import { expect, test } from "bun:test";
import { orderCategoryTools, dedupeTools } from "./categoryOrdering";
import type { Tool } from "../../types/tools";

test("ranking retains every unique catalog record with stable pagination order", () => {
  const tools = Array.from({ length: 200 }, (_, i) => ({ title: `Verified tool ${i}`, description: "Full description ".repeat(i % 30), tags: ["AI", "productivity"], directUrl: `https://tool${i}.example`, emoji: "", color: "", icon: () => null } as Tool));
  const ordered = orderCategoryTools(tools, "ALL AI TOOLS");
  expect(ordered).toHaveLength(200);
  expect(new Set(ordered.map((tool) => tool.title))).toEqual(new Set(tools.map((tool) => tool.title)));
  expect(orderCategoryTools(tools, "ALL AI TOOLS").map((tool) => tool.title)).toEqual(ordered.map((tool) => tool.title));
  expect(ordered.slice(0, 48)).toEqual(orderCategoryTools(tools, "ALL AI TOOLS").slice(0, 48));
});

test("duplicate resolution still keeps the most complete record", () => {
  const base = { title: "Verified Tool", description: "Short", emoji: "", color: "", icon: () => null } as Tool;
  const complete = { ...base, description: "Detailed description ".repeat(20), imageUrl: "local-image.jpg" };
  expect(dedupeTools([base, complete])).toEqual([complete]);
});