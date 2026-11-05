// @ts-ignore -- Bun runs project regressions.
import { expect, test } from "bun:test";
import { TOTAL_TOOLS, MARKETING_TOOL_COUNT } from "./generated/toolCount";
import catalog from "./generated/searchCatalogLite.json";
test("generated total matches the complete searchable directory", () => {
  expect(TOTAL_TOOLS).toBe(5563);
  expect(catalog.length).toBe(TOTAL_TOOLS);
});
test("rounded marketing figure is supported by the exact total", () => {
  expect(MARKETING_TOOL_COUNT).toBe("5,500+");
  expect(TOTAL_TOOLS >= 5500 && TOTAL_TOOLS < 5600).toBe(true);
});