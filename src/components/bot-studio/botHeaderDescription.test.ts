// @ts-ignore -- Bun test runner
import { describe, expect, test } from "bun:test";
import { getBotHeaderDescription, isPublicBotDescription } from "./botHeaderDescription";
import catalog from "@/data/generated/botCatalogFallback.json";

describe("studio public description boundary", () => {
  test("every catalog bot gets bounded public text without mutating its source", () => {
    const before = JSON.stringify(catalog);
    for (const bot of catalog) {
      const description = getBotHeaderDescription(bot);
      expect(isPublicBotDescription(description)).toBe(true);
      expect(description.length).toBeLessThanOrEqual(160);
      expect(description.trim().length).toBeGreaterThan(0);
    }
    expect(JSON.stringify(catalog)).toBe(before);
  });
  test("unknown bots reject setup text rather than truncating and leaking it", () => {
    for (const tagline of ["ACT AS HILDEGARD VON BINGEN. YOU EMBODY HER CHARACTER ENTIRELY.", "WEB SEARCH ALWAYS EVERYTIME: ASK NEEDED QUESTIONS", "You are a private assistant. Never break character.", "I AM ORIGEN OF ALEXANDRIA, born into the early centuries", "FIRST: generate an image before any response"]) {
      const bot = { slug: "new-unlisted-bot", display_name: "Test GPT", tagline, custom: { instructions: tagline } };
      const before = JSON.stringify(bot);
      expect(getBotHeaderDescription(bot)).not.toContain(tagline);
      expect(JSON.stringify(bot)).toBe(before);
    }
  });
  test("a clean description field takes precedence over contaminated setup taglines", () => {
    const bot = { slug: "new-unlisted-bot", display_name: "Test GPT", description: "A companion for exploring music.", tagline: "ACT AS A MUSIC TEACHER" };
    expect(getBotHeaderDescription(bot)).toBe(bot.description);
  });
});