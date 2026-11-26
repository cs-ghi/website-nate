import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { createGlobalPositionStrategy } from '@angular/cdk/overlay';
import { Injectable, Injector, inject } from '@angular/core';
import { JudoTechnique } from '../../../interfaces/judo.model';
import { SyllabusId } from '../data/syllabi';
import { StudyPlan } from './flashcard.model';
import { StudySessionComponent } from './study-session.component';
import { StudySetupComponent, StudySetupData } from './study-setup.component';

/** Phones get the setup as a bottom sheet; wider screens a centred dialog. */
const NARROW = '(max-width: 600px)';

/**
 * The one way into studying: opens the setup sheet, and when that closes
 * with a plan, the full-screen session. The CDK dialogs bring focus
 * trapping, Esc to close, background scroll locking and focus restore.
 */
@Injectable({ providedIn: 'root' })
export class StudyLauncher {
  private readonly dialog = inject(Dialog);
  private readonly injector = inject(Injector);
  /** One close function per dialog this launcher has open. */
  private readonly openDialogs = new Set<() => void>();

  open(shown: readonly JudoTechnique[], syllabus: SyllabusId): void {
    const narrow = window.matchMedia(NARROW).matches;
    const position = createGlobalPositionStrategy(this.injector).centerHorizontally();
    const setup = this.dialog.open<StudyPlan, StudySetupData, StudySetupComponent>(StudySetupComponent, {
      data: { shown, syllabus },
      ariaLabelledBy: 'study-setup-title',
      backdropClass: 'study-backdrop',
      panelClass: 'study-pane',
      positionStrategy: narrow ? position.bottom('0') : position.centerVertically(),
      width: narrow ? '100%' : '480px',
      maxWidth: '100%',
      maxHeight: narrow ? '92dvh' : '88dvh',
    });
    this.track(setup).closed.subscribe(plan => {
      if (plan) this.startSession(plan);
    });
  }

  /** Closes whatever is open, e.g. when the page is left mid-session. */
  closeAll(): void {
    for (const close of [...this.openDialogs]) close();
  }

  private startSession(plan: StudyPlan): void {
    this.track(this.dialog.open<void, StudyPlan, StudySessionComponent>(StudySessionComponent, {
      data: plan,
      ariaLabel: 'Flashcards',
      autoFocus: 'dialog',
      backdropClass: 'study-backdrop',
      panelClass: 'study-pane',
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
    }));
  }

  private track<R, C>(ref: DialogRef<R, C>): DialogRef<R, C> {
    const close = () => ref.close();
    this.openDialogs.add(close);
    ref.closed.subscribe(() => this.openDialogs.delete(close));
    return ref;
  }
}
