/**
 * Pinyin tone conversion utility
 * Converts numbered pinyin (e.g., "ni3 hao3") to tone-marked pinyin (e.g., "nǐ hǎo")
 */

// Tone mark mappings for each vowel
const toneMark: { [key: string]: string[] } = {
  'a': ['ā', 'á', 'ǎ', 'à', 'a'],
  'e': ['ē', 'é', 'ě', 'è', 'e'],
  'i': ['ī', 'í', 'ǐ', 'ì', 'i'],
  'o': ['ō', 'ó', 'ǒ', 'ò', 'o'],
  'u': ['ū', 'ú', 'ǔ', 'ù', 'u'],
  'ü': ['ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'],
  'A': ['Ā', 'Á', 'Ǎ', 'À', 'A'],
  'E': ['Ē', 'É', 'Ě', 'È', 'E'],
  'I': ['Ī', 'Í', 'Ǐ', 'Ì', 'I'],
  'O': ['Ō', 'Ó', 'Ǒ', 'Ò', 'O'],
  'U': ['Ū', 'Ú', 'Ǔ', 'Ù', 'U'],
  'Ü': ['Ǖ', 'Ǘ', 'Ǚ', 'Ǜ', 'Ü'],
};

/**
 * Converts numbered pinyin to tone-marked pinyin
 * @param numbered - Pinyin with numeric tone markers (e.g., "ni3 hao3 ma5")
 * @returns Pinyin with tone marks (e.g., "nǐ hǎo ma")
 */
export function numberedToTones(numbered: string): string {
  // Pattern matches syllables with tone numbers: word characters followed by 1-5
  const pattern = /([a-züÜ]+)([1-5])/g;

  return numbered.replace(pattern, (match, syllable, tone) => {
    const toneNum = parseInt(tone, 10);
    return applyTone(syllable, toneNum);
  });
}

/**
 * Applies the tone mark to the correct vowel in a syllable
 * Rules for tone placement:
 * 1. If 'a' or 'e' is present, it takes the tone
 * 2. If 'ou' is present, 'o' takes the tone
 * 3. Otherwise, the last vowel takes the tone
 */
function applyTone(syllable: string, tone: number): string {
  if (tone < 1 || tone > 5) {
    return syllable;
  }

  const chars = syllable.split('');
  let toneIndex = -1;

  // Find the vowel that should receive the tone mark
  for (let i = 0; i < chars.length; i++) {
    const lower = chars[i].toLowerCase();

    // Rule 1: 'a' or 'e' always gets the tone
    if (lower === 'a' || lower === 'e') {
      toneIndex = i;
      break;
    }

    // Rule 2: in 'ou', 'o' gets the tone
    if (lower === 'o' && i + 1 < chars.length && chars[i + 1].toLowerCase() === 'u') {
      toneIndex = i;
      break;
    }
  }

  // Rule 3: If no 'a', 'e', or 'ou', find the last vowel
  if (toneIndex === -1) {
    for (let i = chars.length - 1; i >= 0; i--) {
      if (isVowel(chars[i])) {
        toneIndex = i;
        break;
      }
    }
  }

  // Apply the tone mark
  if (toneIndex !== -1 && toneIndex < chars.length) {
    const vowel = chars[toneIndex];
    const marks = toneMark[vowel];
    if (marks && tone - 1 < marks.length) {
      chars[toneIndex] = marks[tone - 1];
    }
  }

  return chars.join('');
}

/**
 * Checks if a character is a vowel (including ü)
 */
function isVowel(char: string): boolean {
  const lower = char.toLowerCase();
  return lower === 'a' || lower === 'e' || lower === 'i' ||
         lower === 'o' || lower === 'u' || lower === 'ü';
}
