import { describe, expect, test } from "bun:test";
import { parsePersonalAi, personalProviderError, PERSONAL_PROVIDERS } from "../_shared/personal-provider-policy.ts";

describe("personal AI rules", () => {
  test("requires sign-in, even for a key check", () => {
    expect(() => parsePersonalAi({ provider: "openai", apiKey: "test-placeholder-not-a-credential" }, false, true)).toThrow("Sign in");
  });
  test("only permits the requested four providers", () => {
    expect(Object.keys(PERSONAL_PROVIDERS)).toEqual(["openai", "gemini", "claude", "deepseek"]);
    expect(() => parsePersonalAi({ provider: "localhost", apiKey: "test-placeholder-not-a-credential", model: "anything", baseURL: "http://localhost" }, true)).toThrow("not supported");
  });
  test("provider-owned model IDs are allowlisted, not gateway IDs", () => {
    expect(() => parsePersonalAi({ provider: "deepseek", apiKey: "test-placeholder-not-a-credential", model: "openai/gpt-6-astra" }, true)).toThrow("not supported");
    expect(parsePersonalAi({ provider: "deepseek", apiKey: "test-placeholder-not-a-credential", model: "deepseek-flash" }, true).model).toBe("deepseek-flash");
  });
  test("provider errors never echo credentials or raw response bodies", () => {
    expect(personalProviderError({ statusCode: 401, message: "test-placeholder-not-a-credential", requestBodyValues: "sensitive" })).toBe("Your provider rejected this key. Check it in your provider account.");
    expect(personalProviderError(new Error("sensitive upstream details"))).not.toContain("sensitive");
  });
});