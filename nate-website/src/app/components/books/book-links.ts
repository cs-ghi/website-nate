// Correctly-cased PDF links for the textbooks page, keyed by lower-cased PDF
// basename. This file holds NO descriptions. Since 2026-10-19 every book's
// description comes from graph.json, i.e. the textbooks repo's series-map
// overlay.yaml `nodes:` (DECISIONS 2026-10-19 there), so the series map and
// /books show the same text. Until then this file was book-descriptions.ts and
// its hand-written prose overrode graph.json on /books only.
//
// Why the links survive: BookCatalogService falls back to them for a node with
// no links.web, and check-published-books.js reads them. graph.json's links.pdf
// follows the local .tex casing, which can differ from the published file
// (EYNTKA-Probability.pdf), and GitHub Pages is case-sensitive.

const CURATED_LINKS: string[] = [
  '././assets/pdfs/books/EYNTKA-Algebra.pdf',
  '././assets/pdfs/books/EYNTKA-core-algebra.pdf',
  '././assets/pdfs/books/EYNTKA-commutative-algebra.pdf',
  '././assets/pdfs/books/EYNTKA-classical-algebraic-geometry.pdf',
  '././assets/pdfs/books/EYNTKA-algebraic-number-theory.pdf',
  '././assets/pdfs/books/EYNTKA-core-representation-theory.pdf',
  '././assets/pdfs/books/EYNTKA-homological-algebra.pdf',
  '././assets/pdfs/books/EYNTKA-category-theory.pdf',
  '././assets/pdfs/books/EYNTKA_algGeo.pdf',
  '././assets/pdfs/books/EYNTKA-elliptic-curves.pdf',
  '././assets/pdfs/books/EYNTKA-geo-rep-theory.pdf',
  '././assets/pdfs/books/EYNTKA-moduli-stacks.pdf',
  '././assets/pdfs/books/EYNTKA-galois-cohomology.pdf',
  '././assets/pdfs/books/EYNTKA-class-field-theory.pdf',
  '././assets/pdfs/books/EYNTKA-local-field-theory.pdf',
  '././assets/pdfs/books/EYNTKA-analytic-number-theory.pdf',
  '././assets/pdfs/books/EYNTKA-differential-topology.pdf',
  '././assets/pdfs/books/EYNTKA-riemannian-geometry.pdf',
  '././assets/pdfs/books/EYNTKA-algebraic-topology.pdf',
  '././assets/pdfs/books/EYNTKA-lie-groups.pdf',
  '././assets/pdfs/books/EYNTKA_Vector_bundles_and_K-theory.pdf',
  '././assets/pdfs/books/EYNTKA-algebraic-k-theory.pdf',
  '././assets/pdfs/books/EYNTKA-cstar-algebras.pdf',
  '././assets/pdfs/books/EYNTKA_complex_analysis.pdf',
  '././assets/pdfs/books/EYNTKA_logic.pdf',
  '././assets/pdfs/books/EYNTKA_topology.pdf',
  '././assets/pdfs/books/EYNTKA-Probability.pdf',
  '././assets/pdfs/books/EYNTKA-core-probability.pdf',
  '././assets/pdfs/books/EYNTKA-nonlinear-wave.pdf',
  '././assets/pdfs/books/EYNTKA-linear-pde.pdf',
  '././assets/pdfs/books/EYNTKA_ODE.pdf',
  '././assets/pdfs/books/EYNTKA-linear-algebra.pdf',
];

export const CURATED_LINK_BY_PDF: Record<string, string> = Object.fromEntries(
  CURATED_LINKS.map((l) => [l.split('/').pop()!.toLowerCase(), l]),
);
