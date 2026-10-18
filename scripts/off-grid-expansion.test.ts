import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import bots from "./data/off-grid-expansion.json";
import { OWNER_BATCH_NAMES } from "../supabase/functions/publish-community-gpt/owner-batch";
test("all 25 additional bots have unique identities, full A–J instructions, distinct workflows and individual exports", () => {
  expect(bots).toHaveLength(25);
  expect(new Set(bots.map((b) => b.slug)).size).toBe(25);
  expect(new Set(bots.map((b) => b.instructions)).size).toBe(25);
  expect(bots.map((b) => b.name).sort()).toEqual([...OWNER_BATCH_NAMES].sort());
  for (const b of bots) {
    expect(b.instructions.length).toBeGreaterThan(9000);
    expect(b.instructions.length).toBeLessThanOrEqual(20000);
    for (const section of "ABCDEFGHIJ") expect(b.instructions).toContain(`\n${section}. `);
    expect(b.instructions).toContain(b.personality);
    expect(b.instructions).toContain(b.calcs);
    expect(b.imageUrl).toMatch(/^https:/);
    expect(existsSync(`src/assets/off-grid-bots/${b.image}.jpg`)).toBe(true);
    expect(readFileSync(`public/instructions/community/${b.slug}.pdf`).subarray(0,5).toString()).toBe("%PDF-");
    expect(existsSync(`public/instructions/community/${b.slug}.docx`)).toBe(true);
  }
});