import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import {
  arxivAbs,
  arxivPdf,
  KIND_LABEL,
  Paper,
  PaperEntry,
  PaperManifest,
  STATUS_LABEL,
} from '../interfaces/papers.model';
import { PAPERS } from '../components/papers/papers';

// Page count + compile date per paper PDF, written by
// scripts/gen-pdf-facts.js from the files themselves.
const MANIFEST_URL = 'assets/pdfs/papers/manifest.json';
const PDF_DIR = '././assets/pdfs/papers/';

// A BibTeX entry that changes shape once the paper is posted or published: an
// unpublished draft is @unpublished, an arXiv preprint carries eprint fields,
// and a paper with a venue is @article. Generated rather than authored so it
// cannot drift from the rest of the record.
function bibtex(entry: PaperEntry, arxivId?: string): string {
  const key = entry.bibtexKey ?? entry.slug;
  const year = new Date(entry.versions[entry.versions.length - 1].date).getUTCFullYear();
  const rows: [string, string][] = [
    ['author', entry.authors.join(' and ')],
    ['title', entry.title],
    ['year', String(year)],
  ];

  let type = 'unpublished';
  if (entry.venue) {
    type = 'article';
    rows.push(['journal', entry.venue.name]);
    if (entry.venue.volume) rows.push(['volume', entry.venue.volume]);
    if (entry.venue.pages) rows.push(['pages', entry.venue.pages]);
    if (entry.venue.doi) rows.push(['doi', entry.venue.doi]);
  } else if (arxivId) {
    type = 'misc';
    rows.push(['eprint', arxivId]);
    rows.push(['archivePrefix', 'arXiv']);
    const cls = entry.postings?.find((p) => p.host === 'arxiv')?.primaryClass;
    if (cls) rows.push(['primaryClass', cls]);
  } else {
    rows.push(['note', 'Preprint']);
  }

  const width = Math.max(...rows.map(([k]) => k.length));
  const body = rows
    .map(([k, v]) => `  ${k.padEnd(width)} = {${v}}`)
    .join(',\n');
  return `@${type}{${key},\n${body}\n}`;
}

@Injectable({ providedIn: 'root' })
export class PaperCatalogService {
  constructor(private http: HttpClient) {}

  // A missing manifest costs each paper its page count, not the page.
  private manifest$ = this.http.get<PaperManifest>(MANIFEST_URL).pipe(
    catchError(() => of({} as PaperManifest)),
    shareReplay(1),
  );

  readonly papers$: Observable<Paper[]> = this.manifest$.pipe(
    map((manifest) =>
      PAPERS.map((entry) => {
        // Versions are authored oldest-first; the site always serves the last.
        const current = entry.versions[entry.versions.length - 1];
        const meta = manifest[current.file];
        const arxiv = entry.postings?.find((p) => p.host === 'arxiv');
        return {
          ...entry,
          current,
          file: current.file,
          pdfUrl: PDF_DIR + current.file,
          kindLabel: KIND_LABEL[entry.kind],
          statusLabel: STATUS_LABEL[entry.status],
          pages: meta?.pages ?? undefined,
          compiled: meta?.updated ?? current.date,
          arxiv,
          arxivAbsUrl: arxiv ? arxivAbs(arxiv.id) : undefined,
          arxivPdfUrl: arxiv ? arxivPdf(arxiv.id) : undefined,
          year: new Date(current.date).getUTCFullYear(),
          bibtex: bibtex(entry, arxiv?.id),
        };
      }).sort((a, b) => b.current.date.localeCompare(a.current.date)),
    ),
    shareReplay(1),
  );
}
