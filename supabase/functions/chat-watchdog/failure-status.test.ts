import { expect, test } from "bun:test";
import { isReplyFailure } from "./failure-status.ts";
test("personal provider failures alert the existing chat watchdog", () => {
  expect(isReplyFailure("provider_error")).toBe(true);
  expect(isReplyFailure("gateway_error")).toBe(true);
  expect(isReplyFailure("cancelled")).toBe(false);
  expect(isReplyFailure("ok")).toBe(false);
});