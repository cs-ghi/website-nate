import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ClipPlayerComponent } from './clip-player.component';
import { StudyCard } from './flashcard.model';
import { SilentClipComponent } from './silent-clip.component';

/** One card, front or back. Display only: the session decides when it flips. */
@Component({
  selector: 'app-flashcard',
  imports: [MatIconModule, ClipPlayerComponent, SilentClipComponent],
  templateUrl: './flashcard.component.html',
  styleUrl: './flashcard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlashcardComponent {
  readonly card = input.required<StudyCard>();
  readonly flipped = input(false);
  /** Right answers so far toward the target, shown as pips in mastery mode. */
  readonly streak = input<{ right: number; target: number } | null>(null);

  readonly technique = computed(() => this.card().technique);
  readonly pips = computed(() => {
    const s = this.streak();
    return s ? Array.from({ length: s.target }, (_, i) => i < s.right) : [];
  });
}
