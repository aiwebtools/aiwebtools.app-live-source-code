/** Hold utterances until completion: mobile engines can otherwise garbage-collect them. */
const activeUtterances = new Set<SpeechSynthesisUtterance>();

/** Prefer installed enhanced/natural English voices, without choosing another language. */
export function selectDeviceVoice(voices: SpeechSynthesisVoice[], language = "en-US", feminine = false): SpeechSynthesisVoice | undefined {
  const matching = voices.filter((voice) => voice.lang.toLowerCase().split(/[-_]/)[0] === language.toLowerCase().split(/[-_]/)[0]);
  const score = (voice: SpeechSynthesisVoice) => {
    const name = voice.name.toLowerCase();
    return (/enhanced|premium|natural|neural/.test(name) ? 100 : 0)
      + (/google|samantha|ava|karen|daniel|aaron|evan|susan|aria|jenny|guy/.test(name) ? 30 : 0)
      + (voice.lang.toLowerCase() === language.toLowerCase() ? 15 : 0)
      + (feminine && /samantha|ava|karen|susan|aria|jenny|shelley/.test(name) ? 10 : 0)
      + (voice.localService ? 5 : 0) + (voice.default ? 2 : 0);
  };
  return matching.sort((a, b) => score(b) - score(a))[0];
}

/** Prime Web Speech in the initiating gesture, separately from Web Audio. */
export function unlockDeviceSpeech(): void {
  if (!deviceSpeechAvailable()) return;
  try {
    const synth = window.speechSynthesis;
    synth.getVoices?.();
    synth.resume?.();
    const prime = new window.SpeechSynthesisUtterance(" ");
    prime.volume = 0;
    synth.speak(prime);
  } catch { /* Actual playback reports any missing speaker; text always continues. */ }
}

/** Device speech is optional: missing or broken browser APIs must never stop chat text. */
export function deviceSpeechAvailable(): boolean {
  return typeof window !== "undefined"
    && typeof window.SpeechSynthesisUtterance === "function"
    && typeof window.speechSynthesis?.speak === "function";
}

export function speakDeviceText(text: string, options: {
  onStart?: () => void;
  onEnd?: () => void;
  onUnavailable?: () => void;
  rate?: number;
  feminine?: boolean;
  signal?: AbortSignal;
} = {}): boolean {
  if (!text.trim()) return true;
  if (options.signal?.aborted) { options.onEnd?.(); return false; }
  if (!deviceSpeechAvailable()) { options.onUnavailable?.(); return false; }
  try {
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    const voice = selectDeviceVoice(window.speechSynthesis.getVoices?.() || [], utterance.lang, options.feminine);
    if (voice) utterance.voice = voice;
    utterance.rate = Math.min(1.15, Math.max(0.85, options.rate ?? 1));
    utterance.pitch = 1;
    let settled = false;
    let startTimer: ReturnType<typeof setTimeout> | undefined;
    const finish = (unavailable = false) => {
      if (settled) return;
      settled = true;
      clearTimeout(startTimer);
      activeUtterances.delete(utterance);
      options.signal?.removeEventListener("abort", abort);
      if (unavailable) options.onUnavailable?.(); else options.onEnd?.();
    };
    const abort = () => finish();
    options.signal?.addEventListener("abort", abort, { once: true });
    utterance.onstart = () => { clearTimeout(startTimer); options.onStart?.(); };
    utterance.onend = () => finish();
    utterance.onerror = () => finish(!options.signal?.aborted);
    activeUtterances.add(utterance);
    window.speechSynthesis.resume?.();
    startTimer = setTimeout(() => {
      finish(true);
      window.speechSynthesis.cancel();
    }, 8000);
    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    options.onUnavailable?.();
    return false;
  }
}