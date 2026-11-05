/**
 * PRE-RENDER ("static shell") GENERATOR
 * -----------------------------------------------------------------------------
 * Search engines were receiving an empty <div id="root"> for all 6,000+ routes,
 * so almost nothing was indexable. This script runs AFTER `vite build` and
 * writes a real, lean HTML document for every public route into dist/, each one
 * containing:
 *
 *   - per-page <title>, meta description, canonical, OG/Twitter tags
 *   - JSON-LD structured data
 *   - genuine visible content (headings, copy, links, image)
 *   - internal links so crawlers can walk the whole directory
 *
 * The normal SPA bundle is still loaded, so humans get the full app; the static
 * markup is simply what the crawler (and the very first paint) sees.
 *
 * Nothing is removed from the database and no route changes - this only ADDS
 * crawlable HTML files alongside the existing SPA fallback.
 */
import fs from "fs";
import path from "path";
import { allTools } from "../src/data/toolsData";
import { generateToolSlug } from "../src/utils/urlGenerator";
import { getSpotlights } from "../src/data/spotlights";
import { getFlagshipFeatures } from "../src/data/flagshipFeatures";
import { isExpiredHost, getYouTubeThumbnail } from "../src/utils/imageUtils";
import { blogPosts } from "../src/data/blogPostContent";
import { mainCategories } from "../src/utils/mainCategoryMapping";
import { OP_INSTRUCTION_DOCS } from "../src/data/opInstructionDocs";
import { TOTAL_TOOLS } from "../src/data/generated/toolCount";

const BASE_URL = "https://aiwebtools.app";
const DIST = path.resolve(process.cwd(), "dist");
const SOURCE_HTML = path.join(DIST, "index.html");

if (!fs.existsSync(SOURCE_HTML)) {
  console.warn("⚠️  prerender: dist/index.html not found - skipping");
  process.exit(0);
}

const builtHtml = fs.readFileSync(SOURCE_HTML, "utf-8");

// ---------------------------------------------------------------------------
// Extract only what every page genuinely needs from the built index.html:
// the hashed asset tags plus the small inline boot/analytics scripts.
// (The 50KB matrix boot-loader markup is intentionally left out of the
// pre-rendered shells so crawlers see the real content, not an overlay.)
// ---------------------------------------------------------------------------
const assetTags = (builtHtml.match(
  /<(?:script|link)\b[^>]*(?:src|href)="\/assets\/[^"]+"[^>]*>(?:<\/script>)?/g
) || []).join("\n    ");

const inlineScripts = (builtHtml.match(/<script>[\s\S]*?<\/script>/g) || [])
  // Keep only the small analytics/ads bootstraps; the large inline boot
  // watchdog belongs to the animated loader that these lean shells skip.
  .filter((s) => /googletagmanager|adsbygoogle/.test(s) && s.length < 4000)
  .join("\n    ");

const gptEngTag = (builtHtml.match(/<script[^>]*gptengineer\.js[^>]*><\/script>/) || [""])[0];

const esc = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const clean = (value?: string) => (value || "").replace(/\s+/g, " ").trim();

const truncate = (value: string, max: number) =>
  value.length <= max ? value : `${value.slice(0, max - 1).trimEnd()}…`;

interface PageInput {
  route: string;
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown>;
  body: string;
}

const CRITICAL_CSS = `
  body{margin:0;background:#030712;color:#e8ffe8;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased}
  #root{min-height:100vh;background:#030712}
  .pr{max-width:1040px;margin:0 auto;padding:28px 20px 64px}
  .pr a{color:#4ade80;text-decoration:none}
  .pr h1{font-size:clamp(1.6rem,4vw,2.6rem);line-height:1.15;margin:.2em 0 .3em;color:#7CFFB2}
  .pr h2{font-size:clamp(1.1rem,2.4vw,1.5rem);margin:1.6em 0 .4em;color:#9df5c0}
  .pr p{line-height:1.7;color:#cfe9d6;max-width:72ch}
  .pr img{max-width:100%;height:auto;border-radius:12px;border:1px solid rgba(0,255,65,.25)}
  .pr ul{line-height:1.9;padding-left:1.1rem}
  .pr nav a{margin-right:.8rem;font-size:.9rem}
  .pr .meta{color:#79a98a;font-size:.86rem}
`;

