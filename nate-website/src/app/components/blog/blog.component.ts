import { Component, OnInit, Input, NgModule } from '@angular/core';
import { Book, Books } from 'src/app/interfaces/books.model';

export const blogArray: Book[]= [

    {    name: "Alien's Perspective on Analysis",    desc: "We typically build analysis from the bottom up (N -> Q -> R -> C). But in many ways it is more natural to do (N -> Q -> C), and then try to find how R would naturally appear. This post explores an 'Alien' perspective where the algebraic closure of Q is the natural universe and R a derived substructure found via Galois involutions. This shift in perspective tries to explains why Real Analysis is 'flexible' (allowing bump functions) while Complex Analysis is 'rigid,' and characterizes R as the unique 'Cohesive-Connected Field' among all completions of Q",
      link: "././assets/latex/alien_perspective_on_analysis/alien_perspective_on_analysis.pdf"
    },
    {
      name: "Intuition on Fourier Analysis",
      desc: "Blurb from my real analysis notes extracted to be a separate blog.",
      link: "././assets/latex/fourier_transforms/fourier_transforms.pdf"
    },

    {  name: "A Narrative of Homological Algebra",    desc: "I had a sudden idea of how I see the chronology of homological algebra. I tried to make it as historically as possible. ",
      link: "././assets/latex/a_narrative_of_homological_algebra/a_narrative_of_homological_algebra.pdf"
    },
    {    name: "Some Geometry of Hilbert Spaces",
      desc: "This blog covers some intuition I've developed when trying to really undersatnd why Hilbert space of all the Lp spaces is the right generalization of euclidean space, namely I dive into how to think of Hilbert space as 'flat' as compared to other Lp spaces.",
      link: "././assets/latex/geometric_intuition_of_hilbert_spaces/geometric_intuition_of_hilbert_spaces.pdf"
    },
    { name: "Representation of SL2: L-packets",
      desc: "This post following the paper 'Representations of SL2(F)' by Guy Henniart and Marie-France Vignéras explores the representation theory of $SL_2(F)$ through the lens of restriction from $GL_2(F)$. While the Local Langlands correspondence is a bijection for the general linear group, the restriction to the special linear group creates L-packets -- finite fibers of indistinguishable representations. Using Clifford Theory adapted for locally profinite groups and the uniqueness of Whittaker models, the paper goes over why these packets have cardinalities of 1, 2, or 4, and alludes to their representation theory information",
      link: "././assets/latex/langlands_for_sl2/langlands_for_sl2.pdf"  },
    {
      name: "Some Harmonic Analysis",
      desc: "This is an extract from EYNTKA Algebra that goes over how the representation of finite abelian groups links to Harmonic analysis. I also added a quick explanation on the generalization to locally compact abelian groups (details in the notes on Pontryagin duality) and how non-commutative geometry arrises from a group-ring",
      link: "././assets/latex/some_harmonic_analysis/some_harmonic_analysis.pdf"
    },
    {    name: "Comparing Schemes and Manifolds",
        desc: "An extract from EYTNKA Algebraic Geometry that lists off in bullet point format some differences between schemes and manifolds to get a better sense of the similarities and differences between the geometries they represent",
        link: "././assets/latex/differences_between_schemes_and_manifolds/differences_between_schemes_and_manifolds.pdf"
    },
    {
      name: "Non-Hausdorff Space",
      desc: "A quick blog for non-mathematicians to see an example of a space that can have two points infinitely close to each other while remaining distinct",
      link: "././assets/latex/nonhausdorfness/nonhausdorfness.pdf"
    },
  {
    name: 'Reserach in Algebraic Geometry',
    desc: 'An extract from the end of EYTNKA algebra covering the areas of algebraic geometry research that peeked my interset. Goes over a quick description and resources to understand the math for the statment (either my own or from others)',
    link:'././assets/latex/areas_of_algebraic_geoemtry_reserach/areas_of_algebraic_geoemtry_reserach.pdf'
  },

  {
    name: 'Clock Arithmetic and some Applications',
    desc: 'This is a quick expository article requiring no mathematical background that aims to teach the basic notion of modular arithmetic, or "clock arithmetic," to my friends to whom I love giving math riddles. I also added a quick survey of some uses of modular arithmetic as well as some surprising connections between prime numbers.',
    link: '././assets/latex/clockArithmetics/clock_arithmetic.pdf'
  },
    { name: "Galois Theory - Why use Field Extensions",
      desc: "This is an extract from EYNTKA algebra of me fleshing out my intuition on why field extensions are the natural setting to study the symmetries of the roots of polynomials.",
      link: "././assets/latex/galois_theory_intuition_behind_field_extensions/galois_theory_intuition_behind_field_extensions.pdf"
    },
  // {
  //   name: 'The Difficulty in the Collatz Conjecture',
  //   desc: 'While talking to non-math friends about my interest in number theory, the Collatz Conjecture seems to always be on the tip of their tongues. After perhaps being asked a dozen times about it, I decided to take a look at the conjecture. This paper goes over a probablistic distribution that can be put on the represetnation of natural numbers that is stable when extending the number to the 2-adics, and is almost stable over natural numbers. This allows you to define interesting functionals and find their expected value. Using these, we can re-formulate the conjecture into a problem of these functionals expected value to be negative. In the conclusion, I point out how the Collatz conjecture has been reformulated into this new framework and why it is more evident that it is difficult.',
  //   link: '././assets/pdfs/blogs/Conjecture.pdf'
  // },

  {
    name: 'Complex Analysis: What is it?',
    desc: 'I have struggled with how to perceive complex analysis for awhile, and I finally landed on an intuition that is satisfying. This article expands on the following: "Complex analysis is the analytification of polynomials, giving us the tools to form a link between Algebra and Analysis"',
    link: '././assets/latex/whatIsComplex/what_is_complex.pdf'
  },
  // {
  //   name: 'Towards Langland\'s Reciprocity',
  //   desc: 'Many may have heard the tentalizing claim that quadratic reciprocity is the simplest version of langland\'s reciprocity. In this quick article, I give an overview of the build-up towards it by going through Artin\'s reciprocity. ',
  //   link: '././assets/pdfs/blogs/From_Quadratic_to_Langland.pdf'
  // },
];

@Component({
  selector: 'app-blogs',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})

export class BlogComponent implements OnInit {
  blogs=blogArray;

  constructor() { }

  ngOnInit(): void {
  }
}
