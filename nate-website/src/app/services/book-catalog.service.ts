import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Book, BookSection } from '../interfaces/books.model';
import { CURATED_BY_PDF } from '../components/books/book-descriptions';

// Single source of truth for the textbooks page: the series-map graph, which is
// regenerated from the actual .tex sources and synced into assets/. Carries
// per-book status, last-updated date, tier and subject-track membership. See
// SeriesMapComponent for how the same file feeds the graph viewer.
const GRAPH_URL = 'assets/series-map/graph.json';

// Megabooks (a compiled volume + its sub-books). Their parent node itself carries
// no cluster, so it's assigned to its own section by id.
const MEGABOOK_IDS = new Set(['NateAlgebra', 'NateRealAnalysis']);

// A book may carry 0..n clusters; assign it to exactly one section by this
// priority (megabooks first so each compiled series stays together, then
// thematic tracks by specificity), else "other".
const SECTION_PRIORITY = [
  'NateAlgebra', 'NateRealAnalysis',
  'langlands', 'arithmetic-geometry', 'hodge', 'k-theory', 'analysis-pde',
];

// Order the section headers / chips appear in on the page.
const SECTION_ORDER = [
  'NateAlgebra', 'NateRealAnalysis', 'analysis-pde', 'arithmetic-geometry',
  'langlands', 'hodge', 'k-theory', 'other',
];

const SECTION_LABELS: Record<string, string> = {
  NateAlgebra: 'Algebra',
  NateRealAnalysis: 'Analysis',
  'analysis-pde': 'Analysis & PDE',
  'arithmetic-geometry': 'Arithmetic Geometry',
  langlands: 'Langlands Programme',
  hodge: 'Geometry & Hodge Theory',
  'k-theory': 'K-theory',
  other: 'Other Topics',
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

@Injectable({ providedIn: 'root' })
export class BookCatalogService {
  private graph$ = this.http.get<Graph>(GRAPH_URL).pipe(shareReplay(1));

  constructor(private http: HttpClient) {}

  private sectionKeyFor(n: GraphNode): string {
    if (MEGABOOK_IDS.has(n.id)) return n.id;
    for (const key of SECTION_PRIORITY) {
      if ((n.clusters ?? []).includes(key)) return key;
    }
    return 'other';
  }

  // Curated prose + link win over graph.json (whose links are occasionally
  // mis-cased); everything else — name, status, date, tier, section — is graph's.
  private toBook(n: GraphNode, tierLabels: string[]): Book {
    const curated = CURATED_BY_PDF[pdfBasename(n.links?.pdf)];
    const sectionKey = this.sectionKeyFor(n);
    return {
      name: n.title,
      desc: curated?.desc ?? cleanDesc(n.description ?? ''),
      link: curated?.link ?? `././assets/pdfs/books/${n.links?.pdf?.split('/').pop() ?? ''}`,
      type: 'pdf',
      status: n.status,
      lastUpdated: n.lastUpdated,
      tier: n.tier,
      tierLabel: n.tier != null ? tierLabels[n.tier] : undefined,
      section: sectionKey,
      sectionLabel: SECTION_LABELS[sectionKey],
      webUrl: n.links?.web,
    };
  }

  // Live (web-published, non-planned) books grouped into subject-track sections,
  // sections in SECTION_ORDER, each compiled megabook leading its section,
  // otherwise ordered by tier then title (the learning ladder within a section).
  readonly sections$: Observable<BookSection[]> = this.graph$.pipe(
    map((g) => {
      const tierLabels = g.meta.tiers.map((t) => t.label);
      const live = g.nodes.filter(
        (n) => n.webPublished && n.status !== 'planned',
      );

      const buckets = new Map<string, GraphNode[]>();
      for (const n of live) {
        const key = this.sectionKeyFor(n);
        (buckets.get(key) ?? buckets.set(key, []).get(key)!).push(n);
      }

      const sections: BookSection[] = [];
      for (const key of SECTION_ORDER) {
        const nodes = buckets.get(key);
        if (!nodes?.length) continue;
        nodes.sort(
          (a, b) =>
            (MEGABOOK_IDS.has(a.id) ? 0 : 1) - (MEGABOOK_IDS.has(b.id) ? 0 : 1) ||
            (a.tier ?? 99) - (b.tier ?? 99) ||
            a.title.localeCompare(b.title),
        );
        sections.push({
          key,
          label: SECTION_LABELS[key],
          books: nodes.map((n) => this.toBook(n, tierLabels)),
        });
      }
      return sections;
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
