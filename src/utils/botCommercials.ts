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
    return id && /^[\w-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=0&playsinline=1&rel=0&enablejsapi=1` : null;
  } catch { return null; }
}
export async function getBotCommercial(toolTitle: string | null, name: string): Promise<string | null> {
  console.log("[commercial] getBotCommercial start", { toolTitle, name });
  const { allTools } = await import("@/data/toolsData");
  console.log("[commercial] allTools loaded", allTools.length);
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const own = allTools.filter((t) => t.videoUrl && t.tags?.some((tag) => /aiwebtools/i.test(tag)));
  // Version/variant rooms share their family's single commercial (e.g. every Time Machine / Father Time room).
  const family = /father.?time|time.?machine/i.test(name) && !/black|native|unwritten/i.test(name) ? "time machine gpt" : null;
  const targets = [family, toolTitle, name].filter(Boolean).map((s) => norm(s as string));
  for (const target of targets) {
    const exact = own.find((t) => norm(t.title) === target);
    if (exact) return exact.videoUrl!;
  }
  const n = norm(name);
  const partial = own.filter((t) => norm(t.title).length >= 10 && n.includes(norm(t.title))).sort((a, b) => b.title.length - a.title.length)[0];
  return partial?.videoUrl || null;
}
