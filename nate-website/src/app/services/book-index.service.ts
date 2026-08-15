import { Injectable } from '@angular/core';
import { fuzzyScore, humanizeLabel, titleForms } from '../utils/fuzzy-score';

// One named result (definition/theorem/lemma/…) extracted from a book's compiled
// .aux by .eyntka/scripts/build-book-index.py and shipped at
// /assets/books-index.json. `label` is stable across edits (it's the source
// \label key) and unique *within* a book, so a deep link is (pdf, label).
export interface IndexEntry {
  book: string;        // source dir, e.g. "core-algebra"
  pdf: string;         // published basename, e.g. "EYNTKA-core-algebra.pdf"
  type: string;        // "definition" | "theorem" | "lemma" | …
  title: string;       // raw title (may contain $…$)
  titlePlain: string;  // math/markup stripped, for display + search
  label: string;       // "df:topSp"
  number: string;      // "1.1.1"
  page: number | null; // *printed* page label; viewer maps it to a physical page
}

export interface ScoredEntry extends IndexEntry {
  score: number;
  /** Match-quality tier (see MATCH_*); the primary sort key. */
  tier: number;
}

// How well the query matched, coarse to fine. This is the PRIMARY sort key, and
// result type only breaks ties inside a tier — so type priority reorders
// comparable matches instead of demoting a better one. Getting this wrong is
// visible: weighting type above match quality floats "The Space L(D)" (a
// definition whose label is riemannRochSpace) above the Riemann-Roch theorem
// itself for the query "riemann roch".
const MATCH_NONE = 0;         // query is a subsequence of the target, nothing more
const MATCH_SUBSTRING = 1;    // appears, mid-word
const MATCH_WORD_START = 2;   // appears at a word boundary
const MATCH_PREFIX = 3;       // the target starts with the query
const MATCH_EXACT = 4;        // the target IS the query

// Both arguments must already be lower-cased.
function matchTier(q: string, t: string): number {
  if (t === q) return MATCH_EXACT;
  if (t.startsWith(q)) return MATCH_PREFIX;
  const idx = t.indexOf(q);
  if (idx < 0) return MATCH_NONE;
  return t[idx - 1] === ' ' ? MATCH_WORD_START : MATCH_SUBSTRING;
}

// Combine the title and label tiers into one ordinal. A title match outranks a
// label match of the SAME tier — the title is what the book prints, the label is
// a synthetic source key — while a stronger label tier still beats a weaker
// title one. That second half is what surfaces a result whose printed title
// shares no word with the query at all: "wronskian" finds the ODE example
// titled "Checking Linear Independence" only via ex:wronskianEx.
const matchQuality = (titleTier: number, labelTier: number): number =>
  Math.max(titleTier * 2, labelTier * 2 - 1);

// Result-type priority within a tier. Someone searching a term in a maths
// library usually wants "what is this" before "here is a result that uses it",
// so among equally good matches the definition leads. This decides the common
// case: every prefix match scores identically (fuzzyScore returns 1200 for all
// of them), so type is what actually orders them.
//
// `axiom` sits with `definition`, being definitional in character. `example`
// sits last — an example named after a term is rarely what a search for that
// term is after.
const TYPE_WEIGHT: Record<string, number> = {
  definition: 1,
  axiom: 0.95,
  theorem: 0.9,
  proposition: 0.88,
  lemma: 0.86,
  corollary: 0.84,
  example: 0.78,
};
const UNKNOWN_TYPE_WEIGHT = 0.8;

const typeWeight = (type: string): number => TYPE_WEIGHT[type] ?? UNKNOWN_TYPE_WEIGHT;

@Injectable({ providedIn: 'root' })
export class BookIndexService {
  private entries: IndexEntry[] = [];
  private pages: Record<string, number> = {};   // pdf basename -> page count
  private loadPromise: Promise<IndexEntry[]> | null = null;

  // Fetch + cache the index once. Concurrent callers share the same promise.
  load(): Promise<IndexEntry[]> {
    if (!this.loadPromise) {
      this.loadPromise = fetch('/assets/books-index.json')
        .then(r => r.json())
        .then((data: { entries: IndexEntry[]; books?: Record<string, number> }) => {
          this.pages = data.books ?? {};
          return (this.entries = data.entries ?? []);
        })
        .catch(err => {
          console.error('Failed to load books index:', err);
          this.loadPromise = null; // allow a retry on the next open
          return [];
        });
    }
    return this.loadPromise;
  }

  // Total pages of a published PDF (0 if unknown). Assumes load() done.
  pageCount(pdfBasename: string): number {
    return this.pages[pdfBasename] ?? 0;
  }

  // Rank results against the plain title and the humanized label (so a natural
  // query matches a math-heavy title via its source key). Assumes load() done.
  //
  // Order: match quality, then the finer positional score, then result type
  // (definitions first), then the shorter — so more precisely named — title.
  search(query: string, max = 50): ScoredEntry[] {
    const q = query.trim();
    if (!q) return [];
    const ql = q.toLowerCase();
    const scored: ScoredEntry[] = [];
    for (const e of this.entries) {
      const label = humanizeLabel(e.label);   // already lower-cased
      const titles = titleForms(e.titlePlain);
      const score = Math.max(
        ...titles.map(t => fuzzyScore(q, t)),
        fuzzyScore(q, label),
      );
      if (score <= 0) continue;
      const tier = matchQuality(
        Math.max(...titles.map(t => matchTier(ql, t.toLowerCase()))),
        matchTier(ql, label),
      );
      scored.push({ ...e, score, tier });
    }
    scored.sort(
      (a, b) =>
        b.tier - a.tier ||
        b.score - a.score ||
        typeWeight(b.type) - typeWeight(a.type) ||
        a.titlePlain.length - b.titlePlain.length,
    );
    return scored.slice(0, max);
  }

  // Look up a shared deep link (pdf basename + stable label). Returns the entry
  // (whose `dest` the viewer resolves to a physical page), or null if stale.
  lookup(pdfBasename: string, label: string): IndexEntry | null {
    return this.entries.find(e => e.pdf === pdfBasename && e.label === label) ?? null;
  }
}
