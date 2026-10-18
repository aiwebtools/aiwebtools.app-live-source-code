// @ts-ignore -- Bun test runtime import
import { expect, test } from "bun:test";
import { getBotCategory, searchStudioBots } from "./botSubjects";
import { groupBotsByCategory } from "./botCategories";
import metadata from "@/data/offGridBotMetadata.json";
import type { StudioBot } from "./botCatalog";
const bot = (name: string, slug = name.toLowerCase().replace(/ /g, "-")): StudioBot => ({ slug, display_name: name, tool_title: null, tagline: null, greeting: null, starter_prompts: [], supports_images: true, model: "default" });
test("Time Machine is historical exploration, not science", () => {
  expect(getBotCategory(bot("Time Machine GPT"))).toBe("History & Time Travel");
  expect(getBotCategory(bot("Native American History Time Machine GPT"))).toBe("History & Time Travel");
});
test("domain classification ignores incidental substring collisions", () => {
  expect(getBotCategory(bot("Artificial Intelligence Assistant"))).toBe("General & Productivity");
  expect(getBotCategory(bot("Planet Explorer", "planet-explorer"))).not.toBe("Engineering & Planning");
  expect(getBotCategory(bot("Genome GPT"))).toBe("Science & Research");
  expect(getBotCategory(bot("Training Manual Generator GPT"))).toBe("Education & Learning");
  expect(getBotCategory(bot("Pharma Research Pro"))).toBe("Science & Research");
  expect(getBotCategory(bot("Book Writer Of Time Travel - The Time Machine"))).toBe("Creative & Design");
});
test("all thirty published community-support bots belong to Off Grid Living and are searchable by category", () => {
  const bots = Object.entries(metadata).map(([slug, data]) => bot(data.name, slug));
  expect(bots).toHaveLength(30);
  expect(groupBotsByCategory(bots).map(([category, families]) => [category, families.length])).toEqual([["Off Grid Living", 30]]);
  expect(searchStudioBots(bots, "off grid living")).toHaveLength(30);
  expect(searchStudioBots(bots, "rainwater harvest")[0]?.display_name).toBe("Rainwater Harvest Budget GPT");
});