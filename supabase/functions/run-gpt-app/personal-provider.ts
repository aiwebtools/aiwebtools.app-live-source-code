import { streamText, jsonSchema, type ModelMessage } from "npm:ai@7.0.148";
import { createOpenAI } from "npm:@ai-sdk/openai@4.0.99";
import { createGoogle } from "npm:@ai-sdk/google@4.0.102";
import { createAnthropic } from "npm:@ai-sdk/anthropic@4.0.85";
import { createDeepSeek } from "npm:@ai-sdk/deepseek@3.0.70";
import { PERSONAL_PROVIDERS, personalProviderError, type PersonalAi } from "../_shared/personal-provider-policy.ts";

// SDK warning payloads can carry native tool metadata; never emit them to logs.
(globalThis as typeof globalThis & { AI_SDK_LOG_WARNINGS?: boolean }).AI_SDK_LOG_WARNINGS = false;

type WireMessage = { role: string; content: unknown; tool_call_id?: string; tool_calls?: unknown };
type WireTool = { function: { name: string; description: string; parameters: Record<string, unknown> } };
export type PersonalProviderRun = { history?: ModelMessage[] };
const statusError = (statusCode: number) => Object.assign(new Error(personalProviderError({ statusCode })), { statusCode });

export async function checkPersonalProvider(config: PersonalAi, signal: AbortSignal) {
  const endpoints = {
    openai: "https://api.openai.com/v1/models",
    gemini: "https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000",
    claude: "https://api.anthropic.com/v1/models?limit=1000",
    deepseek: "https://api.deepseek.com/models",
  };
  const headers = config.provider === "gemini" ? { "x-goog-api-key": config.apiKey }
    : config.provider === "claude" ? { "x-api-key": config.apiKey, "anthropic-version": "2023-06-01" }
    : { Authorization: `Bearer ${config.apiKey}` };
  const response = await fetch(endpoints[config.provider], { headers, signal });
  if (!response.ok) throw statusError(response.status);
  const data = await response.json();
  const rows: { id?: string; name?: string; supportedGenerationMethods?: string[] }[] = config.provider === "gemini" ? data.models || [] : data.data || [];
  const available = new Set(rows.filter((row) => config.provider !== "gemini" || row.supportedGenerationMethods?.includes("generateContent"))
    .map((row) => String(row.id || row.name || "").replace(/^models\//, "")));
  const models = PERSONAL_PROVIDERS[config.provider].models.filter((model) => available.has(model));
  if (!models.length) throw statusError(404);
  return { models, message: "Key accepted by your provider. Billing, quota and replies are checked when you send a message." };
}

function sdkMessages(messages: WireMessage[], vision: boolean): { instructions: string; messages: ModelMessage[] } {
  const instructions = messages.filter((message) => message.role === "system").map((message) => String(message.content || "")).join("\n\n");
  const calls = new Map<string, string>();
  const converted: ModelMessage[] = [];
  for (const message of messages) {
    if (message.role === "system") continue;
    if (message.role === "tool") {
      const toolCallId = message.tool_call_id || "";
      const toolName = calls.get(toolCallId);
      if (!toolName) throw statusError(400);
      converted.push({ role: "tool", content: [{ type: "tool-result", toolCallId, toolName, output: { type: "text", value: String(message.content || "") } }] });
    } else if (message.role === "assistant") {
      const toolCalls = Array.isArray(message.tool_calls) ? message.tool_calls as { id: string; function: { name: string; arguments: string } }[] : [];
      if (!toolCalls.length) converted.push({ role: "assistant", content: String(message.content || "") });
      else converted.push({ role: "assistant", content: [
        ...(message.content ? [{ type: "text" as const, text: String(message.content) }] : []),
        ...toolCalls.map((call) => {
          calls.set(call.id, call.function.name);
          return { type: "tool-call" as const, toolCallId: call.id, toolName: call.function.name, input: JSON.parse(call.function.arguments || "{}") };
        }),
      ] });
    } else if (message.role === "user") {
      if (!Array.isArray(message.content)) converted.push({ role: "user", content: String(message.content || "") });
      else {
        const parts = message.content as { type: string; text?: string; image_url?: { url: string } }[];
        if (!vision && parts.some((part) => part.type === "image_url")) throw Object.assign(new Error("This personal model does not support photo input. Your attachment has not been analyzed."), { statusCode: 400 });
        converted.push({ role: "user", content: parts.flatMap<{ type: "text"; text: string } | { type: "image"; image: string }>((part) => part.type === "text"
          ? [{ type: "text" as const, text: part.text || "" }]
          : part.image_url?.url ? [{ type: "image" as const, image: part.image_url.url }] : []) });
      }
    }
  }
  return { instructions, messages: converted };
}

// One provider step, normalized to the existing chat transport. The existing
// tool loop executes search/images and sends complete tool-call/result pairs.
export async function callPersonalProvider(config: PersonalAi, payload: Record<string, unknown>, signal: AbortSignal, run: PersonalProviderRun = {}): Promise<Response> {
  try {
    const model = config.provider === "openai" ? createOpenAI({ apiKey: config.apiKey }).responses(config.model)
      : config.provider === "gemini" ? createGoogle({ apiKey: config.apiKey })(config.model)
      : config.provider === "claude" ? createAnthropic({ apiKey: config.apiKey })(config.model)
      : createDeepSeek({ apiKey: config.apiKey })(config.model);
    const history = sdkMessages(payload.messages as WireMessage[], PERSONAL_PROVIDERS[config.provider].vision);
    if (run.history) {
      // Keep native reasoning/thought signatures and complete tool calls inline.
      // Only the latest tool outputs are new; prior assistant items came from SDK.
      const trailing: ModelMessage[] = [];
      for (let i = history.messages.length - 1; i >= 0 && history.messages[i].role === "tool"; i--) trailing.unshift(history.messages[i]);
      history.messages = [...run.history, ...trailing];
    }
    const wireTools = (payload.tools || []) as WireTool[];
    const tools = Object.fromEntries(wireTools.map((tool) => [tool.function.name, {
      description: tool.function.description,
      inputSchema: jsonSchema(tool.function.parameters),
    }]));
    const chosen = payload.tool_choice as { function?: { name?: string } } | undefined;
    const reasoning = config.provider === "openai" && /^gpt-6/.test(config.model) && config.model !== "gpt-6-luna";
    const result = streamText({
      model, ...history, tools,
      ...(chosen?.function?.name ? { toolChoice: { type: "tool" as const, toolName: chosen.function.name } } : {}),
      abortSignal: signal, maxRetries: 0,
      providerOptions: config.provider === "openai" ? { openai: { store: false, ...(reasoning ? { forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", include: ["reasoning.encrypted_content"] } : config.model === "gpt-6-luna" ? { reasoningEffort: "none" } : {}) } } : undefined,
      onError: () => { /* Never log SDK error objects: they can contain request headers. */ },
    });
    const iterator = result.fullStream[Symbol.asyncIterator]();
    const first = await iterator.next();
    // SDK starts locally before provider headers. Consume through that local
    // start event so rejected keys return a real HTTP error before streaming.
    const pending = [first];
    while (!pending.at(-1)?.done && ["start", "start-step"].includes(String(pending.at(-1)?.value?.type))) pending.push(await iterator.next());
    const failed = pending.find((part) => !part.done && part.value.type === "error");
    if (failed && !failed.done && failed.value.type === "error") throw failed.value.error;
    const encoder = new TextEncoder();
    let toolIndex = 0;
    const body = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          let next = pending.shift() || await iterator.next();
          while (!next.done) {
            const part = next.value;
            let event: unknown;
            if (part.type === "text-delta") event = { choices: [{ delta: { content: part.text } }] };
            else if (part.type === "tool-call") event = { choices: [{ delta: { tool_calls: [{ index: toolIndex++, id: part.toolCallId, function: { name: part.toolName, arguments: JSON.stringify(part.input) } }] } }] };
            else if (part.type === "error") { event = { error: personalProviderError(part.error) }; }
            else if (part.type === "abort") { event = { error: "Reply stopped." }; }
            if (event) controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
            if (part.type === "error" || part.type === "abort") break;
            next = pending.shift() || await iterator.next();
          }
          const response = await result.response;
          run.history = [...history.messages, ...response.messages];
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          if (!signal.aborted) controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: personalProviderError(error) })}\n\n`));
          controller.close();
        }
      },
      async cancel() { await iterator.return?.(); },
    });
    return new Response(body, { headers: { "Content-Type": "text/event-stream" } });
  } catch (error) {
    const status = signal.aborted ? 499 : error && typeof error === "object" && "statusCode" in error ? Number(error.statusCode) || 502 : 502;
    return new Response(JSON.stringify({ error: signal.aborted ? "Reply stopped." : personalProviderError(error) }), { status, headers: { "Content-Type": "application/json" } });
  }
}