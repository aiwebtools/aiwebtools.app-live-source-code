import { expect, test } from "bun:test";
import { acceptsAccessCode, ACCESS_GATE_ENABLED } from "./AccessCodeGate";

test("Master's temporary access gate is disabled for now", () => {
  expect(ACCESS_GATE_ENABLED).toBe(false);
});

test("temporary access requires Master's exact 1111 code", () => {
  expect(acceptsAccessCode("1111")).toBe(true);
  expect(acceptsAccessCode("1112")).toBe(false);
  expect(acceptsAccessCode("")).toBe(false);
});