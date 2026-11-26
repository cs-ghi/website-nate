import { Component, OnDestroy, OnInit, HostListener, ChangeDetectionStrategy, inject } from '@angular/core';
import { JudoTechnique, BeltLevel, MainCategory } from '../../interfaces/judo.model';
import {
  BELT_OPTIONS, DEFAULT_SYLLABUS, SYLLABUS_OPTIONS, Syllabus, SyllabusId, getSyllabus,
} from './data/syllabi';
import { uniqueTechniques } from './data/technique-id';
import { DeckService } from './flashcards/deck.service';
import { StudyLauncher } from './flashcards/study-launcher.service';

@Component({
    selector: 'app-judo',
    templateUrl: './judo.component.html',
    styleUrls: ['./judo.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class JudoComponent implements OnInit, OnDestroy {

  searchQuery = '';
  selectedBelt: BeltLevel | 'all' = 'all';
  selectedCategory: MainCategory | 'all' = 'all';
  syllabus: SyllabusId = DEFAULT_SYLLABUS;
  filteredTechniques: JudoTechnique[] = [];
  selectedTechnique: JudoTechnique | null = null;

  controlsCollapsed = false;
  atTop = true;
  glossaryOpen = false;
  playingCardId: string | null = null;
  modalVideoPlaying = false;
  private lastScrollY = 0;

  readonly deck = inject(DeckService);
  private readonly study = inject(StudyLauncher);

  @HostListener('window:scroll')
  onScroll(): void {
    const currentY = window.scrollY;
    this.controlsCollapsed = currentY > 200 && currentY > this.lastScrollY;
    this.atTop = currentY < 50;
    this.lastScrollY = currentY;
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    this.closeModal();
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

  // Leaving the page with the modal or a study dialog open must not leave the
  // body unscrollable or a dialog floating over the next page.
  ngOnDestroy(): void {
    this.closeModal();
    this.study.closeAll();
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

  toggleDeck(t: JudoTechnique, event: MouseEvent): void {
    event.stopPropagation();
    this.deck.toggle(t);
  }

  /** Distinct techniques on screen (U of T repeats a few across belts). */
  get shownCount(): number {
    return uniqueTechniques(this.filteredTechniques).length;
  }

  /** Shown techniques not yet in the deck; 0 means "remove all" is on offer instead. */
  get shownNotInDeck(): number {
    return this.deck.countMissing(this.filteredTechniques);
  }

  addShownToDeck(): void {
    this.deck.add(this.filteredTechniques);
  }

  removeShownFromDeck(): void {
    this.deck.remove(this.filteredTechniques);
  }

  openStudy(): void {
    this.study.open(this.filteredTechniques, this.syllabus);
  }
}
