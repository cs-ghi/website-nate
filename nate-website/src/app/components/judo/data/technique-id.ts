import { JudoTechnique } from '../../../interfaces/judo.model';

/**
 * Stable key for a technique, shared across syllabi. The syllabi spell romaji
 * differently ("Seoi Nage" / "Seoi-nage", "De Ashi Barai" / "De-ashi-harai"),
 * so the key drops case, spaces and hyphens and folds the voiced "barai" back
 * to "harai". The study deck stores these keys, which is what lets one deck
 * entry stand for the same technique in every syllabus.
 */
export function techniqueId(t: Pick<JudoTechnique, 'title_romaji'>): string {
  return t.title_romaji
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/barai/g, 'harai');
}
