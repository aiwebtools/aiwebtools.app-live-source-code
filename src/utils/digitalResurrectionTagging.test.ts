// @ts-ignore -- Bun runs project regressions.
import { expect, test } from "bun:test";
import { allTools } from "@/data/toolsData";
import { searchTools } from "@/utils/search/searchUtils";
import { RESURRECTION_TAG } from "./digitalResurrectionTagging";

const tagsOf = (title: string) => allTools.find(t => t.title === title)?.tags || [];

test("searching resurrection (any spelling) shows Resurrection GPT first", () => {
  for (const q of ["resurrection", "ressurection"]) expect(searchTools(allTools, q)[0].title).toBe("Resurrection GPT");
});
test("figures from the past are tagged as digital resurrections", () => {
  for (const t of ["ALAN WATTS GPT", "Albert Einstein GPT", "Rumi GPT", "TALK TO THE GODS GPT"]) expect(tagsOf(t)).toContain(RESURRECTION_TAG);
});
test("general chat apps and robots are not tagged as resurrections", () => {
  for (const t of ["Character.AI", "Tesla Bot (Optimus) - Tesla Humanoid Robot"]) expect(tagsOf(t)).not.toContain(RESURRECTION_TAG);
});
test("history tools get a History tag", () => {
  expect(tagsOf("TALK TO HISTORY GPT")).toContain("History");
});
