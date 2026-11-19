export type GateClip = { id: string; title: string; kind?: string; format?: string; durationSeconds?: number | null };

/** The caller supplies the shared music-only catalog, never the audiobook collection. */
export function selectGateShort(videos: readonly GateClip[], random = Math.random): GateClip | null {
  const shorts = videos.filter(video => (video.kind === "music" || /\bmusic video\b/i.test(video.title)) && (video.format === "shorts" || (
    typeof video.durationSeconds === "number" && video.durationSeconds > 0 && video.durationSeconds <= 60
  )));
  if (!shorts.length) return null;
  const index = Math.min(shorts.length - 1, Math.max(0, Math.floor(random() * shorts.length)));
  return shorts[index] ?? null;
}