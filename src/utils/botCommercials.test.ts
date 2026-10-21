// @ts-ignore -- Bun test runtime import
import { expect, test } from "bun:test";
import { commercialEmbed, commercialKey, hasSeenCommercial, markCommercialSeen } from "./botCommercials";
test("existing YouTube commercials autoplay with sound and report when they end", () => {
  expect(commercialEmbed("https://youtu.be/J31nNY5_PB4")).toBe("https://www.youtube-nocookie.com/embed/J31nNY5_PB4?autoplay=1&mute=0&playsinline=1&rel=0&enablejsapi=1");
  expect(commercialEmbed("https://example.com/fake")).toBeNull();
});
test("commercials are once per bot per user", () => {
  expect(hasSeenCommercial("test-bot", "user-one")).toBe(false);
  markCommercialSeen("test-bot", "user-one");
  expect(hasSeenCommercial("test-bot", "user-one")).toBe(true);
  expect(hasSeenCommercial("test-bot", "user-two")).toBe(false);
  expect(commercialKey("another-bot", "user-one")).not.toBe(commercialKey("test-bot", "user-one"));
});
