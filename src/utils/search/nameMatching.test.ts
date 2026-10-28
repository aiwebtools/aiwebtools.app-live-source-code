import { expect, test } from "bun:test";
import { isNearToolWord, nameMatchTier, prioritizeToolNames } from "./nameMatching";
import { performOptimizedSearch } from "./optimizedSearch";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

test("exact names rank ahead of branded and community suggestions", () => {
  expect(prioritizeToolNames(["ChatGPT Helper GPT", "ChatGPT"], "ChatGPT", (x) => x)).toEqual(["ChatGPT", "ChatGPT Helper GPT"]);
});
test("spacing punctuation accents and non-Latin tool names remain searchable", () => {
  expect(nameMatchTier("Bölt.new", "bolt new")).toBe(4);
  expect(nameMatchTier("Time Machine GPT", "timemachinegpt")).toBe(3);
  expect(nameMatchTier("通义千问", "通义千问")).toBe(4);
});
test("spelling accepts adjacent swaps and bounded errors but not short unrelated words", () => {
  expect(isNearToolWord("stellaris", "stelalris")).toBe(true);
  expect(isNearToolWord("midjourney", "midjourny")).toBe(true);
  expect(isNearToolWord("cat", "car")).toBe(false);
  expect(isNearToolWord("stellaris", "gardening")).toBe(false);
});
test("optimized search cannot bury an exact name beneath metadata matches", () => {
  const tools = [
    { title: "ChatGPT Helper", description: "ChatGPT", category: "ChatGPT", tags: ["ChatGPT"] },
    { title: "ChatGPT", description: "Assistant", category: "Chat", tags: [] },
  ];
  expect(performOptimizedSearch(tools, "ChatGPT")[0]?.title).toBe("ChatGPT");
});

test("production worker ranks literal names first and handles unseen name typos", async () => {
  const rows = [
    ["ChatGPT Helper GPT", "Chat", ["custom gpt", "ChatGPT"], null, null, null, null, null, 5, 0, true, "ChatGPT"],
    ["ChatGPT", "Chat", [], null, null, null, null, null, 0, 0, true, "Assistant"],
    ["Stellaris Space Explorer GPT", "Science", [], null, null, null, null, null, 0, 0, true, "Space exploration"],
  ];
  const messages: any[] = [];
  const self: any = { postMessage: (m: any) => messages.push(m) };
  runInNewContext(readFileSync("public/global-search-worker.js", "utf8"), { self, fetch: async () => ({ ok: true, json: async () => rows }), Date, Map, Set });
  await self.onmessage({ data: { id: 1, query: "ChatGPT" } });
  expect(messages.find((m) => m.id === 1)?.results[0]?.title).toBe("ChatGPT");
  await self.onmessage({ data: { id: 2, query: "stelalris" } });
  expect(messages.find((m) => m.id === 2)?.results[0]?.title).toBe("Stellaris Space Explorer GPT");
});