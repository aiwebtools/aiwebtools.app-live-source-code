// @ts-ignore -- Bun test runtime only
import { expect, test } from "bun:test";
import { resolveBotIntroAsset } from "./botIntroAssetPolicy";

const recordings = {
  "time-machine-gpt-fable-v1.mp3": "https://aiwebtools.app/saved-fable.mp3",
  "time-machine-gpt-alloy-v1.mp3": "https://aiwebtools.app/saved-alloy.mp3",
};

test("saved introductions resolve without Supabase and preserve the selected voice", () => {
  expect(resolveBotIntroAsset("time-machine-gpt", "fable", recordings)).toBe("https://aiwebtools.app/saved-fable.mp3");
});
test("unsupported voices use the existing server's alloy default", () => {
  expect(resolveBotIntroAsset("time-machine-gpt", "unknown", recordings)).toBe("https://aiwebtools.app/saved-alloy.mp3");
});
test("missing recordings do not substitute a different character's voice", () => {
  expect(resolveBotIntroAsset("time-machine-gpt", "echo", recordings)).toBeUndefined();
  expect(resolveBotIntroAsset("new-bot", "fable", recordings)).toBeUndefined();
});