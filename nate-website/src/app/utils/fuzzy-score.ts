// Subsequence matcher over a (short) target: rewards contiguous runs and matches
// at word boundaries. Returns 0 when the query is not a subsequence of target.
// Shared by the books page and the global command palette.
export function fuzzyScore(query: string, target: string): number {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (!q) return 1;

  const idx = t.indexOf(q);
  if (idx !== -1) {
    const boundary = idx === 0 || t[idx - 1] === ' ';
    return 1000 - idx + (boundary ? 200 : 0);
  }

  let qi = 0, score = 0, lastMatch = -2;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      score += lastMatch === ti - 1 ? 5 : 1;
      if (ti === 0 || t[ti - 1] === ' ') score += 3;
      lastMatch = ti;
      qi++;
    }
  }
  return qi === q.length ? score : 0;
}

// Turn a result label into a searchable phrase: drop the `df:`/`th:` prefix and
// split the camelCase / snake key into words. `df:fourierTransform` -> "fourier
// transform", so a natural-language query matches even when the printed title is
// heavy on math.
export function humanizeLabel(label: string): string {
  const key = label.includes(':') ? label.slice(label.indexOf(':') + 1) : label;
  return key
    .replace(/[{}]/g, '')
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}
