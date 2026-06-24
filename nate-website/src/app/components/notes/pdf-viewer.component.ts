import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent implements OnInit, AfterViewInit {
  @ViewChild('pdfViewer', { static: false }) pdfViewer!: ElementRef;

  pdfSrc: string = '';
  noteName: string = '';
  isLoading: boolean = true;
  error: string = '';
  currentZoom: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    // Set default zoom based on screen size
    this.setInitialZoom();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.pdfSrc = params['src'] || '';
      this.noteName = params['name'] || 'PDF Document';

      if (!this.pdfSrc) {
        this.error = 'No PDF source provided';
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    // Focus the PDF container after view initialization
    this.focusPdfViewer();
  }

  onLoadComplete(pdf: any): void {
    this.isLoading = false;
    console.log('PDF loaded successfully', pdf);

    // Focus the PDF viewer after loading
    setTimeout(() => {
      this.focusPdfViewer();
    }, 100);
  }

  onError(error: any): void {
    this.isLoading = false;
    this.error = 'Failed to load PDF document';
    console.error('PDF loading error:', error);
  }

  private focusPdfViewer(): void {
    if (this.pdfViewer && this.pdfViewer.nativeElement) {
      this.pdfViewer.nativeElement.focus();
    }
  }

  goBack(): void {
    this.location.back();
  }

  zoomIn(): void {
    if (this.currentZoom < 3) {
      this.currentZoom += 0.25;
    }
  }

  zoomOut(): void {
    if (this.currentZoom > 0.25) {
      this.currentZoom -= 0.25;
    }
  }

 private setInitialZoom(): void {
   // Check if device is desktop (screen width >= 1024px)
   const isDesktop = window.innerWidth >= 1024;
   this.currentZoom = isDesktop ? 0.5 : 1;
 }
}
