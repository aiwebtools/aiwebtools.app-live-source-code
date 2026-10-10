// Streams a hosted AIWebTools GPT. Members only. Instructions stay server-side.
// Supports image generation (Nano Banana) for bots whose instructions require it.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { selectBotModel } from "./model-selection.ts";
import { createLovableAiGatewayRunIdFetch, getLovableAiGatewayResponseHeaders } from "../_shared/run-id.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const DAILY_LIMIT = 60;
const GUEST_DAILY_LIMIT = 10;
const MAX_HISTORY = 120;
const MAX_CLIENT_HISTORY = 500;
const EARLIER_CONTEXT_CHARS = 20_000;
const CHAT_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const IMAGE_URL = "https://ai.gateway.lovable.dev/v1/images/generations";
const IMAGE_MODEL = "openai/gpt-image-2.5-sunburst";
const SIGNED_URL_TTL = 60 * 60 * 24 * 365;

const IMAGE_TOOL = {
  type: "function",
  function: {
    name: "generate_image",
    description:
      "Create an image, illustration, diagram, infographic, logo or any other visual for the user. Use it whenever a visual would answer better than text, or whenever the user asks for one.",
    parameters: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          description:
            "A rich, detailed visual description of the image to create, including style, composition, colours and any text that must appear inside the image.",
        },
      },
      required: ["prompt"],
      additionalProperties: false,
    },
  },
};

const SEARCH_TOOL = {
  type: "function",
  function: {
    name: "web_search",
    description: "Search the live web for current facts, news, prices, places, people or anything you are unsure about. Use it whenever the user asks you to look something up or needs up-to-date information.",
    parameters: {
      type: "object",
      properties: { query: { type: "string", description: "The search query." } },
      required: ["query"],
      additionalProperties: false,
    },
  },
};

const webSearch = async (query: string): Promise<string> => {
  const out: string[] = [];
  try {
    const r = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AIWebToolsBot/1.0)" },
    });
    const html = await r.text();
    const re = /<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g;
    const strip = (t: string) => t.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').trim();
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) && out.length < 6) {
      let url = m[1];
      const u = url.match(/uddg=([^&]+)/);
      if (u) url = decodeURIComponent(u[1]);
      out.push(`- ${strip(m[2])} (${url}): ${strip(m[3])}`);
    }
  } catch (e) { console.error("ddg failed", e); }
  if (out.length === 0) {
    try {
      const r = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srlimit=5&srsearch=${encodeURIComponent(query)}`);
      const j = await r.json();
      for (const h of j?.query?.search ?? []) {
        out.push(`- ${h.title} (https://en.wikipedia.org/wiki/${encodeURIComponent(h.title.replace(/ /g, "_"))}): ${String(h.snippet).replace(/<[^>]+>/g, "")}`);
      }
    } catch (e) { console.error("wiki failed", e); }
  }
  return out.length ? `Web results for "${query}":\n${out.join("\n")}` : "No web results were found. Answer from your own knowledge and say so.";
};

