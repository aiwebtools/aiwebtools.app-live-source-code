import { expect, test } from "bun:test";
import { approvedOwnerBatch, OWNER_BATCH_NAMES } from "./owner-batch";
import { DAILY_LIMIT } from "./creator-validation";
test("Master's one batch contains exactly 25 approved names and ordinary allowance stays ten", () => {
  expect(OWNER_BATCH_NAMES).toHaveLength(25);
  expect(new Set(OWNER_BATCH_NAMES).size).toBe(25);
  expect(DAILY_LIMIT).toBe(10);
});
test("historical batch cannot bypass Master's ten-per-day limit", () => {
  const now = Date.parse("2026-10-18T22:00:00Z");
  expect(approvedOwnerBatch(OWNER_BATCH_NAMES[0], "test-only", "test-only", now)).toBe(false);
  expect(approvedOwnerBatch(OWNER_BATCH_NAMES[0], null, "test-only", now)).toBe(false);
  expect(approvedOwnerBatch(OWNER_BATCH_NAMES[0], "wrong", "test-only", now)).toBe(false);
  expect(approvedOwnerBatch("Unapproved bot", "test-only", "test-only", now)).toBe(false);
  expect(approvedOwnerBatch(OWNER_BATCH_NAMES[0], "test-only", "test-only", Date.parse("2026-10-20T00:00:00Z"))).toBe(false);
});