const renderPage = (page: PageInput) => {
  const canonical = `${BASE_URL}${page.route === "/" ? "/" : page.route}`;
  const image = page.image || `${BASE_URL}/og-default.jpg`;
  const title = truncate(clean(page.title), 70);
  const description = truncate(clean(page.description), 180);

  return `<!doctype html>
<html lang="en" prefix="og: https://ogp.me/ns#">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="${esc(canonical)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <meta property="og:type" content="${page.type || "website"}" />
    <meta property="og:site_name" content="AI Web Tools" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${esc(canonical)}" />
    <meta property="og:image" content="${esc(image)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@aiwebtools" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${esc(image)}" />
    <link rel="icon" type="image/png" href="/favicon-192.png" />
    <meta name="theme-color" content="#0891b2" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="preconnect" href="https://huupailptzvcykyqdkar.supabase.co" crossorigin />
    <style>${CRITICAL_CSS}</style>
${page.jsonLd ? `    <script type="application/ld+json">${JSON.stringify(page.jsonLd)}</script>` : ""}
    ${inlineScripts}
    ${assetTags}
  </head>
  <body>
    <div id="root"><main class="pr">${page.body}</main></div>
    ${gptEngTag}
  </body>
</html>
`;
};

const writePage = (page: PageInput) => {
  const relative = page.route === "/" ? "index.html" : path.join(page.route.replace(/^\//, ""), "index.html");
  const outPath = path.join(DIST, relative);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, renderPage(page), "utf-8");
};

const siteNav = `<nav class="meta"><a href="/">AI Web Tools</a> · <a href="/ai-tools">All AI Tools</a> · <a href="/features">Flagship Features</a> · <a href="/spotlights">Tool Spotlights</a> · <a href="/rankings">Rankings</a> · <a href="/blog">Blog</a></nav>`;

// ---------------------------------------------------------------------------
// 1. Tool pages
// ---------------------------------------------------------------------------
const seen = new Set<string>();
const toolEntries: Array<{ slug: string; tool: (typeof allTools)[number] }> = [];
for (const tool of allTools) {
  if (!tool?.title) continue;
  const slug = generateToolSlug(tool.title);
  if (!slug || seen.has(slug)) continue;
  seen.add(slug);
  toolEntries.push({ slug, tool });
}

const byCategory = new Map<string, Array<{ slug: string; title: string }>>();
for (const { slug, tool } of toolEntries) {
  const category = clean(tool.category) || "AI Tools";
  if (!byCategory.has(category)) byCategory.set(category, []);
  byCategory.get(category)!.push({ slug, title: tool.title });
}

let count = 0;
for (const { slug, tool } of toolEntries) {
  const category = clean(tool.category) || "AI Tools";
  const description = clean(tool.description) || `${tool.title} on the AI Web Tools directory.`;
  const siblings = (byCategory.get(category) || []).filter((s) => s.slug !== slug).slice(0, 12);
  const tags = (tool.tags || []).slice(0, 12);

  const body = `
    ${siteNav}
    <h1>${esc(tool.title)}</h1>
    <p class="meta">Category: <a href="/category/${encodeURIComponent(category)}">${esc(category)}</a>${
      tool.isFree ? " · Free to use" : ""
    }</p>
    ${tool.imageUrl ? `<p><img src="${esc(tool.imageUrl)}" alt="${esc(tool.title)} — AI tool listed on AI Web Tools" loading="lazy" width="1200" height="675" /></p>` : ""}
    ${tool.tagline ? `<p><strong>${esc(clean(tool.tagline))}</strong></p>` : ""}
    <p>${esc(description)}</p>
    ${tool.directUrl ? `<p><a href="${esc(tool.directUrl)}" rel="nofollow noopener">Open ${esc(tool.title)} →</a></p>` : ""}
    ${tags.length ? `<h2>Tags</h2><p>${tags.map((t) => esc(t)).join(" · ")}</p>` : ""}
    <h2>Similar AI tools in ${esc(category)}</h2>
    <ul>${siblings.map((s) => `<li><a href="/${s.slug}">${esc(s.title)}</a></li>`).join("")}</ul>
  `;

  writePage({
    route: `/${slug}`,
    title: `${tool.title} — ${category} AI Tool | AI Web Tools`,
    description,
    image: tool.imageUrl,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: tool.title,
      description,
      applicationCategory: category,
      url: `${BASE_URL}/${slug}`,
      ...(tool.imageUrl ? { image: tool.imageUrl } : {}),
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    body,
  });
  count += 1;
}

// ---------------------------------------------------------------------------
// 2. Spotlight write-ups (long-form back pages)
// ---------------------------------------------------------------------------
const spotlights = getSpotlights();
for (const s of spotlights) {
  const sections = s.sections
    .map(
      (section) =>
        `<h2>${esc(section.heading)}</h2><p>${esc(clean(section.body))}</p>${
          section.bullets?.length
            ? `<ul>${section.bullets.map((b) => `<li>${esc(clean(b))}</li>`).join("")}</ul>`
            : ""
        }`
    )
    .join("");

  const faq = s.faq
    .map((item) => `<h3>${esc(item.q)}</h3><p>${esc(clean(item.a))}</p>`)
    .join("");

  const body = `
    ${siteNav}
    <h1>${esc(s.title)}</h1>
    <p class="meta">${esc(s.category)} · ${esc(s.readTime)} read · Published ${esc(s.publishDate)}</p>
    ${s.imageUrl ? `<p><img src="${esc(s.imageUrl)}" alt="${esc(s.toolTitle)} — AI Web Tools spotlight" loading="lazy" width="1200" height="675" /></p>` : ""}
    <p><strong>${esc(clean(s.answer))}</strong></p>
    <p>${esc(clean(s.intro))}</p>
    <h2>Quick facts</h2>
    <ul>${s.quickFacts.map((f) => `<li><strong>${esc(f.label)}:</strong> ${esc(f.value)}</li>`).join("")}</ul>
    <p><a href="/${s.toolSlug}">Try ${esc(s.toolTitle)} on its tool page →</a></p>
    ${sections}
    <h2>Frequently asked questions</h2>
    ${faq}
    <p><a href="/category/${encodeURIComponent(s.category)}">More ${esc(s.category)} AI tools →</a></p>
  `;

  writePage({
    route: `/spotlight/${s.slug}`,
    title: s.metaTitle,
    description: s.metaDescription,
    image: s.imageUrl,
    type: "article",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          headline: s.title,
          description: s.metaDescription,
          datePublished: s.publishDate,
          author: { "@type": "Organization", name: "AI Web Tools" },
          publisher: { "@type": "Organization", name: "AI Web Tools" },
          mainEntityOfPage: `${BASE_URL}/spotlight/${s.slug}`,
          ...(s.imageUrl ? { image: s.imageUrl } : {}),
        },
        {
          "@type": "FAQPage",
          mainEntity: s.faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: clean(item.a) },
          })),
        },
      ],
    },
    body,
  });
  count += 1;
}

