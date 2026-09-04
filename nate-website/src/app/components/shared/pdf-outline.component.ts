import {
  Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild,
} from '@angular/core';
import { fuzzyScore, titleForms } from '../../utils/fuzzy-score';

// One entry in the table of contents. The tree is kept nested (rather than
// flattened) so it can be collapsed: the largest book here has 562 outline
// entries over 2053 pages, which as a flat list is worse than the book's own
// printed contents page.
export interface OutlineNode {
  title: string;
  dest: any;
  page: number | null;       // physical page in the PDF, 1-based
  pageLabel: string | null;  // what to show: the *printed* number where the PDF
                             // has page labels, else the physical page
  level: number;
  children: OutlineNode[];
  expanded: boolean;
}

// How many rows to show before collapsing. Books here range from 20 to 562
// outline entries, so a fixed depth is wrong for one end or the other: expand
// level by level while the visible rows fit the budget instead.
const OUTLINE_VISIBLE_BUDGET = 40;

const MAX_FILTER_RESULTS = 60;

// The reader's table of contents: the tree, its filter, and which section the
// reader is currently in. Knows nothing about how the page is rendered or
// scrolled — it emits a physical page number and the host viewer navigates.
@Component({
  selector: 'app-pdf-outline',
  templateUrl: './pdf-outline.component.html',
  styleUrls: ['./pdf-outline.component.scss'],
})
export class PdfOutlineComponent implements OnChanges {
  // The loaded PDFDocumentProxy; setting it rebuilds the tree.
  @Input() pdf: any = null;
  @Input() open: boolean = false;
  // Overlay the page rather than pushing it aside. The host owns the
  // breakpoint, so there is exactly one of them.
  @Input() drawer: boolean = false;
  // Physical page the reader is on; drives the active-section highlight.
  @Input() currentPage: number = 1;

  /** Physical page to navigate to. */
  @Output() navigate = new EventEmitter<number>();
  @Output() closeRequested = new EventEmitter<void>();
  /** Whether this document has an outline at all, so the host can hide its toggle. */
  @Output() availableChange = new EventEmitter<boolean>();

  @ViewChild('outlineList') private outlineList?: ElementRef<HTMLElement>;
  @ViewChild('outlineFilter') private outlineFilter?: ElementRef<HTMLInputElement>;

  available: boolean = false;
  tree: OutlineNode[] = [];
  activeNode: OutlineNode | null = null;

  // The same nodes in document order, for resolving which section the reader is
  // currently in, plus each node's parent so that section's ancestors can be
  // expanded.
  private flat: OutlineNode[] = [];
  private parentOf = new Map<OutlineNode, OutlineNode | null>();
  private pageLabels: string[] | null = null;

