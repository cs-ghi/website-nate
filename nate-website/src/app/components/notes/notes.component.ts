// import { NotExpr } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Note, Notes } from 'src/app/interfaces/notes.model';

// Exposition, translations and working notes. Original research moved to
// /papers, which carries what a paper needs and a note does not — abstract,
// authors, versions, arXiv identifier, citation block. Deep links to the two
// that moved are rewritten by LEGACY_PDF_REDIRECTS in pdf-viewer.component.ts.
export const notesArray: Note[]= [
  {
    name: "Galois Cohomology",
    desc: "These are my current work in progress notes on Galois Cohomology which aim to be inspired by Neukirch and Kumar Murty. They are rapidly changing are mostly here for my reference \"on the go\"",
    link: "././assets/pdfs/notes/EYNTKA_galois_cohomology.pdf"
  },
  {
    name: "Toric Varieties",
    desc: "a few properties of Toric varieties. Very rough work, I hope to fill these out more soon. Toric varietie sare great as a large example of very simple varieties/schemes that are dual to lattices.",
    link: "././assets/pdfs/notes/EYNTKA_toric_geometry.pdf"
  },
  {
    name: "Preliminary Chapter",
    desc: "An extract from EYNTKA algebra that is further developed to serve as a general set of notes for mathematical knowledge. Does not include information about calculus or linear algebra.",
    link: "././assets/pdfs/notes/preliminary_chapter.pdf"
  },
  {
    name: 'Translating Serre\'s Paper on Simple Algebras',
    desc: 'This is my translation and embellishment of Serre\'s "Applications algébriques de la cohomologie des groupes. II : théorie des algèbres simples". It is fascinating how number theory can be so beautifully generalised to representation theory. One can see why Langlands proposed his research program by going through these results!',
    link: '././assets/pdfs/blogs/serre_paper-Theory_of_Simple_Algebras.pdf'
  },
  {
    name: "A little  Hodge Theory",
    desc: "These are my current work in progress notes on Hodge Theory I'll update as I have time. They are rapidly changing are mostly here for my reference \"on the go\"",
    link: "././assets/pdfs/notes/EYNTKA_hodge.pdf"
  },
  {
    name: 'Pontryagin Duality',
    desc: 'The existence and applicability Fourier transform is a fascinating piece of mathematics. Pushing the limits of where it may be applied then becomes an interesting question, which lead me to explore Pontryagin duality. This paper is a quick summary that builds up Pontryagin duality and gives some applications of it',
    link: '././assets/pdfs/blogs/PontryaginDuality.pdf'
  },
];

@Component({
    selector: 'app-notes',
    templateUrl: './notes.component.html',
    styleUrls: ['./notes.component.scss'],
    standalone: false
})
export class NotesComponent implements OnInit {
  notes = notesArray;
  selectedNote: Note | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  viewPdf(note: Note) {
    this.router.navigate(['/pdf-viewer'], {
      queryParams: {
        src: note.link,
        name: note.name,
        source: 'notes'
      }
    });
  }
}
