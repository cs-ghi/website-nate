import { Signal, WritableSignal, signal, untracked } from '@angular/core';

/**
 * A value kept in localStorage under `key`, readable as a signal.
 *
 * Writes go to storage as they happen rather than through an effect, so a
 * value set just before its owner is destroyed (a dialog closing, say) is
 * still saved.
 *
 * A stored value that is missing, unparsable or rejected by `isValid` falls
 * back to `initial`, so changing the shape of what is stored never breaks the
 * page; bump the key's version instead of migrating. Storage that throws
 * (private browsing, quota) is ignored and the value simply stops surviving
 * reloads.
 */
export class PersistedValue<T> {
  private readonly state: WritableSignal<T>;
  readonly value: Signal<T>;

  constructor(
    private readonly key: string,
    initial: T,
    isValid: (value: unknown) => value is T,
  ) {
    this.state = signal(read(key, initial, isValid));
    this.value = this.state.asReadonly();
  }

  set(next: T): void {
    this.state.set(next);
    try {
      localStorage.setItem(this.key, JSON.stringify(next));
    } catch {
      // Not saved; the in-memory value still works.
    }
  }

  update(fn: (current: T) => T): void {
    this.set(fn(untracked(this.state)));
  }
}

function read<T>(key: string, initial: T, isValid: (value: unknown) => value is T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return initial;
    const parsed: unknown = JSON.parse(raw);
    return isValid(parsed) ? parsed : initial;
  } catch {
    return initial;
  }
}
