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
});
