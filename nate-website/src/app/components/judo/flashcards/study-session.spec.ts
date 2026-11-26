import { JudoTechnique } from '../../../interfaces/judo.model';
import { StudyCard } from './flashcard.model';
import {
  MISS_GAP, SessionState, canUndo, currentCard, flip, grade, isFinished, nextRound, progress,
  startSession, summarize, undo,
} from './study-session';

// random() just under 1 makes the Fisher-Yates shuffle swap nothing.
const keepOrder = () => 0.999999;

function cards(n: number): StudyCard[] {
  return Array.from({ length: n }, (_, i) => {
    const technique: JudoTechnique = {
      title_en: `English ${i}`, title_romaji: `Waza ${i}`, title_kanji: '技',
      category: 'tachi-waza', sub_category: 'Te-waza', is_kata: false, is_theory: false,
    };
    return { id: `waza${i}`, technique, face: 'japanese', sameClip: [] };
  });
}

/** Flips and grades whatever card is on screen, once per entry in `rights`. */
function answer(s: SessionState, ...rights: boolean[]): SessionState {
  return rights.reduce((acc, right) => grade(flip(acc), right), s);
}

const head = (s: SessionState) => currentCard(s)?.technique.title_romaji;
const order = (s: SessionState) => s.queue.map(i => s.cards[i].technique.title_romaji);

describe('study session', () => {
  describe('graded', () => {
    it('ignores a grade before the card is flipped', () => {
      const s = startSession(cards(2), 'graded', 1, keepOrder);
      expect(grade(s, true)).toBe(s);
    });

    it('shows each card once and then finishes with a score', () => {
      let s = startSession(cards(3), 'graded', 5, keepOrder);
      expect(s.target).toBe(1);
      s = answer(s, true, false, true);
      expect(isFinished(s)).toBeTrue();
      const sum = summarize(s);
      expect(sum.right).toBe(2);
      expect(sum.dealt).toBe(3);
      expect(sum.missed.map(m => m.card.technique.title_romaji)).toEqual(['Waza 1']);
    });

    it('reviews only the missed cards in the next round, with a fresh score', () => {
      let s = answer(startSession(cards(4), 'graded', 1, keepOrder), false, true, false, true);
      s = nextRound(s, 'missed', keepOrder);
      expect(order(s)).toEqual(['Waza 0', 'Waza 2']);
      expect(s.round).toBe(2);
      expect(progress(s)).toEqual(jasmine.objectContaining({ done: 0, total: 2, right: 0, missed: 0 }));
      expect(canUndo(s)).toBeFalse();
    });
  });

  describe('mastery', () => {
    it(`brings a missed card back after ${MISS_GAP} others`, () => {
      let s = startSession(cards(6), 'mastery', 1, keepOrder);
      s = answer(s, false);
      expect(order(s)).toEqual(['Waza 1', 'Waza 2', 'Waza 3', 'Waza 0', 'Waza 4', 'Waza 5']);
    });

    it('brings a missed card straight back when it is the last one left', () => {
      let s = startSession(cards(1), 'mastery', 1, keepOrder);
      s = answer(s, false);
      expect(head(s)).toBe('Waza 0');
      s = answer(s, true);
      expect(isFinished(s)).toBeTrue();
    });

    it('retires a card after one right answer when the target is 1', () => {
      let s = startSession(cards(2), 'mastery', 1, keepOrder);
      s = answer(s, true);
      expect(order(s)).toEqual(['Waza 1']);
    });

    it('sends a right card to the back until it has been right `target` times', () => {
      let s = startSession(cards(2), 'mastery', 3, keepOrder);
      s = answer(s, true, true);             // each card right once
      expect(order(s)).toEqual(['Waza 0', 'Waza 1']);
      s = answer(s, true, true, true, true); // each right three times
      expect(isFinished(s)).toBeTrue();
      expect(summarize(s).answers).toBe(6);
    });

    it('does not reset the count on a miss', () => {
      let s = startSession(cards(1), 'mastery', 2, keepOrder);
      s = answer(s, true, false, true);
      expect(isFinished(s)).toBeTrue();
      expect(s.tally[0]).toEqual({ right: 2, missed: 1 });
    });

    it('counts progress toward the target, not just finished cards', () => {
      let s = startSession(cards(2), 'mastery', 2, keepOrder);
      s = answer(s, true);
      const p = progress(s);
      expect(p.fraction).toBe(0.25);
      expect(p.done).toBe(0);
      s = answer(s, false, true); // Waza 1 missed, Waza 0 right again -> mastered
      expect(progress(s).done).toBe(1);
    });

    it('lists the most-missed cards first', () => {
      let s = startSession(cards(2), 'mastery', 1, keepOrder);
      s = answer(s, false, false, false, true, true);
      const missed = summarize(s).missed;
      expect(missed.map(m => [m.card.technique.title_romaji, m.times])).toEqual([['Waza 0', 2], ['Waza 1', 1]]);
    });
  });

  it('undoes the last answer, back to that card face up', () => {
    let s = startSession(cards(3), 'graded', 1, keepOrder);
    s = answer(s, true);
    s = flip(s);
    s = undo(s);
    expect(head(s)).toBe('Waza 0');
    expect(s.flipped).toBeTrue();
    expect(progress(s).right).toBe(0);
    expect(canUndo(s)).toBeFalse();
    expect(undo(s)).toBe(s);
  });
});
