import { assertEquals, assert } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { callPersonalProvider, checkPersonalProvider } from "./personal-provider.ts";

Deno.test("personal provider verification is read-only and reveals no key", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    assertEquals(String(input), "https://api.deepseek.com/models");
    assertEquals((init as { method?: string } | undefined)?.method || "GET", "GET");
    return Response.json({ data: [{ id: "deepseek-flash" }, { id: "unknown" }] });
  };
  try {
    assertEquals(await checkPersonalProvider({ provider: "deepseek", apiKey: "test-placeholder-not-a-credential", model: "deepseek-flash" }, new AbortController().signal), {
      models: ["deepseek-flash"], message: "Key accepted by your provider. Billing, quota and replies are checked when you send a message.",
    });
  } finally { globalThis.fetch = original; }
});

Deno.test("all four direct adapters send instructions and preserve tool follow-up", async () => {
  const original = globalThis.fetch;
  const tools = [{ type: "function", function: { name: "web_search", description: "Search the web", parameters: { type: "object", properties: { query: { type: "string" } }, required: ["query"], additionalProperties: false } } }];
  const messages = [
    { role: "system", content: "Authored bot instructions unchanged" },
    { role: "user", content: "Find facts about the moon" },
    { role: "assistant", content: "I will search.", tool_calls: [{ id: "call_1", type: "function", function: { name: "web_search", arguments: '{"query":"moon"}' } }] },
    { role: "tool", tool_call_id: "call_1", content: "Moon source result" },
  ];
  try {
    for (const provider of ["openai", "gemini", "claude", "deepseek"] as const) {
      let sawRequest = false;
      globalThis.fetch = async (input, init) => {
        sawRequest = true;
        const url = String(input);
        assert(!url.includes("lovable"));
        const payload = JSON.parse(String((init as { body?: unknown } | undefined)?.body));
        assert(JSON.stringify(payload).includes("Authored bot instructions unchanged"));
        assert(JSON.stringify(payload).includes("Moon source result"));
        assert(!JSON.stringify(payload).includes("test-placeholder-not-a-credential"));
        let events: string[];
        if (provider === "openai") {
          assert(url.endsWith("/responses"));
          assertEquals(payload.store, false);
          assert(payload.input.some((item: { type: string; call_id: string }) => item.type === "function_call" && item.call_id === "call_1"));
          assert(payload.input.some((item: { type: string; call_id: string }) => item.type === "function_call_output" && item.call_id === "call_1"));
          events = [
            JSON.stringify({ type: "response.created", response: { id: "resp_test", created_at: 0, model: "gpt-4o-mini" } }),
            JSON.stringify({ type: "response.output_text.delta", item_id: "msg_test", output_index: 0, content_index: 0, delta: "Hello" }),
            JSON.stringify({ type: "response.completed", response: { id: "resp_test", created_at: 0, model: "gpt-4o-mini", status: "completed", output: [], usage: { input_tokens: 1, output_tokens: 1 } } }),
          ];
        } else if (provider === "gemini") {
          assert(url.includes("generativelanguage.googleapis.com"));
          assert(payload.contents.some((item: { parts: { functionResponse?: unknown }[] }) => item.parts.some((part) => part.functionResponse)));
          events = [JSON.stringify({ candidates: [{ content: { role: "model", parts: [{ text: "Hello" }] }, finishReason: "STOP", index: 0 }], usageMetadata: { promptTokenCount: 1, candidatesTokenCount: 1, totalTokenCount: 2 } })];
        } else if (provider === "claude") {
          assert(url.startsWith("https://api.anthropic.com/v1/messages"));
          assert(payload.messages.some((item: { content: { type: string }[] }) => item.content.some((part) => part.type === "tool_result")));
          events = [
            JSON.stringify({ type: "message_start", message: { id: "msg_test", type: "message", role: "assistant", content: [], model: "claude-haiku-5-5", stop_reason: null, stop_sequence: null, usage: { input_tokens: 1, output_tokens: 0 } } }),
            JSON.stringify({ type: "content_block_start", index: 0, content_block: { type: "text", text: "" } }),
            JSON.stringify({ type: "content_block_delta", index: 0, delta: { type: "text_delta", text: "Hello" } }),
            JSON.stringify({ type: "content_block_stop", index: 0 }),
            JSON.stringify({ type: "message_delta", delta: { stop_reason: "end_turn", stop_sequence: null }, usage: { output_tokens: 1 } }),
            JSON.stringify({ type: "message_stop" }),
          ];
        } else {
          assert(url.startsWith("https://api.deepseek.com/"));
          assert(payload.messages.some((item: { role: string; tool_call_id: string }) => item.role === "tool" && item.tool_call_id === "call_1"));
          events = [JSON.stringify({ id: "chat_test", object: "chat.completion.chunk", created: 0, model: "deepseek-flash", choices: [{ index: 0, delta: { content: "Hello" }, finish_reason: null }] }), JSON.stringify({ id: "chat_test", object: "chat.completion.chunk", created: 0, model: "deepseek-flash", choices: [{ index: 0, delta: {}, finish_reason: "stop" }] })];
        }
        return new Response(events.map((event) => `data: ${event}\n\n`).join(""), { headers: { "Content-Type": "text/event-stream" } });
      };
      const model = provider === "openai" ? "gpt-4o-mini" : provider === "gemini" ? "gemini-flash-latest" : provider === "claude" ? "claude-haiku-5-5" : "deepseek-flash";
      const response = await callPersonalProvider({ provider, apiKey: "test-placeholder-not-a-credential", model }, { messages, tools }, new AbortController().signal);
      const text = await response.text();
      assertEquals(response.status, 200, `${provider}: ${text}`);
      assert(text.includes('"content":"Hello"'), `${provider}: ${text}`);
      assert(sawRequest);
    }
  } finally { globalThis.fetch = original; }
});

Deno.test("provider access failure remains terminal and sanitized", async () => {
  const original = globalThis.fetch;
  let requests = 0;
  globalThis.fetch = async () => {
    requests++;
    return Response.json({ error: { message: "sensitive provider details", type: "authentication_error" } }, { status: 401 });
  };
  try {
    const response = await callPersonalProvider({ provider: "openai", apiKey: "test-placeholder-not-a-credential", model: "gpt-4o-mini" }, { messages: [{ role: "user", content: "Hi" }], tools: [] }, new AbortController().signal);
    assertEquals(response.status, 401);
    assertEquals(requests, 1);
    assert(!(await response.text()).includes("sensitive"));
  } finally { globalThis.fetch = original; }
});