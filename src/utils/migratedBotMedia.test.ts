// @ts-ignore -- Bun test runtime only
import { expect, test } from "bun:test";
import { resolveVerifiedBotMedia } from "./migratedBotMediaPolicy";
import pointer from "../assets/migrated-bots/community-time-travelers-almanac.png.asset.json";
const resolveMigratedBotMedia = (source: string | null | undefined) => resolveVerifiedBotMedia(source, { "community-time-travelers-almanac.png": `https://aiwebtools.app${pointer.url}` });

test("verified original picture uses the exact copied asset", () => {
  expect(resolveMigratedBotMedia("https://huupailptzvcykyqdkar.supabase.co/storage/v1/object/public/tool-images/community-bots/community-time-travelers-almanac.png")).toBe(`https://aiwebtools.app${pointer.url}`);
});
test("new or unverified pictures never get replaced", () => {
  const newUpload = "https://huupailptzvcykyqdkar.supabase.co/storage/v1/object/public/tool-images/community-bots/new-owner-upload.png";
  expect(resolveMigratedBotMedia(newUpload)).toBe(newUpload);
  const revised = "https://huupailptzvcykyqdkar.supabase.co/storage/v1/object/public/tool-images/community-bots/community-time-travelers-almanac.png?revision=2";
  expect(resolveMigratedBotMedia(revised)).toBe(revised);
  expect(resolveMigratedBotMedia(undefined)).toBeUndefined();
});