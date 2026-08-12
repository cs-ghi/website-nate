/**
 * Subject-topic taxonomy for the textbooks page.
 *
 * WHY THIS FILE EXISTS, AND NOT graph.json
 * ----------------------------------------
 * graph.json models the series' INTERNAL structure: what depends on what, which
 * books compile into which volume, and which research "tracks" a book feeds.
 * That is the right model for /series-map, which draws the edges. It is the
 * wrong model for a catalogue page: only 27 of 39 published books belong to any
 * track, so track-grouping dumped 10 of them (Topology, Logic, Linear Algebra,
 * Lie Groups, …) into an "Other Topics" bucket that was the page's LARGEST
 * section, and it shelved Algebraic Topology under "K-theory" — the tower it
 * feeds, not the subject it is about.
 *
 * Topic is a reader-facing shelving decision for one page, so it lives with the
 * page. Everything factual about a book (title, status, tier, date, prereqs,
 * megabook membership) still comes from graph.json — see BookCatalogService.
 *
 * PRIMARY vs ALSO
 * ---------------
 * Some books genuinely span two subjects, so the taxonomy separates shelving
 * from filtering:
 *
 *   primary  exactly one; decides which section the book is rendered in.
 *            The rule: the subject whose LANGUAGE the book is written in and
 *            whose prerequisites it demands — not the subject it is ultimately
 *            applied to. ("Which shelf does a reader who needs it walk to?")
 *   also     0-2 further topics the book SERVES. Filtering by a topic surfaces
 *            these under a separate "Also relevant" group, so nothing is
 *            hidden, but the default view still shows every book exactly once.
 *
 * MAINTENANCE
 * -----------
 * Every live book must appear in BOOK_TOPICS. `scripts/check-book-topics.js`
 * runs on `npm run build` (prebuild hook) and FAILS the build if a book that is
 * webPublished in graph.json is missing here — so publishing a new book upstream
 * cannot silently re-create an "Other" bucket. Unpublished books are listed too,
 * so a future publish is a one-line flip upstream with no edit here.
 */

export interface Topic {
  key: string;
  label: string;
  /** Shown under the heading when the topic is the active filter. */
  blurb: string;
}

/**
 * Display order: the three pillar subjects first (what a newcomer scanning
 * top-down should hit), then the specialisations, roughly in dependency order.
 */
export const TOPICS: Topic[] = [
  {
    key: 'algebra',
    label: 'Algebra',
    blurb: 'Groups, rings, modules and fields, and the categorical and homological machinery built on them.',
  },
  {
    key: 'geometry-topology',
    label: 'Geometry & Topology',
    blurb: 'Spaces and manifolds: point-set topology, the algebraic invariants of spaces, smooth structure, and curvature.',
  },
  {
    key: 'analysis',
    label: 'Analysis',
    blurb: 'Measure, integration, and the theory of function spaces, in the real and complex settings.',
  },
  {
    key: 'number-theory',
    label: 'Number Theory',
    blurb: 'Number fields and their arithmetic, local and global, from ideal class groups through to local Langlands.',
  },
  {
    key: 'algebraic-geometry',
    label: 'Algebraic Geometry',
    blurb: 'Varieties and schemes, their cohomology, cycles, and moduli.',
  },
  {
    key: 'representation-theory',
    label: 'Representation & Lie Theory',
    blurb: 'Representations of finite groups, Lie groups and Lie algebras, and linear algebraic groups.',
  },
  {
    key: 'k-theory',
    label: 'K-theory',
    blurb: 'The three flavours — topological, algebraic, and operator — and the periodicity they share.',
  },
  {
    key: 'pde',
    label: 'Differential Equations & PDE',
    blurb: 'Ordinary differential equations, then the linear elliptic/parabolic and nonlinear dispersive theories.',
  },
  {
    key: 'probability',
    label: 'Probability & Statistics',
    blurb: 'Probability from the combinatorial basics up to the measure-theoretic treatment and martingales.',
  },
  {
    key: 'logic',
    label: 'Logic & Foundations',
    blurb: 'Formal languages, proof and computability, and the discrete groundwork beneath the rest of the series.',
  },
];

export interface TopicAssignment {
  primary: string;
  also?: string[];
  /**
   * Tiebreak within a tier, ascending; unset sorts last, then alphabetically.
   * Sections are ordered by tier so they read as a ladder, but tier is coarse —
   * where several books share one and alphabetical order would misstate the
   * reading order (Local Field Theory before Class Field Theory; topological
   * K-theory before the algebraic and operator flavours), this pins it. Only
   * set it where alphabetical is actually wrong.
   */
  rank?: number;
}

/**
 * graph.json node id -> topics. Includes books not yet web-published, so that
 * publishing one upstream needs no change here.
 */
