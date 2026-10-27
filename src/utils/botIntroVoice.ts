import { supabase } from "@/integrations/supabase/client";
import { getSavedBotIntroUrl } from "./botIntroAssets";
import { speakDeviceText } from "./deviceSpeech";

let generation = 0;
let activeAudio: HTMLAudioElement | null = null;
let pendingTap: (() => void) | null = null;
let deviceIntro = false;

export function stopBotIntro() {
  generation += 1;
  activeAudio?.pause();
  activeAudio = null;
  if (pendingTap) window.removeEventListener("pointerdown", pendingTap);
  pendingTap = null;
  if (deviceIntro) window.speechSynthesis?.cancel();
  deviceIntro = false;
}

// Each bot introduces itself once per device: a lifelike recording (made once with ElevenLabs, never Lovable AI),
// or the device's free built-in voice when no recording is available.
const key = (slug: string, userId?: string) => `awt-bot-intro:${userId || "device"}:${slug}`;
const played = new Set<string>();

function deviceVoice(text: string) {
  deviceIntro = true;
  speakDeviceText(text, { onEnd: () => { deviceIntro = false; }, onUnavailable: () => { deviceIntro = false; } });
}

function localIntro(name: string) {
  return `Welcome, traveler. You have unlocked ${name}. Tell me what you want to create, solve or explore, type it in the text field below, and together we will begin.`;
}

export async function playBotIntro({ slug, name, voice, userId, custom }: { slug: string; name: string; voice: string; userId?: string; custom?: boolean }) {
  const k = key(slug, userId);
  if (played.has(k)) return;
  try { if (localStorage.getItem(k) === "1") return; } catch { /* memory only */ }
  stopBotIntro();
  const current = generation;
  played.add(k);
  try { localStorage.setItem(k, "1"); } catch { /* memory only */ }
  if (custom) { deviceVoice(localIntro(name)); return; }
  let text = localIntro(name);
  try {
    const savedUrl = getSavedBotIntroUrl(slug, voice);
    const data = savedUrl
      ? { url: savedUrl, text }
      : (await supabase.functions.invoke("bot-intro-voice", { body: { slug, voice } })).data;
    if (current !== generation) return;
    if (data?.text) text = data.text;
    if (data?.url) {
      const audio = new Audio(data.url);
      activeAudio = audio;
      try { await audio.play(); return; } catch {
        // Browser blocked sound until a tap: play on the next tap anywhere.
        if (current !== generation) return;
        const resume = () => {
          pendingTap = null;
          if (current !== generation) return;
          void audio.play().catch(() => { if (current === generation) deviceVoice(text); });
        };
        pendingTap = resume;
        window.addEventListener("pointerdown", resume, { once: true });
        return;
      }
    }
  } catch { /* fall through to device voice */ }
  if (current === generation) deviceVoice(text);
}
