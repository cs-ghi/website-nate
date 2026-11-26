import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy, Component, ElementRef, computed, inject, signal, viewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { buildCards } from './build-cards';
import { FlashcardComponent } from './flashcard.component';
import { StudyPlan } from './flashcard.model';
import {
  SessionState, canUndo, currentCard, flip, grade, isFinished, nextRound, progress, startSession,
  summarize, undo,
} from './study-session';

/** Horizontal travel (px) that counts as a swipe rather than a tap or a scroll. */
const SWIPE_MIN = 60;

/** Keys that answer a flipped card: arrows, plus vim's h and l. */
const ANSWER_KEYS: Record<string, boolean> = {
  ArrowRight: true, l: true, L: true,
  ArrowLeft: false, h: false, H: false,
};

/**
 * The full-screen study session, opened as a CDK dialog by StudyLauncher.
 * All session rules live in study-session.ts; this component turns input
 * (buttons, keys, swipes) into calls on it and renders the result.
 */
@Component({
  selector: 'app-study-session',
  imports: [MatIconModule, FlashcardComponent],
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
  private touchStart: { x: number; y: number } | null = null;

  flip(): void {
    this.state.update(flip);
  }

  grade(right: boolean): void {
    if (!this.flipped()) return;
    this.state.update(s => grade(s, right));
    this.flash.set([{ id: ++this.flashId, right }]);
  }

  undo(): void {
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

    if (e.key === ' ' || e.key === 'Enter') {
      // On a focused button, let the button do its own thing.
      if (target?.closest('button, a, summary') || this.flipped() || this.finished()) return;
      e.preventDefault();
      this.flip();
    } else if (e.key in ANSWER_KEYS) {
      if (!this.flipped()) return;
      e.preventDefault();
      this.grade(ANSWER_KEYS[e.key]);
    } else if (e.key === 'z' || e.key === 'Z' || e.key === 'Backspace') {
      e.preventDefault();
      this.undo();
    }
  }

  onTouchStart(e: TouchEvent): void {
    const t = e.touches[0];
    this.touchStart = { x: t.clientX, y: t.clientY };
  }

  onTouchEnd(e: TouchEvent): void {
    const start = this.touchStart;
    this.touchStart = null;
    if (!start || !this.flipped()) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) >= SWIPE_MIN && Math.abs(dx) > 2 * Math.abs(dy)) this.grade(dx > 0);
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
