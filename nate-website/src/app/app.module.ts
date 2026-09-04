import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AboutComponent } from './components/about/about.component';
import { BlogComponent } from './components/blog/blog.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
 import { CommonModule } from '@angular/common';
import { ContactComponent } from './components/contact/contact.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule} from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatOptionModule } from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';



import { BooksComponent } from './components/books/books.component';
import { NotesComponent } from './components/notes/notes.component';
import { PdfViewerComponent } from './components/books/pdf-viewer.component';
import { PdfOutlineComponent } from './components/shared/pdf-outline.component';
import { HtmlBookViewerComponent } from './components/books/html-book-viewer.component';
import { MiscellaneousComponent} from './components/miscellaneous/miscellaneous.component';
import { ProgrammingComponent } from './components/programming/programming.component';
import { ProgrammingDetailComponent } from './components/programming/programming-detail.component';
import { PapersComponent } from './components/papers/papers.component';
import { PaperDetailComponent } from './components/papers/paper-detail.component';
import { MathTextComponent } from './components/papers/math-text.component';
import { TutoringComponent } from './components/tutoring/tutoring.component';
import { ContactFormComponent } from './components/contact/contact-form/contact-form.component';
import { ClickOutsideDirective } from './clickOutside';
import { DictionaryComponent } from './components/dictionary/dictionary.component';
import { DictionaryService } from './services/dictionary.service';
import { JudoComponent } from './components/judo/judo.component';
import { SeriesMapComponent } from './components/series-map/series-map.component';
import { CommandPaletteComponent } from './components/command-palette/command-palette.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { AudioService } from './services/audio.service';
// import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AboutComponent,
    BlogComponent,
    BooksComponent,
    NotesComponent,
    PdfViewerComponent,
    PdfOutlineComponent,
    HtmlBookViewerComponent,
    // ResumeComponent,
    ContactComponent,
    NotFoundComponent,
    // LoadingComponent,
    // ShimmerComponent,
    MiscellaneousComponent,
    ProgrammingComponent,
    ProgrammingDetailComponent,
    PapersComponent,
    PaperDetailComponent,
    MathTextComponent,
    TutoringComponent,
    ContactFormComponent,
    AppComponent,
    ClickOutsideDirective,
    DictionaryComponent,
    JudoComponent,
    SeriesMapComponent,
    CommandPaletteComponent,
    SafeUrlPipe,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PdfViewerModule,
    CommonModule,
    HttpClientModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatOptionModule,
    MatIconModule,
    // FontAwesomeModule,
  ],
  providers: [
    DictionaryService,
    AudioService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
 }
