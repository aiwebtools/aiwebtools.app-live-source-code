// @ts-nocheck — Bun regression tests use browser doubles.
import { expect, test } from "bun:test";
import { createVoiceRecognitionSession } from "./voiceRecognition";

function setup(acquire?: () => Promise<unknown>) {
  const events: string[] = [];
  let active;
  class Recognition {
    constructor() { active = this; }
    start() { events.push("start"); }
    abort() { events.push("abort"); }
  }
  const session = createVoiceRecognitionSession({
    Constructor: Recognition, language: "en-US",
    acquireMicrophone: acquire || (async () => ({ getTracks: () => [{ stop() { events.push("release"); } }] })),
    onListening: () => events.push("listening"), onEnd: () => events.push("end"),
    onError: (e) => events.push(e), onTranscript: (text, final) => events.push(`${final ? "submit" : "draft"}:${text}`),
  });
  return { session, events, recognition: () => active };
}
test("final voice input releases microphone and resumes speaker before one submission", async () => {
  const s = setup(); await s.session.start();
  const callback = s.recognition().onresult;
  callback({ results: [{ isFinal: false, 0: { transcript: "Take me" } }] });
  callback({ results: [{ isFinal: true, 0: { transcript: "Take me to Rome" } }] });
  callback({ results: [{ isFinal: true, 0: { transcript: "Take me to Rome" } }] });
  expect(s.events).toEqual(["start", "listening", "draft:Take me", "abort", "release", "end", "submit:Take me to Rome"]);
});
test("cancel while permission is pending never starts capture later", async () => {
  let resolve;
  const s = setup(() => new Promise((r) => { resolve = r; }));
  const starting = s.session.start(); s.session.stop();
  resolve({ getTracks: () => [{ stop() { s.events.push("release"); } }] }); await starting;
  expect(s.events).toEqual(["end", "release"]);
});
test("permission rejection releases listening state and reports the actual failure", async () => {
  const s = setup(async () => { throw Object.assign(new Error("Denied"), { name: "NotAllowedError" }); });
  await s.session.start(); expect(s.events).toEqual(["end", "NotAllowedError"]);
});
test("speech-service failure releases microphone once and permits a fresh session", async () => {
  const s = setup(); await s.session.start();
  s.recognition().onerror({ error: "network" }); s.session.stop();
  expect(s.events).toEqual(["start", "listening", "abort", "release", "end", "network"]);
  const fresh = setup(); await fresh.session.start(); expect(fresh.events).toEqual(["start", "listening"]); fresh.session.stop();
});