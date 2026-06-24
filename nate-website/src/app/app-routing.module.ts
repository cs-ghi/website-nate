import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AboutComponent } from './components/about/about.component';
import { BlogComponent } from './components/blog/blog.component';
import { ContactComponent } from './components/contact/contact.component';
import { BooksComponent } from './components/books/books.component';
import { NotesComponent } from './components/notes/notes.component';
import { PdfViewerComponent } from './components/books/pdf-viewer.component';
import { HtmlBookViewerComponent } from './components/books/html-book-viewer.component';
import { MiscellaneousComponent } from './components/miscellaneous/miscellaneous.component';
import { ProgrammingComponent } from './components/programming/programming.component';
import { TutoringComponent } from './components/tutoring/tutoring.component';
import { DictionaryComponent } from './components/dictionary/dictionary.component';
import { JudoComponent } from './components/judo/judo.component';

const routes: Routes = [
  {path: '', component: BooksComponent} ,
  {path: 'about', component : AboutComponent},
  {path: 'tutoring', component : TutoringComponent},
  {path: 'books', component: BooksComponent},
  {path: 'notes', component: NotesComponent},
  {path: 'pdf-viewer', component: PdfViewerComponent },
  {path: 'html-viewer', component: HtmlBookViewerComponent },
  {path: 'blog', component: BlogComponent},
  {path: 'contact', component : ContactComponent},
  {path: 'miscellaneous', component: MiscellaneousComponent},
  {path: 'programming', component: ProgrammingComponent},
  {path: 'dictionary', component: DictionaryComponent},
  {path: 'judo', component: JudoComponent},
  {path: "**", component : NotFoundComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
