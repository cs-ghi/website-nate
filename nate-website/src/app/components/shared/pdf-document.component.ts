import {
  AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnChanges,
  OnDestroy, Output, SimpleChanges, ViewChild, ViewEncapsulation,
} from '@angular/core';
import * as pdfjs from 'pdfjs-dist';
import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer';

// Self-hosted, so the reader does not depend on a third-party CDN at runtime.
// Both are copied out of pdfjs-dist by the `assets` globs in angular.json, and
// must stay on the same version as the `pdfjs-dist` dependency.
pdfjs.GlobalWorkerOptions.workerSrc = 'assets/pdfjs/pdf.worker.min.js';
const CMAP_URL = 'assets/pdfjs/cmaps/';

// pdf.js's own page-width calculation, which it does not expose: see
// `_setScale` in pdfjs-dist/legacy/web/pdf_viewer.js. `removePageBorders` zeroes
// the padding it would otherwise subtract.
const H_PADDING = 0;

// Drives a real pdf.js PDFViewer. The point of holding the viewer directly
// rather than through a wrapper is that pdf.js already solves the things a
// wrapper tends to re-implement badly: re-scaling without losing the reader's
// place, reporting the current page, and resolving outline/link destinations to
// an exact position rather than to the top of a page.
@Component({
  selector: 'app-pdf-document',
  template: `
    <div class="pdf-document" #container>
      <div class="pdfViewer"></div>
    </div>
  `,
  styleUrls: ['./pdf-document.component.scss'],
  // pdf.js creates the page elements itself, so they can't carry Angular's
  // per-component attribute.
  encapsulation: ViewEncapsulation.None,
})
export class PdfDocumentComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('container', { static: true }) private containerRef!: ElementRef<HTMLDivElement>;

  @Input() src: string = '';
  /** Fraction of the page-width fit, matching the toolbar's percentage. */
  @Input() zoom: number = 1;
  /** Continuous scroll (every page) vs one page at a time. */
  @Input() continuous: boolean = true;

  /** The loaded PDFDocumentProxy. */
  @Output() loaded = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() loadError = new EventEmitter<any>();

  viewer: any = null;
  linkService: any = null;
  private eventBus: any = null;
  private loadingTask: any = null;
  private pdf: any = null;
  private ready = false;

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.build();
    if (this.src) this.load();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.viewer) return;   // ngAfterViewInit will pick these up
    if (changes['src']) {
      this.load();
      return;
    }
    if (changes['continuous'] && !changes['continuous'].firstChange) {
      this.rebuildForMode();
      return;
    }
    if (changes['zoom'] && !changes['zoom'].firstChange) this.applyScale();
  }

  ngOnDestroy(): void {
    this.destroyViewer();
    this.loadingTask?.destroy();
    this.pdf?.destroy();
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  get currentPage(): number {
    return this.viewer?.currentPageNumber ?? 1;
  }

  get pagesCount(): number {
    return this.viewer?.pagesCount ?? 0;
  }

  /** Jump to the top of a physical page. */
  goToPage(page: number): void {
    if (!this.ready || !this.viewer) return;
    const clamped = Math.min(this.pagesCount || page, Math.max(1, page));
    this.viewer.currentPageNumber = clamped;
  }

  // Jump to an outline/link destination — a named string or an explicit array.
  // Unlike navigating by page number this lands on the destination's own
  // position, so a section starting halfway down a page is not scrolled off.
  goToDestination(dest: any): void {
    if (!this.ready || !this.linkService || dest == null) {
      return;
    }
    this.linkService.goToDestination(dest);
  }

  // Re-fit after something changed the available width (window resize, the
  // contents panel opening). pdf.js re-scales *and* restores the reading
  // position, because the public setter passes noScroll = false.
  refit(): void {
    this.applyScale();
  }

  // ── Setup ──────────────────────────────────────────────────────────────────

  private build(): void {
    this.eventBus = new pdfjsViewer.EventBus();
    this.linkService = new pdfjsViewer.PDFLinkService({
      eventBus: this.eventBus,
      externalLinkTarget: pdfjsViewer.LinkTarget.BLANK,
    });

    const options: any = {
      container: this.containerRef.nativeElement,
      eventBus: this.eventBus,
      linkService: this.linkService,
      textLayerMode: 1,           // selectable text
      removePageBorders: true,
      l10n: pdfjsViewer.NullL10n,
      renderer: 'canvas',
    };
    this.viewer = this.continuous
      ? new pdfjsViewer.PDFViewer(options)
      : new pdfjsViewer.PDFSinglePageViewer(options);
    this.linkService.setViewer(this.viewer);

    // pdf.js fires these outside Angular's zone; hop back in so the toolbar and
    // the contents panel update.
    this.eventBus.on('pagesinit', () => this.zone.run(() => {
      this.ready = true;
      this.applyScale();
    }));
    this.eventBus.on('pagechanging', (e: any) => this.zone.run(() => {
      this.pageChange.emit(e.pageNumber);
    }));
  }

  private destroyViewer(): void {
    this.viewer?.setDocument(null);
    this.linkService?.setDocument(null);
    this.viewer = null;
    this.linkService = null;
    this.eventBus = null;
    this.ready = false;
  }

  // Switching between continuous and single-page means a different viewer
  // class, so rebuild and put the reader back on the page they were reading.
  private rebuildForMode(): void {
    const page = this.currentPage;
    const pdf = this.pdf;
    this.destroyViewer();
    this.containerRef.nativeElement.innerHTML = '<div class="pdfViewer"></div>';
    this.build();
    if (pdf) {
      this.setDocument(pdf);
      this.eventBus.on('pagesinit', () => this.zone.run(() => this.goToPage(page)), { once: true });
    }
  }

  private load(): void {
    this.ready = false;
    this.loadingTask?.destroy();
    if (!this.src) return;

    this.loadingTask = pdfjs.getDocument({ url: this.src, cMapUrl: CMAP_URL, cMapPacked: true });
    this.loadingTask.promise.then(
      (pdf: any) => this.zone.run(() => {
        this.pdf = pdf;
        this.setDocument(pdf);
        this.loaded.emit(pdf);
      }),
      (err: any) => this.zone.run(() => this.loadError.emit(err)),
    );
  }

  private setDocument(pdf: any): void {
    this.viewer.setDocument(pdf);
    this.linkService.setDocument(pdf, null);
  }

  // "50%" means half of the page-width fit, which is what the toolbar has
  // always meant. Assigning `currentScale` (rather than calling the private
  // _setScale with noScroll) is what keeps the reader's place.
  private applyScale(): void {
    if (!this.ready || !this.viewer?.pagesCount) return;
    const page = this.viewer._pages?.[this.viewer.currentPageNumber - 1];
    if (!page?.width) return;
    const container = this.containerRef.nativeElement;
    const pageWidthScale = ((container.clientWidth - H_PADDING) / page.width) * page.scale;
    const next = pageWidthScale * this.zoom;
    if (Number.isFinite(next) && next > 0) this.viewer.currentScale = next;
  }
}