interface ChatMsg {
  role: string;
  content: string | null;
  tool_calls?: unknown;
  tool_call_id?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) return json({ error: "AI is not configured" }, 500);

  const authHeader = req.headers.get("Authorization") || "";

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  let userId: string | undefined;
  if (authHeader.startsWith("Bearer ")) {
    try {
      const authClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } },
      );
      const { data } = await authClient.auth.getClaims(authHeader.replace("Bearer ", ""));
      userId = data?.claims?.sub as string | undefined;
    } catch (_e) {
      userId = undefined;
    }
  }

  let body: {
    slug?: string;
    messages?: { role: string; content: string }[];
    conversationId?: string | null;
    guestId?: string;
    model?: string;
  } = {};
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }

  // Guests may run tools for free with a smaller daily allowance.
  const isGuest = !userId;
  let guestKey = "";
  if (isGuest) {
    const rawGuestId = typeof body.guestId === "string" ? body.guestId.slice(0, 80) : "";
    if (rawGuestId.length < 8) return json({ error: "Invalid request" }, 400);
    const ip =
      (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(`${rawGuestId}|${ip}`),
    );
    guestKey = Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  const slug = typeof body.slug === "string" ? body.slug.slice(0, 120) : "";
  const incoming = Array.isArray(body.messages) ? body.messages : [];
  if (!slug || incoming.length === 0) return json({ error: "Invalid request" }, 400);

  const validIncoming = incoming
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_CLIENT_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.replace(/_Creating your image…_/g, "").replace(/_Searching the web for “[^”]+”…_/g, "").slice(0, 8000) }));
  const recentMessages = validIncoming.slice(-MAX_HISTORY);
  const earlierMessages = validIncoming.slice(0, -MAX_HISTORY);
  const earlierContext = earlierMessages.length > 0
    ? earlierMessages
        .map((m) => `${m.role === "user" ? "Member" : "Assistant"}: ${m.content}`)
        .join("\n")
        .slice(-EARLIER_CONTEXT_CHARS)
    : "";
  const messages = earlierContext
    ? [{ role: "system", content: `Earlier conversation context to remember:\n${earlierContext}` }, ...recentMessages]
    : recentMessages;
  if (recentMessages.length === 0) return json({ error: "Invalid request" }, 400);

  // Daily usage cap (members get the full allowance, guests a free taster)
  const today = new Date().toISOString().slice(0, 10);
  const limit = isGuest ? GUEST_DAILY_LIMIT : DAILY_LIMIT;
  const { data: usage } = isGuest
    ? await admin
        .from("gpt_guest_usage")
        .select("message_count")
        .eq("guest_key", guestKey)
        .eq("usage_date", today)
        .maybeSingle()
    : await admin
        .from("gpt_usage")
        .select("message_count")
        .eq("user_id", userId)
        .eq("usage_date", today)
        .maybeSingle();
  const used = usage?.message_count ?? 0;
  if (used >= limit) {
    return json(
      {
        error: isGuest
          ? `You have used today's ${GUEST_DAILY_LIMIT} free messages. Create a free account to keep going, or come back tomorrow.`
          : `You have reached today's limit of ${DAILY_LIMIT} messages. It resets at midnight UTC.`,
      },
      429,
    );
  }

  const { data: app } = await admin
    .from("gpt_apps")
    .select("slug, display_name, model, is_active, supports_images")
    .eq("slug", slug)
    .maybeSingle();
  if (!app || !app.is_active) return json({ error: "This tool is not available." }, 404);
  const selectedModel = selectBotModel(app.model || "openai/gpt-6-astra", body.model);
  if (!selectedModel) return json({ error: "That model is not supported by this assistant." }, 400);

  const { data: promptRow } = await admin
    .from("gpt_app_prompts")
    .select("system_prompt")
    .eq("app_slug", slug)
    .maybeSingle();
  if (!promptRow?.system_prompt) return json({ error: "This tool is not available." }, 404);

  const { data: profile } = userId
    ? await admin.from("profiles").select("display_name").eq("id", userId).maybeSingle()
    : { data: null as { display_name?: string } | null };

  let systemPrompt = promptRow.system_prompt;
  if (profile?.display_name) {
    systemPrompt += `\n\nThe member you are speaking with is called ${profile.display_name}. Remember details they share during this conversation and refer back to them naturally.`;
  }
  systemPrompt +=
    "\n\nCORE OPERATING RULES: Follow the operational instructions above exactly and stay fully in this persona for the whole conversation, including its opening question and step-by-step flow. You have every capability of a modern assistant like ChatGPT and Gemini: deep reasoning, long memory of this whole conversation, writing, coding, analysis, tables, planning, live web search (web_search tool) and image creation (generate_image tool). Use web_search whenever the user asks you to look something up, mentions current events, prices, locations, or anything time-sensitive, and cite the source links you used. Make every reply vivid, immersive and true to your character.";
  systemPrompt +=
    "\n\nYou can create images. Call the generate_image tool whenever the user explicitly asks for a picture, image, illustration, diagram, infographic, chart, logo, artwork, visual, scene, portrait, design, or photo. Never merely promise to create it: call the tool in the same response. Describe the visual richly and preserve every requested detail in the tool prompt.";
  systemPrompt += "\n\nWhen creating a picture, first speak one or two brief in-character sentences continuing the current scene, then call generate_image in that same response. Preserve the user's companions, objects, location and unfolding plot from earlier turns. After creation, continue the scene rather than restarting your opening or asking to create the same image again.";

  // Conversation bookkeeping (members only — guest chats are not stored)
  let conversationId = body.conversationId || null;
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (userId) {
    if (conversationId) {
      const { data: owned } = await admin.from("gpt_conversations").select("id").eq("id", conversationId).eq("user_id", userId).eq("app_slug", slug).maybeSingle();
      if (!owned) return json({ error: "This conversation does not belong to your account or this assistant." }, 403);
    }
    if (!conversationId) {
      const { data: conv } = await admin
        .from("gpt_conversations")
        .insert({
          user_id: userId,
          app_slug: slug,
          title: (lastUser?.content || app.display_name).slice(0, 80),
        })
        .select("id")
        .single();
      conversationId = conv?.id ?? null;
    }
    if (conversationId && lastUser) {
      await admin.from("gpt_messages").insert({
        conversation_id: conversationId,
        user_id: userId,
        role: "user",
        content: lastUser.content,
      });
    }
  } else {
    conversationId = null;
  }

  if (isGuest) {
    await admin.from("gpt_guest_usage").upsert(
      {
        guest_key: guestKey,
        usage_date: today,
        message_count: used + 1,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "guest_key,usage_date" },
    );
  } else {
    await admin.from("gpt_usage").upsert(
      { user_id: userId, usage_date: today, message_count: used + 1, updated_at: new Date().toISOString() },
      { onConflict: "user_id,usage_date" },
    );
  }

  const gateway = createLovableAiGatewayRunIdFetch();
  const callGateway = (payload: Record<string, unknown>) =>
    gateway.fetch(CHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": LOVABLE_API_KEY, "X-Lovable-AIG-SDK": "fetch" },
      signal: req.signal,
      body: JSON.stringify(payload),
    });

  const basePayload = {
    model: selectedModel,
    stream: true,
    tools: [IMAGE_TOOL, SEARCH_TOOL],
  };

  const upstream = await callGateway({
    ...basePayload,
    messages: [{ role: "system", content: systemPrompt }, ...messages],
  });

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    console.error("gateway error", upstream.status, detail.slice(0, 400));
    let safeMessage = "The AI could not respond right now.";
    try { const parsed = JSON.parse(detail); safeMessage = parsed.message || parsed.error?.message || (typeof parsed.error === "string" ? parsed.error : safeMessage); } catch { /* non-JSON gateway failure */ }
    return json({ error: safeMessage }, upstream.status);
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const frame = (text: string) =>
    encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`);
  const activityFrame = (id: string, name: string, input: string, state: string, error?: string) => encoder.encode(`data: ${JSON.stringify({ activity: { id, name, input, state, error } })}\n\n`);

  let assistant = "";
  const requestStartedAt = Date.now();
  let imageRequested = false;
  let imageSucceeded = false;
  let finalStatus = "ok";
  let finalError: string | null = null;

  const writeChatLog = async () => {
    const { error } = await admin.from("gpt_chat_logs").insert({
      app_slug: slug,
      is_guest: isGuest,
      user_id: userId ?? null,
      model: basePayload.model,
      turn_count: recentMessages.length,
      prompt_chars: lastUser?.content?.length ?? 0,
      reply_chars: assistant.length,
      image_requested: imageRequested,
      image_succeeded: imageSucceeded,
      latency_ms: Date.now() - requestStartedAt,
      status: finalStatus,
      error: finalError,
      user_message: lastUser?.content?.slice(0, 8000) ?? null,
      assistant_reply: assistant.slice(0, 40000) || null,
    });
    if (error) console.error("chat log failed", error.message);
  };

  // Decodes base64 in slices so a large picture never doubles memory at once.
  const decodeBase64 = (b64: string): Uint8Array => {
    const clean = b64.replace(/\s/g, "");
    const out = new Uint8Array((clean.length / 4) * 3);
    let offset = 0;
    const CHUNK = 4 * 1024 * 4; // multiple of 4 keeps base64 groups intact
    for (let i = 0; i < clean.length; i += CHUNK) {
      const binary = atob(clean.slice(i, i + CHUNK));
      for (let j = 0; j < binary.length; j++) out[offset + j] = binary.charCodeAt(j);
      offset += binary.length;
    }
    return out.subarray(0, offset);
  };

  const makeImage = async (prompt: string): Promise<string> => {
    // Non-streaming keeps peak memory low: streamed partials previously blew
    // past the edge function memory limit and the picture never arrived.
    const requestImage = () => fetch(IMAGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_API_KEY}` },
      body: JSON.stringify({ model: IMAGE_MODEL, prompt, size: "1024x1024" }),
    });
    let res = await requestImage();
    if (res.status === 429 || res.status >= 500) {
      const retryAfter = Math.min(Number(res.headers.get("Retry-After") || "2"), 8);
      await new Promise((resolve) => setTimeout(resolve, Math.max(1, retryAfter) * 1000));
      res = await requestImage();
    }
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("image error", res.status, detail.slice(0, 300));
      if (res.status === 402) throw new Error("Picture credits are temporarily unavailable.");
      if (res.status === 429) throw new Error("Picture generation is busy. Please try again shortly.");
      throw new Error("The picture could not be created this time.");
    }
    const payload = await res.json().catch(() => null);
    const b64: string = payload?.data?.[0]?.b64_json || "";
    if (!b64) throw new Error("Picture generation ended before the final image was ready.");
    const bytes = decodeBase64(b64);
    const path = `${userId ?? `guest-${guestKey.slice(0, 16)}`}/${slug}/${crypto.randomUUID()}.png`;
    const { error: upErr } = await admin.storage
      .from("gpt-images")
      .upload(path, bytes, { contentType: "image/png", upsert: false });
    if (upErr) {
      console.error("image upload failed", upErr.message);
      throw new Error("The picture could not be saved this time.");
    }
    const { data: signed } = await admin.storage.from("gpt-images").createSignedUrl(path, SIGNED_URL_TTL);
    if (!signed?.signedUrl) throw new Error("The picture could not be opened this time.");
    return signed.signedUrl;
  };

  // Reads an upstream SSE stream, forwards text deltas, collects tool calls.
  const pump = async (
    res: Response,
    controller: ReadableStreamDefaultController<Uint8Array>,
  ): Promise<{ name: string; args: string; id: string }[]> => {
    if (!res.body) return [];
    const reader = res.body.getReader();
    const calls: { name: string; args: string; id: string }[] = [];
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const payload = line.slice(6).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const delta = JSON.parse(payload)?.choices?.[0]?.delta;
          if (typeof delta?.content === "string" && delta.content) {
            assistant += delta.content;
            controller.enqueue(frame(delta.content));
          }
          if (Array.isArray(delta?.tool_calls)) {
            for (const tc of delta.tool_calls) {
              const index = tc.index ?? 0;
              calls[index] = calls[index] || { name: "", args: "", id: "" };
              if (tc.id) calls[index].id = tc.id;
              if (tc.function?.name) calls[index].name += tc.function.name;
              if (tc.function?.arguments) calls[index].args += tc.function.arguments;
            }
          }
        } catch {
          /* partial frame */
        }
      }
    }
    return calls.filter(Boolean);
  };

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        let calls = await pump(upstream, controller);
        const convo: ChatMsg[] = [{ role: "system", content: systemPrompt }, ...messages];
        let turnTextStart = 0;
        for (let round = 0; round < 4 && calls.length > 0; round++) {
          const used = calls.filter((c) => c.name === "generate_image" || c.name === "web_search").slice(0, 4);
          if (used.length === 0) break;
          const toolResults: ChatMsg[] = [];
          const turnText = assistant.slice(turnTextStart);
          for (const [index, call] of used.entries()) {
            const id = call.id || `call_${round}_${index}`;
            call.id = id;
            let parsed: Record<string, unknown> = {};
            try { parsed = JSON.parse(call.args || "{}"); } catch { /* ignore */ }
            if (call.name === "web_search") {
              const q = String(parsed.query || "").slice(0, 300);
              controller.enqueue(activityFrame(id, call.name, q, "input-available"));
              controller.enqueue(frame(`\n\n_Searching the web for “${q}”…_\n\n`));
              toolResults.push({ role: "tool", tool_call_id: id, content: (await webSearch(q)).slice(0, 6000) });
              controller.enqueue(activityFrame(id, call.name, q, "output-available"));
              continue;
            }
            imageRequested = true;
            const imagePrompt = String(parsed.prompt || "").slice(0, 4000);
            controller.enqueue(activityFrame(id, call.name, imagePrompt, "input-available"));
            controller.enqueue(frame("\n\n_Creating your image…_\n\n"));
            let toolResult = "The picture could not be created this time. Explain that clearly and offer to try again.";
            try {
              const url = await makeImage(imagePrompt);
              const md = `![Generated image ${index + 1}](${url})`;
              assistant += `\n\n${md}\n\n`;
              controller.enqueue(frame(`${md}\n\n`));
              imageSucceeded = true;
              controller.enqueue(activityFrame(id, call.name, imagePrompt, "output-available"));
              toolResult = "The picture was created and is already visible in the chat. Briefly describe it and offer refinements. Do not repeat the image link.";
            } catch (error) {
              finalStatus = "image_error";
              finalError = error instanceof Error ? error.message : "Unknown picture error";
              toolResult = finalError;
              controller.enqueue(activityFrame(id, call.name, imagePrompt, "output-error", finalError));
              controller.enqueue(frame(`\n\n_${toolResult}_\n\n`));
            }
            toolResults.push({ role: "tool", tool_call_id: id, content: toolResult });
          }
          convo.push({
            role: "assistant",
            content: turnText || null,
            tool_calls: used.map((c) => ({ id: c.id, type: "function", function: { name: c.name, arguments: c.args || "{}" } })),
          } as ChatMsg, ...toolResults);
          turnTextStart = assistant.length;
          const follow = await callGateway({ ...basePayload, messages: convo });
          if (!follow.ok || !follow.body) {
            const detail = await follow.json().catch(() => ({}));
            finalStatus = "stream_error";
            finalError = detail.message || detail.error?.message || "The assistant could not finish this reply.";
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: finalError })}\n\n`));
            break;
          }
          calls = await pump(follow, controller);
        }
      } catch (err) {
        finalStatus = "stream_error";
        finalError = err instanceof Error ? err.message : "Unknown stream error";
        console.error("stream error", err);
      } finally {
        if (conversationId && assistant.trim()) {
          await admin.from("gpt_messages").insert({
            conversation_id: conversationId,
            user_id: userId,
            role: "assistant",
            content: assistant.slice(0, 40000),
          });
          await admin
            .from("gpt_conversations")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", conversationId);
        }
        if (!assistant.trim() && finalStatus === "ok") {
          finalStatus = "empty_reply";
          finalError = "The model returned no visible reply.";
        }
        await writeChatLog();
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: getLovableAiGatewayResponseHeaders(upstream.headers, {
      ...corsHeaders,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "X-Conversation-Id": conversationId ?? "",
      "Access-Control-Expose-Headers": "X-Conversation-Id",
    }),
  });
});
