import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AboutComponent } from './components/about/about.component';
import { BlogComponent } from './components/blog/blog.component';
import { ContactComponent } from './components/contact/contact.component';
import { NotesComponent } from './components/notes/notes.component';
import { MiscellaneousComponent } from './components/miscellaneous/miscellaneous.component';

const routes: Routes = [
  {path: '', component: NotesComponent} ,
  {path: 'about', component : AboutComponent},
  {path: 'notes', component: NotesComponent},
  {path: 'blog', component: BlogComponent},
  {path: 'contact', component : ContactComponent},
  {path: 'miscellaneous', component: MiscellaneousComponent},
  {path: "**", component : NotFoundComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
