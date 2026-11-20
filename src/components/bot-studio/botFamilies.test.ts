// @ts-ignore -- Bun test runtime import
import { expect, test } from "bun:test";
import { countCategoryAssistants, groupBotFamilies, groupBotsByCategory } from "./botCategories";
import catalog from "@/data/generated/botCatalogFallback.json";
import type { StudioBot } from "./botCatalog";

const bot = (slug: string, display_name: string) => ({ slug, display_name, tool_title: null, tagline: null, greeting: null, starter_prompts: [], supports_images: true, model: "default" }) as StudioBot;
test('one featured screenplay family retains every original and related edition', () => {
  const rooms = (catalog as StudioBot[]).filter(b => /movie.script|movie.writer|screenplay/i.test(b.slug));
  const families = groupBotFamilies(rooms);
  expect(families).toHaveLength(1);
  expect(families[0].base.slug).toBe('movie-script-writer-gpt');
  expect(families[0].featured).toBe(true);
  expect(families[0].versions.map(b=>b.slug).sort()).toEqual(rooms.map(b=>b.slug).sort());
});

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

test("category counts include every assistant version instead of counting only families", () => {
  const bots = [bot("time-machine-gpt", "Time Machine GPT"), bot("community-time-machine-gpt-v2", "Time Machine GPT (V2)"), bot("automobile-gpt", "Automobile GPT")];
  const groups = groupBotsByCategory(bots);
  expect(groups.map(([, families]) => countCategoryAssistants(families)).reduce((a, b) => a + b, 0)).toBe(3);
  expect(countCategoryAssistants(groupBotFamilies(bots.slice(0, 2)))).toBe(2);
});

test("complete bundled assistant category counts sum to all 1542 rooms", () => {
  const groups = groupBotsByCategory(catalog as StudioBot[]);
  expect(catalog.length).toBe(1542);
  expect(groups.reduce((total, [, families]) => total + countCategoryAssistants(families), 0)).toBe(1542);
});

test("Free College Lessons & Subject Tutor has one panel entry with both preserved archive rooms", () => {
  const rooms = [bot("community-free-college-lessons-or-any-subject-education-open-source-pr", "Free College Lessons & Subject Tutor"), bot("community-free-college-lessons-or-any-subject-education-open-source-pr-2", "Free College Lessons & Subject Tutor")];
  const families = groupBotFamilies(rooms);
  expect(families).toHaveLength(1);
  expect(families[0].base.display_name).toBe("Free College Lessons & Subject Tutor");
  expect(families[0].versions.map(room => room.slug)).toEqual(rooms.map(room => room.slug));
  expect(countCategoryAssistants(families)).toBe(2);
});
