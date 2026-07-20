import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { BookIndexService } from '../../services/book-index.service';

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

  // Deep-link target from the URL: a stable result label (?loc=df:topSp) and/or
  // an explicit page (?page=8). `loc` wins — it's resolved against the shipped
  // index to the page in the *current* build, so shared links survive edits.
  private pendingLoc: string = '';
  private pendingPage: number | null = null;

  // Render mode. `showAll` = continuous scroll (renders every page) is great for
  // normal books but murders huge ones (the Algebra monolith is 1676 pages), so
  // books over LARGE_PDF pages render one page at a time with pagination. The
  // mode is chosen from the shipped page count *before* the PDF renders; a manual
  // toggle lets the reader override.
  showAll: boolean = true;
  page: number = 1;
  totalPages: number = 0;
  userChoseMode: boolean = false;
  private readonly LARGE_PDF = 500;

  // Whether the top bar is shown. Starts hidden on mobile (≤768px, matching the
  // stylesheet breakpoint) to keep the reader full-screen; open on wider
  // screens. Toggled by the × and the floating reopen button — no refresh.
  headerVisible: boolean = window.innerWidth > 768;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private bookIndex: BookIndexService
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
      return;
    }

    // In single-page mode, ←/→ (and PageUp/PageDown) flip pages — unless the
    // user is typing in a field (e.g. the page-number input).
    if (!this.showAll && !event.metaKey && !event.ctrlKey && !event.altKey) {
      const el = event.target as HTMLElement | null;
      if (el?.tagName === 'INPUT' || el?.tagName === 'TEXTAREA') return;
      if (event.key === 'ArrowRight' || event.key === 'PageDown') {
        event.preventDefault(); this.nextPage();
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault(); this.prevPage();
      }
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      const newSrc = params['src'] || '';
      const srcChanged = newSrc !== this.pdfSrc;
      this.bookName = params['name'] || 'PDF Document';
      this.pendingLoc = params['loc'] || '';
      this.pendingPage = params['page'] ? parseInt(params['page'], 10) : null;

      // Determine back button text based on the source or referrer
      const source = params['source'] || this.detectSourceFromUrl();
      if (source === 'notes') {
        this.backButtonText = 'Back to Notes';
        this.returnText = 'Return to Notes';
      } else {
        this.backButtonText = 'Back to Books';
        this.returnText = 'Return to Books';
      }

      if (!newSrc) {
        this.pdfSrc = '';
        this.error = 'No PDF source provided';
        this.isLoading = false;
      } else if (srcChanged) {
        // New book: pick the render mode from its page count *before* binding
        // src, so a huge book never tries to render every page at once.
        this.page = 1;
        this.totalPages = 0;
        this.userChoseMode = false;
        this.isLoading = true;
        await this.bookIndex.load();
        const count = this.bookIndex.pageCount(newSrc.split('/').pop() || '');
        this.showAll = count <= this.LARGE_PDF;   // continuous unless very large
        this.pdfSrc = newSrc;                     // bind src → render in that mode
      } else if (this.pdfDocument) {
        // Same PDF already loaded (e.g. jumping to another result in the same
        // book from the palette): ng2-pdf-viewer won't reload, so navigate now.
        this.scrollToDeepLink();
      }
    });
  }

  // Resolve the URL's deep-link target to a physical page and scroll there. A
  // `loc` (stable label) is looked up in the shipped index to get the book's
  // *printed* page number, which is then mapped to the physical PDF page via the
  // document's own page labels — correct whether or not the book resets page
  // numbering. Falls back to an explicit ?page.
  private async scrollToDeepLink(): Promise<void> {
    let page = this.pendingPage;
    if (this.pendingLoc && this.pdfDocument) {
      const base = this.pdfSrc.split('/').pop() || '';
      await this.bookIndex.load();
      const entry = this.bookIndex.lookup(base, this.pendingLoc);
      if (entry && entry.page != null) {
        page = await this.printedToPhysical(entry.page);
      }
    }
    if (!page) return;
    if (this.showAll) {
      // Continuous mode: pages render asynchronously — give them a beat, scroll.
      setTimeout(() => this.scrollToPage(page as number), 400);
    } else {
      // Single-page mode: navigate ng2-pdf-viewer straight to the page.
      this.page = page;
    }
  }

  // Map a printed page number to a 1-based physical page using the PDF's page
  // labels. Books with front matter print a number that differs from the
  // physical page; the last physical page carrying that label is the main-matter
  // one. If the PDF has no page labels, printed == physical.
  private async printedToPhysical(printed: number): Promise<number> {
    try {
      const labels: string[] | null = await this.pdfDocument.getPageLabels();
      if (labels) {
        const want = String(printed);
        const idx = labels.lastIndexOf(want);
        if (idx >= 0) return idx + 1;
      }
    } catch (error) {
      console.warn('Could not read page labels:', error);
    }
    return printed;
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
    this.totalPages = pdf.numPages || 0;
    console.log('PDF loaded successfully', pdf);

    // Fallback: if the shipped page count was missing (e.g. a stale cached index)
    // and this turns out to be a big book the reader hasn't set a mode for, drop
    // to single-page mode now that we know the real page count.
    if (!this.userChoseMode && this.showAll && this.totalPages > this.LARGE_PDF) {
      this.showAll = false;
      this.page = this.currentTopPage || 1;
    }

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

    // Honor a ?loc / ?page deep link once the document is ready.
    this.scrollToDeepLink();
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

  // ── Pagination (always visible, works in both modes) ───────────────────────
  // The page shown in the toolbar: the tracked top-of-viewport page in continuous
  // mode, or the rendered page in single-page mode.
  get currentPage(): number {
    return this.showAll ? this.currentTopPage : this.page;
  }

  goToPageNum(n: number): void {
    if (isNaN(n)) return;
    const clamped = Math.min(this.totalPages || n, Math.max(1, n));
    if (this.showAll) {
      this.currentTopPage = clamped;
      this.scrollToPage(clamped);
    } else {
      this.page = clamped;
    }
  }
  nextPage(): void { this.goToPageNum(this.currentPage + 1); }
  prevPage(): void { this.goToPageNum(this.currentPage - 1); }
  onPageInput(value: string): void { this.goToPageNum(parseInt(value, 10)); }

  // Flip between continuous scroll and one-page-at-a-time, keeping your place.
  toggleRenderMode(): void {
    this.userChoseMode = true;
    if (this.showAll) {
      this.page = this.currentTopPage || this.page || 1;
      this.showAll = false;
    } else {
      const target = this.page;
      this.showAll = true;
      setTimeout(() => this.scrollToPage(target), 400);
    }
  }

  // Outline methods
  toggleOutline(): void {
    this.showOutline = !this.showOutline;
  }

  hideHeader(): void {
    this.headerVisible = false;
  }

  showHeader(): void {
    this.headerVisible = true;
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