  // Filter over the outline. While a query is active the panel shows a ranked
  // flat list instead of the tree — collapsing is the wrong affordance when you
  // already know the name of what you want.
  filterQuery: string = '';
  filterResults: OutlineNode[] = [];
  highlighted: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pdf']) {
      this.reset();
      if (this.pdf) this.build(this.pdf);
      return;
    }
    if (changes['currentPage']) this.updateActiveNode();
    if (changes['open']?.currentValue) {
      this.updateActiveNode();
      this.scrollActiveIntoView();
    }
    if (changes['open'] && !this.open) this.clearFilter();
  }

  /** Called by the host for its `/` shortcut. */
  focusFilter(): void {
    setTimeout(() => this.outlineFilter?.nativeElement.focus());
  }

  private reset(): void {
    this.tree = [];
    this.flat = [];
    this.parentOf.clear();
    this.activeNode = null;
    this.pageLabels = null;
    this.clearFilter();
    this.setAvailable(false);
  }

  private async build(pdf: any): Promise<void> {
    try {
      this.pageLabels = await pdf.getPageLabels();
    } catch (error) {
      this.pageLabels = null;
      console.warn('Could not read page labels:', error);
    }

    let outline: any[] | null = null;
    try {
      outline = await pdf.getOutline();
    } catch (error) {
      console.warn('No outline available or error extracting outline:', error);
    }
    // A newer document may have loaded while we were awaiting.
    if (pdf !== this.pdf) return;
    if (!outline?.length) return;

    this.tree = await this.buildNodes(pdf, outline);
    if (pdf !== this.pdf) return;

    this.index(this.tree, null);
    this.applyInitialExpansion();
    this.setAvailable(this.flat.length > 0);
    this.updateActiveNode();
  }

  private setAvailable(value: boolean): void {
    if (this.available === value) return;
    this.available = value;
    this.availableChange.emit(value);
  }

  private async buildNodes(pdf: any, items: any[], level: number = 0): Promise<OutlineNode[]> {
    const nodes: OutlineNode[] = [];

    for (const item of items) {
      let page: number | null = null;

      if (item.dest) {
        try {
          if (Array.isArray(item.dest) && item.dest.length > 0) {
            if (item.dest[0] && typeof item.dest[0] === 'object' && item.dest[0].num !== undefined) {
              page = (await pdf.getPageIndex(item.dest[0])) + 1;
            }
          } else if (typeof item.dest === 'string') {
            const namedDest = await pdf.getDestination(item.dest);
            if (namedDest && namedDest.length > 0) {
              page = (await pdf.getPageIndex(namedDest[0])) + 1;
            }
          }
        } catch (error) {
          console.warn('Could not resolve page for outline item:', item.title, error);
        }
      }

      nodes.push({
        title: item.title,
        dest: item.dest,
        page,
        pageLabel: page == null ? null : this.pageLabels?.[page - 1] || String(page),
        level,
        children: item.items?.length ? await this.buildNodes(pdf, item.items, level + 1) : [],
        expanded: false,
      });
    }

    return nodes;
  }

  // Walk the tree once to record document order and each node's parent.
  private index(nodes: OutlineNode[], parent: OutlineNode | null): void {
    for (const node of nodes) {
      this.flat.push(node);
      this.parentOf.set(node, parent);
      this.index(node.children, node);
    }
  }

  // Expand from the top while the rows still fit the budget, so a 20-entry book
  // opens fully expanded and a 562-entry one opens at its chapters.
  private applyInitialExpansion(): void {
    let visible = this.tree.length;
    for (let level = 0; ; level++) {
      const parents = this.flat.filter(n => n.level === level && n.children.length);
      if (!parents.length) return;
      const added = parents.reduce((sum, n) => sum + n.children.length, 0);
      if (visible + added > OUTLINE_VISIBLE_BUDGET) return;
      parents.forEach(n => (n.expanded = true));
      visible += added;
    }
  }

  toggleNode(node: OutlineNode, event: Event): void {
    event.stopPropagation();
    node.expanded = !node.expanded;
  }

  // The section the reader is in: the last entry, in document order, that starts
  // at or before the current page.
  private updateActiveNode(): void {
    let found: OutlineNode | null = null;
    for (const node of this.flat) {
      if (node.page != null && node.page <= this.currentPage) found = node;
    }
    if (found === this.activeNode) return;
    this.activeNode = found;
    for (let a = found && this.parentOf.get(found); a; a = this.parentOf.get(a) ?? null) {
      a.expanded = true;
    }
    this.scrollActiveIntoView();
  }

  // `block: 'nearest'` is a no-op when the row is already visible, so this
  // follows the reader without yanking the list while they browse it.
  private scrollActiveIntoView(): void {
    if (!this.open) return;
    setTimeout(() => {
      this.outlineList?.nativeElement
        .querySelector('.outline-row.active')
        ?.scrollIntoView({ block: 'nearest' });
    });
  }

  // The printed number is what the page itself shows, what the book's own
  // contents page lists, and what the search index stores — but it differs from
  // the physical page wherever a book has front matter (in EYNTKA-Algebra
  // "II Rings" is physical 327, printed 253). The toolbar's page navigator still
  // counts physical pages, so spell both out.
  pageTooltip(node: OutlineNode): string {
    if (node.page == null) return node.title;
    if (node.pageLabel && node.pageLabel !== String(node.page)) {
      return `${node.title} — printed page ${node.pageLabel} (PDF page ${node.page})`;
    }
    return `${node.title} — page ${node.page}`;
  }

  goToNode(node: OutlineNode): void {
    if (node.page != null) this.navigate.emit(node.page);
    // Drop back to the tree, now expanded around where the reader just landed.
    this.clearFilter();
    if (this.drawer) this.closeRequested.emit();
  }

  // ── Filter ───────────────────────────────────────────────────────────────

  get filtering(): boolean {
    return this.filterQuery.trim().length > 0;
  }

  onFilterChange(): void {
    const q = this.filterQuery.trim();
    this.highlighted = 0;
    if (!q) {
      this.filterResults = [];
      return;
    }
    // Same scorer the command palette uses, over the printed title and its
    // article-stripped form, so "yoneda" matches "The Yoneda Lemma".
    this.filterResults = this.flat
      .map(node => ({
        node,
        score: Math.max(...titleForms(node.title).map(t => fuzzyScore(q, t))),
      }))
      .filter(hit => hit.score > 0)
      .sort((a, b) => b.score - a.score || (a.node.page ?? 0) - (b.node.page ?? 0))
      .slice(0, MAX_FILTER_RESULTS)
      .map(hit => hit.node);
  }

  clearFilter(): void {
    this.filterQuery = '';
    this.filterResults = [];
    this.highlighted = 0;
  }

  // Arrows and Enter drive the result list while the caret is in the box, the
  // same contract as the command palette. Escape clears a query first and only
  // closes the panel once the box is empty.
  onFilterKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      if (this.filtering) this.clearFilter();
      else this.closeRequested.emit();
      return;
    }
    if (!this.filterResults.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault(); this.moveHighlight(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault(); this.moveHighlight(-1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const hit = this.filterResults[this.highlighted];
      if (hit) this.goToNode(hit);
    }
  }

  private moveHighlight(delta: number): void {
    const n = this.filterResults.length;
    this.highlighted = (this.highlighted + delta + n) % n;
    setTimeout(() => {
      this.outlineList?.nativeElement
        .querySelector('.outline-row.highlighted')
        ?.scrollIntoView({ block: 'nearest' });
    });
  }

  // Where a filter hit sits in the book — "I Groups › Sylow Theory" — since a
  // ranked flat list otherwise strips the context the tree was providing.
  breadcrumb(node: OutlineNode): string {
    const parts: string[] = [];
    for (let a = this.parentOf.get(node); a; a = this.parentOf.get(a) ?? null) {
      parts.unshift(a.title);
    }
    return parts.join(' › ');
  }
}
