import { WritableSignal, effect, signal } from '@angular/core';

/**
 * A signal whose value is mirrored to localStorage under `key`.
 *
 * A stored value that is missing, unparsable or rejected by `isValid` falls
 * back to `initial`, so changing the shape of what is stored never breaks the
 * page; bump the key's version instead of migrating. Storage that throws
 * (private browsing, quota) is ignored and the value simply stops surviving
 * reloads.
 *
 * Uses `effect`, so call it in an injection context (a field initializer of a
 * service or component).
 */
export function persistedSignal<T>(
  key: string,
  initial: T,
  isValid: (value: unknown) => value is T,
): WritableSignal<T> {
  const value = signal<T>(read(key, initial, isValid));
  effect(() => write(key, value()));
  return value;
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

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Not persisted; the in-memory value still works.
  }
}
