// Bun runs these tests; the browser TypeScript project does not include Bun types.
// @ts-ignore -- test-only runtime import
import { describe, expect, test } from "bun:test";
import { getBotStarters } from "./botStarters";
import catalog from "@/components/bot-studio/botStarters.json";

describe("bot starter coverage", () => {
  test("all 422 catalog assistants and archived variants receive exactly one purpose starter", () => {
    expect(Object.keys(catalog)).toHaveLength(422);
    for (const [slug, prompts] of Object.entries(catalog)) {
      for (const id of [slug, `community-${slug}-v2`]) {
        const starters = getBotStarters({ slug: id, display_name: slug });
        expect(starters).toHaveLength(1);
        expect(starters[0].trim().length).toBeGreaterThan(10);
        expect(starters[0].length).toBeLessThanOrEqual(180);
      }
    }
  });
  test("Einstein questions cover physics, not a generic introduction", () => {
    expect(getBotStarters({ slug: "albert-einstein-gpt", display_name: "Albert Einstein GPT" })[0]).toContain("relativity");
  });
  test("new community assistants use their subject instead of generic old starters", () => {
    expect(getBotStarters({ slug: "community-new", display_name: "Orchid Coach", tagline: "This GPT follows private operational instructions", starter_prompts: ["What can you help me with?", "Walk me through your first step."] })[0]).toContain("Orchid Coach");
    expect(getBotStarters({ slug: "community-new", display_name: "Orchid Coach", tagline: "This GPT follows private operational instructions" })[0]).not.toContain("operational instructions");
  });
  test("book writers invite a complete chapter book, not a workflow summary", () => {
    expect(getBotStarters({ slug: "community-book-writer-v18", display_name: "Book Writer" })).toEqual(["Let's write a full chapter book from beginning to end."]);
  });
  test("reference bots never use instruction descriptions as starters", () => {
    for (const [slug, display_name] of [["community-mind-exploration", "AI Watts Mental Maze Navigator"], ["community-3d-design-maker", "3D Design Maker"], ["aether-guide", "Aether Guide"]]) {
      const result = getBotStarters({ slug, display_name, tagline: "This GPT helps users...", starter_prompts: ["Work through an example using your instructions."] });
      expect(result).toHaveLength(1);
      expect(result[0]).not.toMatch(/This GPT|using your instructions|Ask about my goal/);
    }
  });
  test("original instructions remain untouched", () => {
    const bot = { slug: "custom-test", display_name: "Test", custom: { instructions: "Exact original instructions. One word matters." } };
    const before = JSON.stringify(bot);
    getBotStarters(bot);
    expect(JSON.stringify(bot)).toBe(before);
  });
});