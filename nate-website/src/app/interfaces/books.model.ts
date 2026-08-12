export interface Books{
  bookss: Book[];
}

export interface Book {
  name: string;
  desc: String;
  link: String;
  type?: 'pdf' | 'html';
  children?: Book[];

  // ─── Metadata sourced from series-map graph.json (BookCatalogService) ───
  id?: string;            // graph node id, e.g. 'NateAlgTop'
  status?: string;        // e.g. 'in-progress', 'planned'
  lastUpdated?: string;   // ISO date, e.g. '2026-07-16'
  tier?: number;          // 0..4
  tierLabel?: string;     // 'Foundations' … 'Frontier'
  webUrl?: string;        // in-site /pdf-viewer route from graph.json links.web

  // ─── Subject topic (book-topics.ts) ───
  section?: string;       // primary topic key, e.g. 'algebraic-geometry'
  sectionLabel?: string;  // display label for the section header/chip
  alsoTopics?: string[];  // secondary topic keys — drive the "Also relevant" group
  volumeLabel?: string;   // 'Algebra' / 'Real Analysis' when part of a megabook
}

// A subject-topic section on the textbooks page: chip + heading + its books.
// `books` are the topic's primary members; `alsoBooks` are books shelved
// elsewhere that the topic is a secondary subject for (shown only when the
// topic is the active filter).
export interface BookSection {
  key: string;
  label: string;
  blurb: string;
  books: Book[];
  alsoBooks: Book[];
}
