import { expect, test } from "bun:test";
import { acceptsAccessCode } from "./AccessCodeGate";

test("temporary access requires Master's exact 1111 code", () => {
  expect(acceptsAccessCode("1111")).toBe(true);
  expect(acceptsAccessCode("1112")).toBe(false);
  expect(acceptsAccessCode("")).toBe(false);
});