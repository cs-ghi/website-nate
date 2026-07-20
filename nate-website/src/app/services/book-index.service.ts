import { Injectable } from '@angular/core';
import { fuzzyScore, humanizeLabel } from '../utils/fuzzy-score';

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
}

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
  search(query: string, max = 50): ScoredEntry[] {
    const q = query.trim();
    if (!q) return [];
    const scored: ScoredEntry[] = [];
    for (const e of this.entries) {
      const score = Math.max(
        fuzzyScore(q, e.titlePlain),
        fuzzyScore(q, humanizeLabel(e.label)),
      );
      if (score > 0) scored.push({ ...e, score });
    }
    scored.sort((a, b) => b.score - a.score || a.titlePlain.length - b.titlePlain.length);
    return scored.slice(0, max);
  }

  // Look up a shared deep link (pdf basename + stable label). Returns the entry
  // (whose `dest` the viewer resolves to a physical page), or null if stale.
  lookup(pdfBasename: string, label: string): IndexEntry | null {
    return this.entries.find(e => e.pdf === pdfBasename && e.label === label) ?? null;
  }
}
