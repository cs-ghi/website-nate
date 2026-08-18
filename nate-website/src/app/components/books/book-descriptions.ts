import { Book } from 'src/app/interfaces/books.model';

// Curated prose for the EYNTKA books, lifted verbatim from the original
// hand-maintained list. Keyed by PDF basename (lower-cased); these override the
// terser auto-generated descriptions in series-map graph.json on the textbooks
// page. This file is the source of truth for DESCRIPTIONS ONLY — the live book
// list, status, last-updated dates, tiers and tracks all come from graph.json
// via BookCatalogService.

const CURATED_BOOKS: Book[] = [
  // NOTE (2026-08-17): 'Abstract Algebra' is no longer on the public shelf — the
  // legacy monolith is web.hide'd in the textbooks repo's series-map overlay.yaml,
  // so graph.json carries no NateAlgebra node and nothing looks this parent up.
  // The entry stays because the by-basename map at the bottom of this file
  // recurses into `children`, so its seven members keep these curated
  // descriptions while standing alone. 'Real Analysis' below is the same shape
  // for the same reason: that container was DISBANDED outright on 2026-08-17,
  // so its three members are now standalone books and the parent never renders.
  {
    name: 'Abstract Algebra',
    desc: 'Covers "all" of the core topics algebra: Groups, Rings, Modules, Fields (including Galois Theory), Commutative algebra, Classical Algebraic Geometry, Algebraic Number Theory, and Representation of finite groups, and Homological algebra with an extra chapter on spectral sequences. Special topics include Quiver Theory and Category theory. Note that some group cohomology was included so that EYNTKA Class Field Theory can reference this book without needing to reference the more dense book on Galois Cohomology.\n\n Note that this book is a monolith of the algebra series of texbooks.',
    link: '././assets/pdfs/books/EYNTKA-Algebra.pdf',
    type: 'pdf',
    children: [
      {
        name: 'Core Algebra',
        desc: 'Begins with Group Theory: subgroups, quotients, homomorphisms, group actions, and Sylow Theorems. Progresses to Ring Theory including ideals, UFDs, PIDs, and polynomial rings. Continues with Modules theory including vector spaces, modules over PIDs, tensor products, and projective/injective/flat modules. Concludes with Field Theory, covering extensions, Galois Theory, and some extra structrue on fields.',
        link: '././assets/pdfs/books/EYNTKA-core-algebra.pdf',
        type: 'pdf'
      },
      {
        name: 'Commutative Algebra',
        desc: 'Book mainly for the backgroun for algebraic number theory and (classical/modern) Algebraic Geometry. Topics include Noetherian and Artinian rings, Localization, Primary Decomposition, and Integral Dependence. Covers Valuation Rings, Discrete Valuation Rings (DVRs), dimension theory (Krull dimension, Hilbert polynomial), and some categorical concepts such as (co)limits and adjoints.',
        link: '././assets/pdfs/books/EYNTKA-commutative-algebra.pdf',
        type: 'pdf'
      },
      {
        name: 'Classical Algebraic Geometry',
        desc: 'Geometry of affine and projective varieties over algebraically closed fields, preceding the language of schemes. Hilbert\'s Nullstellensatz, the correspondence between varieties and coordinate rings, and the Zariski topology. Covers morphisms, rational maps, dimension, smoothness, singularities, and blow-ups.',
        link: '././assets/pdfs/books/EYNTKA-classical-algebraic-geometry.pdf',
        type: 'pdf'
      },
      {
        name: 'Algebraic Number Theory',
        desc: 'The study of number fields and their rings of integers. Covers the failure of unique factorization and the remedy via ideals. Covers integral bases, norms and traces, splitting of primes, and the finiteness of the Ideal Class Group. Includes Dirichlet\'s Unit Theorem. Includes a proof of Kronnecker-Weber without using local fields.',
        link: '././assets/pdfs/books/EYNTKA-algebraic-number-theory.pdf',
        type: 'pdf'
      },
      {
        name: 'Core Representation Theory',
        desc: 'Focusing on the representation of finite groups and semisimple algebras. Maschke\'s Theorem, Schur\'s Lemma, and the Wedderburn-Artin Theorem. Extensive treatment of Character Theory, orthogonality relations, character tables, induced representations, and Frobenius Reciprocity. Bonus chapter on Quiver Theory.',
        link: '././assets/pdfs/books/EYNTKA-core-representation-theory.pdf',
        type: 'pdf'
      },
      {
        name: 'Homological Algebra',
        desc: 'Tools for measuring the failure of exactness in abelian categories. Covers Chain complexes, Homology and Cohomology, and Projective/Injective resolutions. Defines Derived Functors (specifically Tor and Ext) and their properties. Chapter on application of cohomology includes group cohomology and cohomological dimension. Concludes with a chapter on Spectral Sequences and their convergence.',
        link: '././assets/pdfs/books/EYNTKA-homological-algebra.pdf',
        type: 'pdf'
      },
      {
        name: 'Category Theory',
        desc: 'Categories, functors, and natural transformations. Yoneda\'s Lemma and the functor of points. Universal properties, limits and colimits, adjunctions and the adjoint functor theorems (GAFT/SAFT). Monads with their Eilenberg-Moore and Kleisli algebras and Beck monadicity. Kan extensions via ends, coends, and density. Monoidal categories and Mac Lane\'s coherence theorem, and enriched and 2-categories ', link: '././assets/pdfs/books/EYNTKA-category-theory.pdf',
        type: 'pdf'
      },
    ]
  },
  {
    name: 'Algebraic Geometry',
    desc: 'Presheaves and sheaves, stalks, sheafification, direct and inverse image. Affine schemes, Spec and the structure sheaf, gluing, the functor of points. Morphisms: separated, proper, finite, flat, smooth; fibre products, Proj. Group schemes and Hopf algebras. Quasi-coherent and coherent sheaves, projective morphisms, divisors and the Picard group, differentials. Sheaf cohomology, Cech, the cohomology of projective space, Serre finiteness and vanishing, Ext and Serre duality. Curves and surfaces: Riemann-Roch, the Hodge index theorem, Noether\'s formula, adjunction, blow-ups, the 27 lines on a cubic surface. Assumes classical algebraic geometry (see "classical algebraic geometry").',
    link: '././assets/pdfs/books/EYNTKA_algGeo.pdf',
    type: 'pdf'
  },
  {
    name: 'Elliptic Curves',
    desc: 'Covering the basics of elliptic curves with strong influences from Silverman: Their geometry, the formal group (as well as its relation to K-theory), The Weil Conjecture and Endomorhpism group over finite fields. Solutions over local fields and over the complex numbers is included, as well as results about the Weierstrass p-function. Mordel-Weil Theorem, and integral solutions.',
    link: '././assets/pdfs/books/EYNTKA-elliptic-curves.pdf',
    type: 'pdf'
  },
  {
    name: 'Abelian Varieties',
    desc: 'Book in progress covering currently complex tori and their cohomology/algebraicity, line bundles and Appell-Humbert Theorem, Polarization, and Riemann-Roch on Abelian varieties. ',
    link: '././assets/pdfs/books/EYNTKA-abelian-varieties.pdf',
    type: 'pdf'
  },
  {
    name: 'Geometric Representation Theory',
    desc: 'Begins with the foundational theory of linear algebraic groups, exploring them through the lens of Hopf algebras, comodules, and group actions (orbits and homogeneous spaces). Progresses to the local structure via Lie algebras, covering the Adjoint representation, Cartier\'s Theorem, quotient maps, and the intrinsic Jordan decomposition. Continues with the structure theory of solvable and reductive groups, including Borel subgroups, and culminates in the complete classification of split reductive groups using root systems, Weyl groups, and Root Data (Dynkin diagrams). Concludes with the algebraic representation theory of these groups; this part is still a work in progress.',
    link: '././assets/pdfs/books/EYNTKA-geo-rep-theory.pdf',
    type: 'pdf'
  },
  {
    name: 'Moduli, Deformation Theory, and Stacks',
    desc: 'formulate moduli problems as functors of points, builds the construction toolkit: fine and coarse moduli spaces, the Hilbert and Quot schemes, and Geometric Invariant Theory. Develops deformation theory: first-order deformations as cohomology (H^1 of the tangent sheaf, sections of the normal sheaf, Ext groups), obstructions, the naive cotangent complex, and Schlessinger\'s criteria. Define stacks that represent moduli problems with automorphisms: descent and Grothendieck topologies, fibered categories and stacks, algebraic spaces and Deligne-Mumford/Artin stacks with Artin\'s representability criteria, and gerbes with twisted sheaves and the Brauer group. An applications to the moduli of curves.',
    link: '././assets/pdfs/books/EYNTKA-moduli-stacks.pdf',
    type: 'pdf'
  },
  {
    name: 'Group and Galois Cohomology',
    desc: 'Cohomology of discrete, finite, and profinite groups and its arithmetic incarnation. Profinite groups; group cohomology via derived functors and the bar resolution, low-degree interpretations and group extensions, Tate cohomology and cup products for finite groups. Cohomological dimension, pro-p groups and the Golod-Shafarevich inequality, and the Brauer group. Galois cohomology of local and global fields: local and global Tate duality, the Poitou-Tate sequence and Euler-Poincaré characteristics, class formations, and the cohomological reciprocity isomorphism C_K/N_{L/K}C_L ≅ Gal(L/K)^ab. Concludes with descent, non-abelian cohomology, and Selmer and Shafarevich-Tate groups.',
    link: '././assets/pdfs/books/EYNTKA-galois-cohomology.pdf',
    type: 'pdf'
  },
  {
    name: 'Class Field Theory',
    desc: 'Local field theory. Class field theory via ray class groups, then the modern idele-theoretic perspective. The Hasse principle for degree-2 forms: a rational solution to P(x,y) exists iff one exists at every localization.',
    link: '././assets/pdfs/books/EYNTKA-class-field-theory.pdf',
    type: 'pdf'
  },
  {
    name: "Langlands for GL2(F)",
    desc: "A complete guide to the Local Langlands Correspondence for GL_2(F) for odd prime. Begins with the foundational theory of smooth representations of locally profinite groups and Hecke algebras. Classifies the Principal Series and Supercuspidal representations, constructing the latter explicitly via compact induction, Admissible Pairs, and Fundamental Strata. Covers the arithmetic invariants, Local L-functions and epsilon-factors via Tate's thesis and Godement-Jacquet theory, culminating in the Converse Theorem. Concludes by refining the Galois side into Weil Groups and Deligne Representations to establish the Local Langlands Correspondence for GL_2(F).",
    link: "././assets/pdfs/books/EYNTKA-langlands-gl2.pdf",
    type: 'pdf'
  },
  {
    name: 'Local Field Theory',
    desc: 'These books are a continuation of the algebraic number theory chapter presented in EYTNKA Algebra. The book continues where it left off in local field teory. As a motivation for local fields and elliptic curves, these books also include a demonstration of the Hasse Principle in showing that a rational solution for a degree 2 polynomial P(x,y) exists iff it exists at each localization.',
    link: '././assets/pdfs/books/EYNTKA-local-field-theory.pdf',
    type: 'pdf'
  },
  {
    name: 'Analytic Number Theory',
    desc: 'Elementary number theory review; arithmetic functions and summation techniques; Dirichlet series, Euler products, the Mellin transform, and Perron\'s formula; elementary prime distribution (Chebyshev\'s estimates, Mertens\' theorems, Bertrand\'s postulate); the Riemann zeta function (meromorphic continuation, the pole at s=1, non-vanishing on Re(s)=1); Prime Number Theorem; the functional equation, the trivial zeros and special values, and the critical strip and Riemann Hypothesis; Dirichlet characters and L-functions, with Gauss sums and the functional equation, the non-vanishing of L(1,chi), and Dirichlet\'s theorem on primes in arithmetic progressions; the Dedekind zeta function of a number fiel, and Hecke\'s functional equation, Hecke L-functions of ray class characters; Artin L-functions of Galois representations, with the Artin formalism, meromorphic continuation via Brauer induction, Chebotarev density theorem.',
    link: '././assets/pdfs/books/EYNTKA-analytic-number-theory.pdf',
    type: 'pdf'
  },

  {
    name: 'Differential Topology',
    desc: 'Topological and smooth manifolds, smooth maps, tangent and cotangent bundles; the rank theorem, immersions, submersions, embeddings; Sard\'s theorem, Whitney embedding, intersection theory; vector fields and flows; vector bundles, tensors, differential forms, integration and Stokes\' theorem. Distributions and the Frobenius theorem, degree theory, the Poincare-Hopf theorem, Morse theory, cobordism, and de Rham cohomology coming soon.',
    link: '././assets/pdfs/books/EYNTKA-differential-topology.pdf',
    type: 'pdf'
  },
  {
    name: 'Riemann Geometry',
    desc: 'Riemannian and pseudo-Riemannian metrics, the Levi-Civita connection, geodesics and the exponential map, the curvature tensor. Jacobi fields and conjugate points, completeness and comparison theorems. Submanifold geometry, and curvature and topology. Homogeneous and symmetric spaces. Connections and curvature on vector bundles, Chern-Weil theory. The Hodge-de Rham theorem and the Bochner technique.',
    link: '././assets/pdfs/books/EYNTKA-riemannian-geometry.pdf',
    type: 'pdf'
  },
  {
    name: 'Algebraic Topology',
    desc: 'Homotopy, homotopy equivalences,  cell-complexes. Fundamental groups, covering spaces, van-kampen\'s theorem, Deck Transformations, interesting consequences. Homology, Delta and singular complexes, relative homology, snake lemma and Mayer-Vietoris, Cellular Homology, Euler-Characteristic and applications. Cohomology, cup and cap product, Poincare Duality. Homotopy Theory and Spectral Sequences coming soon!',
    link: '././assets/pdfs/books/EYNTKA-algebraic-topology.pdf',
    type: 'pdf'
  },
  {
    name: 'Lie Groups',
    desc: 'Matrix Lie groups and the classical groups. Lie groups as manifolds and their Lie algebras, and the Lie group-Lie algebra correspondence. Homogeneous spaces, actions, and covering groups. Structure theory of Lie algebras: nilpotent and solvable, semisimple and the Cartan criteria, Cartan subalgebras and the root space decomposition, culminating in root systems and the classification (Cartan matrices, Dynkin diagrams). Compact groups, the Peter-Weyl theorem, and the Weyl character formula coming soon.',
    link: '././assets/pdfs/books/EYNTKA-lie-groups.pdf',
    type: 'pdf'
  },
  {
    name: 'Vector Bundles and K-Theory',
    desc: 'The topological side: vector bundles, classifying spaces BO and BU, topological K^0 and K^1, Bott periodicity, and characteristic classes (Stiefel-Whitney, Chern, Euler, Pontryagin).',
    link: '././assets/pdfs/books/EYNTKA_Vector_bundles_and_K-theory.pdf',
    type: 'pdf'
  },
  {
    name: 'Algebraic K-Theory',
    desc: 'The algebraic side: projective modules and K_0 (the Grothendieck group, its relation to Pic, Morita invariance), K_1 (the Whitehead group and determinants), K_2 (the Steinberg group and Matsumoto\'s theorem), and an introduction to Quillen\'s higher K-theory via the plus- and Q-constructions.',
    link: '././assets/pdfs/books/EYNTKA-algebraic-k-theory.pdf',
    type: 'pdf'
  },
  {
    name: 'C* Albegra and K-Theory',
    desc: 'Basic C* algebra and their K-theory (in particular the 6-term exact sequence and Bott periodicity is proven)',
    link: '././assets/pdfs/books/EYNTKA-cstar-algebras.pdf',
    type: 'pdf'

  },
  {
    name: 'Real Analysis',
    desc: 'Abstract and Lebesgue Measure, Measurable and Integrable functions, Signed Measures, Radon-Nikodyn Theorem and FTC, Banach and Hilbert Spaces, Topological Vector Spaces, Lebegue Space, Fourier Analysis, Distribution Theory, and Measure on Locally Compact Topological Groups. ',
    link: '././assets/pdfs/books/EYNTKA-real-analysis.pdf',
    type: 'pdf',
    children: [
      {
        name: 'Measure Theory',
        desc: 'Foundational construction of Sigma-Algebras, Outer Measure, and Borel/Lebesgue measures on the real line.  Coverage of Integration: measurable functions, modes of convergence, Product Measure, and the n-dimensional Lebesgue Integral. Concludes with the theory of Signed and Complex Measures, the Lebesgue-Radon-Nikodym Theorem, and the differentiation of measures on Euclidean Space.',
        link: '././assets/pdfs/books/EYNTKA-measure-theory.pdf',
        type: 'pdf'
      },
      {
        name: 'Functional Analysis',
        desc: 'Begins with Metric Function Spaces, Baire Category Theory, and equicontinuity. Covers the core structures of Functional Analysis: Banach and Fréchet Spaces (including Dual Spaces and Weak Topologies) and Hilbert Spaces (including Compact Operators and Trace). Includes Spectral Theory for Banach Algebras and the Continuous Functional Calculus. Extensive treatment of Lebesgue Spaces and interpolation theorems (Riesz-Thorin), concluding with Radon Measures and the dual theory of continuous functions.',
        link: '././assets/pdfs/books/EYNTKA-functional-analysis.pdf',
        type: 'pdf'
      },
      {
        name: 'Harmonic Analysis',
        desc: 'Centered on Fourier Analysis: definitions, convolution, and the Fourier Transform on the n-Torus and Euclidean Space, including point-wise convergence of Fourier Series. Provides a rigorous treatment of Distribution Theory, covering tempered distributions, Sobolev Spaces, and the Sobolev Embedding Theorem. The final chapters generalize these concepts to Topological Groups, covering the Haar Measure and Pontryagin Duality.',
        link: '././assets/pdfs/books/EYNTKA-harmonic-analysis.pdf',
        type: 'pdf'
      },
    ]
  },
  {
    name: 'Complex Analysis',
    desc: 'Complex numbers, functions, and Mobius transformations. Complex Differentiation, power series, analytic functions. Complex integration, Meromorphic functions, Residue theorem, and Argument Principle. Holomorphic Function spaces, Montel and Marty\'s Theorem, Riemann Mapping Theorem. Factorization of Holomorphic Functions and Riemann-zeta function. Elliptic functions and Weiestrass p-function. Riemann surfaces and Harmonic Functions. Higher-dimensional complex differentiation.',
    link: '././assets/pdfs/books/EYNTKA_complex_analysis.pdf',
    type: 'pdf'
  },
  {
    name: 'Logic',
    desc: 'First Order Language and Propositional Language, Deduction from Inference heavy and Axiom heavy approach, Soundness and Completeness, Compactness, Computability, Turing Machines, Godel\'s Incompleteness Theorem. ',
    link: '././assets/pdfs/books/EYNTKA_logic.pdf',
    type: 'pdf'
  },
  {
    name: 'Topology',
    desc: 'Definition and Property of Topologies, Continuity, Seperation and Countability Axioms, Subspace/Product/Quotient Topology, Weak Topology, Metric Spaces, Connectedness and Compactness, Urysohn Lemma and Consequences, Fundamental Group, Topological Group. Dimension Theory coming soon!',
    // link: '/assets/books/topology/',
    // type: 'html'
    link: '././assets/pdfs/books/EYNTKA_topology.pdf',
    type: 'pdf'
  },
  {
    name: 'Probability',
    desc: 'Measure-theoretic probability built on measure theory: Probability Spaces and the Borel-Cantelli Lemmas, Random Variables and Independence, Expectation and its Inequalities, Laws of Large Numbers (including Hardy-Ramanujan), Weak Convergence and Characteristic Functions, the Central Limit Theorem (including Erdos-Kac), the Law of the Iterated Logarithm, Conditional Expectation, and Discrete-Time Martingales.',
    link: '././assets/pdfs/books/EYNTKA-Probability.pdf',
    type: 'pdf'
  },
  {
    name: 'Core Probability',
    desc: 'Motivation and Definitions, Distributions and Expected Value, Linearity of Expectations, Variance and Correlation, Law of Large Numbers, Cliques in Erdos Reyni Graphs, Exponential Inequalities, Gaussian Distribution. Markov Chains coming soon!',
    link: '././assets/pdfs/books/EYNTKA-core-probability.pdf',
    type: 'pdf'
  },
  {
    name: 'Nonlinear Wave and Dispersive PDE',
    desc: 'Linear and nonlinear wave equations in increasing complexity; the wave equation and its weak/distributional solutions; existence and uniqueness for linear and nonlinear wave equations; Littlewood-Paley theory; the Klainerman-Sobolev inequality and global existence for nonlinear wave equations; well-posedness and dispersive (Strichartz) estimates. Maxwell-Klein-Gordon equations coming soon.',
    link: '././assets/pdfs/books/EYNTKA-nonlinear-wave.pdf',
    type: 'pdf'
  },
  {
    name: 'Linear Elliptic and Parabolic PDE',
    desc: 'Second-order linear elliptic and parabolic PDE. Weak formulations and the Lax-Milgram theorem; the Sobolev setup for boundary-value problems; existence by variational methods and the Fredholm alternative; Schauder and L^p (Calderon-Zygmund) regularity; spectral theory of elliptic operators (Rayleigh quotient, Courant-Fischer min-max, Weyl\'s law). Maximum principles, Green\'s functions, and the parabolic theory (heat equation, semigroups) coming soon.',
    link: '././assets/pdfs/books/EYNTKA-linear-pde.pdf',
    type: 'pdf'
  },

  {
    name: 'Ordinary Differential Equations (ODE)',
    desc: 'Existence and Uniqueness Theorems (Picard-Lindelöf), Scalar and Linear Second-Order Equations, Linear Systems via Matrix Exponentials and Jordan Forms, Qualitative Theory and Stability (Lyapunov, Poincaré-Bendixson), Boundary Value Problems, Sturm-Liouville Theory and Green\'s Functions, Series Solutions and Special Functions (Bessel, Legendre).',
    link: '././assets/pdfs/books/EYNTKA_ODE.pdf',
    type: 'pdf'
  },
  {
    name: 'Elementary Analysis',
    desc: 'Notes that will eventually be the basics that are needed for real analysis (real numbers, sequences and series, etc.) and differentiable geometry (calculus).',
    link: '././assets/pdfs/books/elementary_analysis.pdf',
    type: 'pdf'
  },
  {
    name: 'Linear Algebra',
    desc: 'Linear systems, elimination and the LU factorization; vector spaces over the reals and complexes, the four fundamental subspaces, rank-nullity; determinants as signed volume, cofactors, Cramer\'s rule, orientation; eigenvalues, diagonalization, algebraic and geometric multiplicity, the minimal polynomial and Cayley-Hamilton. Coming soon: inner products, orthogonality and QR; least squares and the pseudoinverse; the spectral theorem; quadratic forms and Sylvester\'s law of inertia; complexification and complex structures; Hermitian and symplectic forms; the singular value decomposition; Jordan forms over both fields; conditioning, eigenvalue perturbation, iterative computation, Perron-Frobenius.',
    link: '././assets/pdfs/books/EYNTKA-linear-algebra.pdf',
    type: 'pdf'
  },
];

const pdfBasename = (link: unknown): string =>
  String(link).split('/').pop()!.toLowerCase();

// Curated books keyed by lower-cased PDF basename. Used by BookCatalogService to
// override graph.json's terser descriptions AND its (occasionally mis-cased) PDF
// links — the curated links are the ones the live site already resolves.
export const CURATED_BY_PDF: Record<string, Book> = (() => {
  const out: Record<string, Book> = {};
  const add = (b: Book) => {
    out[pdfBasename(b.link)] = b;
    (b.children ?? []).forEach(add);
  };
  CURATED_BOOKS.forEach(add);
  return out;
})();
