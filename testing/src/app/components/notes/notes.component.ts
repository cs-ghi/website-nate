import { NotExpr } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Note, Notes } from 'src/app/interfaces/notes.model';


export const notesArray: Note[]= [
  {
    name: 'Abstract Algebra',
    desc: 'Covers "all" undergraduate algebra: Groups, Rings, Modules, Fields, Commutative algebra, Algebraic Number Theory, and Representation of finite groups. Special topics include Quiver Theory and Category theory. Includes basic preliminary chapter. Homological Algebra coming soon!',
    link: '././assets/pdfs/notes/EYNTKA_algebra.pdf'
  },
  {
    name: 'Differential Geometry',
    desc: 'Various properties of Topological and Smooth Manifolds, smooth maps, tangent maps and bundles, Rank-Nullity Theorem and consequences, Sard\'s Theorem and Transversality, Vector Bundles, Differential Forms and integration on Manifolds, Riemann Manifolds. Preliminaires include inverse and implicit function theorem and Partition of Unity',
    link: '././assets/pdfs/notes/EYNTKA_differential_geometry.pdf'
  },
  {
    name: 'Real Analysis',
    desc: 'Abstract and Lebesgue Measure, Measurable and Integrable functions, Signed Measures, Radon-Nikodyn Theorem and FTC, Banach and Hilbert Spaces, Topological Vector Spaces, Lebegue Space, Fourier Analysis, Distribution Theory, and Measure on Locally Compact Topological Groups. ',
    link: '././assets/pdfs/notes/EYNTKA_real_analysis.pdf'
  },
  {
    name: 'Complex Analysis',
    desc: 'Complex numbers, functions, and Mobius transformations. Complex Differentiation, power series, analytic functions. Complex integration, Meromorphic functions, Schwarz Lemma, Residue theorem, and Argument Principle. Holomorphic Function spaces, Montel and Marty\'s Theorem, Riemann Mapping Theorem. Factorization of Holomorphic Functions and Riemann-zeta function. Elliptic functions and Weiestrass p-function. Riemann surfaces and Harmonic Functions. Higher-dimensional complex differentiation. Some introduction to the relation between complex analysis and algebraic geometry.',
    link: '././assets/pdfs/notes/EYNTKA_complex_analysis.pdf'
  },
  {
    name: 'Functional Analysis',
    desc: 'Banach Spaces, Hahn-Banach Extension Theorem, Hilbert Spaces, Normal and Self-Adjoint Operators, Positive Operators, Unitary Operators, Diagonalizability, Compact Operators and Fredholm Operators, Index, and Spectral Theory. Gelfand Duality coming soon!',
    link: '././assets/pdfs/notes/EYNTKA_functional_analysis.pdf'
  },
  {
    name: 'Logic',
    desc: 'First Order Language and Propositional Language, Deduction from Inference heavy and Axiom heavy approach, Soundness and Completeness, Compactness, Computability, Turing Machines, Godel\'s Incompleteness Theorem. ',
    link: '././assets/pdfs/notes/EYNTKA_logic.pdf'
  },
  {
    name: 'Point-Set Topology',
    desc: 'Definition and Property of Topologies, Continuity, Seperation and Countability Axioms, Subspace/Product/Quotient Topology, Weak Topology, Metric Spaces, Connectedness and Compactness, Urysohn Lemma and Consequences, Fundamental Group, Topological Group. Dimension Theory coming soon!',
    link: '././assets/pdfs/notes/EYNTKA_topology.pdf'
  },
  {
    name: 'Probability',
    desc: 'Motivation and Definitions, Distributions and Expected Value, Linearity of Expectations, Variance and Correlation, Law of Large Numbers, Cliques in Erdos Reyni Graphs, Exponential Inequalities, Gaussian Distribution. Markov Chains coming soon!',
    link: '././assets/pdfs/notes/EYNTKA_probability.pdf'
  },
  {
    name: 'PDEs',
    desc: 'Notes focusing on solving wave equations in increasing degrees of complexity. Existence and uniqueness of solutions to linear and non-linear wave equations, Litttle-Paley Theory, Distribution Theory, Klainerman-Sobelev Inequality. Future goal of adding Maxell-Klein-Gordon equations and Strichartz type estimates.',
    link: '././assets/pdfs/notes/EYNTKA_PDEs.pdf'
  },
  {
    name: 'Algebraic Topology',
    desc: 'Homotopy, homotopy equivalences,  cell-complexes. Fundamental groups, covering spaces, van-kampen\'s theorem, Deck Transformations, interesting consequences. Homology, Delta and singular complexes, relative homology, snake lemma and Mayer-Vietoris, Cellular Homology, Euler-Characteristic and applications. Cohomology, cup and cap product, Poincare Duality. Homotopy Theory and Spectral Sequences coming soon!',
    link: '././assets/pdfs/notes/EYNTKA_algebraic_topology.pdf'
  },
];


@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  notes=notesArray;

  constructor() { }

  ngOnInit(): void {
  }

}
