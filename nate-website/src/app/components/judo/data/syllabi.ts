import { BeltLevel, JudoTechnique, MainCategory } from '../../../interfaces/judo.model';
import { JUDO_CANADA_TECHNIQUES } from './judo-canada.data';
import { KODOKAN_TECHNIQUES } from './kodokan.data';
import { UOFT_TECHNIQUES } from './uoft.data';
import { techniqueId } from './technique-id';

export type SyllabusId = 'judo-canada' | 'kodokan' | 'uoft';

export interface FilterOption<T extends string> {
  value: T | 'all';
  label: string;
}

export interface Syllabus {
  id: SyllabusId;
  /** Name in the syllabus picker. */
  label: string;
  /** Line under the page title. */
  subtitle: string;
  techniques: readonly JudoTechnique[];
  categories: readonly FilterOption<MainCategory>[];
  /** Whether techniques carry a belt, i.e. whether the belt filter means anything. */
  hasBelts: boolean;
}

const ALL_CATEGORIES: FilterOption<MainCategory> = { value: 'all', label: 'All Categories' };

export const SYLLABI: readonly Syllabus[] = [
  {
    id: 'judo-canada',
    label: 'Judo Canada',
    subtitle: 'Judo Canada Syllabus, Grading Reference',
    techniques: JUDO_CANADA_TECHNIQUES,
    hasBelts: true,
    categories: [
      ALL_CATEGORIES,
      { value: 'tachi-waza', label: 'Tachi-waza (Standing)' },
      { value: 'ne-waza', label: 'Ne-waza (Ground)' },
      { value: 'kiso', label: 'Kiso (Basics)' },
      { value: 'kata', label: 'Kata' },
      { value: 'knowledge', label: 'Knowledge' },
    ],
  },
  {
    id: 'kodokan',
    label: 'Kodokan (100 techniques)',
    subtitle: 'Kodokan 100 Standard Techniques',
    techniques: KODOKAN_TECHNIQUES,
    hasBelts: false,
    categories: [
      ALL_CATEGORIES,
      { value: 'tachi-waza', label: 'Nage-waza (Throwing)' },
      { value: 'ne-waza', label: 'Katame-waza (Grappling)' },
      { value: 'knowledge', label: 'Knowledge' },
    ],
  },
  {
    id: 'uoft',
    label: 'U of T Judo Club',
    subtitle: 'University of Toronto Judo Club, Promotional Syllabus',
    techniques: UOFT_TECHNIQUES,
    hasBelts: true,
    categories: [
      ALL_CATEGORIES,
      { value: 'tachi-waza', label: 'Tachi-waza (Standing)' },
      { value: 'ne-waza', label: 'Ne-waza (Ground)' },
      { value: 'kata', label: 'Kata' },
      { value: 'knowledge', label: 'Knowledge' },
    ],
  },
];

export const DEFAULT_SYLLABUS: SyllabusId = 'judo-canada';

/** Picker entries: the real syllabi plus placeholders that are not in yet. */
export const SYLLABUS_OPTIONS: readonly { value: string; label: string; disabled?: boolean }[] = [
  ...SYLLABI.map(s => ({ value: s.id, label: s.label })),
  { value: 'ijf', label: 'IJF (coming soon)', disabled: true },
];

export const BELT_OPTIONS: readonly FilterOption<BeltLevel>[] = [
  { value: 'all', label: 'All Belts' },
  { value: 'white', label: 'White (Rokkyu)' },
  { value: 'yellow', label: 'Yellow (Gokyu)' },
  { value: 'orange', label: 'Orange (Yonkyu)' },
  { value: 'green', label: 'Green (Sankyu)' },
  { value: 'blue', label: 'Blue (Nikyu)' },
  { value: 'brown', label: 'Brown (Ikkyu)' },
  { value: 'black', label: 'Black (Dan)' },
];

export function getSyllabus(id: SyllabusId): Syllabus {
  return SYLLABI.find(s => s.id === id) ?? SYLLABI[0];
}

// One lookup per syllabus. U of T lists a few techniques at more than one
// belt; the first (lowest belt) entry wins.
const BY_ID = new Map<SyllabusId, Map<string, JudoTechnique>>(
  SYLLABI.map(s => {
    const index = new Map<string, JudoTechnique>();
    for (const t of s.techniques) {
      const id = techniqueId(t);
      if (!index.has(id)) index.set(id, t);
    }
    return [s.id, index];
  }),
);

/**
 * The technique entries for `ids`, in the order given. Each id is looked up in
 * `preferred` first so the wording matches the page being viewed, then in the
 * other syllabi. Ids no syllabus knows (say, a technique since removed) are
 * skipped.
 */
export function resolveTechniques(ids: Iterable<string>, preferred: SyllabusId): JudoTechnique[] {
  const order = [preferred, ...SYLLABI.map(s => s.id).filter(id => id !== preferred)];
  const out: JudoTechnique[] = [];
  for (const id of ids) {
    for (const s of order) {
      const t = BY_ID.get(s)?.get(id);
      if (t) { out.push(t); break; }
    }
  }
  return out;
}
