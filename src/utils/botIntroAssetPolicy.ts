const voices = new Set(["fable", "echo", "onyx", "ash", "ballad", "sage", "coral", "nova", "shimmer", "alloy", "verse"]);

export function resolveBotIntroAsset(slug: string, voice: string, recordings: Record<string, string>): string | undefined {
  if (!/^[a-z0-9-]{1,120}$/.test(slug)) return undefined;
  const selectedVoice = voices.has(voice) ? voice : "alloy";
  return recordings[`${slug}-${selectedVoice}-v1.mp3`];
}