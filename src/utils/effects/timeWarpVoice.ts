// Reuse one buffered clip; rapid download clicks never stack announcements.
let audio: HTMLAudioElement | null = null;
let lastStarted = 0;
function getAudio() {
  if (typeof window === "undefined") return null;
  if (!audio) {
    audio = new Audio("/sounds/time-warp-voice.mp3");
    audio.preload = "auto";
    audio.volume = 0.85;
    audio.load();
  }
  return audio;
}
getAudio();
export function playTimeWarpVoice() {
  const clip = getAudio();
  if (!clip) return null;
  const now = Date.now();
  if (now - lastStarted < 1200 || (!clip.paused && !clip.ended)) return clip;
  lastStarted = now;
  clip.currentTime = 0;
  // Called synchronously within user clicks, respecting browser audio permissions.
  void clip.play().catch(() => { lastStarted = 0; });
  return clip;
}

// Catch every internal bot link, including directory, menus and keyboard clicks.
if (typeof document !== "undefined") {
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest("a[href]");
    if (!link) return;
    const href = link.getAttribute("href") || "";
    if (href.startsWith("/app/") || href.includes("#try-bot")) playTimeWarpVoice();
  }, { capture: true });
}
