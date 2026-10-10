// @ts-nocheck
import { describe, expect, it } from "bun:test";
import { getGptVoiceProfile } from "./gptVoiceProfiles";

describe("bot voice casting", () => {
  it("Time Machine speaks as Father Time", () => {
    expect(getGptVoiceProfile("time-machine-gpt", "Time Machine GPT").label).toBe("Father Time");
  });
  it("class/teaching bots use the friendly professor", () => {
    expect(getGptVoiceProfile("college-degree-gpt", "College Degree GPT").label).toBe("Friendly professor");
  });
  it("Black history time machine uses the civil-rights orator", () => {
    expect(getGptVoiceProfile("black-history-time-machine-gpt", "Black History Time Machine GPT").label).toBe("Civil-rights era orator");
  });
  it("Mary Magdalene has a compassionate feminine voice", () => {
    const profile = getGptVoiceProfile("mary-magdalene-gpt", "Mary Magdalene GPT", "Spiritual history teacher");
    expect(profile.voice).toBe("shimmer");
    expect(profile.instructions).toContain("distinctly feminine");
  });
  it("Einstein receives a gentle German accent even without his first name", () => {
    expect(getGptVoiceProfile("einstein-gpt", "Einstein GPT").instructions).toContain("gentle German accent");
  });
  it("Tesla receives a different voice and Serbian-influenced accent", () => {
    const tesla = getGptVoiceProfile("tesla-gpt", "Tesla GPT");
    expect(tesla.instructions).toContain("Serbian-influenced");
    expect(tesla.voice).not.toBe(getGptVoiceProfile("einstein-gpt", "Einstein GPT").voice);
  });
  it("university professors have a mature scholarly delivery", () => {
    expect(getGptVoiceProfile("college-degree-gpt", "College Degree GPT").instructions).toContain("university professor");
  });
  it("shared base voices retain different bot-specific direction within the server limit", () => {
    const first = getGptVoiceProfile("book-writer-gpt", "Book Writer GPT");
    const second = getGptVoiceProfile("graphic-design-gpt", "Graphic Design GPT");
    expect(first.instructions).not.toBe(second.instructions);
    expect(first.instructions).toContain("Book Writer GPT");
    expect(first.instructions.length).toBeLessThanOrEqual(600);
  });
});
