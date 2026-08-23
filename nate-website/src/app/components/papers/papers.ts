import { PaperEntry } from 'src/app/interfaces/papers.model';

// Research output. Distinct from /notes (exposition and translations) and /blog
// (short-form intuition) — this is the arXiv-bound material, and the model
// carries what a paper needs that a note does not: abstract, authors, versions,
// postings, a citation block.
//
// Abstracts may contain TeX between $…$ and $$…$$; MathTextComponent renders it
// with KaTeX, and scripts/check-papers.js parses every span at build time so a
// typo fails CI rather than shipping a red error span. Custom macros from the
// source .tex must be expanded here — KaTeX only knows standard commands.
//
// To post one to arXiv: add a `postings` entry with the id and primary class.
// Every arXiv link and the BibTeX eprint fields are derived from it; no template
// changes are needed.
export const PAPERS: PaperEntry[] = [
  {
    slug: 'integral-hodge-twisting',
    title: 'Integral Hodge Conjecture — Invariance Under Twisting',
    authors: ['Nathanael Chwojko-Srawley'],
    kind: 'research',
    status: 'draft',
    summary:
      'No gerbe twist of a generalized cohomology theory strengthens the topological obstruction to the integral Hodge conjecture; what is left over is algebro-geometric.',
    abstract:
      'We establish a structural classification of the role of gerbe twists in the integral Hodge conjecture. ' +
      'First, we prove that twisting generalized cohomology theories by $[H] \\in H^3(X;\\mathbb{Z})$ produces no new ' +
      'topological obstructions to the untwisted conjecture: any multiplicative cycle-receiving theory is necessarily ' +
      'complex-oriented and factors through $\\mathrm{MU}$, while twisted $K$-theory fails this criterion because ' +
      '$d_3^{[H]}(1) = [H] \\neq 0$. Furthermore, by Hertl’s ghost theorem, every $H^3$-twist of $\\mathrm{MU}$ leaves ' +
      'the primary differential $d_3^{\\mathrm{MU},\\tau} = \\mathrm{Sq}^3_{\\mathbb{Z}}$ invariant. Any remaining obstruction to the classical ' +
      'conjecture is shown to be purely algebro-geometric, residing in the cokernel of the Levine–Morel realization ' +
      '$\\Omega^i(X) \\to \\mathrm{MU}^{2i}(X(\\mathbb{C})) \\otimes_{\\mathrm{MU}^*} \\mathbb{Z}$. Finally, we transfer the framework of this paper to where the twisted ' +
      'differential does govern: the integral Hodge conjecture for $\\alpha$-twisted sheaves, where the ' +
      'missing unit is quantitatively replaced by the index $\\operatorname{ind}(\\alpha)$.',
    msc: ['14C30', '19L50', '55N22'],
    keywords: [
      'integral Hodge conjecture',
      'twisted K-theory',
      'complex cobordism',
      'Atiyah–Hirzebruch spectral sequence',
      'twisted sheaves',
    ],
    versions: [
      {
        label: 'v1',
        date: '2026-08-17',
        file: 'integral-hodge-twisting-v1.pdf',
      },
    ],
    relatedNotes: [
      { label: 'A little Hodge Theory (notes)', route: '/notes' },
      { label: 'Research in Algebraic Geometry (blog)', route: '/blog' },
    ],
    bibtexKey: 'chwojkosrawley2026ihc',
  },
  {
    slug: 'hirzebruch-riemann-roch',
    title: 'Hirzebruch–Riemann–Roch Theorem',
    authors: ['Nathanael Chwojko-Srawley'],
    kind: 'thesis',
    status: 'draft',
    summary:
      'A motivated, tools-as-needed proof of Hirzebruch–Riemann–Roch, ending in a sketch of the Grothendieck generalization.',
    abstract:
      'The Riemann–Roch problem asks how many holomorphic, meromorphic, or algebraic sections a space admits — ' +
      'equivalently, what can be said about $H^0(M, \\mathcal{F})$, and what the higher sheaf cohomology says when that group ' +
      'is smaller than one would expect. This paper is an exposition of the Hirzebruch–Riemann–Roch Theorem, ' +
      'which answers this for a complex vector bundle $E$ over a projective variety $M$: ' +
      '$$\\chi(M, E) = \\int_M \\operatorname{ch}(E) \\smile \\operatorname{td}(M).$$ ' +
      'The proof is organized around two generating functions — the $\\chi_y$-characteristic, which packages the ' +
      'Euler characteristics, and the $T$-characteristic $T_y$, which packages the Chern character and Todd class ' +
      'data. The two agree at $y = 1$ with $\\chi(M,E)$, and at $y = -1$ with the spin index $\\tau(M)$; that second ' +
      'agreement is the bridge which forces the theorem, and cobordism then reduces the statement to the case ' +
      '$M = \\mathbb{C}\\mathrm{P}^n$. ' +
      'The exposition deliberately reverses the order of Hirzebruch’s original treatment, introducing each tool at ' +
      'the point where the problem calls for it rather than in advance: Chern classes and the Chern character, via ' +
      'the splitting principle and $K$-theory; Dolbeault cohomology and Kähler geometry, to relate the analytic ' +
      'and algebraic Euler characteristics; the Todd class, as a multiplicative sequence; and the oriented cobordism ' +
      'ring together with the Hirzebruch signature theorem. A closing chapter sketches Grothendieck–Riemann–Roch and ' +
      'surveys the current generalizations in the literature.',
    msc: ['14C40', '19E20', '32J25'],
    keywords: [
      'Hirzebruch–Riemann–Roch',
      'Todd class',
      'Chern character',
      'cobordism',
      'signature theorem',
    ],
    versions: [
      {
        label: 'v1',
        date: '2026-08-22',
        file: 'hirzebruch-riemann-roch-v1.pdf',
        note: 'abstract added',
      },
    ],
    relatedNotes: [
      { label: 'EYNTKA Complex Geometry (textbooks)', route: '/books' },
      { label: 'EYNTKA Algebraic Geometry (textbooks)', route: '/books' },
    ],
    bibtexKey: 'chwojkosrawley2026hrr',
  },
];

// Old /notes deep links, which were query-string URLs into /pdf-viewer and are
// therefore indexable. At least one is pasted into the /books overview copy.
// pdf-viewer.component.ts rewrites these rather than letting them 404.
export const LEGACY_PDF_REDIRECTS: Record<string, string> = {
  'twisted-IHC.pdf': '././assets/pdfs/papers/integral-hodge-twisting-v1.pdf',
  'HRR.pdf': '././assets/pdfs/papers/hirzebruch-riemann-roch-v1.pdf',
  // Renamed on 2026-08-23: the old basename misspelled Langlands, and the file
  // was the only blog source still living under PhD applications/.
  'From_Quadratic_to_Langland.pdf': '././assets/pdfs/blogs/from_quadratic_to_langlands.pdf',
};
