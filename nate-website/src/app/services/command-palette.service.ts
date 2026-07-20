import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// Lets any component (e.g. the books page's "search all results" button, which
// is also the mobile entry point) open the global command palette.
@Injectable({ providedIn: 'root' })
export class CommandPaletteService {
  private openSubject = new Subject<void>();
  open$ = this.openSubject.asObservable();

  open(): void {
    this.openSubject.next();
  }
}
