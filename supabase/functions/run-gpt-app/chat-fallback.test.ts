import { expect, test } from "bun:test";
import { createFallbackChat, LOVABLE_FALLBACK_MODEL } from "./chat-fallback";
import { isPaused, type ProviderState, type ProviderStore } from "../_shared/chat-provider-state";

function setup(status: number, marker?: string) {
  const states = new Map<string, ProviderState>();
  const store: ProviderStore = { get: async (p) => states.get(p) || null, set: async (s) => { states.set(s.provider, s); } };
  const calls: Record<string, unknown>[] = [];
  let bionicCalls = 0;
  const route = createFallbackChat(store, async () => { bionicCalls++; return new Response("{}", { status, headers: marker ? { "X-Bionic-Failure": marker } : {} }); }, async (p) => { calls.push(p); return new Response("data: [DONE]\n\n"); }, new AbortController().signal);
  return { route, states, calls, count: () => bionicCalls };
}
const payload = { model: "bionic/glm-5.3-flash", messages: [{ role: "system", content: "Authored brain" }, { role: "tool", tool_call_id: "1", content: "Actual result" }], tools: [{ type: "function" }], stream: true };

test("Bionic exhausted credits automatically use previous Lovable model with intact tools/history", async () => {
  const s = setup(402);
  expect((await s.route.call(payload)).ok).toBe(true);
  expect(s.calls[0]).toEqual({ ...payload, model: "openai/gpt-6-luna", reasoning_effort: "none" });
  expect(s.route.getModel()).toBe(LOVABLE_FALLBACK_MODEL);
  expect(s.states.get("bionic")?.status).toBe("credits");
  await s.route.call(payload);
  expect(s.count()).toBe(1);
});
test("genuine Bionic outage falls back once with a persistent five-minute cooldown", async () => {
  const s = setup(502);
  await s.route.call({ ...payload, model: "bionic/deepseek-v4.1-flash" });
  expect(s.calls).toHaveLength(1);
  expect(s.states.get("bionic")?.status).toBe("outage");
  expect(isPaused(s.states.get("bionic") || null)).toBe(true);
});
for (const status of [400, 401, 403, 404, 429]) test(`Bionic ${status} never switches to Lovable`, async () => {
  const s = setup(status);
  expect((await s.route.call(payload)).status).toBe(status);
  expect(s.calls).toHaveLength(0);
  if ([401, 403, 404].includes(status)) { await s.route.call(payload); expect(s.count()).toBe(1); }
});
test("missing Bionic configuration does not masquerade as an outage", async () => {
  const s = setup(503, "configuration");
  expect((await s.route.call(payload)).status).toBe(503);
  expect(s.calls).toHaveLength(0);
});
test("Lovable credit pause is checked before every future fallback", async () => {
  const states = new Map<string, ProviderState>();
  const store: ProviderStore = { get: async p => states.get(p) || null, set: async s => { states.set(s.provider, s); } };
  let count = 0;
  const route = createFallbackChat(store, async () => new Response("{}", { status: 402 }), async () => { count++; return new Response('{"message":"Top up site credits"}', { status: 402 }); }, new AbortController().signal);
  expect((await route.call(payload)).status).toBe(402);
  expect((await route.call(payload)).status).toBe(402);
  expect(count).toBe(1);
});
test("successful HTTP response, including empty/refusal streams, is never replayed", async () => {
  const s = setup(200);
  await s.route.call(payload);
  expect(s.calls).toHaveLength(0);
});
test("Bionic failures after text or tools start never switch models mid-reply", async () => {
  const s = setup(402);
  s.route.markStarted();
  expect((await s.route.call(payload)).status).toBe(402);
  expect(s.calls).toHaveLength(0);
});