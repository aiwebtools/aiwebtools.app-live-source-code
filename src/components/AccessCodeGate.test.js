import { expect, test } from "bun:test";
import { acceptsAccessCode, ACCESS_GATE_ENABLED } from "./AccessCodeGate";

test("Master's Angel Number gate is enabled", () => {
  expect(ACCESS_GATE_ENABLED).toBe(true);
});

test("temporary access requires Master's exact 1111 code", () => {
  expect(acceptsAccessCode("1111")).toBe(true);
  expect(acceptsAccessCode("1112")).toBe(false);
  expect(acceptsAccessCode("")).toBe(false);
});