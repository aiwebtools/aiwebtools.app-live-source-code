// Builds each bot's spoken welcome from its stored name and purpose (no AI call).
const clean = (s: string) => s.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}]/gu, "").replace(/\s+/g, " ").trim();

export const VOICE_MAP: Record<string, string> = {
  fable: "JBFqnCBsd6RMkjVDRZzb", // George – warm mature narrator
  echo: "onwK4e9ZLuTAKqWW03F9", // Daniel – thoughtful
  onyx: "nPczCjzI2devNBz1zQrb", // Brian – deep, steady
  ash: "iP95p4xoKVk53GoZ742B", // Chris – plainspoken
  ballad: "N2lVS1w4EtoT3dr4eOWO", // Callum – contemplative
  sage: "XrExE9yKIg1WjnnlVkGX", // Matilda – calm
  coral: "cgSgspJ2msm6clMCkdW9", // Jessica – expressive
  nova: "EXAVITQu4vr4xnSDxMaL", // Sarah – bright teacher
  shimmer: "Xb7hH8MSUJpSbSDYk0k2", // Alice – gentle feminine
  alloy: "CwhRBWXzGAHq8TQ4Fs17", // Roger – friendly concierge
  verse: "TX3LPaxmHKxFdv7VOQHJ", // Liam – energetic
};

// Community titles carry dates/version notes ("FINAL 9-14-2024 works excellent"); speak a clean name.
export function speakableName(name: string): string {
  const n = clean(name).replace(/[_|]/g, " ").replace(/\b\d{1,4}([-/.]\d{1,4})*\b/g, " ")
    .replace(/\b(final|amazing|perfect|works?|excellent|new|latest|version|historically accurate|v\d*|copy|updated?)\b/gi, " ")
    .replace(/[-–(),]+\s*$/g, "").replace(/\s+/g, " ").trim();
  return n.length >= 3 ? n.replace(/\b(\w)(\w*)\b/g, (_, a, b) => a.toUpperCase() + (b === b.toUpperCase() && b.length <= 3 ? b : b.toLowerCase())).replace(/\bGpt\b/g, "GPT") : clean(name);
}

export function buildBotIntro(name: string, tagline: string | null): string {
  const n = speakableName(name);
  if (/time.?machine|father.?time/i.test(n) && !/black|native|unwritten/i.test(n)) {
    return `Great Scott! Greetings, time traveler. I am Father Time, and this is Time Machine GPT, an immersive and fun way to learn history, and perhaps discover something new. Now, dear traveler, enter your coordinates in the text field below: the exact date, time, year and location you wish to travel to. Give me your destination, and at your command, we will begin our digital time-traveling adventure.`;
  }
  let purpose = clean(tagline || "").replace(/^(i am|i'm)\s+/i, "");
  const sentences = purpose.match(/[^.!?]+[.!?]+/g) || (purpose ? [purpose + "."] : []);
  purpose = sentences.slice(0, 2).join(" ").trim();
  if (purpose.length > 320) purpose = purpose.slice(0, 317).replace(/\s+\S*$/, "") + "...";
  return [
    `Welcome, traveler. You have unlocked ${n}.`,
    purpose || `I am your dedicated guide, built by AI Web Tools to help you with everything this tool was made for.`,
    `Tell me what you want to create, solve or explore, type it in the text field below, and together we will begin.`,
  ].join(" ");
}
