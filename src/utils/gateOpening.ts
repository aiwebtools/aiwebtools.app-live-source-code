export type GateClip = { id: string; title: string; kind?: string; format?: string; durationSeconds?: number | null };

/** Where the opening video's "view the full channel" button leads. */
export const MTV_CHANNEL_PATH = "/music-stream";

/** A verified active-frame ending closes even if YouTube's earlier playing notice was missed. */
export function gateOpeningEventAction(event: { state?: number; error?: number } | null): "play" | "finish" | null {
  if (!event) return null;
  if (event.error || event.state === 0) return "finish";
  if (event.state === 1) return "play";
  return null;
}

/** The caller supplies the shared music-only catalog, never the audiobook collection. */
export function selectGateShort(videos: readonly GateClip[], random = Math.random): GateClip | null {
  const shorts = videos.filter(video => (video.kind === "music" || /\bmusic video\b/i.test(video.title)) && (video.format === "shorts" || (
    typeof video.durationSeconds === "number" && video.durationSeconds > 0 && video.durationSeconds <= 60
  )));
  if (!shorts.length) return null;
  const index = Math.min(shorts.length - 1, Math.max(0, Math.floor(random() * shorts.length)));
  return shorts[index] ?? null;
}