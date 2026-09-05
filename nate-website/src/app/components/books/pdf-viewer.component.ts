import { Component, OnInit, OnDestroy, ViewChild, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { BookIndexService } from '../../services/book-index.service';
import { PdfDocumentComponent } from '../shared/pdf-document.component';
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

// This reader opens this site's own documents and nothing else. `src` comes
// straight off the query string, so without this check an emailed link like
// ?src=https://evil.com/x.pdf renders a stranger's PDF on this origin — and any
// pdf.js carrying CVE-2024-4367 turns a crafted font in that PDF into script
// execution here. Rejects absolute and protocol-relative URLs and traversal;
// leading "./" is normalised because LEGACY_PDF_REDIRECTS spells its targets
// "././assets/pdfs/...".
export function isOwnDocument(src: string): boolean {
  if (!src) return false;
  if (/^[a-z][a-z0-9+.-]*:/i.test(src) || src.startsWith('//')) return false;
  const path = src.replace(/^(?:\.?\/)+/, '');
  return !path.includes('..') && path.startsWith('assets/pdfs/');
}

@Component({
    selector: 'app-pdf-viewer',
    templateUrl: './pdf-viewer.component.html',
    styleUrls: ['./pdf-viewer.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PdfViewerComponent implements OnInit, OnDestroy {
  @ViewChild(PdfDocumentComponent) private doc?: PdfDocumentComponent;
  @ViewChild(PdfOutlineComponent) private outline?: PdfOutlineComponent;

  // The page pdf.js reports as in view; drives the toolbar and the outline's
  // active-section highlight.
  private currentTopPage: number = 1;
  private resizeTimer: any = null;

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
      } else if (!isOwnDocument(newSrc)) {
        this.pdfSrc = '';
        this.error = 'That link does not point to a document on this site.';
        this.isLoading = false;
      } else if (srcChanged) {
        // New book: always continuous, so there is nothing to decide before the
        // src binds and no need to wait on the index to decide it.
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
    this.goToPageNum(page);
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

  // Re-fit after the available width changes. pdf.js re-scales *and* keeps the
  // reader's place: assigning `currentScale` routes through _setScale with
  // noScroll = false, which restores its saved location. Zoom needs nothing at
  // all here — the [zoom] binding goes straight to the same setter.
  @HostListener('window:resize')
  @HostListener('window:orientationchange')
  onViewportChange(): void {
    this.viewportWidth = window.innerWidth;
    if (this.resizeTimer) clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.resizeTimer = null;
      this.doc?.refit();
    }, 150);
  }

  ngOnDestroy(): void {
    if (this.resizeTimer) clearTimeout(this.resizeTimer);
  }

  // pdf.js tells us which page is in view (via ng2's pageChange output, fed by
  // the viewer's own `pagechanging` event). This used to be re-derived by
  // querying .page elements and comparing bounding boxes on every scroll frame.
  onPageChange(page: number): void {
    this.currentTopPage = page;
  }

  async onLoadComplete(pdf: any): Promise<void> {
    this.isLoading = false;
    this.pdfDocument = pdf;
    this.totalPages = pdf.numPages || 0;

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

  zoomIn(): void { this.applyZoom(this.currentZoom + 0.25); }
  zoomOut(): void { this.applyZoom(this.currentZoom - 0.25); }

  // No save/restore dance: the [zoom] binding reaches pdf.js's own `currentScale`
  // setter, which re-scales and puts the reader back where they were.
  private applyZoom(next: number): void {
    this.currentZoom = Math.min(3, Math.max(0.25, next));
  }

  private setInitialZoom(): void {
    const isDesktop = window.innerWidth >= 1024;
    this.currentZoom = isDesktop ? 0.5 : 1;
  }

  // ── Pagination (always visible, works in both modes) ───────────────────────
  // The page shown in the toolbar: the tracked top-of-viewport page in continuous
  // mode, or the rendered page in single-page mode.
  // pdf.js reports the current page in both render modes, so there is one
  // source of truth rather than a mode-dependent pair.
  get currentPage(): number {
    return this.currentTopPage;
  }

  goToPageNum(n: number): void {
    if (isNaN(n)) return;
    this.doc?.goToPage(n);
  }
  nextPage(): void { this.goToPageNum(this.currentPage + 1); }
  prevPage(): void { this.goToPageNum(this.currentPage - 1); }
  onPageInput(value: string): void { this.goToPageNum(parseInt(value, 10)); }

  // Flip between continuous scroll and one-page-at-a-time. The document
  // component swaps PDFViewer for PDFSinglePageViewer and restores the page.
  toggleRenderMode(): void {
    this.showAll = !this.showAll;
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

  // The outline emits its own destination where it has one, so pdf.js can land
  // on the section itself rather than the top of the page containing it.
  onOutlineNavigate(target: { page: number; dest: any }): void {
    if (target.dest != null) this.doc?.goToDestination(target.dest);
    else this.goToPageNum(target.page);
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
    setTimeout(() => this.doc?.refit(), OUTLINE_TRANSITION_MS + 20);
  }

  hideHeader(): void {
    this.headerVisible = false;
  }

  showHeader(): void {
    this.headerVisible = true;
  }


}
