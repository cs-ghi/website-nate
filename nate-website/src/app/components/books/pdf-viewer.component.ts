import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('pdfViewer', { static: false }) pdfViewer!: ElementRef;

  // Rotation handling: track the page at the top of the viewport so we can
  // restore it after ng2-pdf-viewer re-renders at the new width.
  private currentTopPage: number = 1;
  private scrollRaf: number | null = null;
  private resizeTimer: any = null;
  private resizeAnchorPage: number | null = null;

  pdfSrc: string = '';
  bookName: string = '';
  isLoading: boolean = true;
  error: string = '';
  currentZoom: number = 1;
  backButtonText: string = 'Back to Books';
  returnText: string = 'Return to Books';

  // Outline properties
  showOutline: boolean = false;
  hasOutline: boolean = false;
  pdfOutline: any[] = [];
  private pdfDocument: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.setInitialZoom();
  }

  // Keyboard shortcut listener
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    // Check for Ctrl+Shift+T (or Cmd+Shift+T on Mac)
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 't') {
      // Only trigger if we have an outline and the component is active
      if (this.hasOutline) {
        event.preventDefault(); // Prevent browser default behavior
        this.toggleOutline();
        console.log('Table of contents toggled via keyboard shortcut');
      }
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.pdfSrc = params['src'] || '';
      this.bookName = params['name'] || 'PDF Document';
      
      // Determine back button text based on the source or referrer
      const source = params['source'] || this.detectSourceFromUrl();
      if (source === 'notes') {
        this.backButtonText = 'Back to Notes';
        this.returnText = 'Return to Notes';
      } else {
        this.backButtonText = 'Back to Books';
        this.returnText = 'Return to Books';
      }

      if (!this.pdfSrc) {
        this.error = 'No PDF source provided';
        this.isLoading = false;
      }
    });
  }

  // Rotating the phone (or resizing) makes ng2-pdf-viewer re-render every page
  // at a new width, so the old pixel scroll offset lands on a different page.
  // Re-anchor to the page that was at the top before the reflow.
  @HostListener('window:resize')
  @HostListener('window:orientationchange')
  onViewportChange(): void {
    if (this.resizeAnchorPage === null) {
      this.resizeAnchorPage = this.currentTopPage;
    }
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
    this.resizeTimer = setTimeout(() => {
      const page = this.resizeAnchorPage ?? this.currentTopPage;
      this.resizeAnchorPage = null;
      this.resizeTimer = null;
      this.scrollToPage(page);
    }, 300);
  }

  ngAfterViewInit(): void {
    this.focusPdfViewer();
    // Scroll events from the PDF's inner container don't bubble to window, so
    // listen in the capture phase to catch whichever element actually scrolls.
    document.addEventListener('scroll', this.onScrollCapture, true);
  }

  ngOnDestroy(): void {
    document.removeEventListener('scroll', this.onScrollCapture, true);
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
    if (this.scrollRaf !== null) {
      cancelAnimationFrame(this.scrollRaf);
    }
  }

  private onScrollCapture = (): void => {
    if (this.scrollRaf !== null) {
      return;
    }
    this.scrollRaf = requestAnimationFrame(() => {
      this.scrollRaf = null;
      this.currentTopPage = this.detectTopPage();
    });
  };

  private detectTopPage(): number {
    const pages = document.querySelectorAll('.ng2-pdf-viewer-container .page');
    if (pages.length === 0) {
      return this.currentTopPage;
    }
    const container = document.querySelector('.ng2-pdf-viewer-container');
    const refTop = container ? container.getBoundingClientRect().top : 0;
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].getBoundingClientRect().bottom > refTop + 2) {
        return i + 1;
      }
    }
    return pages.length;
  }

  async onLoadComplete(pdf: any): Promise<void> {
    this.isLoading = false;
    this.pdfDocument = pdf;
    console.log('PDF loaded successfully', pdf);

    setTimeout(() => {
      this.focusPdfViewer();
    }, 100);

    try {
      const outline = await pdf.getOutline();
      if (outline && outline.length > 0) {
        this.hasOutline = true;
        this.pdfOutline = await this.flattenOutline(outline);

        console.log('PDF outline extracted:', this.pdfOutline);
        console.log('Use Ctrl+Shift+T to toggle table of contents');
      }
    } catch (error) {
      console.log('No outline available or error extracting outline:', error);
    }
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

  private detectSourceFromUrl(): string {
    // Check if we can detect the source from the current URL or referrer
    const referrer = document.referrer;
    if (referrer.includes('/notes')) {
      return 'notes';
    }
    return 'books';
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
    const isDesktop = window.innerWidth >= 1024;
    this.currentZoom = isDesktop ? 0.5 : 1;
  }

  // Outline methods
  toggleOutline(): void {
    this.showOutline = !this.showOutline;
  }

  private async flattenOutline(outline: any[], level: number = 0): Promise<any[]> {
    const result: any[] = [];

    for (const item of outline) {
      let pageNumber: number | null = null;

      if (item.dest) {
        try {
          if (Array.isArray(item.dest) && item.dest.length > 0) {
            if (item.dest[0] && typeof item.dest[0] === 'object' && item.dest[0].num !== undefined) {
              const pageRef = await this.pdfDocument.getPageIndex(item.dest[0]);
              pageNumber = pageRef + 1;
            }
          } else if (typeof item.dest === 'string') {
            const namedDest = await this.pdfDocument.getDestination(item.dest);
            if (namedDest && namedDest.length > 0) {
              const pageRef = await this.pdfDocument.getPageIndex(namedDest[0]);
              pageNumber = pageRef + 1;
            }
          }
        } catch (error) {
          console.warn('Could not resolve page for outline item:', item.title, error);
        }
      }

      result.push({
        title: item.title,
        dest: item.dest,
        pageNumber: pageNumber,
        level: level
      });

      if (item.items && item.items.length > 0) {
        const childItems = await this.flattenOutline(item.items, level + 1);
        result.push(...childItems);
      }
    }

    return result;
  }

  async goToPage(destination: any, preResolvedPageNumber?: number): Promise<void> {
    console.log('goToPage called with:', { destination, preResolvedPageNumber });

    if (preResolvedPageNumber) {
      this.scrollToPage(preResolvedPageNumber);

      if (window.innerWidth <= 768) {
        this.showOutline = false;
      }
      return;
    }

    if (!this.pdfDocument || !destination) return;

    try {
      let pageNumber: number | null = null;

      if (Array.isArray(destination) && destination.length > 0) {
        if (destination[0] && typeof destination[0] === 'object' && destination[0].num !== undefined) {
          try {
            const pageRef = await this.pdfDocument.getPageIndex(destination[0]);
            pageNumber = pageRef + 1;
          } catch (error) {
            console.warn('Failed to get page index from destination:', error);
          }
        } else if (typeof destination[0] === 'number') {
          pageNumber = destination[0];
        }
      } else if (typeof destination === 'string') {
        try {
          const namedDest = await this.pdfDocument.getDestination(destination);
          if (namedDest && namedDest.length > 0) {
            const pageRef = await this.pdfDocument.getPageIndex(namedDest[0]);
            pageNumber = pageRef + 1;
          }
        } catch (error) {
          console.warn('Failed to resolve named destination:', error);
        }
      } else if (typeof destination === 'number') {
        pageNumber = destination;
      }

      if (pageNumber) {
        this.scrollToPage(pageNumber);
      } else {
        console.warn('Could not resolve destination to page number');
      }

      if (window.innerWidth <= 768) {
        this.showOutline = false;
      }

    } catch (error) {
      console.error('Error in goToPage:', error);
    }
  }

  private scrollToPage(pageNumber: number): void {
    console.log('Attempting to scroll to page:', pageNumber);

    setTimeout(() => {
      let targetElement = document.querySelector(`[data-page-number="${pageNumber}"]`);

      if (!targetElement) {
        targetElement = document.querySelector(`.ng2-pdf-viewer-container .page:nth-child(${pageNumber})`);
      }

      if (!targetElement) {
        const allPages = document.querySelectorAll('.page');
        if (allPages.length >= pageNumber) {
          targetElement = allPages[pageNumber - 1];
        }
      }

      if (!targetElement) {
        const allCanvases = document.querySelectorAll('canvas');
        if (allCanvases.length >= pageNumber) {
          targetElement = allCanvases[pageNumber - 1].closest('.page') || allCanvases[pageNumber - 1];
        }
      }

      if (targetElement) {
        console.log('Found target element:', targetElement);
        targetElement.scrollIntoView({
          block: 'start',
          inline: 'nearest'
        });
      } else {
        console.warn('Could not find page element, trying calculation method');
        this.scrollToPageByCalculation(pageNumber);
      }
    }, 200);
  }

  private scrollToPageByCalculation(pageNumber: number): void {
    const pdfContainer = document.querySelector('.ng2-pdf-viewer-container') ||
                        document.querySelector('pdf-viewer') ||
                        document.querySelector('.pdf-display');

    if (!pdfContainer) {
      console.warn('PDF container not found');
      return;
    }

    const containerHeight = pdfContainer.clientHeight;
    const scrollHeight = pdfContainer.scrollHeight;
    const totalPages = this.pdfDocument.numPages;
    const estimatedPageHeight = scrollHeight / totalPages;
    const scrollTop = (pageNumber - 1) * estimatedPageHeight;

    if (pdfContainer.scrollTo) {
      pdfContainer.scrollTo({
        top: scrollTop
      });
    } else {
      pdfContainer.scrollTop = scrollTop;
    }
  }
}
