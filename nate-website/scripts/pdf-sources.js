// Where every PDF under src/assets/pdfs/ comes from.
//
// The site serves copies. The originals live outside this repo, in the LaTeX
// tree at ~/Documents/academic — books under textbooks/, blog sources under
// blogs/, research output under research/. Nothing connected the two: PDFs were
// hand-dropped into assets/, so a recompiled book and a stale site copy looked
// identical from inside this repo. On 2026-08-22 five book PDFs and three note
// PDFs were behind their sources with nothing reporting it.
//
// Every PDF in assets/pdfs must appear in exactly one of the two maps below.
// A file in neither is a hard error in sync-pdfs.js — that is the property that
// matters, because it means a PDF cannot be added to the site without a
// decision about whether it tracks a source.
//
//   TRACKED — has a live source. sync-pdfs.js --write copies it; the check
//             fails the build when the copy is behind.
//   PINNED  — deliberately frozen, with the reason. Never copied, never fails.
//
// Paths are relative to SOURCE_ROOT on the left, and to src/assets/pdfs on the
// right. SOURCE_ROOT does not exist on CI runners; sync-pdfs.js skips the
// comparison there and checks only the classification.

const os = require('os');
const path = require('path');

const SOURCE_ROOT = path.join(os.homedir(), 'Documents', 'academic');

