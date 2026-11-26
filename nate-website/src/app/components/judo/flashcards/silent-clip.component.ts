import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, input, signal,
  viewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { YTPlayer, YTState, loadYouTubeApi } from './youtube-api';

/**
 * Seconds to skip at the start. Every technique video (the Kodokan / IJF
 * Academy series) opens on a title card with the technique's name, which
 * lasts about 4.5 s.
 */
const START_AT = 5.5;
/** Seconds before the end to loop back: the last second fades out. */
const END_TRIM = 1.5;
/** How long to wait for autoplay before offering a Play button instead. */
const AUTOPLAY_GRACE_MS = 3000;

/**
 * A technique video that gives nothing away, for the front of a card.
 *
 * - Plays muted from after the title card, and loops back there before the
 *   end, so neither the title card nor YouTube's end screen ever shows.
 * - A curtain hides the player until it is really playing past the title
 *   card (YouTube's poster and loading screen show the title).
 * - YouTube's top bar (video title) is cropped off: the player is taller than
 *   the 16:9 window it sits in, so the video is letterboxed into the window
 *   and the bar falls in the hidden band above it.
 * - The videos print the technique's name in a caption in the bottom-left
 *   corner for their whole length; an opaque patch covers it (a blur would
 *   not do: browsers do not apply backdrop-filter to cross-origin iframe
 *   content, so the text shows through). Measured on the
 *   longest caption, "Kuzure-kami-shiho-gatame": about 5-31% across, 88-94%
 *   down.
 * - The player takes no pointer or keyboard input, so a tap lands on the card
 *   (and flips it) and YouTube's pause screen never appears. If the browser
 *   refuses to autoplay (iOS Low Power Mode), a Play button takes its place.
 *
 * One instance plays one video: the card recreates it for each new card.
 */
@Component({
  selector: 'app-silent-clip',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="clip">
      <div class="clip__frame" aria-hidden="true"><div #mount></div></div>
      <div class="clip__caption-cover" aria-hidden="true"></div>
      @if (!showing()) {
        <div class="clip__curtain">
          @if (failed()) {
            <span class="clip__msg">The video could not load. Show the answer to see it on YouTube.</span>
          } @else if (blocked()) {
            <button type="button" class="clip__play" (click)="play($event)">
              <mat-icon>play_arrow</mat-icon> Play clip
            </button>
          } @else {
            <span class="clip__spinner" aria-label="Loading video"></span>
          }
        </div>
      }
    </div>
  `,
  styles: `
    $band: 80px;

    :host { display: block; }

    .clip {
      position: relative;
      aspect-ratio: 16 / 9;
      overflow: hidden;
      background: #000;
      border-radius: 4px;
    }

    // pointer-events is inherited, so the player iframe inside gets none too.
    .clip__frame {
      position: absolute;
      left: 0;
      top: -$band;
      width: 100%;
      height: calc(100% + #{2 * $band});
      pointer-events: none;
    }

    .clip__caption-cover {
      position: absolute;
      left: 2.5%;
      top: 85%;
      width: 32%;
      height: 11%;
      border-radius: 4px;
      background: #2a2b30;
      box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06);
    }

    .clip__curtain {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background: #111214;
      text-align: center;
    }

    .clip__spinner {
      width: 28px;
      height: 28px;
      border: 2px solid #3a3733;
      border-top-color: #a49b96;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .clip__play {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      min-height: 48px;
      padding: 0 1.25rem;
      border: 1px solid #46423f;
      border-radius: 24px;
      background: #1e1f23;
      color: #e0d9d3;
      font: inherit;
      font-size: 0.9rem;
      cursor: pointer;

      &:hover { border-color: #a49b96; }
    }

    .clip__msg {
      max-width: 22rem;
      color: #888;
      font-size: 0.85rem;
      line-height: 1.5;
    }
  `,
})
export class SilentClipComponent {
  readonly videoId = input.required<string>();

  /** Playing past the title card, so the curtain can go. */
  readonly showing = signal(false);
  /** Autoplay was refused; waiting for a tap. */
  readonly blocked = signal(false);
  readonly failed = signal(false);

  private readonly mount = viewChild.required<ElementRef<HTMLElement>>('mount');
  private player: YTPlayer | null = null;
  private poll = 0;
  private destroyed = false;

  constructor() {
    afterNextRender(() => void this.create());
    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
      clearInterval(this.poll);
      this.player?.destroy();
    });
  }

  play(event: Event): void {
    event.stopPropagation(); // a tap here starts the clip; it must not also flip the card
    this.blocked.set(false);
    this.player?.playVideo();
  }

  private async create(): Promise<void> {
    let YT;
    try {
      YT = await loadYouTubeApi();
    } catch {
      this.failed.set(true);
      return;
    }
    if (this.destroyed) return;

    this.player = new YT.Player(this.mount().nativeElement, {
      videoId: this.videoId(),
      width: '100%',
      height: '100%',
      playerVars: {
        autoplay: 1, mute: 1, start: Math.ceil(START_AT), controls: 0, // whole seconds only disablekb: 1, fs: 0,
        iv_load_policy: 3, playsinline: 1, rel: 0,
      },
      events: {
        onReady: e => {
          const frame = e.target.getIframe();
          frame.title = 'Technique video'; // YouTube sets the video's title, i.e. the answer
          frame.tabIndex = -1;
          e.target.mute();
          e.target.playVideo();
          this.watch(e.target);
        },
        onStateChange: e => {
          if (e.data === YTState.Ended) this.restart(e.target);
        },
        onError: () => this.failed.set(true),
      },
    });
  }

  /** Lifts the curtain once playing, loops before the end, and notices refused autoplay. */
  private watch(player: YTPlayer): void {
    const since = Date.now();
    this.poll = window.setInterval(() => {
      const t = player.getCurrentTime();
      const end = player.getDuration() - END_TRIM;
      if (end > START_AT && t >= end) player.seekTo(START_AT, true);

      const playing = player.getPlayerState() === YTState.Playing;
      if (playing && t >= START_AT - 0.5) {
        this.showing.set(true);
        this.blocked.set(false);
      } else if (!this.showing() && !playing && Date.now() - since > AUTOPLAY_GRACE_MS) {
        this.blocked.set(true);
      }
    }, 200);
  }

  /** If the loop was missed (a throttled background tab), hide the end screen and go round again. */
  private restart(player: YTPlayer): void {
    this.showing.set(false);
    player.seekTo(START_AT, true);
    player.playVideo();
  }
}
