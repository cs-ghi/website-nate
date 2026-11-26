import { JudoTechnique } from '../../../interfaces/judo.model';
import { buildCards, countWithoutVideo } from './build-cards';

function technique(romaji: string, youtube_id?: string): JudoTechnique {
  return {
    title_en: romaji, title_romaji: romaji, title_kanji: '技', youtube_id,
    category: 'tachi-waza', sub_category: 'Te-waza', is_kata: false, is_theory: false,
  };
}

describe('buildCards', () => {
  it('makes one card per technique, however it is spelled', () => {
    const cards = buildCards([technique('Seoi Nage'), technique('Seoi-nage'), technique('De Ashi Barai'),
      technique('De-ashi-harai')], ['japanese']);
    expect(cards.map(c => c.id)).toEqual(['seoinage', 'deashiharai']);
  });

  it('falls back to the Japanese name when Video is the only front and there is no video', () => {
    const cards = buildCards([technique('Mae Ukemi')], ['video']);
    expect(cards[0].face).toBe('japanese');
  });

  it('only picks fronts the technique can show', () => {
    const faces = new Set(Array.from({ length: 20 }, (_, i) =>
      buildCards([technique('Mae Ukemi')], ['video', 'english'], () => i / 20)[0].face));
    expect([...faces]).toEqual(['english']);
  });

  it('picks among the chosen fronts at random', () => {
    const pick = (r: number) => buildCards([technique('Ogoshi', 'x')], ['video', 'english'], () => r)[0].face;
    expect(pick(0.1)).toBe('video');
    expect(pick(0.9)).toBe('english');
  });

  it('names the other techniques that share a video, when the front is the video', () => {
    const cards = buildCards([technique('Seoi Nage', 'v1'), technique('Morote Seoi Nage', 'v1'),
      technique('Ogoshi', 'v2')], ['video']);
    expect(cards.map(c => c.sameClip)).toEqual([['Morote Seoi Nage'], ['Seoi Nage'], []]);
    expect(buildCards([technique('Seoi Nage', 'v1'), technique('Morote Seoi Nage', 'v1')], ['english'])[0].sameClip)
      .toEqual([]);
  });

  it('counts distinct techniques without a video', () => {
    expect(countWithoutVideo([technique('Mae Ukemi'), technique('Mae-ukemi'), technique('Ogoshi', 'x')])).toBe(1);
  });
});
