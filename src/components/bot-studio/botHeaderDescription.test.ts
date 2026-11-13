// @ts-ignore -- Bun test runner
import { describe, expect, test } from "bun:test";
import { getBotHeaderDescription, isPublicBotDescription } from "./botHeaderDescription";
import catalog from "@/data/generated/botCatalogFallback.json";
import descriptions from "./botHeaderDescriptions.json";

describe("studio public description boundary", () => {
  test("every catalog bot gets bounded public text without mutating its source", () => {
    expect(catalog.length).toBe(1542);
    expect(Object.keys(descriptions).sort()).toEqual(catalog.map((bot) => bot.slug).sort());
    const before = JSON.stringify(catalog);
    for (const bot of catalog) {
      const description = getBotHeaderDescription(bot);
      expect(isPublicBotDescription(description)).toBe(true);
      expect(description.length).toBeLessThanOrEqual(160);
      expect(description.trim().length).toBeGreaterThan(0);
      expect(description).not.toContain("conversation companion for");
      expect(description).not.toBe("Explore questions, develop ideas and work through practical next steps.");
    }
    expect(JSON.stringify(catalog)).toBe(before);
  });
  test("rejects archive identities, greetings and name-only templates", () => {
    for (const value of ["A conversation companion for TIME MACHINE GPT FINAL AMAZING PERFECT 9_14_2024 Works exc 2a2245d.", "Congratulations!", "A conversation companion for Competitive Price Analysis Assistant.", "A conversation companion for AutoBiz.", "A conversation companion for Career Matchmaker."]) {
      expect(isPublicBotDescription(value)).toBe(false);
    }
  });
  test("never uses archive taglines even when they look like public prose", () => {
    const bot = { slug: "new-unlisted-bot", display_name: "New Unlisted Bot", tagline: "An archived sentence with no trustworthy public description." };
    expect(getBotHeaderDescription(bot)).not.toBe(bot.tagline);
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