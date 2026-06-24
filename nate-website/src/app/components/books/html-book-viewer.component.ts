import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-html-book-viewer',
  templateUrl: './html-book-viewer.component.html',
  styleUrls: ['./html-book-viewer.component.scss']
})
export class HtmlBookViewerComponent implements OnInit {
  bookSrc: SafeResourceUrl | null = null;
  bookName: string = '';
  isLoading: boolean = true;
  hasError: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const src = params['src'] || '';
      this.bookName = params['name'] || 'Book';
      if (src) {
        this.bookSrc = this.sanitizer.bypassSecurityTrustResourceUrl(src);
      } else {
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  onLoad(): void {
    this.isLoading = false;
  }

  onError(): void {
    this.isLoading = false;
    this.hasError = true;
  }

  goBack(): void {
    this.location.back();
  }
}
