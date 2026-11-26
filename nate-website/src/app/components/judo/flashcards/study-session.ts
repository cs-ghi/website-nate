// The study session as plain data and pure functions: no Angular, no DOM.
// Every operation returns a new state, which makes undo a pointer to the
// previous one and lets the component hold the whole thing in one signal.

import { MAX_TARGET, MIN_TARGET, StudyCard, StudyMode } from './flashcard.model';

/** In mastery mode, how many other cards come before a missed one returns. */
export const MISS_GAP = 3;

export interface Tally {
  right: number;
  missed: number;
}

export interface SessionState {
  readonly mode: StudyMode;
  /** Right answers a card needs before it leaves the queue. Always 1 in graded mode. */
  readonly target: number;
  readonly cards: readonly StudyCard[];
  /** Indices into `cards` still to come. The head is the card on screen. */
  readonly queue: readonly number[];
  /** Per card: this round's answers (graded) or the whole session's (mastery). */
  readonly tally: readonly Tally[];
  /** How many cards this round started with. */
  readonly dealt: number;
  readonly round: number;
  readonly flipped: boolean;
  /** The state before the last grade, for undo. Null at the start of a round. */
  readonly previous: SessionState | null;
}

export interface Progress {
  /** 0 to 1, for the progress bar. Mastery counts every right answer toward the target. */
  fraction: number;
  /** Graded: cards answered this round. Mastery: cards that reached the target. */
  done: number;
  /** Cards dealt this round. */
  total: number;
  right: number;
  missed: number;
}

export interface Summary {
  dealt: number;
  /** Graded: cards answered right this round. */
  right: number;
  /** Every answer given, and how many of those were misses. */
  answers: number;
  misses: number;
  /** Cards missed at least once, most-missed first. */
  missed: { card: StudyCard; times: number }[];
}

export function clampTarget(n: number): number {
  return Math.min(MAX_TARGET, Math.max(MIN_TARGET, Math.round(n) || MIN_TARGET));
}

export function startSession(
  cards: readonly StudyCard[],
  mode: StudyMode,
  target: number,
  random: () => number = Math.random,
): SessionState {
  const base = { mode, target: mode === 'mastery' ? clampTarget(target) : 1, cards };
  return deal(base, cards.map((_, i) => i), 1, random);
}

export function currentCard(s: SessionState): StudyCard | null {
  return s.queue.length ? s.cards[s.queue[0]] : null;
}

export function isFinished(s: SessionState): boolean {
  return s.queue.length === 0;
}

export function canUndo(s: SessionState): boolean {
  return s.previous !== null;
}

/** Shows the back of the current card. Flipping is one way; grading turns the next card face up. */
export function flip(s: SessionState): SessionState {
  return isFinished(s) || s.flipped ? s : { ...s, flipped: true };
}

/** Records an answer for the current card and moves on. Only once the card has been flipped. */
export function grade(s: SessionState, right: boolean): SessionState {
  if (isFinished(s) || !s.flipped) return s;
  const [card, ...rest] = s.queue;
  const before = s.tally[card];
  const after = right ? { ...before, right: before.right + 1 } : { ...before, missed: before.missed + 1 };
  return {
    ...s,
    queue: requeue(s, card, rest, right, after),
    tally: s.tally.map((t, i) => (i === card ? after : t)),
    flipped: false,
    previous: s,
  };
}

export function undo(s: SessionState): SessionState {
  return s.previous ?? s;
}

/** A fresh round of either the cards missed in this one or all of them. */
export function nextRound(
  s: SessionState,
  which: 'missed' | 'all',
  random: () => number = Math.random,
): SessionState {
  const indices = which === 'all'
    ? s.cards.map((_, i) => i)
    : s.tally.flatMap((t, i) => (t.missed > 0 ? [i] : []));
  return deal(s, indices, s.round + 1, random);
}

export function progress(s: SessionState): Progress {
  const right = sum(s.tally, t => t.right);
  const missed = sum(s.tally, t => t.missed);
  const total = s.dealt;
  if (s.mode === 'graded') {
    const done = total - s.queue.length;
    return { fraction: total ? done / total : 1, done, total, right, missed };
  }
  const done = s.tally.filter(t => t.right >= s.target).length;
  const earned = sum(s.tally, t => Math.min(t.right, s.target));
  return { fraction: total ? earned / (total * s.target) : 1, done, total, right, missed };
}

export function summarize(s: SessionState): Summary {
  const missed = s.tally
    .map((t, i) => ({ card: s.cards[i], times: t.missed }))
    .filter(m => m.times > 0)
    .sort((a, b) => b.times - a.times);
  const right = s.tally.filter(t => t.right > 0 && t.missed === 0).length;
  const misses = sum(s.tally, t => t.missed);
  return { dealt: s.dealt, right, answers: sum(s.tally, t => t.right) + misses, misses, missed };
}

export function shuffled<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function deal(
  base: Pick<SessionState, 'mode' | 'target' | 'cards'>,
  indices: readonly number[],
  round: number,
  random: () => number,
): SessionState {
  return {
    mode: base.mode,
    target: base.target,
    cards: base.cards,
    queue: shuffled(indices, random),
    tally: base.cards.map(() => ({ right: 0, missed: 0 })),
    dealt: indices.length,
    round,
    flipped: false,
    previous: null,
  };
}

function requeue(s: SessionState, card: number, rest: number[], right: boolean, after: Tally): number[] {
  if (s.mode === 'graded') return rest;
  if (!right) {
    const at = Math.min(MISS_GAP, rest.length);
    return [...rest.slice(0, at), card, ...rest.slice(at)];
  }
  return after.right < s.target ? [...rest, card] : rest;
}

function sum<T>(items: readonly T[], f: (item: T) => number): number {
  return items.reduce((n, item) => n + f(item), 0);
}
