// @ts-ignore -- Bun test runtime
import { expect, test } from "bun:test";
import { promotionDelay, PROMOTION_INTERVAL_MS } from "./promotionalPopups";

test("no automatic promotion during the first 15 minutes", () => {
  expect(PROMOTION_INTERVAL_MS).toBe(900_000);
  expect(promotionDelay(1000, 1000, 0)).toBe(900_000);
  expect(promotionDelay(900_999, 1000, 0)).toBe(1);
  expect(promotionDelay(901_000, 1000, 0)).toBe(0);
});

test("promotions remain 15 minutes apart after dismissal and navigation", () => {
  expect(promotionDelay(1_800_000, 1000, 1_200_000)).toBe(300_000);
  expect(promotionDelay(2_100_000, 1000, 1_200_000)).toBe(0);
});