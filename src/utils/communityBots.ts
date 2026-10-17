import { communityBotName, communityBotImage } from "./communityBotIdentity";
import { supabase } from "@/integrations/supabase/client";
import { getOffGridBotMetadata } from "./offGridBots";

export interface CommunityBotTool {
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  categoryPath: string;
  tags: string[];
  isCommunityGpt: true;
}

// Bundled branded images for bots published before automatic image generation.
const bundled = import.meta.glob("@/assets/community-bots/*.jpg", { eager: true, query: "?url", import: "default" }) as Record<string, string>;
const BUNDLED: Record<string, string> = {};
for (const [path, url] of Object.entries(bundled)) { const filename = path.split("/").pop(); if (filename) BUNDLED[filename.replace(/\.jpg$/, "")] = url; }

let cache: CommunityBotTool[] | null = null;
let pending: Promise<CommunityBotTool[]> | null = null;

/** Approved community GPTs (passed the AI ethics review), shaped like directory tools. */
type Row = { slug: string; display_name: string; tagline: string | null; image_url?: string | null };
async function fetchCommunityRows(): Promise<Row[]> {
  const rows: Row[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from("gpt_apps").select("slug, display_name, tagline, image_url").like("slug", "community-%").eq("is_active", true).order("created_at", { ascending: false }).order("slug").range(from, from + 999);
    if (error) throw error;
    rows.push(...((data ?? []) as Row[]));
    if (!data || data.length < 1000) break;
  }
  return rows;
}

/** Community GPTs shaped like directory tools. Archived extra versions (-vN) open from their base bot's room. */
export function loadCommunityBots(): Promise<CommunityBotTool[]> {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = fetchCommunityRows().then((data) => {
      pending = null;
      cache = data.filter((b) => !/-v\d+$/.test(b.slug)).map((b) => ({
        title: communityBotName(b.slug, b.display_name),
        description: (b.tagline || "Community GPT").replace(/\s*·\s*Community GPT$/, "") + " — a community AI assistant published on AIWebTools.",
        category: "Community GPTs",
        imageUrl: b.image_url || communityBotImage(b.slug) || BUNDLED[b.slug] || undefined,
        categoryPath: `/app/${b.slug}`,
        tags: ["community gpt", "custom gpt", "ai assistant", "chatbot", ...(getOffGridBotMetadata(b.slug)?.tags || []), ...communityBotName(b.slug, b.display_name).toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2)],
        isCommunityGpt: true as const,
      }));
      return cache;
    }).catch(() => { pending = null; return []; });
  }
  return pending;
}

export const getBundledCommunityImage = (slug: string): string | undefined => communityBotImage(slug) || BUNDLED[slug];

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
