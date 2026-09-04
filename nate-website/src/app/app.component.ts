// import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

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
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})

export class AppComponent {

  // Full-screen reading routes hide the global header/footer chrome.
  isReaderRoute = false;

  // contactData: Contact;
  // title = 'nate';
  // menuFlag$: Observable<boolean> = this.appStateService.menuObs();

  // constructor
  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.isReaderRoute = event.urlAfterRedirects.split('?')[0] === '/pdf-viewer';
      });
  }
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