// ---------------------------------------------------------------------------
// 3. Blog posts
// ---------------------------------------------------------------------------
for (const post of blogPosts) {
  if (!post.slug) continue;
  const text = clean(String(post.content || "")).slice(0, 6000);
  const body = `
    ${siteNav}
    <h1>${esc(post.title)}</h1>
    <p class="meta">${esc(post.category)} · ${esc(post.readTime)} read · ${esc(post.publishDate)}</p>
    <p><strong>${esc(post.excerpt)}</strong></p>
    <p>${esc(text)}</p>
    <p><a href="/blog">All AI Web Tools articles →</a></p>
  `;
  writePage({
    route: `/blog/${post.slug}`,
    title: post.title,
    description: post.excerpt,
    type: "article",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.publishDate,
      author: { "@type": "Organization", name: "AI Web Tools" },
      mainEntityOfPage: `${BASE_URL}/blog/${post.slug}`,
    },
    body,
  });
  count += 1;
}

// ---------------------------------------------------------------------------
// 3b. Flagship long-form features (live tool embedded in the page)
// ---------------------------------------------------------------------------
const features = getFlagshipFeatures();
for (const feature of features) {
  const featureTool = allTools.find((t) => t.title === feature.toolTitle);
  const rawHero = typeof featureTool?.imageUrl === "string" ? featureTool.imageUrl.trim() : "";
  // Bundled /src/ paths and dead image hosts are not usable in static HTML.
  const heroImage =
    rawHero && !rawHero.startsWith("/src/") && !isExpiredHost(rawHero)
      ? rawHero
      : getYouTubeThumbnail(featureTool?.videoUrl);
  const sections = feature.sections
    .map(
      (section) =>
        `<h2>${esc(section.heading)}</h2>${section.body
          .map((p) => `<p>${esc(clean(p))}</p>`)
          .join("")}${
          section.bullets?.length
            ? `<ul>${section.bullets.map((b) => `<li>${esc(clean(b))}</li>`).join("")}</ul>`
            : ""
        }`
    )
    .join("");

  const faq = feature.faq.map((item) => `<h3>${esc(item.q)}</h3><p>${esc(clean(item.a))}</p>`).join("");

  const body = `
    ${siteNav}
    <h1>${esc(feature.headline)}</h1>
    <p class="meta">${esc(feature.kicker)} · ${esc(feature.category)} · ${esc(feature.readTime)} read · Published ${esc(feature.publishDate)}</p>
    <p><strong>${esc(clean(feature.deck))}</strong></p>
    ${heroImage ? `<p><img src="${esc(heroImage)}" alt="${esc(feature.toolTitle)} — custom AI tool by AIWebTools.ai" loading="lazy" width="1200" height="675" /></p>` : ""}
    <p>${esc(clean(feature.answer))}</p>
    <h2>Try ${esc(feature.toolTitle)} right here</h2>
    <p>The real, working version of ${esc(feature.toolTitle)} runs inside this article — free in the browser, no install and no account needed for a daily allowance.</p>
    <p><a href="/${feature.toolSlug}">Open the ${esc(feature.toolTitle)} tool page →</a></p>
    <h2>${esc(feature.toolTitle)} at a glance</h2>
    <ul>${feature.quickFacts.map((f) => `<li><strong>${esc(f.label)}:</strong> ${esc(f.value)}</li>`).join("")}</ul>
    ${sections}
    <h2>Frequently asked questions</h2>
    ${faq}
    <h2>More flagship features</h2>
    <ul>${features
      .filter((f) => f.slug !== feature.slug)
      .map((f) => `<li><a href="/feature/${f.slug}">${esc(f.headline)}</a></li>`)
      .join("")}</ul>
    <p><a href="/category/${encodeURIComponent(feature.category)}">More ${esc(feature.category)} →</a></p>
  `;

  writePage({
    route: `/feature/${feature.slug}`,
    title: feature.metaTitle,
    description: feature.metaDescription,
    image: heroImage,
    type: "article",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          headline: feature.headline,
          description: feature.metaDescription,
          datePublished: feature.publishDate,
          author: { "@type": "Organization", name: "AI Web Tools" },
          publisher: { "@type": "Organization", name: "AI Web Tools" },
          mainEntityOfPage: `${BASE_URL}/feature/${feature.slug}`,
          keywords: feature.keywords.join(", "),
          ...(heroImage ? { image: heroImage } : {}),
          about: {
            "@type": "SoftwareApplication",
            name: feature.toolTitle,
            applicationCategory: "AIApplication",
            operatingSystem: "Web",
            url: `${BASE_URL}/${feature.toolSlug}`,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          },
        },
        {
          "@type": "FAQPage",
          mainEntity: feature.faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: clean(item.a) },
          })),
        },
      ],
    },
    body,
  });
  count += 1;
}

