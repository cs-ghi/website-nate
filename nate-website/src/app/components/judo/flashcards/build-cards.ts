import { JudoTechnique } from '../../../interfaces/judo.model';
import { techniqueId, uniqueTechniques } from '../data/technique-id';
import { Face, StudyCard } from './flashcard.model';

/** A front every technique can show, used when none of the chosen ones fit. */
export const FALLBACK_FACE: Face = 'japanese';

/** The chosen fronts this technique can actually show. */
export function facesFor(t: JudoTechnique, faces: readonly Face[]): Face[] {
  return faces.filter(f => f !== 'video' || !!t.youtube_id);
}

/** How many techniques have no video, which matters when Video is a chosen front. */
export function countWithoutVideo(techniques: readonly JudoTechnique[]): number {
  return uniqueTechniques(techniques).filter(t => !t.youtube_id).length;
}

/**
 * One card per distinct technique, each with a front picked at random from
 * the chosen faces it supports (falling back to the Japanese name). Cards
 * keep the order given; the session shuffles.
 */
export function buildCards(
  techniques: readonly JudoTechnique[],
  faces: readonly Face[],
  random: () => number = Math.random,
): StudyCard[] {
  const unique = uniqueTechniques(techniques);

  const namesByClip = new Map<string, string[]>();
  for (const t of unique) {
    if (t.youtube_id) namesByClip.set(t.youtube_id, [...(namesByClip.get(t.youtube_id) ?? []), t.title_romaji]);
  }

  return unique.map(t => {
    const usable = facesFor(t, faces);
    const face = usable.length ? usable[Math.floor(random() * usable.length)] : FALLBACK_FACE;
    const sameClip = face === 'video'
      ? (namesByClip.get(t.youtube_id!) ?? []).filter(name => name !== t.title_romaji)
      : [];
    return { id: techniqueId(t), technique: t, face, sameClip };
  });
}
