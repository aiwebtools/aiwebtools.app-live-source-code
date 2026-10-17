const shown = new Set<string>();
export const commercialKey = (slug: string, userId?: string) => `awt-bot-commercial:${userId || "device"}:${slug}`;
export function hasSeenCommercial(slug: string, userId?: string): boolean {
  const key = commercialKey(slug, userId);
  if (shown.has(key)) return true;
  try { return localStorage.getItem(key) === "1"; } catch { return false; }
}
export function markCommercialSeen(slug: string, userId?: string) {
  const key = commercialKey(slug, userId); shown.add(key);
  try { localStorage.setItem(key, "1"); } catch { /* memory fallback */ }
}
export function commercialEmbed(url: string): string | null {
  try {
    const parsed = new URL(url);
    const id = parsed.hostname === "youtu.be" ? parsed.pathname.slice(1) : /^(www\.)?youtube\.com$/.test(parsed.hostname) ? parsed.searchParams.get("v") || parsed.pathname.match(/\/(?:embed|shorts)\/([^/]+)/)?.[1] : null;
    return id && /^[\w-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&playsinline=1&rel=0` : null;
  } catch { return null; }
}
export async function getBotCommercial(toolTitle: string | null, name: string): Promise<string | null> {
  const { allTools } = await import("@/data/toolsData");
  const target = (toolTitle || name).trim().toLowerCase();
  const tool = allTools.find((t) => t.title.trim().toLowerCase() === target && t.videoUrl && t.tags?.some((tag) => /aiwebtools/i.test(tag)));
  return tool?.videoUrl || null;
}
