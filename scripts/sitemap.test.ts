// @ts-ignore -- Bun runs project regressions.
import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { TOTAL_TOOLS } from "../src/data/generated/toolCount";

const base = "https://aiwebtools.app";
const read = (file: string) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const locations = (xml: string) => [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
const index = read("public/sitemap.xml");
const sections = locations(index).map(loc => read(`public/${new URL(loc).pathname.slice(1)}`));
const urls = sections.flatMap(locations);

test("sitemap uses the public domain and lists each URL once across all sections", () => {
  expect(locations(index)).toHaveLength(8);
  expect(urls.length).toBeGreaterThan(5437);
  expect(new Set(urls).size).toBe(urls.length);
  expect(urls.every(loc => loc.startsWith(`${base}/`))).toBe(true);
});

test("core sitemap URLs correspond to actual public routes, including GPTs and music", () => {
  const app = read("src/App.tsx");
  const actualRoutes = new Set([...app.matchAll(/<Route path="([^":*]+)"/g)].map(match => match[1]));
  const core = locations(read("public/sitemap-pages.xml")).map(loc => new URL(loc).pathname);
  expect(core).toContain("/gpts");
  expect(core).toContain("/music-stream");
  expect(core).not.toContain("/mtvai");
  for (const route of core) expect(actualRoutes.has(route)).toBe(true);
  expect(urls.some(loc => /\/(?:admin|account|join|welcome|favorites)(?:\/|$)/.test(new URL(loc).pathname))).toBe(false);
});

test("lastmod is limited to an explicit page-specific editorial update, never build time", () => {
  expect(index.includes("<lastmod>")).toBe(false);
  for (const section of sections) {
    for (const match of section.matchAll(/<url>(.*?)<\/url>/gs)) {
      if (!match[1].includes("<lastmod>")) continue;
      expect(match[1]).toContain(`${base}/blog/gpt-5-release-date-features-guide`);
      expect(match[1]).toContain("<lastmod>2026-11-20</lastmod>");
    }
  }
  expect(read("src/utils/sitemap.ts")).not.toMatch(/lastmod:\s*new Date/);
  expect(read("src/utils/sitemapGenerator.ts")).not.toContain("<lastmod>${currentDate}</lastmod>");
});

test("SEO regeneration preserves the distinct directory total of 5,437", () => {
  expect(TOTAL_TOOLS).toBe(5437);
});