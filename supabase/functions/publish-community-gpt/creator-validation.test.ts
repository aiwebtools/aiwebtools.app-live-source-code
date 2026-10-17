import { describe, expect, test } from "bun:test";
import { DAILY_LIMIT, validateAvatar, VOICES } from "./creator-validation";
describe("community creator rules", () => {
  test("Master approved five publications per day", () => expect(DAILY_LIMIT).toBe(5));
  test("uploaded image bytes are preserved", () => {
    const bytes = Uint8Array.from([137,80,78,71,13,10,26,10,0]);
    const image = validateAvatar(`data:image/png;base64,${btoa(String.fromCharCode(...bytes))}`);
    expect(image?.bytes).toEqual(bytes);
    expect(image?.contentType).toBe("image/png");
  });
  test("remote URLs and disguised files are rejected", () => {
    expect(() => validateAvatar("https://example.com/avatar.png")).toThrow();
    expect(() => validateAvatar(`data:image/png;base64,${btoa("not an image")}`)).toThrow();
  });
  test("the chosen voices are supported", () => { expect(VOICES).toContain("sage"); expect(VOICES).toContain("nova"); expect(VOICES).toHaveLength(11); });
});