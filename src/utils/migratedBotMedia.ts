type AssetPointer = { url: string };

// Only exact, verified copies are eligible; newer uploads keep their own URL.
const pointers = import.meta.glob<AssetPointer>("../assets/migrated-bots/*.asset.json", { eager: true, import: "default" });
const migratedByFilename: Record<string, string> = {};
for (const [path, pointer] of Object.entries(pointers)) {
  const filename = path.split("/").pop()?.replace(/\.asset\.json$/, "");
  if (filename) migratedByFilename[filename] = pointer.url;
}

export function resolveMigratedBotMedia(source: string | null | undefined): string | undefined {
  if (!source) return undefined;
  const prefix = "https://huupailptzvcykyqdkar.supabase.co/storage/v1/object/public/tool-images/community-bots/";
  if (!source.startsWith(prefix)) return source;
  const filename = source.slice(prefix.length);
  return migratedByFilename[filename] || source;
}