import {
  DestroyRef, Directive, ElementRef, NgZone, afterNextRender, inject, input, output,
} from '@angular/core';

export type SwipeDirection = 'left' | 'right';

export interface SwipeEvent {
  direction: SwipeDirection;
  /** True for a finger swipe, false for fling() (a button or key). */
  gesture: boolean;
}

/** Movement before a touch counts as a drag, and before its axis is decided. */
const SLOP_PX = 8;
/** Drag distance that commits, as a share of the card's width (capped below). */
const COMMIT_SHARE = 0.3;
const COMMIT_MAX_PX = 120;
/** A quick flick commits from a shorter drag. In px/ms. */
const FLICK_SPEED = 0.45;
const FLICK_MIN_PX = 40;
/** Must match the transition in the stylesheet. */
const FLY_MS = 220;

/**
 * Makes the host a card you can throw left or right, by touch or by fling().
 *
 * It only writes two custom properties on the host, and the stylesheet
 * draws everything from them:
 * - `--swipe-x`: horizontal offset (a length);
 * - `--swipe-p`: progress toward committing, -1 to 1. It reaches +-1
 *   exactly where letting go will count, so a stamp at full opacity means
 *   "release now".
 * Plus the classes `is-armed` (swiping is on) and `is-dragging` (a finger is
 * down, so no transition).
 *
 * Touch uses Pointer Events with `touch-action: pan-y` on the armed host:
 * the browser keeps vertical scrolling and hands horizontal drags to us,
 * which is what tells a swipe from a scroll. Mouse pointers are ignored;
 * desktop has the buttons and keys.
 */
@Directive({
  selector: '[appSwipeCard]',
  exportAs: 'appSwipeCard',
  host: { '[class.is-armed]': 'enabled()' },
})
export class SwipeCardDirective {
  /** Whether the card can be swiped right now. */
  readonly enabled = input(false, { alias: 'appSwipeCard' });
  /** After the card has flown off. */
  readonly swiped = output<SwipeEvent>();

  private readonly el: HTMLElement = inject(ElementRef).nativeElement;
  private readonly zone = inject(NgZone);
  private readonly reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  private drag: {
    id: number; x0: number; y0: number; dx: number;
    horizontal: boolean | null; lastX: number; lastT: number; speed: number;
  } | null = null;
  /** The throw in flight, if any, and the timer that lands it. */
  private flight: { event: SwipeEvent; timer: ReturnType<typeof setTimeout> } | null = null;

  constructor() {
    const down = (e: PointerEvent) => this.onDown(e);
    const move = (e: PointerEvent) => this.onMove(e);
    const up = (e: PointerEvent) => this.onUp(e);
    const cancel = (e: PointerEvent) => this.onCancel(e);

    // Outside Angular: a drag fires a pointermove every frame and only needs
    // to write two style properties. Angular hears about the result.
    afterNextRender(() => this.zone.runOutsideAngular(() => {
      this.el.addEventListener('pointerdown', down);
      this.el.addEventListener('pointermove', move);
      this.el.addEventListener('pointerup', up);
      this.el.addEventListener('pointercancel', cancel);
    }));
    inject(DestroyRef).onDestroy(() => {
      this.el.removeEventListener('pointerdown', down);
      this.el.removeEventListener('pointermove', move);
      this.el.removeEventListener('pointerup', up);
      this.el.removeEventListener('pointercancel', cancel);
    });
  }

  /** Throws the card off one side, then emits `swiped`. */
  fling(direction: SwipeDirection, gesture = false): void {
    this.settle();
    const event: SwipeEvent = { direction, gesture };
    if (this.reducedMotion.matches) {
      this.zone.run(() => this.swiped.emit(event));
      return;
    }
    const sign = direction === 'right' ? 1 : -1;
    this.el.classList.remove('is-dragging');
    this.set(sign * (window.innerWidth / 2 + this.el.offsetWidth), sign);
    this.flight = { event, timer: setTimeout(() => this.land(), FLY_MS) };
  }

  /**
   * Lands a throw still in flight right away. Call it before acting on new
   * input, so a key pressed mid-throw applies to the next card instead of
   * being lost.
   */
  settle(): void {
    if (this.flight) this.land();
  }

  private land(): void {
    const flight = this.flight;
    if (!flight) return;
    clearTimeout(flight.timer);
    this.flight = null;
    // Emitting inside the zone runs change detection before this returns, so
    // the next card is already in the DOM when the host snaps back to centre:
    // the old card is never seen coming back.
    this.zone.run(() => this.swiped.emit(flight.event));
    this.el.classList.add('is-dragging'); // no transition for the snap back
    this.set(0, 0);
    void this.el.offsetWidth;
    this.el.classList.remove('is-dragging');
  }

  private onDown(e: PointerEvent): void {
    if (!this.enabled() || this.flight || this.drag || e.pointerType === 'mouse') return;
    this.drag = {
      id: e.pointerId, x0: e.clientX, y0: e.clientY, dx: 0,
      horizontal: null, lastX: e.clientX, lastT: e.timeStamp, speed: 0,
    };
  }

  private onMove(e: PointerEvent): void {
    const d = this.drag;
    if (!d || e.pointerId !== d.id) return;
    const dx = e.clientX - d.x0;
    const dy = e.clientY - d.y0;

    if (d.horizontal === null) {
      if (Math.hypot(dx, dy) < SLOP_PX) return;
      d.horizontal = Math.abs(dx) > Math.abs(dy);
      if (!d.horizontal) {
        this.drag = null; // a vertical scroll: the browser's
        return;
      }
      this.el.setPointerCapture(e.pointerId);
      this.el.classList.add('is-dragging');
    }

    const dt = e.timeStamp - d.lastT;
    if (dt > 0) d.speed = (e.clientX - d.lastX) / dt;
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;
    d.dx = dx;
    this.set(dx, Math.max(-1, Math.min(1, dx / this.commitDistance())));
  }

  private onUp(e: PointerEvent): void {
    const d = this.drag;
    if (!d || e.pointerId !== d.id) return;
    this.drag = null;
    if (!d.horizontal) return;

    const far = Math.abs(d.dx) >= this.commitDistance();
    const flick = Math.abs(d.speed) >= FLICK_SPEED && Math.abs(d.dx) >= FLICK_MIN_PX
      && Math.sign(d.speed) === Math.sign(d.dx);
    if (far || flick) {
      this.fling(d.dx > 0 ? 'right' : 'left', true);
    } else {
      this.el.classList.remove('is-dragging');
      this.set(0, 0); // springs back through the transition
    }
  }

  private onCancel(e: PointerEvent): void {
    if (!this.drag || e.pointerId !== this.drag.id) return;
    this.drag = null;
    this.el.classList.remove('is-dragging');
    this.set(0, 0);
  }

  private commitDistance(): number {
    return Math.min(COMMIT_MAX_PX, this.el.offsetWidth * COMMIT_SHARE);
  }

  private set(x: number, progress: number): void {
    this.el.style.setProperty('--swipe-x', `${x}px`);
    this.el.style.setProperty('--swipe-p', String(progress));
  }
}