export const BOOK_TOPICS: Record<string, TopicAssignment> = {
  // ── Algebra ───────────────────────────────────────────────────────────────
  // Deliberately scoped as the concrete on-ramp rather than a first abstract
  // algebra course (overlay.yaml, 2026-07-20), and a co-requisite of both the
  // algebra and the Lie/representation towers. Tier 0, so it heads the ladder.
  NateLinAlg: { primary: 'algebra', also: ['representation-theory'] },
  NateAlgebra: { primary: 'algebra' },
  NateCoreAlgebra: { primary: 'algebra' },
  NateCategoryTheory: { primary: 'algebra' },
  // Its own description: "mainly for the background for algebraic number theory
  // and (classical/modern) Algebraic Geometry" — so both get the cross-listing.
  NateCommAlg: { primary: 'algebra', also: ['algebraic-geometry', 'number-theory'] },
  NateHomologicalAlg: { primary: 'algebra', also: ['k-theory', 'algebraic-geometry'] },
  NateHigherCategoryTheory: { primary: 'algebra', also: ['geometry-topology'] },

  // ── Geometry & Topology ───────────────────────────────────────────────────
  // Carries topological groups at the "lowest common denominator" for analysis,
  // representation theory and geometry at once (see the page's Notes block).
  NateTopology: { primary: 'geometry-topology', also: ['analysis'] },
  NateAlgTop: { primary: 'geometry-topology', also: ['algebra', 'k-theory'] },
  NateDiffTop: { primary: 'geometry-topology' },
  NateRiemannianGeometry: { primary: 'geometry-topology' },
  NateCalcOnManifolds: { primary: 'geometry-topology', also: ['analysis'] },

  // ── Analysis ──────────────────────────────────────────────────────────────
  NateMetricFunctionSpaces: { primary: 'analysis', also: ['geometry-topology'] },
  NateElemAnalysis: { primary: 'analysis' },
  NateCalculus: { primary: 'analysis' },
  NateRealAnalysis: { primary: 'analysis' },
  NateMeasureTheory: { primary: 'analysis', also: ['probability'], rank: 1 },
  // Riemann surfaces and the zeta function put it in reach of both geometry and
  // number theory; the book itself is one-variable complex analysis.
  NateComplexAnalysis: { primary: 'analysis', also: ['geometry-topology', 'number-theory'], rank: 2 },
  NateFuncAnalysis: { primary: 'analysis', also: ['pde'] },
  // Haar measure and Pontryagin duality are the entry to the Langlands side.
  NateHarmonicAnalysis: { primary: 'analysis', also: ['pde', 'representation-theory'] },

  // ── Number Theory ─────────────────────────────────────────────────────────
  NateAlgNumberTheory: { primary: 'number-theory', also: ['algebra'] },
  NateAnalyticNumTheory: { primary: 'number-theory', also: ['analysis'], rank: 4 },
  NateLocalFieldTheory: { primary: 'number-theory', rank: 1 },
  NateCFT: { primary: 'number-theory', also: ['algebra'], rank: 2 },
  NateGaloisCohom: { primary: 'number-theory', also: ['algebra'] },
  // Silverman-shaped: Mordell-Weil, solutions over local fields, integral
  // points. Written as arithmetic, not as geometry — hence NT primary, and the
  // sibling Abelian Varieties goes the other way (see below).
  NateEllipticCurves: { primary: 'number-theory', also: ['algebraic-geometry'], rank: 3 },
  NateLanglandsGL2: { primary: 'number-theory', also: ['representation-theory'] },
  NateShimuraVarieties: { primary: 'number-theory', also: ['algebraic-geometry'] },

  // ── Algebraic Geometry ────────────────────────────────────────────────────
  NateClassicalAlgGeo: { primary: 'algebraic-geometry', also: ['algebra'] },
  NateAlgGeo: { primary: 'algebraic-geometry', also: ['number-theory'] },
  NateIntersectionTheory: { primary: 'algebraic-geometry', also: ['geometry-topology'] },
  // Complex tori, line bundles, Appell-Humbert, Riemann-Roch: the book is
  // written in geometry even though the tower it keystones is arithmetic.
  NateAbelianVarieties: { primary: 'algebraic-geometry', also: ['number-theory'] },
  NateModuliStacks: { primary: 'algebraic-geometry', also: ['algebra'] },
  NateToricGeometry: { primary: 'algebraic-geometry', also: ['algebra'] },
  NateEtaleCohomology: { primary: 'algebraic-geometry', also: ['number-theory'] },
  NateHodgeTheory: { primary: 'algebraic-geometry', also: ['geometry-topology', 'analysis'] },
  NateComplexAnalyticGeometry: { primary: 'algebraic-geometry', also: ['analysis'] },

  // ── Representation & Lie Theory ───────────────────────────────────────────
  NateCoreRepTheory: { primary: 'representation-theory', also: ['algebra'] },
  NateLieGroups: { primary: 'representation-theory', also: ['geometry-topology', 'algebra'] },
  NateGeoRepTheory: { primary: 'representation-theory', also: ['algebraic-geometry'] },
  NateUnitaryRepTheory: { primary: 'representation-theory', also: ['analysis'] },

  // ── K-theory ──────────────────────────────────────────────────────────────
  NateKTheory: { primary: 'k-theory', also: ['geometry-topology'], rank: 1 },
  NateAlgKTheory: { primary: 'k-theory', also: ['algebra'], rank: 2 },
  NateCStarAlgebras: { primary: 'k-theory', also: ['analysis'], rank: 3 },

  // ── Differential Equations & PDE ──────────────────────────────────────────
  NateODE: { primary: 'pde', also: ['analysis'] },
  NateLinearPDE: { primary: 'pde', also: ['analysis'] },
  NateNonlinearWave: { primary: 'pde', also: ['analysis'] },
  NateMicrolocalAnalysis: { primary: 'pde', also: ['analysis'] },

  // ── Probability & Statistics ──────────────────────────────────────────────
  NateCoreProbability: { primary: 'probability' },
  NateProbability: { primary: 'probability', also: ['analysis'] },
  NateStatistics: { primary: 'probability' },

  // ── Logic & Foundations ───────────────────────────────────────────────────
  NatePrelim: { primary: 'logic' },
  NateLogic: { primary: 'logic' },
  NateModelTheory: { primary: 'logic', also: ['algebra'] },
  NateCombinatorics: { primary: 'logic', also: ['probability'] },
};

export const TOPIC_LABELS: Record<string, string> = Object.fromEntries(
  TOPICS.map((t) => [t.key, t.label]),
);
