import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Book, BookSection } from '../interfaces/books.model';
import { CURATED_BY_PDF } from '../components/books/book-descriptions';
import { BOOK_TOPICS, TOPICS, TOPIC_LABELS } from '../components/books/book-topics';

// Single source of truth for the textbooks page: the series-map graph, which is
// regenerated from the actual .tex sources and synced into assets/. Carries
// per-book status, last-updated date, tier and cluster membership. See
// SeriesMapComponent for how the same file feeds the graph viewer.
const GRAPH_URL = 'assets/series-map/graph.json';

// Megabooks (a compiled volume + its sub-books). Grouping is by SUBJECT, so a
// volume's parts land in whichever topic each part is about — Algebraic Number
// Theory under Number Theory, Classical Algebraic Geometry under Algebraic
// Geometry — and the volume link survives as a per-row badge instead.
const MEGABOOK_LABELS: Record<string, string> = {
  NateAlgebra: 'Algebra',
  NateRealAnalysis: 'Real Analysis',
};

// Books with no entry in BOOK_TOPICS land here. scripts/check-book-topics.js
// fails the build before this can reach production; the bucket exists so local
// dev degrades visibly rather than dropping a book off the page.
const UNCLASSIFIED = {
  key: 'unclassified',
  label: 'Unclassified',
  blurb: 'No topic assigned — see book-topics.ts.',
};

interface GraphNode {
  id: string;
  title: string;
  description?: string;
  status?: string;
  webPublished?: boolean;
  clusters?: string[];
  links?: { pdf?: string; web?: string };
  lastUpdated?: string;
  tier?: number;
}
interface Graph {
  meta: { tiers: { label: string }[] };
  nodes: GraphNode[];
}

const pdfBasename = (path: string | undefined): string =>
  (path ?? '').split('/').pop()!.toLowerCase();

// A few graph.json descriptions carry light markdown (**bold**, `code`); strip
// it when we fall back to them (curated overrides are already plain).
const cleanDesc = (s: string): string =>
  s.replace(/\*\*(.+?)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1').trim();

// The published path for a book, taken from `links.web` — which the extractor
// builds from the overlay's `webBook` value, i.e. the path the site actually
// serves. `links.pdf` is NOT that: it is the newest PDF in the local book
// directory, a local-dev convenience whose casing tracks the .tex rather than
// the published copy. The two differ for Probability (EYNTKA-probability.pdf vs
// EYNTKA-Probability.pdf), and GitHub Pages is case-sensitive, so deriving the
// URL from links.pdf yielded a 404 that only book-descriptions.ts — a file
// documented as being for descriptions ONLY — happened to paper over.
// Unpublished nodes have no links.web, hence the fallbacks.
const siteLink = (n: GraphNode): string | undefined => {
  const m = /[?&]src=([^&]+)/.exec(n.links?.web ?? '');
  return m ? decodeURIComponent(m[1]) : undefined;
};

@Injectable({ providedIn: 'root' })
export class BookCatalogService {
  private graph$ = this.http.get<Graph>(GRAPH_URL).pipe(shareReplay(1));

  constructor(private http: HttpClient) {}

  // The compiled volume a book is a part of, if any. A megabook's own node is
  // the cluster id, so exclude it or the volume would badge itself.
  private volumeLabelFor(n: GraphNode): string | undefined {
    const parent = (n.clusters ?? []).find(
      (c) => c !== n.id && MEGABOOK_LABELS[c] !== undefined,
    );
    return parent ? MEGABOOK_LABELS[parent] : undefined;
  }

  // Curated prose wins over graph.json's terser description; everything else —
  // name, status, date, tier, and the link — is graph's.
  private toBook(n: GraphNode, tierLabels: string[]): Book {
    const curated = CURATED_BY_PDF[pdfBasename(n.links?.pdf)];
    const topic = BOOK_TOPICS[n.id];
    const key = topic?.primary ?? UNCLASSIFIED.key;
    return {
      id: n.id,
      name: n.title,
      desc: curated?.desc ?? cleanDesc(n.description ?? ''),
      link:
        siteLink(n) ??
        curated?.link ??
        `././assets/pdfs/books/${n.links?.pdf?.split('/').pop() ?? ''}`,
      type: 'pdf',
      status: n.status,
      lastUpdated: n.lastUpdated,
      tier: n.tier,
      tierLabel: n.tier != null ? tierLabels[n.tier] : undefined,
      section: key,
      sectionLabel: TOPIC_LABELS[key] ?? UNCLASSIFIED.label,
      alsoTopics: topic?.also ?? [],
      volumeLabel: this.volumeLabelFor(n),
      webUrl: n.links?.web,
    };
  }

  // Within a topic, the learning ladder: tier ascending, a compiled volume ahead
  // of its own parts at equal tier, then the curated within-tier rank, then
  // alphabetical.
  private ladder(a: Book, b: Book): number {
    return (
      (a.tier ?? 99) - (b.tier ?? 99) ||
      (MEGABOOK_LABELS[a.id!] ? 0 : 1) - (MEGABOOK_LABELS[b.id!] ? 0 : 1) ||
      (BOOK_TOPICS[a.id!]?.rank ?? 99) - (BOOK_TOPICS[b.id!]?.rank ?? 99) ||
      a.name.localeCompare(b.name)
    );
  }

  // Live (web-published, non-planned) books grouped into subject-topic sections
  // in TOPICS order. Each book appears in exactly one section — its primary
  // topic — and additionally in the `alsoBooks` of every topic it serves, which
  // the page reveals only when that topic is the active filter.
  readonly sections$: Observable<BookSection[]> = this.graph$.pipe(
    map((g) => {
      const tierLabels = g.meta.tiers.map((t) => t.label);
      const live = g.nodes
        .filter((n) => n.webPublished && n.status !== 'planned')
        .map((n) => this.toBook(n, tierLabels));

      const defs = [...TOPICS, UNCLASSIFIED];
      const sections = defs.map((t) => ({
        key: t.key,
        label: t.label,
        blurb: t.blurb,
        books: live.filter((b) => b.section === t.key).sort((x, y) => this.ladder(x, y)),
        alsoBooks: live
          .filter((b) => (b.alsoTopics ?? []).includes(t.key))
          .sort((x, y) => this.ladder(x, y)),
      }));
      return sections.filter((s) => s.books.length);
    }),
    shareReplay(1),
  );

  // Every graph node as a flat Book list (published or not) — the command
  // palette maps PDF basenames to display names/links for in-book search hits,
  // which can include books not shown on the page.
  readonly allBooks$: Observable<Book[]> = this.graph$.pipe(
    map((g) => {
      const tierLabels = g.meta.tiers.map((t) => t.label);
      return g.nodes.map((n) => this.toBook(n, tierLabels));
    }),
    shareReplay(1),
  );
}
