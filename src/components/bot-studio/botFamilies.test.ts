// @ts-ignore -- Bun test runtime import
import { expect, test } from "bun:test";
import { groupBotFamilies } from "./botCategories";
import type { StudioBot } from "./botCatalog";

const bot = (slug: string, display_name: string) => ({ slug, display_name, tool_title: null, tagline: null, greeting: null, starter_prompts: [], supports_images: true, model: "default" }) as StudioBot;

test("archived versions open under their base bot as V1, V2, V3 in order", () => {
  const families = groupBotFamilies([
    bot("community-book-writer-gpt-no-longer-segmented-v3", "Book Writer GPT (V3)"),
    bot("book-writer-gpt-no-longer-segmented", "Book Writer GPT"),
    bot("community-book-writer-gpt-no-longer-segmented-v2", "Book Writer GPT (V2)"),
    bot("community-abba-anthony-gpt", "Abba Anthony GPT"),
    bot("community-abba-anthony-gpt-v2", "Abba Anthony GPT (V2)"),
    bot("alan-watts-gpt", "Alan Watts GPT"),
  ]);
  const book = families.find((f) => f.base.slug === "book-writer-gpt-no-longer-segmented");
  expect(book?.versions.map((b) => b.slug)).toEqual(["book-writer-gpt-no-longer-segmented", "community-book-writer-gpt-no-longer-segmented-v2", "community-book-writer-gpt-no-longer-segmented-v3"]);
  expect(families.find((f) => f.base.slug === "community-abba-anthony-gpt")?.versions).toHaveLength(2);
  expect(families.find((f) => f.base.slug === "alan-watts-gpt")?.versions).toHaveLength(1);
  expect(families).toHaveLength(3);
});

test("all twenty book instruction versions remain in their family", () => {
  const versions = Array.from({ length: 20 }, (_, i) => bot(i ? `community-book-writer-v${i + 1}` : "community-book-writer", "Book Writer GPT"));
  const [family] = groupBotFamilies(versions.reverse());
  expect(family.versions).toHaveLength(20);
  expect(family.versions[19].slug).toBe("community-book-writer-v20");
});
