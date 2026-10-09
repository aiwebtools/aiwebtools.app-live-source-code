// @ts-nocheck
import { expect, it } from "bun:test";
import { IMAGE_PLACEHOLDER, splitImageProgress } from "./image-progress";

it("keeps image loading active while narrative continues", () => {
  expect(splitImageProgress(`${IMAGE_PLACEHOLDER}\nThe portal opens into ancient Rome.`).working).toBe(true);
});
it("finishes image loading only after the generated image arrives", () => {
  expect(splitImageProgress(`${IMAGE_PLACEHOLDER}\n![Ancient Rome](https://example.com/rome.jpg)`).working).toBe(false);
});
it("clears image loading on a terminal image failure", () => {
  expect(splitImageProgress(`${IMAGE_PLACEHOLDER}\nImage generation failed.`).working).toBe(false);
});
it("shows progress for a second image after the first is complete", () => {
  expect(splitImageProgress(`${IMAGE_PLACEHOLDER}\n![First](https://example.com/1.jpg)\n${IMAGE_PLACEHOLDER}\nContinuing our journey.`).working).toBe(true);
});