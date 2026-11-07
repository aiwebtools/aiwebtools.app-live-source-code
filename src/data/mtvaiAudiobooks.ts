import { RECENT_MTVAI_UPLOADS } from "./recentMtvaiUploads";

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

export const MTVAI_AUDIOBOOKS = [...RECENT_MTVAI_UPLOADS.filter(v => v.kind === "audiobook"),
  ...VERIFIED_MTVAI_AUDIOBOOKS
].filter((v, i, all) => all.findIndex(item => item.id === v.id) === i);

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