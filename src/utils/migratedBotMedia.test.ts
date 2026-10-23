// @ts-ignore -- Bun test runtime only
import { expect, test } from "bun:test";
import { resolveMigratedBotMedia } from "./migratedBotMedia";
import pointer from "../assets/migrated-bots/community-time-travelers-almanac.png.asset.json";

test("verified original picture uses the exact copied asset", () => {
  expect(resolveMigratedBotMedia("https://huupailptzvcykyqdkar.supabase.co/storage/v1/object/public/tool-images/community-bots/community-time-travelers-almanac.png")).toBe(pointer.url);
});
test("new or unverified pictures never get replaced", () => {
  const newUpload = "https://huupailptzvcykyqdkar.supabase.co/storage/v1/object/public/tool-images/community-bots/new-owner-upload.png";
  expect(resolveMigratedBotMedia(newUpload)).toBe(newUpload);
  const revised = "https://huupailptzvcykyqdkar.supabase.co/storage/v1/object/public/tool-images/community-bots/community-time-travelers-almanac.png?revision=2";
  expect(resolveMigratedBotMedia(revised)).toBe(revised);
  expect(resolveMigratedBotMedia(undefined)).toBeUndefined();
});