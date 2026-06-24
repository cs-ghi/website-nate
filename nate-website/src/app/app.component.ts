// import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer'; // Import the module

// import { Observable } from 'rxjs';
//import { environment } from 'src/environments/environment';
// import { Contact } from './interfaces/contact.interface';
//import { AppStateService } from './services/app-state.service';
// import { OnInit } from '@angular/core';

// decorator
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {

  // contactData: Contact;
  // title = 'nate';
  // menuFlag$: Observable<boolean> = this.appStateService.menuObs();

  // constructor
  constructor(){}
  //   private appStateService: AppStateService,
  //   private http: HttpClient
  // ) {
  //   this.http
  //     .get(environment.serviceUrl, {
  //       params: new HttpParams()
  //         .set('email', environment.email)
  //         .set('controller', 'contact'),
  //     })
  //     .subscribe((contact: Contact) => {
  //       this.contactData = contact;
  //     });
  }


// @Component({
//   selector: 'redirectCV',
//   template: 'redirecting...'
// })
// export class RedirectComponent implements OnInit {
//   constructor() { }

//   ngOnInit() {
//     window.location.href = './assets/pdfs/grad_cv.pdf'
//   }
// }
