// @ts-ignore -- Bun test runtime import
import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import docs from "@/data/communityInstructionDocs.json";
import names from "@/data/communityBotNames.json";
import { getOpInstructionDoc } from "@/data/opInstructionDocs";

test("each imported instruction variant has a real complete PDF download", () => {
  expect(Object.keys(docs)).toHaveLength(1044);
  for (const slug of Object.keys(docs)) {
    const doc = getOpInstructionDoc(slug);
    expect(doc?.href).toBe(`/instructions/community/${slug}.pdf`);
    const path = `public/instructions/community/${slug}.pdf`;
    expect(existsSync(path)).toBe(true);
    expect(readFileSync(path).subarray(0, 5).toString()).toBe("%PDF-");
  }
});

test("professional public names remove known archive clutter without changing links", () => {
  expect(names["community-book-writrs-gpt-3-segments-no-compile-final"]).toBe("Book Writer GPT — Three Segments");
  expect(names["community-community-gpt"]).toBe("Image Seed GPT");
});
