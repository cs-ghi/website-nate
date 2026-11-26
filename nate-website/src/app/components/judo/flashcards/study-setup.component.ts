import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { JudoTechnique } from '../../../interfaces/judo.model';
import { PersistedValue } from '../../../utils/persisted-value';
import { SyllabusId, resolveTechniques } from '../data/syllabi';
import { uniqueTechniques } from '../data/technique-id';
import { countWithoutVideo } from './build-cards';
import { DeckService } from './deck.service';
import {
  DEFAULT_STUDY_PREFS, FACE_OPTIONS, Face, MAX_TARGET, MIN_TARGET, STUDY_PREFS_KEY, StudyMode,
  StudyPlan, StudyPrefs, isStudyPrefs,
} from './flashcard.model';
import { clampTarget } from './study-session';

export interface StudySetupData {
  /** What the directory's filters currently show. */
  shown: readonly JudoTechnique[];
  /** The syllabus on screen, whose wording deck cards use. */
  syllabus: SyllabusId;
}

/** Picks the cards, the fronts and the mode, then closes with a StudyPlan. */
@Component({
  selector: 'app-study-setup',
  imports: [MatIconModule],
  templateUrl: './study-setup.component.html',
  styleUrl: './study-setup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudySetupComponent {
  private readonly ref = inject<DialogRef<StudyPlan>>(DialogRef);
  private readonly data = inject<StudySetupData>(DIALOG_DATA);
  private readonly deck = inject(DeckService);
  private readonly prefs = new PersistedValue<StudyPrefs>(STUDY_PREFS_KEY, DEFAULT_STUDY_PREFS, isStudyPrefs);

  readonly faceOptions = FACE_OPTIONS;
  readonly minTarget = MIN_TARGET;
  readonly maxTarget = MAX_TARGET;

  readonly deckTechniques = computed(() => resolveTechniques(this.deck.entries(), this.data.syllabus));
  readonly shownTechniques = uniqueTechniques(this.data.shown);
  readonly source = signal<'deck' | 'shown'>(this.deckTechniques().length ? 'deck' : 'shown');
  readonly techniques = computed(() => (this.source() === 'deck' ? this.deckTechniques() : this.shownTechniques));

  readonly faces = signal<readonly Face[]>(this.prefs.value().faces);
  readonly mode = signal<StudyMode>(this.prefs.value().mode);
  readonly target = signal(this.prefs.value().target);

  readonly faceNote = computed(() => {
    if (!this.faces().includes('video')) return '';
    const n = countWithoutVideo(this.techniques());
    if (!n) return '';
    const subject = n === 1 ? '1 card has' : `${n} cards have`;
    return this.faces().length === 1
      ? `${subject} no video and will show the Japanese name instead.`
      : `${subject} no video and will use your other choices.`;
  });

  isFaceOn(face: Face): boolean {
    return this.faces().includes(face);
  }

  toggleFace(face: Face, box: HTMLInputElement): void {
    const on = this.isFaceOn(face);
    if (on && this.faces().length === 1) {
      box.checked = true; // at least one front has to stay chosen
      return;
    }
    const next = new Set(this.faces());
    if (on) next.delete(face);
    else next.add(face);
    this.faces.set(FACE_OPTIONS.map(o => o.value).filter(f => next.has(f)));
  }

  stepTarget(delta: number): void {
    this.target.update(t => clampTarget(t + delta));
  }

  removeFromDeck(t: JudoTechnique): void {
    this.deck.remove([t]);
    this.leaveEmptyDeck();
  }

  clearDeck(): void {
    this.deck.clear();
    this.leaveEmptyDeck();
  }

  start(): void {
    const techniques = this.techniques();
    if (!techniques.length) return;
    const prefs: StudyPrefs = { faces: [...this.faces()], mode: this.mode(), target: this.target() };
    this.prefs.set(prefs);
    this.ref.close({ ...prefs, techniques });
  }

  close(): void {
    this.ref.close();
  }

  private leaveEmptyDeck(): void {
    if (!this.deckTechniques().length) this.source.set('shown');
  }
}
