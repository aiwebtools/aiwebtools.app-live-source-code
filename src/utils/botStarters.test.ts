// Bun runs these tests; the browser TypeScript project does not include Bun types.
// @ts-ignore -- test-only runtime import
import { describe, expect, test } from "bun:test";
import { getBotStarters } from "./botStarters";
import catalog from "@/components/bot-studio/botStarters.json";

describe("bot starter coverage", () => {
  test("all 422 active assistants have two nonempty starters", () => {
    expect(Object.keys(catalog)).toHaveLength(422);
    for (const [slug, prompts] of Object.entries(catalog)) {
      expect(getBotStarters({ slug, display_name: slug })).toEqual(prompts);
      expect(prompts).toHaveLength(2);
      expect(prompts.every((prompt) => prompt.trim().length > 20)).toBe(true);
    }
  });
  test("Einstein questions cover physics, not a generic introduction", () => {
    expect(getBotStarters({ slug: "albert-einstein-gpt", display_name: "Albert Einstein GPT" })[0]).toContain("relativity");
  });
  test("new community assistants use their subject instead of generic old starters", () => {
    expect(getBotStarters({ slug: "community-new", display_name: "Orchid Coach", tagline: "Orchid care · Community GPT", starter_prompts: ["What can you help me with?", "Walk me through your first step."] })[0]).toContain("Orchid care");
  });
  test("original instructions remain untouched", () => {
    const bot = { slug: "custom-test", display_name: "Test", custom: { instructions: "Exact original instructions. One word matters." } };
    const before = JSON.stringify(bot);
    getBotStarters(bot);
    expect(JSON.stringify(bot)).toBe(before);
  });
});