// Several filenames resolve to more than one file under SOURCE_ROOT — a book
// also sits in the university/ directory for the course it was written for.
// The EYNTKA series tree (textbooks/, blogs/) is the canonical one; the
// university/ copies are course-time snapshots that do not move.
const TRACKED = {
  // --- blogs: sources in academic/blogs/<slug>/ -----------------------------
  'blogs/a_narrative_of_homological_algebra.pdf':
    'blogs/a_narrative_of_homological_algebra/a_narrative_of_homological_algebra.pdf',
  'blogs/alien_perspective_on_analysis.pdf':
    'blogs/alien_perspective_on_analysis/alien_perspective_on_analysis.pdf',
  'blogs/areas_of_algebraic_geoemtry_reserach.pdf':
    'blogs/areas_of_algebraic_geoemtry_reserach/areas_of_algebraic_geoemtry_reserach.pdf',
  'blogs/clock_arithmetic.pdf': 'blogs/clockArithmetics/clock_arithmetic.pdf',
  'blogs/fourier_transforms.pdf': 'blogs/fourier_transforms/fourier_transforms.pdf',
  'blogs/galois_theory_intuition_behind_field_extensions.pdf':
    'blogs/galois_theory_intuition_behind_field_extensions/galois_theory_intuition_behind_field_extensions.pdf',
  'blogs/geometric_intuition_of_hilbert_spaces.pdf':
    'blogs/geometric_intuition_of_hilbert_spaces/geometric_intuition_of_hilbert_spaces.pdf',
  'blogs/langlands_for_sl2.pdf': 'blogs/langlands_for_sl2/langlands_for_sl2.pdf',
  'blogs/nonhausdorfness.pdf': 'blogs/nonhausdorfness/nonhausdorfness.pdf',
  'blogs/some_harmonic_analysis.pdf': 'blogs/some_harmonic_analysis/some_harmonic_analysis.pdf',
  'blogs/what_is_complex.pdf': 'blogs/whatIsComplex/what_is_complex.pdf',

  // --- books: sources in academic/textbooks/<book>/ -------------------------
  'books/EYNTKA-Algebra.pdf': 'textbooks/algebra/EYNTKA-Algebra.pdf',
  'books/EYNTKA-Probability.pdf': 'textbooks/probability/EYNTKA-probability.pdf',
  'books/EYNTKA-abelian-varieties.pdf': 'textbooks/abelian-varieties/EYNTKA-abelian-varieties.pdf',
  'books/EYNTKA-algebraic-k-theory.pdf':
    'textbooks/algebraic-k-theory/EYNTKA-algebraic-k-theory.pdf',
  'books/EYNTKA-algebraic-number-theory.pdf':
    'textbooks/algebraic-number-theory/EYNTKA-algebraic-number-theory.pdf',
  'books/EYNTKA-algebraic-topology.pdf':
    'textbooks/algebraic-topology/EYNTKA-algebraic-topology.pdf',
  'books/EYNTKA-analytic-number-theory.pdf':
    'textbooks/analytic-number-theory/EYNTKA-analytic-number-theory.pdf',
  'books/EYNTKA-category-theory.pdf': 'textbooks/category-theory/EYNTKA-category-theory.pdf',
  'books/EYNTKA-class-field-theory.pdf':
    'textbooks/class-field-theory/EYNTKA-class-field-theory.pdf',
  'books/EYNTKA-classical-algebraic-geometry.pdf':
    'textbooks/classical-algebraic-geometry/EYNTKA-classical-algebraic-geometry.pdf',
  'books/EYNTKA-commutative-algebra.pdf':
    'textbooks/commutative-algebra/EYNTKA-commutative-algebra.pdf',
  'books/EYNTKA-core-algebra.pdf': 'textbooks/core-algebra/EYNTKA-core-algebra.pdf',
  'books/EYNTKA-core-probability.pdf': 'textbooks/core-probability/EYNTKA-core-probability.pdf',
  'books/EYNTKA-core-representation-theory.pdf':
    'textbooks/core-representation-theory/EYNTKA-core-representation-theory.pdf',
  'books/EYNTKA-cstar-algebras.pdf': 'textbooks/cstar-algebras/EYNTKA-cstar-algebras.pdf',
  'books/EYNTKA-differential-topology.pdf':
    'textbooks/differential-topology/EYNTKA-differential-topology.pdf',
  'books/EYNTKA-elementary-analysis.pdf':
    'textbooks/elementary-analysis/EYNTKA-elementary-analysis.pdf',
  'books/EYNTKA-elliptic-curves.pdf': 'textbooks/elliptic-curves/EYNTKA-elliptic-curves.pdf',
  'books/EYNTKA-functional-analysis.pdf':
    'textbooks/functional-analysis/EYNTKA-functional-analysis.pdf',
  'books/EYNTKA-galois-cohomology.pdf': 'textbooks/galois-cohomology/EYNTKA-galois-cohomology.pdf',
  'books/EYNTKA-geo-rep-theory.pdf':
    'textbooks/geometric-representation-theory/EYNTKA-geo-rep-theory.pdf',
  'books/EYNTKA-harmonic-analysis.pdf': 'textbooks/harmonic-analysis/EYNTKA-harmonic-analysis.pdf',
  'books/EYNTKA-hodge-theory.pdf': 'textbooks/hodge-theory/EYNTKA-hodge-theory.pdf',
  'books/EYNTKA-homological-algebra.pdf':
    'textbooks/homological-algebra/EYNTKA-homological-algebra.pdf',
  'books/EYNTKA-intersection-theory.pdf':
    'textbooks/intersection-theory/EYNTKA-intersection-theory.pdf',
  'books/EYNTKA-langlands-gl2.pdf': 'textbooks/langlands-gl2/EYNTKA-langlands-gl2.pdf',
  'books/EYNTKA-lie-groups.pdf': 'textbooks/lie-groups/EYNTKA-lie-groups.pdf',
  'books/EYNTKA-linear-algebra.pdf': 'textbooks/linear-algebra/EYNTKA-linear-algebra.pdf',
  'books/EYNTKA-linear-pde.pdf': 'textbooks/linear-pde/EYNTKA-linear-pde.pdf',
  'books/EYNTKA-local-field-theory.pdf':
    'textbooks/local-field-theory/EYNTKA-local-field-theory.pdf',
  'books/EYNTKA-measure-theory.pdf': 'textbooks/measure-theory/EYNTKA-measure-theory.pdf',
  'books/EYNTKA-metric-function-spaces.pdf':
    'textbooks/metric-function-spaces/EYNTKA-metric-function-spaces.pdf',
  'books/EYNTKA-modern-alg-geo.pdf': 'textbooks/modern-algebraic-geometry/EYNTKA-modern-alg-geo.pdf',
  'books/EYNTKA-moduli-stacks.pdf': 'textbooks/moduli-stacks/EYNTKA-moduli-stacks.pdf',
  'books/EYNTKA-nonlinear-wave.pdf': 'textbooks/nonlinear-wave-pde/EYNTKA-nonlinear-wave.pdf',
  'books/EYNTKA-riemannian-geometry.pdf':
    'textbooks/riemannian-geometry/EYNTKA-riemannian-geometry.pdf',
  'books/EYNTKA_ODE.pdf': 'textbooks/ODE/EYNTKA_ODE.pdf',
  'books/EYNTKA_Vector_bundles_and_K-theory.pdf':
    'textbooks/vector-bundles-and-k-theory/EYNTKA_Vector_bundles_and_K-theory.pdf',
  'books/EYNTKA_algGeo.pdf': 'textbooks/algebraic-geometry/EYNTKA_algGeo.pdf',
  'books/EYNTKA_complex_analysis.pdf': 'textbooks/complex-analysis/EYNTKA_complex_analysis.pdf',
  'books/EYNTKA_logic.pdf': 'textbooks/logic/EYNTKA_logic.pdf',
  'books/EYNTKA_topology.pdf': 'textbooks/topology/EYNTKA_topology.pdf',

  // --- notes ----------------------------------------------------------------
  'notes/EYNTKA_galois_cohomology.pdf':
    'textbooks/galois-cohomology/EYNTKA_galois_cohomology.pdf',
  'notes/EYNTKA_hodge.pdf': 'research/hodge-research/EYNTKA_hodge.pdf',
  'notes/EYNTKA_toric_geometry.pdf': 'textbooks/toric-geometry/EYNTKA_toric_geometry.pdf',
  // Site filename transposes the acronym; the source spells it EYNTKA.
  'notes/EYTNKA_p-adic_rep.pdf':
    'university/PhD/2025-2026/1st semester/p-adic_representation/EYNTKA_p-adic_rep.pdf',
  'notes/preliminary_chapter.pdf': 'notes/preliminary_chapter/preliminary_chapter.pdf',
};