writePage({
  route: "/features",
  title: "Flagship AI Tool Features — Try Each Tool Inside the Article | AI Web Tools",
  description: `${features.length} long-form features on the flagship custom AI GPTs built by AIWebTools.ai — each article has the real, working tool embedded so you can try it free.`,
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Flagship AI Tool Features",
    url: `${BASE_URL}/features`,
    numberOfItems: features.length,
  },
  body: `
    ${siteNav}
    <h1>Flagship AI Tool Features</h1>
    <p>In-depth write-ups on the flagship custom GPTs built by AIWebTools.ai. Every feature has the real, working tool embedded in the page — read the story, then try it free without leaving the article.</p>
    <ul>${features
      .map(
        (f) =>
          `<li><a href="/feature/${f.slug}">${esc(f.headline)}</a> — ${esc(clean(f.deck))}</li>`
      )
      .join("")}</ul>
  `,
});
count += 1;

// ---------------------------------------------------------------------------
// 4. Category pages
// ---------------------------------------------------------------------------
for (const [category, tools] of byCategory) {
  const listed = tools.slice(0, 120);
  const body = `
    ${siteNav}
    <h1>${esc(category)} AI Tools</h1>
    <p>Browse ${tools.length} ${esc(category)} AI tools in the AI Web Tools directory — free tools, custom GPTs, agents and assistants, updated continuously.</p>
    <ul>${listed.map((t) => `<li><a href="/${t.slug}">${esc(t.title)}</a></li>`).join("")}</ul>
    <p><a href="/ai-tools">Browse the full AI tools directory →</a></p>
  `;
  writePage({
    route: `/category/${encodeURIComponent(category)}`,
    title: `${category} AI Tools — ${tools.length} Tools | AI Web Tools`,
    description: `The best ${category} AI tools: ${listed
      .slice(0, 8)
      .map((t) => t.title)
      .join(", ")} and more.`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${category} AI Tools`,
      url: `${BASE_URL}/category/${encodeURIComponent(category)}`,
      numberOfItems: tools.length,
    },
    body,
  });
  count += 1;
}

for (const main of mainCategories) {
  const body = `
    ${siteNav}
    <h1>${esc(main.name)} AI Tools</h1>
    <p>${esc(clean((main as { description?: string }).description) || `Explore ${main.name} AI tools on AI Web Tools.`)}</p>
    <ul>${Array.from(byCategory.keys())
      .slice(0, 80)
      .map((c) => `<li><a href="/category/${encodeURIComponent(c)}">${esc(c)}</a></li>`)
      .join("")}</ul>
  `;
  writePage({
    route: `/main-category/${encodeURIComponent(main.name)}`,
    title: `${main.name} AI Tools | AI Web Tools`,
    description: `Discover ${main.name} AI tools, agents and custom GPTs in the AI Web Tools directory.`,
    body,
  });
  count += 1;
}

// ---------------------------------------------------------------------------
// 5. Directory hub pages (indexable navigation for the whole catalogue)
// ---------------------------------------------------------------------------
const hub = (
  route: string,
  title: string,
  description: string,
  body: string,
  jsonLd?: Record<string, unknown>,
) => {
  writePage({ route, title, description, body, jsonLd });
  count += 1;
};

const rankedCategories = [...byCategory.entries()].sort((a, b) => b[1].length - a[1].length);
const categoryLinks = rankedCategories
  .map(
    ([category, tools]) =>
      `<li><a href="/category/${encodeURIComponent(category)}">${esc(category)}</a> (${tools.length})</li>`,
  )
  .join("");
const toolListItems = (entries: Array<{ slug: string; title: string }>, limit: number) =>
  entries
    .slice(0, limit)
    .map((t) => `<li><a href="/${t.slug}">${esc(t.title)}</a></li>`)
    .join("");

hub(
  "/ai-tools",
  "All AI Tools — Full Directory of AI Web Tools",
  `Every AI tool listed on AI Web Tools in one place: ${toolEntries.length} real, working tools, custom GPTs, agents, assistants and open-source models, browsable by category.`,
  `
    ${siteNav}
    <h1>The Full AI Tools Directory</h1>
    <p>${toolEntries.length} AI tools are indexed in the AI Web Tools directory — custom GPTs built by AIWebTools.ai, open-source models, agents, image and video generators, coding assistants and business tools. Start with a category below or browse the listing.</p>
    <h2>Categories</h2>
    <ul>${categoryLinks}</ul>
    <h2>Featured tools</h2>
    <ul>${toolListItems(toolEntries.map((t) => ({ slug: t.slug, title: t.tool.title })), 300)}</ul>
    <p><a href="/features">Read the flagship feature write-ups →</a></p>
  `,
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "All AI Tools",
    url: `${BASE_URL}/ai-tools`,
    numberOfItems: toolEntries.length,
  },
);

hub(
  "/categories",
  "AI Tool Categories — Browse Every Category | AI Web Tools",
  `Browse the AI Web Tools directory by category: ${byCategory.size} categories covering writing, coding, image, video, health, legal, finance, spirituality and more.`,
  `
    ${siteNav}
    <h1>AI Tool Categories</h1>
    <p>The directory is organised into ${mainCategories.length} main groups and ${byCategory.size} categories. Pick one to see every AI tool listed under it.</p>
    <h2>Main groups</h2>
    <ul>${mainCategories
      .map(
        (main) =>
          `<li><a href="/main-category/${encodeURIComponent(main.name)}">${esc(main.name)}</a></li>`,
      )
      .join("")}</ul>
    <h2>All categories</h2>
    <ul>${categoryLinks}</ul>
  `,
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI Tool Categories",
    url: `${BASE_URL}/categories`,
    numberOfItems: byCategory.size,
  },
);

hub(
  "/blog",
  "AI Tools Blog — Guides, Reviews & How-Tos | AI Web Tools",
  `Guides, comparisons and how-to articles on using AI tools productively, written by the AI Web Tools team.`,
  `
    ${siteNav}
    <h1>The AI Web Tools Blog</h1>
    <p>Practical guides on getting more from AI: prompts, workflows, tool comparisons and honest notes from building the directory.</p>
    <ul>${blogPosts
      .filter((p) => p.slug)
      .map(
        (p) =>
          `<li><a href="/blog/${p.slug}">${esc(p.title)}</a> — ${esc(clean(p.excerpt))}</li>`,
      )
      .join("")}</ul>
    <p><a href="/features">Flagship feature write-ups →</a></p>
  `,
);

hub(
  "/spotlights",
  "AI Tool Spotlights — In-Depth Write-Ups | AI Web Tools",
  `Long-form spotlights on standout AI tools: what they do, how to use them well, and the questions people ask most.`,
  `
    ${siteNav}
    <h1>AI Tool Spotlights</h1>
    <p>${spotlights.length} in-depth spotlight articles on standout tools in the directory.</p>
    <ul>${spotlights
      .map(
        (s) =>
          `<li><a href="/spotlight/${s.slug}">${esc(s.title)}</a> — ${esc(clean(s.answer))}</li>`,
      )
      .join("")}</ul>
  `,
);

hub(
  "/rankings",
  "AI Tool Rankings — Most Listed Categories & Flagship GPTs | AI Web Tools",
  "Which AI categories and custom GPTs lead the AI Web Tools directory right now, ranked by how much of the catalogue they cover.",
  `
    ${siteNav}
    <h1>AI Tool Rankings</h1>
    <p>Rankings are drawn straight from the directory itself: categories ranked by how many working tools are listed, and the flagship custom GPTs our team builds and maintains.</p>
    <h2>Top categories by tools listed</h2>
    <ol>${rankedCategories
      .slice(0, 40)
      .map(
        ([category, tools]) =>
          `<li><a href="/category/${encodeURIComponent(category)}">${esc(category)}</a> — ${tools.length} tools</li>`,
      )
      .join("")}</ol>
    <h2>Flagship AIWebTools.ai GPTs</h2>
    <ol>${features
      .map(
        (f) =>
          `<li><a href="/feature/${f.slug}">${esc(f.headline)}</a> — ${esc(clean(f.deck))}</li>`,
      )
      .join("")}</ol>
    <p><a href="/ai-tools">Browse the full directory →</a></p>
  `,
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "AI Tool Rankings",
    itemListElement: rankedCategories.slice(0, 40).map(([category], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${category} AI Tools`,
      url: `${BASE_URL}/category/${encodeURIComponent(category)}`,
    })),
  },
);

