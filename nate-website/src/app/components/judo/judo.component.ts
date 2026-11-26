import { Component, OnInit, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { JudoTechnique, BeltLevel, MainCategory } from '../../interfaces/judo.model';
import {
  BELT_OPTIONS, DEFAULT_SYLLABUS, SYLLABI, SYLLABUS_OPTIONS, Syllabus, SyllabusId, getSyllabus,
} from './data/syllabi';

@Component({
    selector: 'app-judo',
    templateUrl: './judo.component.html',
    styleUrls: ['./judo.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class JudoComponent implements OnInit {

  searchQuery = '';
  selectedBelt: BeltLevel | 'all' = 'all';
  selectedCategory: MainCategory | 'all' = 'all';
  syllabus: SyllabusId = DEFAULT_SYLLABUS;
  filteredTechniques: JudoTechnique[] = [];
  bookmarked: Set<string> = new Set();
  selectedTechnique: JudoTechnique | null = null;

  controlsCollapsed = false;
  atTop = true;
  glossaryOpen = false;
  playingCardId: string | null = null;
  modalVideoPlaying = false;
  private lastScrollY = 0;

  // ── Flashcard study mode ──────────────────────────────────────────
  studyMode = false;
  studyDeck: JudoTechnique[] = [];
  deckIndex = 0;
  cardFlipped = false;
  studyVideoPlaying = false;
  private touchStartX = 0;
  private touchStartY = 0;
  private didSwipe = false;

  @HostListener('window:scroll')
  onScroll(): void {
    const currentY = window.scrollY;
    this.controlsCollapsed = currentY > 200 && currentY > this.lastScrollY;
    this.atTop = currentY < 50;
    this.lastScrollY = currentY;
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    if (this.studyMode) { this.exitStudy(); return; }
    this.closeModal();
  }

  @HostListener('window:keydown.arrowright')
  onArrowRight(): void { if (this.studyMode) this.nextCard(); }

  @HostListener('window:keydown.arrowleft')
  onArrowLeft(): void { if (this.studyMode) this.prevCard(); }

  // Typed as Event, not KeyboardEvent: Angular types a host listener's $event
  // as Event, and preventDefault is all this needs.
  @HostListener('window:keydown.space', ['$event'])
  onSpace(e: Event): void {
    if (this.studyMode) { e.preventDefault(); this.flipCard(); }
  }

  readonly beltOptions = BELT_OPTIONS;
  readonly syllabusOptions = SYLLABUS_OPTIONS;

  get activeSyllabus(): Syllabus {
    return getSyllabus(this.syllabus);
  }

  get activeTechniques(): readonly JudoTechnique[] {
    return this.activeSyllabus.techniques;
  }

  get categoryOptions() {
    return this.activeSyllabus.categories;
  }

  get showBeltFilter(): boolean {
    return this.activeSyllabus.hasBelts;
  }

  onSyllabusChange(): void {
    if (this.syllabus !== DEFAULT_SYLLABUS) {
      this.selectedBelt = 'all';
    }
    this.selectedCategory = 'all';
    this.filter();
  }

  ngOnInit(): void {
    this.filteredTechniques = [...this.activeTechniques];
  }

  get hasActiveFilters(): boolean {
    return this.searchQuery.trim() !== ''
      || (this.showBeltFilter && this.selectedBelt !== 'all')
      || this.selectedCategory !== 'all';
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedBelt = 'all';
    this.selectedCategory = 'all';
    this.filter();
  }

  private fuzzyMatch(query: string, text: string): boolean {
    let qi = 0;
    for (let i = 0; i < text.length && qi < query.length; i++) {
      if (text[i] === query[qi]) qi++;
    }
    return qi === query.length;
  }

  filter(): void {
    const q = this.searchQuery.toLowerCase().trim();
    this.filteredTechniques = this.activeTechniques.filter(t => {
      const matchesSearch = !q
        || this.fuzzyMatch(q, t.title_en.toLowerCase())
        || this.fuzzyMatch(q, t.title_romaji.toLowerCase())
        || t.title_kanji.includes(q);
      const matchesBelt = this.selectedBelt === 'all' || !t.belt_requirement || t.belt_requirement === this.selectedBelt;
      const matchesCategory = this.selectedCategory === 'all' || t.category === this.selectedCategory;
      return matchesSearch && matchesBelt && matchesCategory;
    });
  }

  openModal(t: JudoTechnique): void {
    this.selectedTechnique = t;
    this.modalVideoPlaying = false;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.selectedTechnique = null;
    this.modalVideoPlaying = false;
    document.body.style.overflow = '';
  }

  playCard(youtubeId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.playingCardId = youtubeId;
  }

  toggleBookmark(t: JudoTechnique, event: MouseEvent): void {
    event.stopPropagation();
    const key = t.title_romaji;
    if (this.bookmarked.has(key)) {
      this.bookmarked.delete(key);
    } else {
      this.bookmarked.add(key);
    }
  }

  isBookmarked(t: JudoTechnique): boolean {
    return this.bookmarked.has(t.title_romaji);
  }

  // ── Flashcard methods ─────────────────────────────────────────────
  startStudy(): void {
    const all = SYLLABI.flatMap(s => s.techniques);
    const deck = all.filter(t => this.bookmarked.has(t.title_romaji));
    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    this.studyDeck = deck;
    this.deckIndex = 0;
    this.cardFlipped = false;
    this.studyMode = true;
    document.body.style.overflow = 'hidden';
  }

  exitStudy(): void {
    this.studyMode = false;
    document.body.style.overflow = '';
  }

  flipCard(): void {
    if (this.didSwipe) { this.didSwipe = false; return; }
    this.cardFlipped = !this.cardFlipped;
  }

  nextCard(): void {
    if (this.deckIndex < this.studyDeck.length - 1) {
      this.deckIndex++;
      this.cardFlipped = false;
      this.studyVideoPlaying = false;
    }
  }

  prevCard(): void {
    if (this.deckIndex > 0) {
      this.deckIndex--;
      this.cardFlipped = false;
      this.studyVideoPlaying = false;
    }
  }

  onTouchStart(e: TouchEvent): void {
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
    this.didSwipe = false;
  }

  onTouchEnd(e: TouchEvent): void {
    const dx = e.changedTouches[0].clientX - this.touchStartX;
    const dy = Math.abs(e.changedTouches[0].clientY - this.touchStartY);
    if (Math.abs(dx) > 50 && dy < 80) {
      this.didSwipe = true;
      if (dx < 0) this.nextCard();
      else this.prevCard();
    }
  }
}
