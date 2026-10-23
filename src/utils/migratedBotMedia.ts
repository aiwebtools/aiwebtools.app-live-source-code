import { resolveVerifiedBotMedia } from "./migratedBotMediaPolicy";
type AssetPointer = { url: string };

// Only exact, verified copies are eligible; newer uploads keep their own URL.
const pointers = import.meta.glob<AssetPointer>("../assets/migrated-bots/*.asset.json", { eager: true, import: "default" });
const compressed = import.meta.glob<AssetPointer>("../assets/compressed-bots/*.webp.asset.json", { eager: true, import: "default" });
const migratedByFilename: Record<string, string> = {};
for (const [path, pointer] of Object.entries(pointers)) {
  const filename = path.split("/").pop()?.replace(/\.asset\.json$/, "");
  if (filename) migratedByFilename[filename] = `https://aiwebtools.app${pointer.url}`;
}
for (const [path, pointer] of Object.entries(compressed)) {
  const filename = path.split("/").pop()?.replace(/\.webp\.asset\.json$/, "");
  if (filename) migratedByFilename[filename] = `https://aiwebtools.app${pointer.url}`;
}

export function resolveMigratedBotMedia(source: string | null | undefined): string | undefined {
  return resolveVerifiedBotMedia(source, migratedByFilename);
}