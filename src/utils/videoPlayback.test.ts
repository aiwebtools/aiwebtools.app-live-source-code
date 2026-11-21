// @ts-ignore -- Bun runs project regression tests.
import { expect, test } from "bun:test";
import { startYouTubeWithSound, youtubePlaybackUrl } from "./videoPlayback";

test("active video requests audible autoplay and 1080p without dropping original parameters", () => {
  const url = new URL(youtubePlaybackUrl("https://www.youtube-nocookie.com/embed/example?controls=1&rel=0&mute=1&autoplay=0"));
  expect(url.searchParams.get("autoplay")).toBe("1");
  expect(url.searchParams.get("mute")).toBe("0");
  expect(url.searchParams.get("vq")).toBe("hd1080");
  expect(url.searchParams.get("controls")).toBe("1");
  expect(url.searchParams.get("rel")).toBe("0");
});

test("startup sends sound and HD commands only to the selected player", () => {
  const sent: Array<{ func: string; args: unknown[]; origin: string }> = [];
  const frame = { src: "https://www.youtube-nocookie.com/embed/example", contentWindow: { postMessage: (raw: string, origin: string) => sent.push({ ...JSON.parse(raw), origin }) } };
  startYouTubeWithSound(frame as unknown as HTMLIFrameElement);
  expect(sent.map(item => item.func)).toEqual(["setPlaybackQuality", "unMute", "setVolume", "playVideo"]);
  expect(sent[0].args).toEqual(["hd1080"]);
  expect(sent[2].args).toEqual([100]);
  expect(sent.every(item => item.origin === "https://www.youtube-nocookie.com")).toBe(true);
});