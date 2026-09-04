import { Component, OnInit, ViewChild, ElementRef, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Book, BookSection } from 'src/app/interfaces/books.model';
import { fuzzyScore } from 'src/app/utils/fuzzy-score';
import { CommandPaletteService } from 'src/app/services/command-palette.service';
import { BookCatalogService } from 'src/app/services/book-catalog.service';

// ─── Admin password setup ────────────────────────────────────────────────────
// To set your password, run this in a browser console and paste the result below:
//   crypto.subtle.digest('SHA-256', new TextEncoder().encode('your-password'))
//     .then(b => console.log(Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2,'0')).join('')))
const PASSWORD_HASH = 'c1e7dc8e9098153d7ad6d7c49fe9fa65e58977524473fc97df2950d4252df653';
// ─────────────────────────────────────────────────────────────────────────────

// Static list of book PDFs, generated at build time by scripts/gen-pdf-manifest.js.
// Same-origin, so there is no hardcoded repo owner and no GitHub API rate limit.
const PDF_MANIFEST = 'assets/pdfs/books/manifest.json';
const AUTH_KEY = 'books_admin_auth';

async function sha256(str: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ─── Fuzzy search ────────────────────────────────────────────────────────────
// Score a book entry: fuzzy on the title (primary), substring on the description.
function entryScore(query: string, name: string, desc: unknown): number {
  const nameScore = fuzzyScore(query, name);
  if (nameScore > 0) return nameScore + 1000;
  return String(desc).toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
}
// ─────────────────────────────────────────────────────────────────────────────


@Component({
    selector: 'app-books',
    templateUrl: './books.component.html',
    styleUrls: ['./books.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BooksComponent implements OnInit {
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  // Live catalog, grouped into subject-topic sections, from BookCatalogService
  // (series-map graph.json + book-topics.ts). See the service for the rules.
  allSections: BookSection[] = [];

  notesExpanded = false;   // Overview "Notes & caveats" block, collapsed by default
  searchQuery = '';
  activeSection = 'all';   // selected topic chip ('all' or a topic key)
  activeTier: number | 'all' = 'all';   // selected reading-level chip

  // Sections surviving the current search + level (topic-chip-independent) —
  // drives the chip counts — and the sections after also applying the active
  // topic chip (what renders).
  queryMatched: BookSection[] = [];
  filteredSections: BookSection[] = [];

  // Keyboard navigation: the currently highlighted entry (rendered only while
  // the search box is focused) and whether the box has focus.
  highlightedItem?: Book;
  searchFocused = false;

  // Press "/" anywhere on the page to jump to the search box (unless already
  // typing in a field).
  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return;
    const el = event.target as HTMLElement | null;
    const tag = el?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || el?.isContentEditable) return;
    event.preventDefault();
    this.searchInput?.nativeElement.focus();
  }

  isAuthenticated = false;
  showPasswordForm = false;
  passwordInput = '';
  authError = false;
  isLoadingPdfs = false;
  rawPdfs: Book[] = [];

  // ⌘ on Mac, Ctrl elsewhere — shown in the "search inside all books" hint.
  readonly modKey = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl';

  constructor(
    private router: Router,
    private http: HttpClient,
    private paletteService: CommandPaletteService,
    private catalog: BookCatalogService,
  ) { }

  // Open the global result palette. Doubles as the mobile entry point (tap).
  openResultSearch(): void {
    this.paletteService.open();
  }

  ngOnInit(): void {
    this.catalog.sections$.subscribe(sections => {
      this.allSections = sections;
      this.recompute();
    });
    this.isAuthenticated = sessionStorage.getItem(AUTH_KEY) === 'true';
    if (this.isAuthenticated) {
      this.loadRawPdfs();
    }
  }

  // Chips: one per topic, in the catalog's display order, plus the "All" chip
  // rendered separately in the template.
  get sectionChips(): { key: string; label: string }[] {
    return this.allSections.map(s => ({ key: s.key, label: s.label }));
  }

  // Reading levels present in the live catalog, in tier order. Derived rather
  // than hardcoded so a tier with no published book never gets a dead chip.
  get tierChips(): { tier: number; label: string }[] {
    const seen = new Map<number, string>();
    for (const s of this.allSections) {
      for (const b of s.books) {
        if (b.tier != null && b.tierLabel) seen.set(b.tier, b.tierLabel);
      }
    }
    return [...seen.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([tier, label]) => ({ tier, label }));
  }

  // Books matching the current query + level within a topic (topic-chip-
  // independent), so the chip counts reflect both filters. Counts the topic's
  // primary members only — the same number the section heading shows.
  countFor(key: string): number {
    return this.queryMatched.find(s => s.key === key)?.books.length ?? 0;
  }

  selectSection(key: string): void {
    this.activeSection = key;
    this.recompute();
  }

  selectTier(tier: number | 'all'): void {
    this.activeTier = tier;
    this.recompute();
  }

  // Cross-listed books ("Also relevant") are noise in the all-topics view,
  // where every book is already on screen under its own subject. They earn
  // their place only once the reader has narrowed to one topic.
  get showAlso(): boolean {
    return this.activeSection !== 'all';
  }

  onSearchChange(): void {
    this.recompute();
  }

  // Recompute the visible sections from the query + level + active topic chip,
  // ranked by relevance. Memoized into fields (rather than getters) so object
  // identity stays stable for the keyboard-highlight comparison.
  private recompute(): void {
    const q = this.searchQuery.trim();
    const sift = (books: Book[]): Book[] => {
      const atLevel = this.activeTier === 'all'
        ? books
        : books.filter(b => b.tier === this.activeTier);
      return q ? this.rank(atLevel, q) : atLevel;
    };

    this.queryMatched = this.allSections
      .map(s => ({ ...s, books: sift(s.books), alsoBooks: sift(s.alsoBooks) }))
      .filter(s => s.books.length);
    this.filteredSections = this.queryMatched
      .filter(s => this.activeSection === 'all' || s.key === this.activeSection);
    this.highlightedItem = this.navItems[0];
  }

  private rank(books: Book[], q: string): Book[] {
    return books
      .map(b => ({ b, score: entryScore(q, b.name, b.desc) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(x => x.b);
  }

  // Flat list of keyboard-navigable entries, in display order.
  get navItems(): Book[] {
    return this.filteredSections.flatMap(
      s => this.showAlso ? [...s.books, ...s.alsoBooks] : s.books,
    );
  }

  onSearchFocus(): void {
    this.searchFocused = true;
    if (!this.highlightedItem) this.highlightedItem = this.navItems[0];
  }

  // Arrow keys move the highlight; Enter opens the highlighted (or top) entry.
  onSearchKeydown(event: KeyboardEvent): void {
    const items = this.navItems;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.moveHighlight(1, items);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.moveHighlight(-1, items);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const target = this.highlightedItem ?? items[0];
      if (target) this.handleBookClick(target);
    }
  }

  private moveHighlight(delta: number, items: Book[]): void {
    if (!items.length) return;
    const cur = this.highlightedItem ? items.indexOf(this.highlightedItem) : -1;
    const next = Math.min(items.length - 1, Math.max(0, cur + delta));
    this.highlightedItem = items[next];
    setTimeout(() =>
      document.querySelector('.nav-highlighted')?.scrollIntoView({ block: 'nearest' }));
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.recompute();
  }

  // Shown when the filter combination is empty, naming whichever of the three
  // filters is actually responsible rather than a generic "no results".
  get emptyStateMessage(): string {
    const q = this.searchQuery.trim();
    const level = this.tierChips.find(t => t.tier === this.activeTier)?.label;
    const topic = this.allSections.find(s => s.key === this.activeSection)?.label;
    const parts = [
      q ? `matching "${q}"` : '',
      topic ? `in ${topic}` : '',
      level ? `at the ${level} level` : '',
    ].filter(Boolean);
    return `No books ${parts.join(' ')}.`;
  }

  // Hidden (admin) raw PDFs filtered by the same query, ranked by relevance.
  get filteredRawPdfs(): Book[] {
    const q = this.searchQuery.trim();
    if (!q) return this.rawPdfs;
    return this.rawPdfs
      .map(p => ({ pdf: p, score: fuzzyScore(q, p.name) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(x => x.pdf);
  }

  toggleLock() {
    if (this.isAuthenticated) {
      this.logout();
    } else {
      this.showPasswordForm = !this.showPasswordForm;
      this.authError = false;
      this.passwordInput = '';
    }
  }

  async submitPassword() {
    const hash = await sha256(this.passwordInput);
    if (hash === PASSWORD_HASH) {
      this.isAuthenticated = true;
      sessionStorage.setItem(AUTH_KEY, 'true');
      this.showPasswordForm = false;
      this.authError = false;
      this.passwordInput = '';
      this.loadRawPdfs();
    } else {
      this.authError = true;
      this.passwordInput = '';
    }
  }

  onPasswordKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') { this.submitPassword(); }
    if (event.key === 'Escape') { this.showPasswordForm = false; }
  }

  logout() {
    this.isAuthenticated = false;
    sessionStorage.removeItem(AUTH_KEY);
    this.rawPdfs = [];
    this.showPasswordForm = false;
  }

  loadRawPdfs() {
    this.isLoadingPdfs = true;
    this.http.get<string[]>(PDF_MANIFEST).subscribe({
      next: (names) => {
        this.rawPdfs = names
          .filter(n => n.toLowerCase().endsWith('.pdf'))
          .sort((a, b) => a.localeCompare(b))
          .map(n => ({
            name: n,
            desc: '',
            link: `././assets/pdfs/books/${n}`,
            type: 'pdf' as const
          }));
        this.isLoadingPdfs = false;
      },
      error: () => {
        this.isLoadingPdfs = false;
      }
    });
  }

  openRawPdf(book: Book) {
    window.open(book.link.toString(), '_blank');
  }

  viewPdf(book: Book) {
    this.router.navigate(['/pdf-viewer'], {
      queryParams: {
        src: book.link,
        name: book.name,
        source: 'books'
      }
    });
  }

  viewHtml(book: Book) {
    this.router.navigate(['/html-viewer'], {
      queryParams: {
        src: book.link,
        name: book.name
      }
    });
  }

  toggleNotes(): void {
    this.notesExpanded = !this.notesExpanded;
  }

  handleBookClick(book: Book) {
    if (book.type === 'html') {
      this.viewHtml(book);
    } else {
      this.viewPdf(book);
    }
  }
}
