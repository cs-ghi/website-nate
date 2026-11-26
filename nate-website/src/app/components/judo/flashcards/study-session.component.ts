import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy, Component, ElementRef, computed, inject, signal, viewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PersistedValue } from '../../../utils/persisted-value';
import { buildCards } from './build-cards';
import { FlashcardComponent } from './flashcard.component';
import { StudyPlan } from './flashcard.model';
import {
  SessionState, canUndo, currentCard, flip, grade, isFinished, nextRound, progress, startSession,
  summarize, undo,
} from './study-session';
import { SwipeCardDirective, SwipeEvent } from './swipe-card.directive';

const isBoolean = (v: unknown): v is boolean => typeof v === 'boolean';

/** Keys that answer a flipped card: arrows, plus vim's h and l. */
const ANSWER_KEYS: Record<string, boolean> = {
  ArrowRight: true, l: true, L: true,
  ArrowLeft: false, h: false, H: false,
};

const UNDO_KEYS = new Set(['z', 'Z', 'Backspace']);

/**
 * The full-screen study session, opened as a CDK dialog by StudyLauncher.
 * All session rules live in study-session.ts; this component turns input
 * (buttons, keys, swipes) into calls on it and renders the result. Every
 * answer, however it is given, throws the card right (got it) or left
 * (missed), which is also what teaches the swipe.
 */
@Component({
  selector: 'app-study-session',
  imports: [MatIconModule, FlashcardComponent, SwipeCardDirective],
  templateUrl: './study-session.component.html',
  styleUrl: './study-session.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'onKey($event)',
    '(window:blur)': 'reclaimFocus()',
  },
})
export class StudySessionComponent {
  private readonly ref = inject(DialogRef);
  private readonly plan = inject<StudyPlan>(DIALOG_DATA);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly swipe = viewChild(SwipeCardDirective);

  /** Phones and tablets: show swipe cues instead of keyboard hints. */
  readonly touch = matchMedia('(pointer: coarse)').matches;
  /** Set by the first finger swipe ever made; until then the lesson below plays. */
  private readonly swipeLearned = new PersistedValue<boolean>('judo.swipe-learned.v1', false, isBoolean);
  /**
   * On touch screens, until a swipe has been made once: the first answer of
   * the session nudges the card right and left, with a line saying what that
   * means.
   */
  readonly lesson = signal(this.touch && !this.swipeLearned.value());

  readonly mastery = this.plan.mode === 'mastery';
  readonly state = signal<SessionState>(
    startSession(buildCards(this.plan.techniques, this.plan.faces), this.plan.mode, this.plan.target),
  );

  readonly card = computed(() => currentCard(this.state()));
  readonly flipped = computed(() => this.state().flipped);
  readonly finished = computed(() => isFinished(this.state()));
  readonly canUndo = computed(() => canUndo(this.state()));
  readonly progress = computed(() => progress(this.state()));
  readonly progressPercent = computed(() => Math.round(this.progress().fraction * 100));
  readonly summary = computed(() => (this.finished() ? summarize(this.state()) : null));
  readonly percentRight = computed(() => {
    const s = this.summary();
    return s && s.dealt ? Math.round((100 * s.right) / s.dealt) : 0;
  });
  /** Toward-the-target count for the card on screen, when the target is more than one. */
  readonly streak = computed(() => {
    const s = this.state();
    if (s.mode !== 'mastery' || s.target < 2 || !s.queue.length) return null;
    return { right: s.tally[s.queue[0]].right, target: s.target };
  });

  /** A brief green/red wash after each answer; keyed so every answer replays it. */
  readonly flash = signal<{ id: number; right: boolean }[]>([]);
  private flashId = 0;

  flip(): void {
    this.swipe()?.settle();
    this.state.update(flip);
  }

  /** Answers the card on screen by throwing it: right for got it, left for missed. */
  answer(right: boolean): void {
    this.swipe()?.settle(); // a throw still in flight lands first
    if (!this.flipped()) return;
    const swipe = this.swipe();
    if (swipe) swipe.fling(right ? 'right' : 'left');
    else this.record(right);
  }

  onSwiped(e: SwipeEvent): void {
    if (e.gesture) this.swipeLearned.set(true);
    this.lesson.set(false);
    this.record(e.direction === 'right');
  }

  private record(right: boolean): void {
    if (!this.flipped()) return;
    this.state.update(s => grade(s, right));
    this.flash.set([{ id: ++this.flashId, right }]);
  }

  undo(): void {
    this.swipe()?.settle();
    this.state.update(undo);
  }

  reviewMissed(): void {
    this.state.update(s => nextRound(s, 'missed'));
  }

  restart(): void {
    this.state.update(s => nextRound(s, 'all'));
  }

  close(): void {
    this.ref.close();
  }

  onCardClick(): void {
    if (!this.flipped()) this.flip();
  }

  onKey(e: KeyboardEvent): void {
    if (e.repeat || e.altKey || e.ctrlKey || e.metaKey) return;
    const target = e.target instanceof Element ? e.target : null;
    if (target?.closest('input, textarea, select')) return;

    const activate = e.key === ' ' || e.key === 'Enter';
    // On a focused button, let the button do its own thing.
    if (activate && target?.closest('button, a, summary')) return;
    // Land a throw still in flight before reading the state, or a key pressed
    // during it would be judged against the card that is leaving.
    if (activate || e.key in ANSWER_KEYS || UNDO_KEYS.has(e.key)) this.swipe()?.settle();

    if (activate) {
      if (this.flipped() || this.finished()) return;
      e.preventDefault();
      this.flip();
    } else if (e.key in ANSWER_KEYS) {
      if (!this.flipped()) return;
      e.preventDefault();
      this.answer(ANSWER_KEYS[e.key]);
    } else if (UNDO_KEYS.has(e.key)) {
      e.preventDefault();
      this.undo();
    }
  }

  /**
   * A click on a video moves keyboard focus into YouTube's iframe, where the
   * shortcuts can't be heard. Take it back once the click has landed; the
   * player still gets the click itself.
   */
  reclaimFocus(): void {
    setTimeout(() => {
      const active = document.activeElement;
      const root = this.root().nativeElement;
      if (active instanceof HTMLIFrameElement && root.contains(active)) root.focus({ preventScroll: true });
    });
  }
}