const freeTools = toolEntries.filter(({ tool }) => tool.isFree);
hub(
  "/free-ai-tools",
  `Free AI Tools — ${freeTools.length} Tools You Can Use For Free | AI Web Tools`,
  `A growing list of AI tools that are free to use: free tiers, open-source models and free custom GPTs built by AIWebTools.ai.`,
  `
    ${siteNav}
    <h1>Free AI Tools</h1>
    <p>${freeTools.length} tools in the directory are listed as free to use — open-source models, free tiers and the custom GPTs AIWebTools.ai publishes with open operational instructions.</p>
    <ul>${toolListItems(freeTools.map((t) => ({ slug: t.slug, title: t.tool.title })), 250)}</ul>
    <p><a href="/ai-tools">See every AI tool →</a></p>
  `,
);

hub(
  "/best-ai-tools",
  "Best AI Tools — The Curated Short List | AI Web Tools",
  "The best AI tools to start with, hand-picked from the AI Web Tools directory: writing, images, video, coding, research and business.",
  `
    ${siteNav}
    <h1>Best AI Tools</h1>
    <p>A short, curated starting point from the directory — the tools our team features first because they do the most, for the widest range of people.</p>
    <ol>${toolListItems(toolEntries.map((t) => ({ slug: t.slug, title: t.tool.title })), 60)}</ol>
    <h2>Flagship features</h2>
    <ul>${features
      .map((f) => `<li><a href="/feature/${f.slug}">${esc(f.headline)}</a></li>`)
      .join("")}</ul>
  `,
);

