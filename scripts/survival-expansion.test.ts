import { expect, test } from "bun:test";
import { readFileSync, existsSync } from "node:fs";
import bots from "./data/survival-expansion.json";
import { getBotCategory, searchStudioBots } from "../src/components/bot-studio/botSubjects";
import { DAILY_LIMIT } from "../supabase/functions/publish-community-gpt/creator-validation";
test("25 distinct unpublished survival assistants preserve ten-per-day publication", () => {
  expect(bots).toHaveLength(25);
  expect(new Set(bots.map((bot) => bot.name)).size).toBe(25);
  expect(DAILY_LIMIT).toBe(10);
  for (const bot of bots) {
    expect(["draft-awaiting-daily-allowance", "published"]).toContain(bot.status);
    if (bot.status === "published") expect(getBotCategory({ slug: bot.publishedSlug, display_name: bot.name, tagline: bot.tagline })).toBe("Apocalypse Survival & Nature");
    expect(bot.instructions.length).toBeGreaterThan(9000);
    expect(bot.instructions.length).toBeLessThanOrEqual(20000);
    for (const section of "ABCDEFGHIJ") expect(bot.instructions).toContain(`\n${section}. `);
    expect(existsSync(`src/assets/survival-bots/${bot.image}.jpg`)).toBe(true);
    expect(readFileSync(`public${bot.pdf}`).subarray(0, 5).toString()).toBe("%PDF-");
    expect(getBotCategory({ slug: bot.slug, display_name: bot.name, tagline: bot.tagline })).toBe("Apocalypse Survival & Nature");
  }
  expect(searchStudioBots(bots.map((bot) => ({ slug: bot.slug, display_name: bot.name, tagline: bot.tagline })), "apocalypse survival")).toHaveLength(25);
});
test("never more than ten published on the first day", () => {
  expect(bots.filter((bot) => bot.status === "published").length).toBeLessThanOrEqual(10);
});
test("foraging cannot certify edibility and chemical water cannot be cleared by boiling", () => {
  expect(bots.find((bot) => bot.name === "Foraging Lookalike Risk Tutor GPT")?.instructions).toContain("Never certify edible plants or mushrooms from a photo or chat");
  expect(bots.find((bot) => bot.name === "Emergency Water Contamination Triage GPT")?.instructions).toContain("Boiling does not remove many chemicals or salts");
});