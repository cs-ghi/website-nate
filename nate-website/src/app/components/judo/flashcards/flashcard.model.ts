import { JudoTechnique } from '../../../interfaces/judo.model';

/** What can be on the front of a card. The back always shows everything. */
export type Face = 'video' | 'japanese' | 'english' | 'kanji';

export const FACE_OPTIONS: readonly { value: Face; label: string }[] = [
  { value: 'video', label: 'Video' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'english', label: 'English' },
  { value: 'kanji', label: '漢字' },
];

/**
 * graded:  one pass through the cards, then a score; missed cards can be
 *          reviewed in another round.
 * mastery: a missed card comes back a few cards later, a right one goes to
 *          the back of the queue, and a card leaves once it has been answered
 *          right `target` times.
 */
export type StudyMode = 'graded' | 'mastery';

export const MIN_TARGET = 1;
export const MAX_TARGET = 10;

/** The choices the setup sheet remembers between sessions. */
export interface StudyPrefs {
  faces: Face[];
  mode: StudyMode;
  /** Right answers each card needs in mastery mode. */
  target: number;
}

/** Everything a session needs to start. */
export interface StudyPlan extends StudyPrefs {
  techniques: readonly JudoTechnique[];
}

export interface StudyCard {
  /** techniqueId of the technique. */
  id: string;
  technique: JudoTechnique;
  face: Face;
  /**
   * Other techniques in the session that use the same video. When the front
   * is the video, naming any of them is right.
   */
  sameClip: readonly string[];
}

export const STUDY_PREFS_KEY = 'judo.study-prefs.v1';

export const DEFAULT_STUDY_PREFS: StudyPrefs = { faces: ['video'], mode: 'graded', target: 1 };

const FACE_VALUES = new Set<unknown>(FACE_OPTIONS.map(f => f.value));

export function isStudyPrefs(v: unknown): v is StudyPrefs {
  if (typeof v !== 'object' || v === null) return false;
  const p = v as Partial<StudyPrefs>;
  return Array.isArray(p.faces) && p.faces.length > 0 && p.faces.every(f => FACE_VALUES.has(f))
    && (p.mode === 'graded' || p.mode === 'mastery')
    && Number.isInteger(p.target) && p.target! >= MIN_TARGET && p.target! <= MAX_TARGET;
}
