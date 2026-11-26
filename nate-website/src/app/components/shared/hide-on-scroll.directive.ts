import { DestroyRef, Directive, ElementRef, NgZone, afterNextRender, inject, signal } from '@angular/core';

/** Scrolling this far one way counts as meaning it; smaller wobbles (trackpads) don't. */
const INTENT_PX = 12;

/**
 * For a `position: sticky` bar: once it is pinned, slides it away while the
 * page scrolls down and brings it back as soon as it scrolls up.
 *
 * It sets two classes on the host for the stylesheet to act on:
 * - `is-pinned`: stuck at its `top`, over the content (so it wants a background).
 * - `is-hidden`: slid away.
 *
 * Style `is-hidden` with transform, opacity and visibility only, never with
 * anything that changes the bar's size. A size change moves the content
 * below the bar; the browser's scroll anchoring then shifts the scroll
 * position to compensate; that shift reads as scrolling the other way, which
 * undoes the change, and so on every frame. The bar then sticks half-open
 * whenever scrolling pauses.
 *
 * The bar never hides while focus is inside it, e.g. while typing a search.
 */
@Directive({
  selector: '[appHideOnScroll]',
  host: {
    '[class.is-pinned]': 'pinned()',
    '[class.is-hidden]': 'hidden()',
  },
})
export class HideOnScrollDirective {
  readonly pinned = signal(false);
  readonly hidden = signal(false);

  private readonly bar: HTMLElement = inject(ElementRef).nativeElement;
  /**
   * An empty element just before the bar, marking the bar's place in the
   * flow. The bar is pinned once this has scrolled above the bar's `top`.
   * (The bar's own position can't tell: once stuck it no longer moves.)
   */
  private readonly marker = document.createElement('div');
  private lastY = 0;
  /** Where scrolling in the current direction began. */
  private turnY = 0;
  private goingDown = false;

  constructor() {
    const zone = inject(NgZone);
    const onScroll = () => this.update();

    afterNextRender(() => {
      this.marker.setAttribute('aria-hidden', 'true');
      this.bar.before(this.marker);
      this.lastY = this.turnY = window.scrollY;
      this.update();
      // Outside Angular: a scroll event is only worth change detection when a
      // signal above actually changes, and setting one schedules that itself.
      zone.runOutsideAngular(() => window.addEventListener('scroll', onScroll, { passive: true }));
    });

    inject(DestroyRef).onDestroy(() => {
      window.removeEventListener('scroll', onScroll);
      this.marker.remove();
    });
  }

  private update(): void {
    // Clamp away rubber-band overscroll, which would read as a change of direction.
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const y = Math.min(Math.max(window.scrollY, 0), Math.max(max, 0));
    if (y !== this.lastY) {
      const down = y > this.lastY;
      if (down !== this.goingDown) {
        this.goingDown = down;
        this.turnY = this.lastY;
      }
      this.lastY = y;
    }

    const stickTop = parseFloat(getComputedStyle(this.bar).top) || 0;
    const pinned = this.marker.getBoundingClientRect().top < stickTop;
    this.pinned.set(pinned);

    if (!pinned || this.bar.contains(document.activeElement)) {
      this.hidden.set(false);
    } else if (Math.abs(y - this.turnY) >= INTENT_PX) {
      this.hidden.set(this.goingDown);
    }
  }
}
