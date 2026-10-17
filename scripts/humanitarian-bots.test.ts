import { expect, test } from "bun:test";
import bots from "./data/humanitarian-bots.json";
import docs from "../src/data/humanitarianInstructionDocs.json";
import { existsSync } from "node:fs";

test("all ten humanitarian bots retain complete A–J directives and assigned identities", () => {
  expect(bots).toHaveLength(10);
  expect(new Set(bots.map((bot) => bot.name)).size).toBe(10);
  for (const bot of bots) {
    for (const section of "ABCDEFGHIJ") expect(bot.instructions).toContain(`\n${section}. `);
    expect(bot.instructions.length).toBeGreaterThan(9000);
    expect(bot.voice.length).toBeGreaterThan(0);
    expect(Object.values(docs)).toContain(bot.name);
  }
});

test("each published humanitarian bot has its own instruction PDF", () => {
  expect(Object.keys(docs)).toHaveLength(10);
  for (const slug of Object.keys(docs)) expect(existsSync(`public/instructions/community/${slug}.pdf`)).toBe(true);
});