import { supabase } from "@/integrations/supabase/client";

export interface CommunityBotTool {
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  categoryPath: string;
  tags: string[];
  isCommunityGpt: true;
}

let cache: CommunityBotTool[] | null = null;
let pending: Promise<CommunityBotTool[]> | null = null;

/** Approved community GPTs (passed the AI ethics review), shaped like directory tools. */
export function loadCommunityBots(): Promise<CommunityBotTool[]> {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = Promise.resolve(
      supabase.from("gpt_apps").select("slug, display_name, tagline, image_url").like("slug", "community-%").eq("is_active", true).order("created_at", { ascending: false }).limit(500),
    ).then(({ data, error }) => {
      pending = null;
      if (error) return [];
      cache = (data ?? []).map((b: { slug: string; display_name: string; tagline: string | null; image_url?: string | null }) => ({
        title: b.display_name,
        description: (b.tagline || "Community GPT").replace(/\s*·\s*Community GPT$/, "") + " — a community-built AI assistant, ethics-reviewed and published on AIWebTools.",
        category: "Community GPTs",
        imageUrl: b.image_url || undefined,
        categoryPath: `/app/${b.slug}`,
        tags: ["community gpt", "custom gpt", "ai assistant", "chatbot"],
        isCommunityGpt: true as const,
      }));
      return cache;
    });
  }
  return pending;
}

export function getCommunityBotsSync() { return cache; }

export function matchCommunityBots(bots: CommunityBotTool[] | null, query: string): CommunityBotTool[] {
  const q = query.trim().toLowerCase();
  if (!bots || q.length < 2) return [];
  const words = q.split(/\s+/);
  return bots.filter((b) => {
    const hay = `${b.title} ${b.description} ${b.tags.join(" ")}`.toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}
