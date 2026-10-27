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
} = {}): boolean {
  if (!text.trim()) return true;
  if (!deviceSpeechAvailable()) { options.onUnavailable?.(); return false; }
  try {
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.rate = 1.02;
    utterance.pitch = 1;
    utterance.onstart = () => options.onStart?.();
    utterance.onend = () => options.onEnd?.();
    utterance.onerror = () => options.onUnavailable?.();
    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    options.onUnavailable?.();
    return false;
  }
}