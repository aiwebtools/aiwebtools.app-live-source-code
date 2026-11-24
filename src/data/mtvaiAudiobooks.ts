import { RECENT_MTVAI_UPLOADS } from "./recentMtvaiUploads";
import { REMOVED_MTVAI_UPLOAD_IDS, isMtvaiAudiobook, isMtvaiPromotion } from "./mtvaiRemovedUploads";

// Exact public Videos listing order, verified November 5, 2026.
export const VERIFIED_MTVAI_AUDIOBOOKS = [
  { id: "-nrZhBBNChE", title: "Maya Lights the Way Home — Read-Aloud Storybook | A Galactic Gambit Story for Little Lights, Book 3" },
  { id: "FMAstSXaVVM", title: "Chasing Radiance: The Diary of Marie Curie — Audiobook Opening | Full-Cast Audiobook by KG Bastian" },
  { id: "7aFexKjrv1k", title: "Chasing Souls: The Diary of William Shakespeare — Audiobook Opening | History Resurrected" },
  { id: "nKi7ZKhfGP4", title: "Murk's Little Light — A Galactic Gambit Story for Little Lights | Read-Aloud Picture Book" },
  { id: "mxFKRIWF2Ok", title: "Chasing Wonder: The Diary of Carl Sagan — Audiobook Opening | History Resurrected" },
  { id: "oqMaMFYvqeY", title: "The Angel Inside You — Read-Aloud Storybook | A Galactic Gambit Story for Little Lights" },
  { id: "iPGIwpAnWQo", title: "Mud and Iron — Audiobook Opening" },
  { id: "Uay4-I0PA2I", title: "Chasing Light: The Diary of Albert Einstein — Audiobook Opening" },
  { id: "gsf_Ucwt1Zw", title: "Galactic Gambit — Audiobook Opening" },
  { id: "IKrEvLSewAQ", title: "Galactic Gambit: The Bet of Ages — Full Audiobook | KG Bastian" },
  { id: "EYnCtw9CsxQ", title: "Galactic Gambit AudioBook -The Angelic Watchers Written By Ai-WebTools.com - A Metaphorical Sci-Fi -" },
  { id: "k1aYXaaAkho", title: "Galactic Gambit The Bet Of The Ages. - Free Full Audiobook written by aiwebtools.ai" },
];

const PART_NUMBERS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9, x: 10 };

export function audiobookPart(title: string): { work: string; number: number } | null {
  const match = /\bpart\s+(\d+|one|two|three|four|five|six|seven|eight|nine|ten|viii|vii|iii|ii|iv|vi|ix|i|v|x)\b/i.exec(title);
  if (!match || match.index === undefined) return null;
  const number = PART_NUMBERS[match[1].toLowerCase()] ?? Number(match[1]);
  if (!Number.isInteger(number) || number < 1) return null;
  const work = title.slice(0, match.index).replace(/\b(?:full[ -]cast|full)?\s*audiobook\b/gi, "")
    .normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  return work ? { work, number } : null;
}

export function orderMtvaiAudiobooks<T extends { title: string }>(books: T[]): T[] {
  const groups = new Map<string, T[]>();
  const ordered: T[][] = [];
  for (const book of books) {
    const part = audiobookPart(book.title);
    if (!part) { ordered.push([book]); continue; }
    let group = groups.get(part.work);
    if (!group) { group = []; groups.set(part.work, group); ordered.push(group); }
    group.push(book);
  }
  return ordered.flatMap(group => group.sort((a, b) => (audiobookPart(a.title)?.number ?? 0) - (audiobookPart(b.title)?.number ?? 0)));
}

export const MTVAI_AUDIOBOOKS = orderMtvaiAudiobooks([...RECENT_MTVAI_UPLOADS.filter(isMtvaiAudiobook),
  ...VERIFIED_MTVAI_AUDIOBOOKS
].filter((v, i, all) => !REMOVED_MTVAI_UPLOAD_IDS.has(v.id) && !isMtvaiPromotion(v) && all.findIndex(item => item.id === v.id) === i));

export function nextMtvaiAudiobookPart(id: string) {
  const current = MTVAI_AUDIOBOOKS.find(book => book.id === id);
  const part = current && audiobookPart(current.title);
  if (!part) return null;
  return MTVAI_AUDIOBOOKS.find(book => {
    const candidate = audiobookPart(book.title);
    return candidate?.work === part.work && candidate.number === part.number + 1;
  }) ?? null;
}

export function findMtvaiAudiobooks(query: string) {
  const words = query.toLowerCase().normalize("NFKD").replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  return MTVAI_AUDIOBOOKS.filter(v => {
    const title = v.title.toLowerCase().normalize("NFKD").replace(/[^a-z0-9\s]/g, " ");
    return words.every(word => title.includes(word));
  });
}

export function audiobookEdition(title: string) {
  if (/opening/i.test(title)) return "Opening";
  if (/read.aloud/i.test(title)) return "Read-aloud";
  if (/full audiobook/i.test(title)) return "Full audiobook";
  return "Audiobook";
}