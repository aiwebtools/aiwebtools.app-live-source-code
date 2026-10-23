import { supabase } from "@/integrations/supabase/client";
import { getSavedBotIntroUrl } from "./botIntroAssets";

// Each bot introduces itself once per device: a lifelike recording (made once with ElevenLabs, never Lovable AI),
// or the device's free built-in voice when no recording is available.
const key = (slug: string, userId?: string) => `awt-bot-intro:${userId || "device"}:${slug}`;
const played = new Set<string>();

function deviceVoice(text: string) {
  if (!("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.95;
  window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
}

function localIntro(name: string) {
  return `Welcome, traveler. You have unlocked ${name}. Tell me what you want to create, solve or explore, type it in the text field below, and together we will begin.`;
}

export async function playBotIntro({ slug, name, voice, userId, custom }: { slug: string; name: string; voice: string; userId?: string; custom?: boolean }) {
  const k = key(slug, userId);
  if (played.has(k)) return;
  try { if (localStorage.getItem(k) === "1") return; } catch { /* memory only */ }
  played.add(k);
  try { localStorage.setItem(k, "1"); } catch { /* memory only */ }
  if (custom) { deviceVoice(localIntro(name)); return; }
  let text = localIntro(name);
  try {
    const savedUrl = getSavedBotIntroUrl(slug, voice);
    const data = savedUrl
      ? { url: savedUrl, text }
      : (await supabase.functions.invoke("bot-intro-voice", { body: { slug, voice } })).data;
    if (data?.text) text = data.text;
    if (data?.url) {
      const audio = new Audio(data.url);
      try { await audio.play(); return; } catch {
        // Browser blocked sound until a tap: play on the next tap anywhere.
        const resume = () => { void audio.play().catch(() => deviceVoice(text)); };
        window.addEventListener("pointerdown", resume, { once: true });
        return;
      }
    }
  } catch { /* fall through to device voice */ }
  deviceVoice(text);
}
