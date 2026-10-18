import { expect, test } from "bun:test";
import { readFileSync, existsSync } from "node:fs";
import bots from "./data/off-grid-bots.json";
import expansion from "./data/off-grid-expansion.json";
import docs from "../src/data/offGridInstructionDocs.json";
import metadata from "../src/data/offGridBotMetadata.json";
import { OFF_GRID_PROJECT } from "../src/data/offGridProject";

test("the companion destination retains Master's project and affiliate convention", () => {
  const url = new URL(OFF_GRID_PROJECT.url);
  expect(url.origin).toBe("https://off-grid-tribes.lovable.app");
  expect(url.searchParams.get("via")).toBe("aiwebtools");
});

test("five distinct additional contributors retain complete directives and selected identities", () => {
  expect(bots).toHaveLength(5);
  expect(new Set(bots.map((bot) => bot.name)).size).toBe(5);
  expect(Object.keys(docs)).toHaveLength(30);
  for (const [slug, info] of Object.entries(metadata)) {
    const bot = [...bots, ...expansion].find((b) => b.name === info.name);
    expect(bot).toBeDefined();
    if (!bot) throw new Error(`Missing authored bot ${slug}`);
    for (const section of "ABCDEFGHIJ") expect(bot.instructions).toContain(`\n${section}. `);
    expect(bot.instructions.length).toBeGreaterThan(9000);
    expect(bot.instructions.length).toBeLessThanOrEqual(20000);
    expect(bot.voice).toBe(info.voice);
    expect(info.tags).toContain("off grid tribes");
    expect(info.starters).toHaveLength(2);
    expect((docs as Record<string, string>)[slug]).toBe(bot.name);
    const path = `public/instructions/community/${slug}.pdf`;
    expect(existsSync(path)).toBe(true);
    expect(readFileSync(path).subarray(0, 5).toString()).toBe("%PDF-");
    expect(existsSync(`src/assets/off-grid-bots/${bot.image}.jpg`)).toBe(true);
  }
});