// @ts-nocheck -- regression tests run with Bun, like the existing speech tests.
import { expect, test } from "bun:test";
import { deviceSpeechAvailable, speakDeviceText, selectDeviceVoice, unlockDeviceSpeech } from "./deviceSpeech";

test("a missing phone utterance API never throws or interrupts reply delivery", () => {
  const original = globalThis.window;
  Object.assign(globalThis, { window: { speechSynthesis: { speak() {} } } });
  try {
    let unavailable = 0;
    expect(deviceSpeechAvailable()).toBe(false);
    expect(speakDeviceText("First sentence.", { onUnavailable: () => unavailable++ })).toBe(false);
    expect(unavailable).toBe(1);
  } finally { Object.assign(globalThis, { window: original }); }
});

test("a broken device speaker cannot prevent later reply chunks arriving", () => {
  const original = globalThis.window;
  Object.assign(globalThis, { window: { SpeechSynthesisUtterance: class {}, speechSynthesis: { speak() { throw new Error("speaker failed"); } } } });
  try {
    let text = "";
    for (const chunk of ["First sentence.", " Final sentence."]) {
      text += chunk;
      speakDeviceText(chunk);
    }
    expect(text).toBe("First sentence. Final sentence.");
  } finally { Object.assign(globalThis, { window: original }); }
});

test("available device speech preserves exact text and invokes completion", () => {
  const original = globalThis.window;
  let spoken = "";
  let ended = false;
  class Utterance { constructor(public text: string) {} onend?: () => void; }
  Object.assign(globalThis, { window: { SpeechSynthesisUtterance: Utterance, speechSynthesis: { speak(u: Utterance) { spoken = u.text; u.onend?.(); } } } });
  try {
    expect(speakDeviceText("Complete reply.", { onEnd: () => { ended = true; } })).toBe(true);
    expect(spoken).toBe("Complete reply.");
    expect(ended).toBe(true);
  } finally { Object.assign(globalThis, { window: original }); }
});

test("free fallback prefers natural English voices over robotic defaults or another language", () => {
  const voices = [
    { name: "Default", lang: "en-US", default: true, localService: true },
    { name: "Samantha (Enhanced)", lang: "en-US", localService: true },
    { name: "Premium French", lang: "fr-FR", localService: true },
  ];
  expect(selectDeviceVoice(voices)?.name).toBe("Samantha (Enhanced)");
});

test("device speech unlock primes the speaker during the click gesture", () => {
  const original = globalThis.window;
  let primed;
  let resumed = false;
  Object.assign(globalThis, { window: { SpeechSynthesisUtterance: class { constructor(public text: string) {} }, speechSynthesis: {
    resume() { resumed = true; }, speak(u) { primed = u; }, getVoices() { return []; },
  } } });
  try { unlockDeviceSpeech(); expect(resumed).toBe(true); expect(primed.volume).toBe(0); }
  finally { Object.assign(globalThis, { window: original }); }
});

test("device speaker errors are reported once and cancellation never reports failure", () => {
  const original = globalThis.window;
  let utterance;
  Object.assign(globalThis, { window: { SpeechSynthesisUtterance: class {}, speechSynthesis: { speak(u) { utterance = u; } } } });
  try {
    let failed = 0;
    speakDeviceText("Okay, here is the answer.", { onUnavailable() { failed++; } });
    utterance.onerror(); utterance.onerror();
    expect(failed).toBe(1);
    const controller = new AbortController();
    speakDeviceText("Another reply.", { signal: controller.signal, onUnavailable() { failed++; } });
    controller.abort(); utterance.onerror();
    expect(failed).toBe(1);
  } finally { Object.assign(globalThis, { window: original }); }
});