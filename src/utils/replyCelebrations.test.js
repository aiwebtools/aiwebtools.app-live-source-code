import { expect, test } from "bun:test";
import { REPLY_COMBOS } from "./replyCelebrations";

test("replies have twenty distinct celebration combinations", () => {
  expect(REPLY_COMBOS.length).toBe(20);
  expect(new Set(REPLY_COMBOS).size).toBe(20);
});