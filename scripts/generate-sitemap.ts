/**
 * Generates public/sitemap.xml using real SEO-friendly slug URLs
 * (matches the routes rendered by ToolDetail.tsx / /:toolSlug).
 *
 * Run with: bunx vite-node scripts/generate-sitemap.ts
 */
import fs from "fs";
import path from "path";
import { allTools } from "../src/data/toolsData";
import { generateToolSlug } from "../src/utils/urlGenerator";
import { getSpotlights } from "../src/data/spotlights";
import { getFlagshipFeatures } from "../src/data/flagshipFeatures";
import { blogPosts } from "../src/data/blogPostContent";
import { mainCategories } from "../src/utils/mainCategoryMapping";

const BASE_URL = "https://aiwebtools.app";

const staticRoutes: Array<{ path: string; priority: string; changefreq: string }> = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/mtvai", priority: "0.9", changefreq: "weekly" },
  { path: "/ai-tools", priority: "0.9", changefreq: "daily" },
  { path: "/ai-tools-hub", priority: "0.9", changefreq: "weekly" },
  { path: "/ai-agents-directory", priority: "0.9", changefreq: "weekly" },
  { path: "/chatgpt-alternatives", priority: "0.8", changefreq: "weekly" },
  { path: "/best-ai-tools", priority: "0.9", changefreq: "weekly" },
  { path: "/free-ai-tools", priority: "0.9", changefreq: "weekly" },
  { path: "/ai-writing-tools", priority: "0.8", changefreq: "weekly" },
  { path: "/ai-web-tools", priority: "0.8", changefreq: "weekly" },
  { path: "/blog", priority: "0.8", changefreq: "weekly" },
  { path: "/spotlights", priority: "0.9", changefreq: "weekly" },
  { path: "/rankings", priority: "0.9", changefreq: "daily" },
  { path: "/digest", priority: "0.8", changefreq: "weekly" },
  { path: "/gaming-entertainment", priority: "0.8", changefreq: "weekly" },
  { path: "/faq", priority: "0.7", changefreq: "monthly" },
  { path: "/our-story", priority: "0.6", changefreq: "monthly" },
  { path: "/privacy-policy", priority: "0.4", changefreq: "yearly" },
  { path: "/disclaimers", priority: "0.4", changefreq: "yearly" },
  { path: "/submit-tool", priority: "0.6", changefreq: "monthly" },
  { path: "/user-submitted", priority: "0.7", changefreq: "daily" },
];

const encodePathSegment = (value: string) => encodeURIComponent(value.trim());

const used = new Set<string>();
const slugs: string[] = [];
for (const tool of allTools) {
  if (!tool?.title) continue;
  const slug = generateToolSlug(tool.title);
  if (!slug || used.has(slug)) continue;
  used.add(slug);
  slugs.push(slug);
}

const url = (loc: string, changefreq: string, priority: string) =>
  `  <url><loc>${loc}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;

// --- section: core pages -----------------------------------------------------
const pageUrls = staticRoutes.map((r) => url(`${BASE_URL}${r.path}`, r.changefreq, r.priority));

// --- section: categories -----------------------------------------------------
const toolCategories = Array.from(
  new Set(allTools.map((tool) => tool.category?.trim()).filter((category): category is string => Boolean(category)))
).sort((a, b) => a.localeCompare(b));
const categoryUrls = [
  ...toolCategories.map((c) => url(`${BASE_URL}/category/${encodePathSegment(c)}`, "weekly", "0.7")),
  ...mainCategories.map((c) => url(`${BASE_URL}/main-category/${encodePathSegment(c.name)}`, "weekly", "0.8")),
];

// --- section: tools ----------------------------------------------------------
const toolUrls = slugs.map((slug) => url(`${BASE_URL}/${slug}`, "weekly", "0.8"));

// --- section: blog -----------------------------------------------------------
const blogSlugs = new Set<string>();
const blogUrls: string[] = [];
for (const post of blogPosts) {
  if (!post.slug || blogSlugs.has(post.slug)) continue;
  blogSlugs.add(post.slug);
  blogUrls.push(url(`${BASE_URL}/blog/${encodePathSegment(post.slug)}`, "monthly", "0.7"));
}

// --- section: spotlights (long-form "back pages") ----------------------------
const spotlights = getSpotlights();
const spotlightUrls = spotlights.map((s) => url(`${BASE_URL}/spotlight/${s.slug}`, "monthly", "0.8"));

// --- section: flagship features (each embeds the live tool) ------------------
const features = getFlagshipFeatures();
const featureUrls = [
  url(`${BASE_URL}/features`, "weekly", "0.9"),
  ...features.map((f) => url(`${BASE_URL}/feature/${f.slug}`, "weekly", "0.9")),
];

// ---------------------------------------------------------------------------
// Write one sitemap file per section (tools chunked) plus a sitemap index at
// /sitemap.xml, so search engines can fetch and report on each group.
// ---------------------------------------------------------------------------
const publicDir = path.resolve(process.cwd(), "public");
const today = new Date().toISOString().slice(0, 10);
const written: Array<{ file: string; count: number }> = [];

const writeSitemap = (file: string, entries: string[]) => {
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    entries.join("\n") +
    `\n</urlset>\n`;
  fs.writeFileSync(path.join(publicDir, file), body, "utf-8");
  written.push({ file, count: entries.length });
};

writeSitemap("sitemap-pages.xml", pageUrls);
writeSitemap("sitemap-features.xml", featureUrls);
writeSitemap("sitemap-spotlights.xml", spotlightUrls);
writeSitemap("sitemap-blog.xml", blogUrls);
writeSitemap("sitemap-categories.xml", categoryUrls);

const CHUNK = 2000;
for (let i = 0; i < toolUrls.length; i += CHUNK) {
  writeSitemap(`sitemap-tools-${Math.floor(i / CHUNK) + 1}.xml`, toolUrls.slice(i, i + CHUNK));
}

const indexXml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  written
    .map((w) => `  <sitemap><loc>${BASE_URL}/${w.file}</loc><lastmod>${today}</lastmod></sitemap>`)
    .join("\n") +
  `\n</sitemapindex>\n`;
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), indexXml, "utf-8");

const totalUrls = written.reduce((sum, w) => sum + w.count, 0);
console.log(`✅ sitemap index written with ${written.length} sitemaps / ${totalUrls} URLs`);
for (const w of written) console.log(`   • ${w.file}: ${w.count}`);

// ---------------------------------------------------------------------------
// Generate the authoritative tool count so on-site counters never go stale.
// ---------------------------------------------------------------------------
const countOutPath = path.resolve(process.cwd(), "src/data/generated/toolCount.ts");
const totalTools = allTools.length;
// Branding rule: the public count is always "4,000+" regardless of the raw total.
const marketingTotal = "4,000+";
const categorySet = new Set(
  allTools.map((t) => (t.category || "").trim()).filter(Boolean)
);
fs.writeFileSync(
  countOutPath,
  `// AUTO-GENERATED by scripts/generate-sitemap.ts — do not edit by hand.\n` +
    `export const TOTAL_TOOLS = ${totalTools};\n` +
    `export const TOTAL_TOOL_CATEGORIES = ${categorySet.size};\n` +
    `export const MARKETING_TOOL_COUNT = "${marketingTotal}";\n`,
  "utf-8"
);
console.log(`✅ toolCount.ts written: ${totalTools} tools / ${categorySet.size} categories (${marketingTotal})`);
