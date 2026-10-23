export function resolveVerifiedBotMedia(source: string | null | undefined, byFilename: Record<string, string>): string | undefined {
  if (!source) return undefined;
  const prefix = "https://huupailptzvcykyqdkar.supabase.co/storage/v1/object/public/tool-images/community-bots/";
  if (!source.startsWith(prefix)) return source;
  return byFilename[source.slice(prefix.length)] || source;
}