import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Book } from 'src/app/interfaces/books.model';

// ─── Admin password setup ────────────────────────────────────────────────────
// To set your password, run this in a browser console and paste the result below:
//   crypto.subtle.digest('SHA-256', new TextEncoder().encode('your-password'))
//     .then(b => console.log(Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2,'0')).join('')))
const PASSWORD_HASH = 'c1e7dc8e9098153d7ad6d7c49fe9fa65e58977524473fc97df2950d4252df653';
// ─────────────────────────────────────────────────────────────────────────────

const GITHUB_PDF_API = 'https://api.github.com/repos/cs-ghi/website-nate/contents/assets/pdfs/books?ref=gh-pages';
const AUTH_KEY = 'books_admin_auth';

async function sha256(str: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ─── Fuzzy search ────────────────────────────────────────────────────────────
// Subsequence matcher over a (short) title: rewards contiguous runs and matches
// at word boundaries. Returns 0 when the query is not a subsequence of target.
function fuzzyScore(query: string, target: string): number {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (!q) return 1;

  const idx = t.indexOf(q);
  if (idx !== -1) {
    const boundary = idx === 0 || t[idx - 1] === ' ';
    return 1000 - idx + (boundary ? 200 : 0);
  }

  let qi = 0, score = 0, lastMatch = -2;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      score += lastMatch === ti - 1 ? 5 : 1;
      if (ti === 0 || t[ti - 1] === ' ') score += 3;
      lastMatch = ti;
      qi++;
    }
  }
  return qi === q.length ? score : 0;
}

// Score a book entry: fuzzy on the title (primary), substring on the description.
function entryScore(query: string, name: string, desc: unknown): number {
  const nameScore = fuzzyScore(query, name);
  if (nameScore > 0) return nameScore + 1000;
  return String(desc).toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
}
// ─────────────────────────────────────────────────────────────────────────────


