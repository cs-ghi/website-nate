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
  status?: string;        // e.g. 'in-progress', 'planned'
  lastUpdated?: string;   // ISO date, e.g. '2026-07-16'
  tier?: number;          // 0..4
  tierLabel?: string;     // 'Foundations' … 'Frontier'
  section?: string;       // subject-track key, e.g. 'langlands'
  sectionLabel?: string;  // display label for the section header/chip
  webUrl?: string;        // in-site /pdf-viewer route from graph.json links.web
}

// A subject-track section on the textbooks page: chip + heading + its books.
export interface BookSection {
  key: string;
  label: string;
  books: Book[];
}
