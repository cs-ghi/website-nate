import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
var d = new Date();  

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})

export class FooterComponent implements OnInit {

  // var d = new Date(); 
  // page.currentYear = d.getFullYear(); 
  currentYear = d.getFullYear();
  
  constructor() { }

  ngOnInit() {
  }

}