const PINNED = {
  'papers/hirzebruch-riemann-roch-v1.pdf':
    'arXiv v1 snapshot. /papers serves a named version and says which one, so ' +
    'the file must not move when the working copy does (PAPERS-SECTION-PLAN.md).',
  'papers/integral-hodge-twisting-v1.pdf': 'arXiv v1 snapshot; same as above.',

  'blogs/twisted-IHC.pdf':
    'Redirect target only. LEGACY_PDF_REDIRECTS in papers.ts rewrites the old ' +
    '/pdf-viewer deep link to papers/integral-hodge-twisting-v1.pdf.',
  'books/HRR.pdf':
    'Redirect target only. LEGACY_PDF_REDIRECTS rewrites it to ' +
    'papers/hirzebruch-riemann-roch-v1.pdf.',

  'blogs/Conjecture_old.pdf': 'Published post with no source under SOURCE_ROOT.',
  'blogs/From_Quadratic_to_Langland.pdf':
    'Published post. Source is a frozen 2024 PhD-application artifact under ' +
    'university/masters/PhD applications/, which does not get recompiled.',
  'blogs/PontryaginDuality.pdf':
    'Not referenced by any blog entry; on disk for old /pdf-viewer deep links. ' +
    'Written as 2022-23 MAT436 coursework and frozen there.',
  'blogs/serre_paper-Theory_of_Simple_Algebras.pdf':
    'Third-party paper (Serre), not authored here; nothing to track.',

  'books/EYNTKA-real-analysis.pdf':
    'Linked from book-descriptions.ts, but the book was disbanded on 2026-08-17 ' +
    '(textbooks/_archive/Real-Analysis-container-disbanded-2026-08-17). Pinned so ' +
    'the check does not fail on it; the entry itself needs an editorial decision.',
  'books/EYNTKA_Differential_Geometry.pdf':
    'No live source; the only copy is in academic/_archive/. Superseded on the ' +
    'site by EYNTKA-riemannian-geometry.pdf and EYNTKA-differential-topology.pdf.',
  'books/elementary_analysis.pdf':
    'No live source. Superseded by EYNTKA-elementary-analysis.pdf, which is ' +
    'tracked and also served.',
  'notes/EYNTKA_geo_rep_theory.pdf':
    'Old-naming copy. The live book is served as books/EYNTKA-geo-rep-theory.pdf.',
};

module.exports = { SOURCE_ROOT, TRACKED, PINNED };