hub(
  "/chatgpt-alternatives",
  "ChatGPT Alternatives — Other AI Assistants To Try | AI Web Tools",
  "ChatGPT alternatives worth trying: open-source models, Perplexity, Gemini, Claude and free custom GPTs listed in the AI Web Tools directory.",
  `
    ${siteNav}
    <h1>ChatGPT Alternatives</h1>
    <p>Other AI assistants listed in the directory, from open-source chat models to web-aware research assistants and the free custom GPTs AIWebTools.ai builds.</p>
    <h2>Assistants and chat models in the directory</h2>
    <ul>${toolListItems(
      toolEntries
        .filter(({ tool }) =>
          /(chatgpt|gpt|claude|gemini|llama|mistral|perplexity|copilot|assistant|chat)/i.test(
            `${tool.title} ${tool.category} ${(tool.tags || []).join(" ")}`,
          ),
        )
        .map((t) => ({ slug: t.slug, title: t.tool.title })),
      150,
    )}</ul>
    <p><a href="/ai-tools">Browse every AI tool →</a></p>
  `,
);

// ---------------------------------------------------------------------------
// 6. In-site bot demo rooms (/app/<slug>) — every hosted GPT, Gem and agent
// ---------------------------------------------------------------------------
const humanize = (slug: string) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((word) =>
      word.length <= 2 ? word.toUpperCase() : word[0].toUpperCase() + word.slice(1),
    )
    .join(" ");