export const booksArray: Book[]= [
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
    ]
  },
  {
    name: 'Algebraic Geometry',
    desc: 'With an assumption of clasical algebraic geometry being covered (see "classical algebraic geometry"), this book will hold my Modern Algebraic Geometry Knowledge. The first part is dedicated to the basics: sheaf theory, schemes and their properties, cohomology of quasicoherent sheaves, and partical appliations to curves and modules. Further parts shall focus on more specialized topics',
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
    name: 'Geometric Representation Theory',
    desc: 'Begins with the foundational theory of linear algebraic groups, exploring them through the lens of Hopf algebras, comodules, and group actions (orbits and homogeneous spaces). Progresses to the local structure via Lie algebras, covering the Adjoint representation, Cartier\'s Theorem, quotient maps, and the intrinsic Jordan decomposition. Continues with the structure theory of solvable and reductive groups, including Borel subgroups, and culminates in the complete classification of split reductive groups using root systems, Weyl groups, and Root Data (Dynkin diagrams). Concludes with the algebraic representation theory of these groups; this part is still a work in progress.',
    link: '././assets/pdfs/books/EYNTKA-geo-rep-theory.pdf',
    type: 'pdf'
  },
  {
    name: 'Class Field Theory',
    desc: 'These books are a continuation of the algebraic number theory chapter presented in EYTNKA Algebra. The book continues where it left off in local field teory and presents Class Field Theory using Ray class groups before continuing onto the more modern perspective using the Idele group. As a motivation for local fields and elliptic curves, these books also include a demonstration of the Hasse Principle in showing that a rational solution for a degree 2 polynomial P(x,y) exists iff it exists at each localization.',
    link: '././assets/pdfs/books/EYNTKA-class-field-theory.pdf',
    type: 'pdf'
  },
  {
    name: "Langlands for GL2(F)",
    desc: "A complete guide to the Local Langlands Correspondence for GL_2(F) for odd prime. Begins with the foundational theory of smooth representations of locally profinite groups and Hecke algebras. Classifies the Principal Series and Supercuspidal representations, constructing the latter explicitly via compact induction, Admissible Pairs, and Fundamental Strata. Covers the arithmetic invariants, Local L-functions and epsilon-factors via Tate's thesis and Godement-Jacquet theory, culminating in the Converse Theorem. Concludes by refining the Galois side into Weil Groups and Deligne Representations to establish the Local Langlands Correspondence for GL_2(F).",
    link: "././assets/pdfs/books/EYNTKA_p-adic_rep.pdf",
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
    name: 'Differential Geometry',
    desc: 'Various properties of Topological and Smooth Manifolds, smooth maps, tangent maps and bundles, Rank-Nullity Theorem and consequences, Sard\'s Theorem and Transversality, Vector Bundles, Differential Forms and integration on Manifolds, Riemannian Manifolds. Preliminaires include inverse and implicit function theorem and Partition of Unity',
    link: '././assets/pdfs/books/EYNTKA_Differential_Geometry.pdf',
    type: 'pdf'
  },
  {
    name: 'Riemann Geometry',
    desc: 'Riemann and Pseudo-Riemann metric, Levi-Cavita Connections, Geodescis, the curvature tensor, Jacobian Fields, Comparison Theorems',
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
    desc: 'Motivation and Definitions, Distributions and Expected Value, Linearity of Expectations, Variance and Correlation, Law of Large Numbers, Cliques in Erdos Reyni Graphs, Exponential Inequalities, Gaussian Distribution. Markov Chains coming soon!',
    link: '././assets/pdfs/books/EYNTKA-Probability.pdf',
    type: 'pdf'
  },
  {
    name: 'Partial Differential Equations (PDE)',
    desc: 'books focusing on solving wave equations in increasing degrees of complexity. Existence and uniqueness of solutions to linear and non-linear wave equations, Litttle-Paley Theory, Distribution Theory, Klainerman-Sobelev Inequality. Future goal of adding Maxell-Klein-Gordon equations and Strichartz type estimates.',
    link: '././assets/latex/PDE/EYNTKA_PDE.pdf',
    type: 'pdf'
  },

  {
    name: 'Ordinary Differential Equations (ODE)',
    desc: 'Existence and Uniqueness Theorems (Picard-Lindelöf), Scalar and Linear Second-Order Equations, Linear Systems via Matrix Exponentials and Jordan Forms, Qualitative Theory and Stability (Lyapunov, Poincaré-Bendixson), Boundary Value Problems, Sturm-Liouville Theory and Green\'s Functions, Series Solutions and Special Functions (Bessel, Legendre).',
    link: '././assets/latex/ODE/EYNTKA_ODE.pdf',
    type: 'pdf'
  },
  {
    name: 'Elementary Analysis',
    desc: 'Notes that will eventually be the basics that are needed for real analysis (real numbers, sequences and series, etc.) and differentiable geometry (calculus).',
    link: '././assets/pdfs/books/elementary_analysis.pdf',
    type: 'pdf'
  },
];

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  books = booksArray;
  expandedBooks = new Set<string>();
  searchQuery = '';

  // Keyboard navigation: the currently highlighted entry (rendered only while
  // the search box is focused) and whether the box has focus.
  filteredBooks: Book[] = this.books;
  highlightedItem?: Book;
  searchFocused = false;

  // Press "/" anywhere on the page to jump to the search box (unless already
  // typing in a field).
  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return;
    const el = event.target as HTMLElement | null;
    const tag = el?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || el?.isContentEditable) return;
    event.preventDefault();
    this.searchInput?.nativeElement.focus();
  }

  isAuthenticated = false;
  showPasswordForm = false;
  passwordInput = '';
  authError = false;
  isLoadingPdfs = false;
  rawPdfs: Book[] = [];

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.onSearchChange();
    this.isAuthenticated = sessionStorage.getItem(AUTH_KEY) === 'true';
    if (this.isAuthenticated) {
      this.loadRawPdfs();
    }
  }

  // Recompute the visible books from the query, ranked by relevance. A book is
  // kept if its own title/description matches, or if any of its children match
  // (in which case only the matching children are shown). Memoized into a field
  // (rather than a getter) so object identity stays stable for the keyboard
  // highlight comparison. Called on every query change.
  onSearchChange(): void {
    const q = this.searchQuery.trim();
    if (!q) {
      this.filteredBooks = this.books;
    } else {
      const scored: { book: Book; score: number }[] = [];
      for (const book of this.books) {
        const selfScore = entryScore(q, book.name, book.desc);
        const matchingChildren = (book.children ?? [])
          .filter(c => entryScore(q, c.name, c.desc) > 0);
        const bestChild = matchingChildren
          .reduce((m, c) => Math.max(m, entryScore(q, c.name, c.desc)), 0);

        if (selfScore > 0) {
          scored.push({ book, score: Math.max(selfScore, bestChild) });
        } else if (matchingChildren.length) {
          scored.push({ book: { ...book, children: matchingChildren }, score: bestChild });
        }
      }
      this.filteredBooks = scored.sort((a, b) => b.score - a.score).map(s => s.book);
    }
    // Reset the highlight to the top result.
    this.highlightedItem = this.navItems[0];
  }

  // Flat list of keyboard-navigable entries, in display order: each visible book
  // followed by its visible children.
  get navItems(): Book[] {
    const items: Book[] = [];
    for (const book of this.filteredBooks) {
      items.push(book);
      if (this.shouldShowChildren(book)) {
        for (const child of book.children ?? []) items.push(child);
      }
    }
    return items;
  }

  onSearchFocus(): void {
    this.searchFocused = true;
    if (!this.highlightedItem) this.highlightedItem = this.navItems[0];
  }

  // Arrow keys move the highlight; Enter opens the highlighted (or top) entry.
  onSearchKeydown(event: KeyboardEvent): void {
    const items = this.navItems;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.moveHighlight(1, items);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.moveHighlight(-1, items);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const target = this.highlightedItem ?? items[0];
      if (target) this.handleBookClick(target);
    }
  }

  private moveHighlight(delta: number, items: Book[]): void {
    if (!items.length) return;
    const cur = this.highlightedItem ? items.indexOf(this.highlightedItem) : -1;
    const next = Math.min(items.length - 1, Math.max(0, cur + delta));
    this.highlightedItem = items[next];
    setTimeout(() =>
      document.querySelector('.nav-highlighted')?.scrollIntoView({ block: 'nearest' }));
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.onSearchChange();
  }

  // Hidden (admin) raw PDFs filtered by the same query, ranked by relevance.
  get filteredRawPdfs(): Book[] {
    const q = this.searchQuery.trim();
    if (!q) return this.rawPdfs;
    return this.rawPdfs
      .map(p => ({ pdf: p, score: fuzzyScore(q, p.name) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(x => x.pdf);
  }

  // Children are auto-expanded while a search is active so matches stay visible.
  shouldShowChildren(book: Book): boolean {
    return this.searchQuery.trim() !== '' || this.isExpanded(book.name);
  }

  toggleLock() {
    if (this.isAuthenticated) {
      this.logout();
    } else {
      this.showPasswordForm = !this.showPasswordForm;
      this.authError = false;
      this.passwordInput = '';
    }
  }

  async submitPassword() {
    const hash = await sha256(this.passwordInput);
    if (hash === PASSWORD_HASH) {
      this.isAuthenticated = true;
      sessionStorage.setItem(AUTH_KEY, 'true');
      this.showPasswordForm = false;
      this.authError = false;
      this.passwordInput = '';
      this.loadRawPdfs();
    } else {
      this.authError = true;
      this.passwordInput = '';
    }
  }

  onPasswordKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') { this.submitPassword(); }
    if (event.key === 'Escape') { this.showPasswordForm = false; }
  }

  logout() {
    this.isAuthenticated = false;
    sessionStorage.removeItem(AUTH_KEY);
    this.rawPdfs = [];
    this.showPasswordForm = false;
  }

  loadRawPdfs() {
    this.isLoadingPdfs = true;
    this.http.get<any[]>(GITHUB_PDF_API).subscribe({
      next: (files) => {
        this.rawPdfs = files
          .filter(f => f.type === 'file' && f.name.toLowerCase().endsWith('.pdf'))
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(f => ({
            name: f.name,
            desc: '',
            link: `././assets/pdfs/books/${f.name}`,
            type: 'pdf' as const
          }));
        this.isLoadingPdfs = false;
      },
      error: () => {
        this.isLoadingPdfs = false;
      }
    });
  }

  openRawPdf(book: Book) {
    window.open(book.link.toString(), '_blank');
  }

  viewPdf(book: Book) {
    this.router.navigate(['/pdf-viewer'], {
      queryParams: {
        src: book.link,
        name: book.name,
        source: 'books'
      }
    });
  }

  viewHtml(book: Book) {
    this.router.navigate(['/html-viewer'], {
      queryParams: {
        src: book.link,
        name: book.name
      }
    });
  }

  toggleExpand(bookName: string): void {
    if (this.expandedBooks.has(bookName)) {
      this.expandedBooks.delete(bookName);
    } else {
      this.expandedBooks.add(bookName);
    }
  }

  isExpanded(bookName: string): boolean {
    return this.expandedBooks.has(bookName);
  }

  handleBookClick(book: Book) {
    if (book.type === 'html') {
      this.viewHtml(book);
    } else {
      this.viewPdf(book);
    }
  }
}
