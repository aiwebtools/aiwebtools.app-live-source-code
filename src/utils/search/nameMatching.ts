/** Search-only normalization: never changes a tool's displayed name or slug. */
export const normalizeToolName = (value: string): string => value.toLowerCase()
  .normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[^\p{L}\p{N}]+/gu, " ").trim();

export function nameMatchTier(name: string, query: string): number {
  const title = normalizeToolName(name), q = normalizeToolName(query);
  if (!q) return 0;
  if (title === q) return 4;
  if (title.replace(/\s/g, "") === q.replace(/\s/g, "")) return 3;
  if (title.startsWith(q)) return 2;
  if (title.includes(q)) return 1;
  return 0;
}

/** Bounded Damerau distance includes common adjacent-letter swaps. */
export function isNearToolWord(a: string, b: string): boolean {
  if (a === b) return true;
  if (Math.min(a.length, b.length) < 4 || Math.max(a.length, b.length) > 64) return false;
  const limit = Math.max(a.length, b.length) >= 8 ? 2 : 1;
  if (Math.abs(a.length - b.length) > limit) return false;
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  let beforePrevious = previous;
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let minimum = i;
    for (let j = 1; j <= b.length; j++) {
      let value = Math.min(previous[j] + 1, row[j - 1] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) value = Math.min(value, beforePrevious[j - 2] + 1);
      row[j] = value;
      minimum = Math.min(minimum, value);
    }
    if (minimum > limit) return false;
    beforePrevious = previous;
    previous = row;
  }
  return previous[b.length] <= limit;
}

/** Stable partition: preserve task relevance below literal-name matches. */
export function prioritizeToolNames<T>(items: T[], query: string, name: (item: T) => string): T[] {
  return items.map((item, index) => ({ item, index, tier: nameMatchTier(name(item), query) }))
    .sort((a, b) => b.tier - a.tier || a.index - b.index).map(({ item }) => item);
}