import { RECENT_MTVAI_UPLOADS } from "./recentMtvaiUploads";

// Lead with the current shared channel additions, then retain the original
// cinematic two-long/one-short rotation for the remaining legacy gallery.
export function buildMtvaiMusicOrder<T extends { id: string; title: string }>(gallery: T[]): T[] {
  const byId = new Map<string, T>();
  for (const video of gallery) if (!byId.has(video.id)) byId.set(video.id, video);
  const lead: T[] = [];
  for (const upload of RECENT_MTVAI_UPLOADS) {
    const video = byId.get(upload.id);
    if (video) { lead.push(video); byId.delete(upload.id); }
  }
  const shorts: T[] = [];
  const longs: T[] = [];
  for (const video of byId.values()) {
    (/\b(short|interlude|commercial)\b/i.test(video.title) ? shorts : longs).push(video);
  }
  const legacy: T[] = [];
  for (let long = 0, short = 0; long < longs.length || short < shorts.length;) {
    for (let n = 0; n < 2 && long < longs.length; n++) legacy.push(longs[long++]);
    if (short < shorts.length) legacy.push(shorts[short++]);
  }
  return [...lead, ...legacy];
}

// Fisher-Yates shuffle so every MTVAI queue plays in a fresh random order
// each visit/round — never the same sequence twice in a row. When
// `avoidFirstId` is given (the track that just finished), the shuffled queue
// never opens with it, so back-to-back rounds cannot repeat the same video.
export function shuffleMtvaiOrder<T extends { id: string }>(items: T[], avoidFirstId?: string): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  if (avoidFirstId && shuffled.length > 1 && shuffled[0].id === avoidFirstId) {
    const swap = 1 + Math.floor(Math.random() * (shuffled.length - 1));
    [shuffled[0], shuffled[swap]] = [shuffled[swap], shuffled[0]];
  }
  return shuffled;
}