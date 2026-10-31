import { expect, test } from "bun:test";
import { getResolvedAssetUrl } from "./imageUtils";

test("hosted and bundled image URLs keep their exact destination", () => {
  expect(getResolvedAssetUrl("/assets/muse-hero-123.jpg")).toBe("/assets/muse-hero-123.jpg");
  expect(getResolvedAssetUrl("https://example.com/hero.jpg")).toBe("https://example.com/hero.jpg");
  expect(getResolvedAssetUrl(undefined)).toBe("");
});