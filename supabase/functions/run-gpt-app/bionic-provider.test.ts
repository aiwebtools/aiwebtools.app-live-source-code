import { expect, test } from "bun:test";
import { callBionic, BIONIC_CHAT_URL } from "./bionic-provider";

test("Bionic preserves full instructions, photo input, tools and follow-up history at the exact endpoint", async () => {
  const payload = { model: "bionic/glm-5.3-flash", stream: true, tools: [{ type: "function", function: { name: "web_search" } }], tool_choice: "auto", messages: [{ role: "system", content: "Original instructions verbatim" }, { role: "user", content: [{ type: "image_url", image_url: { url: "data:image/png;base64,AAAA" } }] }, { role: "assistant", content: null, tool_calls: [{ id: "search-1" }] }, { role: "tool", tool_call_id: "search-1", content: "Actual sources" }] };
  const response = new Response('data: {"choices":[{"delta":{"content":"Ready"}}]}\n\ndata: [DONE]\n\n');
  const result = await callBionic("test-only-placeholder", payload, new AbortController().signal, (async (url, init) => {
    expect(url).toBe(BIONIC_CHAT_URL);
    expect(JSON.parse(String(init?.body))).toEqual(payload);
    expect(init?.redirect).toBe("error");
    return response;
  }) as typeof fetch);
  expect(await result.text()).toContain('"content":"Ready"');
});
test("Bionic rejects arbitrary models without sending requests", async () => {
  let called = false;
  const response = await callBionic("test-only-placeholder", { model: "untrusted/model" }, new AbortController().signal, (async () => { called = true; return new Response(); }) as typeof fetch);
  expect(response.status).toBe(400);
  expect(called).toBe(false);
});
test("Bionic exhausted balance is redacted and never retried on another paid provider", async () => {
  let count = 0;
  const response = await callBionic("test-only-placeholder", { model: "bionic/deepseek-v4.1-flash" }, new AbortController().signal, (async () => { count++; return new Response("sensitive-provider-details", { status: 402 }); }) as typeof fetch);
  expect(count).toBe(1);
  expect(response.status).toBe(402);
  expect(await response.text()).not.toContain("sensitive-provider-details");
});