for (const slug of Object.keys(OP_INSTRUCTION_DOCS)) {
  const name = humanize(slug);
  hub(
    `/app/${slug}`,
    `${name} — Try It Free In Your Browser | AI Web Tools`,
    `Talk to ${name} right here in the browser — a free trial chat with starter prompts, and the full operational instructions you can download and run on your own model.`,
    `
    ${siteNav}
    <h1>${esc(name)}</h1>
    <p class="meta">AI Web Tools hosted demo room · free trial chat in the browser</p>
    <p>This page runs ${esc(name)} as a live trial chat: pick one of the starter prompts or type your own message and the assistant replies instantly. No install and no account is needed for the daily free allowance.</p>
    <h2>What you get on this page</h2>
    <ul>
      <li>A working chat window with starter prompts written for this specific tool</li>
      <li>Image generation inside the chat where the tool supports it, with a progress counter</li>
      <li>A clear <strong>Send message</strong> control and full-screen mode when you want more room</li>
      <li>A gold button to download the complete operational instructions for this bot as a PDF</li>
    </ul>
    <h2>Use these instructions on your own model</h2>
    <p>Every AIWebTools.ai bot ships with its operational instructions published in full. Download them and paste them into your own AI model to run the same assistant anywhere.</p>
    <p><a href="/instructions/${encodeURIComponent(slug)}.pdf">Download the ${esc(name)} operational instructions (PDF) →</a></p>
    <h2>More places to explore</h2>
    <ul>
      <li><a href="/features">Flagship feature write-ups with the tools embedded</a></li>
      <li><a href="/ai-tools">The full AI tools directory</a></li>
      <li><a href="/categories">Browse every category</a></li>
    </ul>
  `,
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name,
      applicationCategory: "AIApplication",
      operatingSystem: "Web",
      url: `${BASE_URL}/app/${slug}`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  );
}

