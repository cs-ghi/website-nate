import { Component, OnInit} from '@angular/core';

// navbar menu, add here for more menu items
export const menuItems = [
  { name: 'books', url: '/books'},
  { name: 'series map', url: '/series-map'},
  { name: 'notes', url: '/notes'},
  { name: 'blog', url: '/blog'},
  { name: 'programming', url: '/programming'},
  { name: 'dictionary', url: '/dictionary'},
  { name: 'judo', url: '/judo'},
  // { name: 'Beatsaber', url: 'https://beatleader.com/u/304451'},
  { name: 'contact', url: '/contact'},
  { name: 'about', url: '/about'},
  { name: 'cv', url: '/cv', link:'./assets/pdfs/nathanaelChwS_cv.pdf'},
];

// decorators

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

// define class <3
export class HeaderComponent implements OnInit {
  isMenuOpened: boolean = false;

  toggleMenu(): void {
    this.isMenuOpened = !this.isMenuOpened;
  }

  clickedOutside(): void {
    this.isMenuOpened = false;
  }


  menu = menuItems
  constructor() {}

  ngOnInit() {
  }

  // toggle() {
  //   // this.appStateService.toggle();
  // }
  // open() {
  //   // this.appStateService.open();
  // }
  // close() {
  //   // this.appStateService.close();
  // }
}
