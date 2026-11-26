import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

/** The ordinary video for the back of a card: a thumbnail until tapped, then YouTube with sound. */
@Component({
  selector: 'app-clip-player',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="player">
      @if (playing()) {
        <iframe [src]="src()" [title]="label() + ' video'"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>
      } @else {
        <button type="button" class="player__poster" (click)="playing.set(true)"
          [attr.aria-label]="'Play the ' + label() + ' video'">
          <img [src]="thumbnail()" alt="">
          <mat-icon class="player__icon">play_arrow</mat-icon>
        </button>
      }
    </div>
  `,
  styles: `
    :host { display: block; }

    .player {
      position: relative;
      aspect-ratio: 16 / 9;
      background: #000;
      border: 1px solid #2a2b30;
      border-radius: 4px;
      overflow: hidden;

      iframe {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        border: 0;
      }
    }

    .player__poster {
      display: block;
      position: absolute;
      inset: 0;
      padding: 0;
      border: 0;
      background: none;
      cursor: pointer;

      img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.8;
        transition: opacity 0.15s;
      }

      &:hover img,
      &:focus-visible img { opacity: 1; }
    }

    .player__icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 3.5rem;
      height: 3.5rem;
      font-size: 3.5rem;
      color: rgba(255, 255, 255, 0.92);
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.6));
    }
  `,
})
export class ClipPlayerComponent {
  readonly videoId = input.required<string>();
  /** The technique's name, for the accessible labels. */
  readonly label = input.required<string>();
  readonly playing = signal(false);

  private readonly sanitizer = inject(DomSanitizer);

  readonly thumbnail = computed(() => `https://img.youtube.com/vi/${encodeURIComponent(this.videoId())}/hqdefault.jpg`);
  readonly src = computed(() => this.sanitizer.bypassSecurityTrustResourceUrl(
    `https://www.youtube.com/embed/${encodeURIComponent(this.videoId())}?autoplay=1&rel=0&playsinline=1&disablekb=1`,
  ));
}