// ---------------------------------------------------------------------------
// 7. Homepage — the most important page the crawler ever sees
// ---------------------------------------------------------------------------
hub(
  "/",
  "AIWEBTOOLS — 5,500+ Best AI Tools Directory | Try Custom GPTs Free",
  "The largest directory of real AI tools: 5,500+ listings plus free custom GPTs you can try in the browser, with their full operational instructions to download.",
  `
    ${siteNav}
    <h1>AI Web Tools — 5,500+ AI Tools, And You Can Try Them Right Here</h1>
    <p>AI Web Tools is a directory of real, working AI tools — ${TOTAL_TOOLS.toLocaleString("en-US")} tools across ${byCategory.size} categories — and the custom GPTs AIWebTools.ai builds run free inside this site, no install and no account needed for a daily allowance.</p>
    <h2>Flagship custom GPTs — read the story, then try the tool</h2>
    <ul>${features
      .map(
        (f) =>
          `<li><a href="/feature/${f.slug}">${esc(f.headline)}</a> — ${esc(clean(f.deck))}</li>`,
      )
      .join("")}</ul>
    <h2>Most-listed categories</h2>
    <ul>${rankedCategories
      .slice(0, 30)
      .map(
        ([category, tools]) =>
          `<li><a href="/category/${encodeURIComponent(category)}">${esc(category)}</a> — ${tools.length} tools</li>`,
      )
      .join("")}</ul>
    <h2>Popular AI tools</h2>
    <ul>${toolListItems(toolEntries.map((t) => ({ slug: t.slug, title: t.tool.title })), 40)}</ul>
    <h2>Open source, in the open</h2>
    <p>Every AIWebTools.ai GPT ships with its full operational instructions published for anyone to download and run, and our code and prompts live on GitHub at <a href="https://github.com/aiwebtools" rel="noopener">github.com/aiwebtools</a>.</p>
    <p><a href="/ai-tools">Browse the full directory →</a> · <a href="/features">Flagship features →</a> · <a href="/rankings">Rankings →</a></p>
  `,
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "AI Web Tools",
        url: `${BASE_URL}/`,
        description:
          "Directory of 5,500+ real AI tools with free in-browser custom GPTs and downloadable operational instructions.",
        publisher: { "@type": "Organization", name: "AIWebTools.ai", url: BASE_URL },
        potentialAction: {
          "@type": "SearchAction",
          target: `${BASE_URL}/?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "ItemList",
        name: "Featured AI Tools",
        itemListElement: features.map((f, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: f.headline,
          url: `${BASE_URL}/feature/${f.slug}`,
        })),
      },
    ],
  },
);

console.log(`✅ prerender: ${count} static HTML pages written into dist/`);
