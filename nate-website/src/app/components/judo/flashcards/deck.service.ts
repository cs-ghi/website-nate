import { Injectable, computed } from '@angular/core';
import { JudoTechnique } from '../../../interfaces/judo.model';
import { PersistedValue } from '../../../utils/persisted-value';
import { techniqueId } from '../data/technique-id';

const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every(x => typeof x === 'string');

/**
 * The techniques picked for study. Stored as technique ids (see techniqueId),
 * in the order they were added, and saved across reloads.
 */
@Injectable({ providedIn: 'root' })
export class DeckService {
  private readonly ids = new PersistedValue<readonly string[]>('judo.deck.v1', [], isStringArray);
  private readonly idSet = computed(() => new Set(this.ids.value()));

  readonly entries = this.ids.value;
  readonly size = computed(() => this.ids.value().length);

  has(t: JudoTechnique): boolean {
    return this.idSet().has(techniqueId(t));
  }

  /** How many of `ts` are not in the deck yet, counting each technique once. */
  countMissing(ts: readonly JudoTechnique[]): number {
    const missing = new Set<string>();
    for (const t of ts) {
      const id = techniqueId(t);
      if (!this.idSet().has(id)) missing.add(id);
    }
    return missing.size;
  }

  toggle(t: JudoTechnique): void {
    if (this.has(t)) this.remove([t]);
    else this.add([t]);
  }

  add(ts: readonly JudoTechnique[]): void {
    const next = [...this.ids.value()];
    const seen = new Set(next);
    for (const t of ts) {
      const id = techniqueId(t);
      if (!seen.has(id)) { seen.add(id); next.push(id); }
    }
    if (next.length !== this.ids.value().length) this.ids.set(next);
  }

  remove(ts: readonly JudoTechnique[]): void {
    const drop = new Set(ts.map(techniqueId));
    this.ids.update(ids => ids.filter(id => !drop.has(id)));
  }

  clear(): void {
    this.ids.set([]);
  }
}
