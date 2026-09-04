import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { PdfViewerComponent as Ng2PdfViewer } from 'ng2-pdf-viewer';
import { BookIndexService } from '../../services/book-index.service';
import { PdfOutlineComponent } from '../shared/pdf-outline.component';
import { LEGACY_PDF_REDIRECTS } from '../papers/papers';

// Below this width the outline overlays the page instead of pushing it aside.
// Single source of truth — the outline component keys off the `drawer` input
// this drives, not a parallel media query that can drift out of step.
const OUTLINE_DRAWER_MAX_WIDTH = 1100;

// Keep in step with the panel's width/transform transition in the stylesheet;
// the PDF is re-scaled once the panel has finished taking its width.
const OUTLINE_TRANSITION_MS = 220;

// Whether the panel is open persists across books and reloads; which nodes are
// expanded deliberately does not, since the tree re-expands around wherever the
// reader currently is, which is more useful than restoring a stale shape.
const OUTLINE_OPEN_KEY = 'reader.outline.open';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('pdfViewer', { static: false }) pdfViewer!: ElementRef;
  @ViewChild(Ng2PdfViewer) private ng2Viewer?: Ng2PdfViewer;
  @ViewChild(PdfOutlineComponent) private outline?: PdfOutlineComponent;

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

  // Outline. The panel itself is <app-pdf-outline>; the viewer owns only whether
  // it is open, and hands it the document plus the reader's current page.
  showOutline: boolean = localStorage.getItem(OUTLINE_OPEN_KEY) === '1';
  hasOutline: boolean = false;
  /** The loaded PDFDocumentProxy; bound into the outline. */
  pdfDocument: any = null;
  /** The PDF's own page labels, when it has any: physical index -> printed number. */
  private pageLabels: string[] | null = null;

  // Drives the push-vs-drawer layout. Kept as a field rather than read from
  // `window` in a getter, which the template would re-run every change detection.
  viewportWidth: number = window.innerWidth;

  // Deep-link target from the URL: a stable result label (?loc=df:topSp) and/or
  // an explicit page (?page=8). `loc` wins — it's resolved against the shipped
  // index to the page in the *current* build, so shared links survive edits.
  private pendingLoc: string = '';
  private pendingPage: number | null = null;

  // Render mode. `showAll` = continuous scroll (renders every page). Every book
  // opens in it, whatever its length (author's call, 2026-09-01): a size
  // threshold used to force the longest books into one-page-at-a-time, which
  // meant the books most worth scrolling through were the ones that wouldn't.
  // The toolbar toggle still switches to paginated for a reader who wants it.
  showAll: boolean = true;
  page: number = 1;
  totalPages: number = 0;

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
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    // Never steal a keystroke the reader meant for a text field.
    const el = event.target as HTMLElement | null;
    if (el?.tagName === 'INPUT' || el?.tagName === 'TEXTAREA') return;

    // `t` toggles the contents. Deliberately not Ctrl/Cmd+Shift+T: that is
    // "reopen last closed tab" in Chrome, Firefox and Safari and is not
    // suppressible by preventDefault, so the old binding fired the browser's
    // action too.
    if (event.key === 't' || event.key === 'T') {
      if (this.hasOutline) {
        event.preventDefault();
        this.toggleOutline();
      }
      return;
    }

    // `/` opens the contents and puts the caret in its filter.
    if (event.key === '/') {
      if (this.hasOutline) {
        event.preventDefault();
        if (!this.showOutline) this.openOutline();
        this.outline?.focusFilter();
      }
      return;
    }

    if (event.key === 'Escape' && this.showOutline) {
      event.preventDefault();
      this.closeOutline();
      return;
    }

    // In single-page mode, ←/→ (and PageUp/PageDown) flip pages.
    if (!this.showAll) {
      if (event.key === 'ArrowRight' || event.key === 'PageDown') {
        event.preventDefault(); this.nextPage();
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault(); this.prevPage();
      }
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      // The two research documents moved from assets/pdfs/notes to
      // assets/pdfs/papers. Their old URLs are indexable query-string deep
      // links, and one is pasted into the /books overview copy, so rewrite
      // rather than 404.
      const requested = params['src'] || '';
      const moved = LEGACY_PDF_REDIRECTS[requested.split('/').pop() ?? ''];
      const newSrc = moved ?? requested;
      const srcChanged = newSrc !== this.pdfSrc;
      this.bookName = params['name'] || 'PDF Document';
      this.pendingLoc = params['loc'] || '';
      this.pendingPage = params['page'] ? parseInt(params['page'], 10) : null;

      // Determine back button text based on the source or referrer
      const source = params['source'] || this.detectSourceFromUrl();
      if (source === 'notes') {
        this.backButtonText = 'Back to Notes';
        this.returnText = 'Return to Notes';
      } else if (source === 'blog') {
        this.backButtonText = 'Back to Blog';
        this.returnText = 'Return to Blog';
      } else if (source === 'papers') {
        this.backButtonText = 'Back to Papers';
        this.returnText = 'Return to Papers';
      } else {
        this.backButtonText = 'Back to Books';
        this.returnText = 'Return to Books';
      }

      if (!newSrc) {
        this.pdfSrc = '';
        this.error = 'No PDF source provided';
        this.isLoading = false;
      } else if (srcChanged) {
        // New book: always continuous, so there is nothing to decide before the
        // src binds and no need to wait on the index to decide it.
        this.page = 1;
        this.totalPages = 0;
        this.isLoading = true;
        this.showAll = true;
        // Clearing the document resets <app-pdf-outline>; onLoadComplete rebinds it.
        this.pdfDocument = null;
        this.pageLabels = null;
        this.hasOutline = false;
        this.currentTopPage = 1;
        this.pdfSrc = newSrc;
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
        page = this.printedToPhysical(entry.page);
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
  private printedToPhysical(printed: number): number {
    if (this.pageLabels) {
      const idx = this.pageLabels.lastIndexOf(String(printed));
      if (idx >= 0) return idx + 1;
    }
    return printed;
  }

  // What the current page is printed as, shown beside the navigator when it
  // differs from the physical index — which it does in 16 of the 44 books,
  // wherever front matter shifts the numbering. The navigator itself still
  // counts physical pages: a printed number is ambiguous as *input* (front
  // matter and main matter both run 1..k), but unambiguous as a readout.
  get printedPage(): string | null {
    const label = this.pageLabels?.[this.currentPage - 1];
    return label && label !== String(this.currentPage) ? label : null;
  }

  // Rotating the phone (or resizing) makes ng2-pdf-viewer re-render every page
  // at a new width, so the old pixel scroll offset lands on a different page.
  // Re-anchor to the page that was at the top before the reflow.
  @HostListener('window:resize')
  @HostListener('window:orientationchange')
  onViewportChange(): void {
    this.viewportWidth = window.innerWidth;
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
      // Bound to the outline's `currentPage`, which highlights the section the
      // reader is in.
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

    setTimeout(() => {
      this.focusPdfViewer();
    }, 100);

    try {
      this.pageLabels = await pdf.getPageLabels();
    } catch (error) {
      this.pageLabels = null;
      console.warn('Could not read page labels:', error);
    }

    // Binding pdfDocument hands the document to <app-pdf-outline>, which builds
    // its own tree and reports back through (availableChange).

    // Honor a ?loc / ?page deep link once the document is ready.
    this.scrollToDeepLink();
  }

  // The outline finished building (or the document has none). If the panel was
  // restored open from a previous session it is about to take its width from
  // the page, so re-scale exactly as toggling it would. A deep link scrolls
  // later than this, so it still wins.
  onOutlineAvailable(available: boolean): void {
    this.hasOutline = available;
    if (available && this.showOutline) this.reflowAfterPanelChange();
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
    if (referrer.includes('/papers')) {
      return 'papers';
    }
    if (referrer.includes('/notes')) {
      return 'notes';
    }
    if (referrer.includes('/blog')) {
      return 'blog';
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
    if (this.showAll) {
      this.page = this.currentTopPage || this.page || 1;
      this.showAll = false;
    } else {
      const target = this.page;
      this.showAll = true;
      setTimeout(() => this.scrollToPage(target), 400);
    }
  }

  // ── Outline ────────────────────────────────────────────────────────────────

  // Under this width the panel overlays the page instead of pushing it aside;
  // pushing would leave too little room for the page itself.
  get isDrawer(): boolean {
    return this.viewportWidth <= OUTLINE_DRAWER_MAX_WIDTH;
  }

  toggleOutline(): void {
    this.showOutline ? this.closeOutline() : this.openOutline();
  }

  openOutline(): void {
    this.showOutline = true;
    localStorage.setItem(OUTLINE_OPEN_KEY, '1');
    this.reflowAfterPanelChange();
  }

  closeOutline(): void {
    this.showOutline = false;
    localStorage.setItem(OUTLINE_OPEN_KEY, '0');
    this.reflowAfterPanelChange();
  }

  // The outline emits a physical page; navigating is the viewer's job. Via
  // goToPageNum so it works in single-page mode too — scrollToPage alone only
  // works in continuous mode, where the target page is actually in the DOM.
  onOutlineNavigate(page: number): void {
    this.goToPageNum(page);
  }

  // In push mode the panel takes 320px from the page, but ng2-pdf-viewer only
  // re-scales on a *window* resize (it subscribes to fromEvent(window,
  // 'resize')), so a container-width change alone leaves the canvas at its old
  // width and the page clipped behind an overflow-x scrollbar. Re-scale by hand
  // once the transition has settled — and put the reader back where they were,
  // since updateSize() calls _setScale(…, noScroll) and does not preserve the
  // scroll position itself.
  private reflowAfterPanelChange(): void {
    if (this.isDrawer || !this.pdfDocument) return;
    const anchor = this.currentTopPage;
    setTimeout(() => {
      this.ng2Viewer?.updateSize();
      this.scrollToPage(anchor);
    }, OUTLINE_TRANSITION_MS + 20);
  }

  hideHeader(): void {
    this.headerVisible = false;
  }

  showHeader(): void {
    this.headerVisible = true;
  }

  private scrollToPage(pageNumber: number): void {
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
