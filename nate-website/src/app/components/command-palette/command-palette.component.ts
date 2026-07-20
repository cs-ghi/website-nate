import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { BookIndexService, ScoredEntry } from '../../services/book-index.service';
import { CommandPaletteService } from '../../services/command-palette.service';
import { booksArray } from '../books/books.component';
import { Book } from '../../interfaces/books.model';

// Compact type badges for the result rows.
const TYPE_ABBR: Record<string, string> = {
  definition: 'Def', theorem: 'Thm', lemma: 'Lem', proposition: 'Prop',
  corollary: 'Cor', example: 'Ex', axiom: 'Ax', conjecture: 'Conj',
};

@Component({
  selector: 'app-command-palette',
  templateUrl: './command-palette.component.html',
  styleUrls: ['./command-palette.component.scss'],
})
export class CommandPaletteComponent {
  @ViewChild('input') input?: ElementRef<HTMLInputElement>;

  isOpen = false;
  query = '';
  results: ScoredEntry[] = [];
  highlighted = 0;
  loading = false;
  copiedKey: string | null = null;

  // ⌘ on Mac, Ctrl elsewhere — used in the on-screen hints.
  readonly modKey = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl';

  // pdf basename -> the books-page entry, for the display name and the exact
  // link the site already uses. Flattened over parents + children.
  private pdfMap = new Map<string, Book>();

  constructor(
    private router: Router,
    private index: BookIndexService,
    paletteService: CommandPaletteService,
  ) {
    const add = (b: Book) => {
      const base = b.link.toString().split('/').pop();
      if (base) this.pdfMap.set(base, b);
      (b.children ?? []).forEach(add);
    };
    booksArray.forEach(add);

    paletteService.open$.subscribe(() => this.open());
  }

  // ⌘K / Ctrl-K toggles the palette from anywhere; when open, arrows navigate,
  // Enter opens, Esc closes.
  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      this.isOpen ? this.close() : this.open();
      return;
    }
    if (!this.isOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); this.close(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); this.move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); this.move(-1); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const hit = this.results[this.highlighted];
      if (!hit) return;
      // Shift+Enter copies the shareable link instead of opening.
      if (e.shiftKey) this.copyLink(hit, e);
      else this.openEntry(hit);
    }
  }

  open(): void {
    this.isOpen = true;
    this.loading = true;
    this.index.load().then(() => {
      this.loading = false;
      if (this.query) this.runSearch();
    });
    setTimeout(() => this.input?.nativeElement.focus(), 0);
  }

  close(): void {
    this.isOpen = false;
    this.copiedKey = null;
  }

  onQueryChange(): void {
    this.runSearch();
  }

  private runSearch(): void {
    this.results = this.index.search(this.query);
    this.highlighted = 0;
  }

  private move(delta: number): void {
    if (!this.results.length) return;
    this.highlighted = Math.min(this.results.length - 1, Math.max(0, this.highlighted + delta));
    setTimeout(() =>
      document.querySelector('.cp-result.highlighted')?.scrollIntoView({ block: 'nearest' }));
  }

  openEntry(e: ScoredEntry): void {
    this.router.navigate(['/pdf-viewer'], {
      queryParams: { src: this.srcFor(e), name: this.nameFor(e), loc: e.label, source: 'books' },
    });
    this.close();
  }

  copyLink(e: ScoredEntry, evt: Event): void {
    evt.stopPropagation();
    const tree = this.router.createUrlTree(['/pdf-viewer'], {
      queryParams: { src: this.srcFor(e), name: this.nameFor(e), loc: e.label },
    });
    const url = location.origin + tree.toString();
    navigator.clipboard?.writeText(url);
    this.copiedKey = this.keyFor(e);
    setTimeout(() => { if (this.copiedKey === this.keyFor(e)) this.copiedKey = null; }, 1500);
  }

  typeAbbr(type: string): string { return TYPE_ABBR[type] ?? type; }
  nameFor(e: ScoredEntry): string { return this.pdfMap.get(e.pdf)?.name ?? e.book; }
  keyFor(e: ScoredEntry): string { return e.pdf + '#' + e.label; }
  trackByKey = (_: number, e: ScoredEntry): string => this.keyFor(e);

  private srcFor(e: ScoredEntry): string {
    const link = this.pdfMap.get(e.pdf)?.link;
    return (link ?? `././assets/pdfs/books/${e.pdf}`).toString();
  }
}
