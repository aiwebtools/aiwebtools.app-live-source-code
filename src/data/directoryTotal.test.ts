// @ts-ignore -- Bun runs project regressions.
import { expect, test } from "bun:test";
import { TOTAL_TOOLS, MARKETING_TOOL_COUNT } from "./generated/toolCount";
import { directoryTools as catalog } from "./toolsData";
const distinctNames = new Set(catalog.map(tool => tool.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()));
test("generated total matches distinct searchable listings, not preserved source records", () => {
  expect(TOTAL_TOOLS).toBe(5437);
  expect(distinctNames.size).toBe(TOTAL_TOOLS);
});
test("marketing figure is the exact distinct-listing total", () => {
  expect(MARKETING_TOOL_COUNT).toBe("5,437");
  expect(MARKETING_TOOL_COUNT).toBe(TOTAL_TOOLS.toLocaleString("en-US"));
});
test("every searchable tool contributes exactly once to its collection category total", () => {
  const counts = new Map<string, number>();
  const seen = new Set<string>();
  for (const tool of catalog) {
    const key = tool.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (seen.has(key)) continue;
    seen.add(key);
    counts.set(tool.category || "AI Tools", (counts.get(tool.category || "AI Tools") || 0) + 1);
  }
  expect([...counts.values()].reduce((total, count) => total + count, 0)).toBe(5437);
});