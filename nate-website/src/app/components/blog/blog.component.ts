import { Component, OnInit, Input, NgModule } from '@angular/core';
import { Note, Notes } from 'src/app/interfaces/notes.model';

export const blogArray: Note[]= [
  {
    name: 'What is Complex Analysis?',
    desc: 'I have struggled with how to perceive complex analysis for years, and I finally landed on an intuition that is satisfying. This article expands on the following: "Complex analysis is the analytification of polynomials, giving us the tools of analysis to form a link between these two fields"',
    link: '././assets/latex/whatIsComplex/what_is_complex.pdf'

  },
  {
    name: 'Translating Serre\'s Paper on Simple Algebras',
    desc: 'This is my translation and embellishment of Serre\'s "Applications algébriques de la cohomologie des groupes. II : théorie des algèbres simples". It is fascinating how number theory can be so beautifully generalised to representation theory. One can see why Langlands proposed his research program by going through these results!',
    link: '././assets/pdfs/blogs/serre_paper-Theory_of_Simple_Algebras.pdf'
  },
  {
    name: 'Towards Langland\'s Reciprocity',
    desc: 'Many may have heard the tentalizing claim that quadratic reciprocity is the simplest version of langland\'s reciprocity. In this quick article, I give an overview of the build-up towards it by going through Artin\'s reciprocity. ',
    link: '././assets/pdfs/blogs/From_Quadratic_to_Langland.pdf'
  },
  // {
  //   name: 'The Difficulty in the Collatz Conjecture',
  //   desc: 'While talking to friends about my interest in number theory, the Collatz Conjecture seems to always be on the tip of their tongues. After perhaps being asked a dozen times about it, I decided to take a look at the conjecture. I found an interesting probibalistic distributions on the natural numbers that is stable under iteration of the Collatz function up to a small (key!) exception, as well as a formulation that demonstrates the difficulties in concluding the veracity of the conjecture.',
  //   link: '././assets/pdfs/blogs/Conjecture.pdf'
  // },
  {
    name: 'Pontryagin Duality',
    desc: 'The existence and applicability Fourier transform is a fascinating piece of mathematics. Pushing the limits of where it may be applied then becomes an interesting question, which lead me to explore Pontryagin duality. This paper is a quick summary that builds up Pontryagin duality and gives some applications of it',
    link: '././assets/pdfs/blogs/PontryaginDuality.pdf'
  },
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
