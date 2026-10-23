import { resolveBotIntroAsset } from "./botIntroAssetPolicy";

const pointers = import.meta.glob<{ url: string }>("../assets/bot-intros/*.mp3.asset.json", { eager: true, import: "default" });
const recordings: Record<string, string> = {};
for (const [path, pointer] of Object.entries(pointers)) {
  const filename = path.split("/").pop()?.replace(/\.asset\.json$/, "");
  // An absolute website asset address works in clones, too, without Supabase or a signed URL.
  if (filename) recordings[filename] = `https://aiwebtools.app${pointer.url}`;
}

export function getSavedBotIntroUrl(slug: string, voice: string): string | undefined {
  return resolveBotIntroAsset(slug, voice, recordings);
}