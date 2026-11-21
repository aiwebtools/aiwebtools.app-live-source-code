/** A quality preference, not a guarantee: YouTube may select another available resolution. */
export const VIDEO_QUALITY = "hd1080";

export const youtubePlaybackUrl = (url: string): string => {
  const parsed = new URL(url);
  parsed.searchParams.set("autoplay", "1");
  parsed.searchParams.set("mute", "0");
  parsed.searchParams.set("playsinline", "1");
  parsed.searchParams.set("enablejsapi", "1");
  parsed.searchParams.set("vq", VIDEO_QUALITY);
  return parsed.toString();
};

/** Only call on startup or an explicit play gesture; never continuously override user controls. */
export const startYouTubeWithSound = (frame: HTMLIFrameElement | null, quality = true) => {
  if (!frame?.contentWindow) return;
  const origin = new URL(frame.src).origin;
  const send = (func: string, args: unknown[] = []) =>
    frame.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args }), origin);
  if (quality) send("setPlaybackQuality", [VIDEO_QUALITY]);
  send("unMute");
  send("setVolume", [100]);
  send("playVideo");
};