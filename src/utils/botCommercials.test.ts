// @ts-ignore -- Bun test runtime import
import { expect, test } from "bun:test";
import { commercialEmbed, commercialPlayerEvent, commercialKey, hasSeenCommercial, markCommercialSeen } from "./botCommercials";
test("existing YouTube commercials autoplay with sound and report when they end", () => {
  const embed = new URL(commercialEmbed("https://youtu.be/J31nNY5_PB4") ?? "");
  expect(embed.pathname).toBe("/embed/J31nNY5_PB4");
  expect(embed.searchParams.get("autoplay")).toBe("1");
  expect(embed.searchParams.get("mute")).toBe("0");
  expect(embed.searchParams.get("vq")).toBe("hd1080");
  expect(commercialEmbed("https://example.com/fake")).toBeNull();
});
test("another site's video cannot close or control a bot commercial", () => {
  const player = {} as Window;
  const data = JSON.stringify({ event: "onStateChange", info: 0 });
  expect(commercialPlayerEvent({ source: {} as Window, origin: "https://www.youtube.com", data }, player)).toBeNull();
  expect(commercialPlayerEvent({ source: player, origin: "https://youtube.com.fake.test", data }, player)).toBeNull();
  expect(commercialPlayerEvent({ source: player, origin: "https://www.youtube-nocookie.com", data }, player)?.state).toBe(0);
});
test("commercials are once per bot per user", () => {
  expect(hasSeenCommercial("test-bot", "user-one")).toBe(false);
  markCommercialSeen("test-bot", "user-one");
  expect(hasSeenCommercial("test-bot", "user-one")).toBe(true);
  expect(hasSeenCommercial("test-bot", "user-two")).toBe(false);
  expect(commercialKey("another-bot", "user-one")).not.toBe(commercialKey("test-bot", "user-one"));
});
