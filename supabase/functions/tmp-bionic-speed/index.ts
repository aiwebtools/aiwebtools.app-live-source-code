// TEMPORARY speed test; deleted after use. Returns timings + short text only.
const URL_ = "https://api.lmstudio.ai/v1/chat/completions";
const VARIANTS: Record<string, Record<string, unknown>> = {
  baseline: {},
  effort_low: { reasoning_effort: "low" },
  effort_none: { reasoning_effort: "none" },
  thinking_off: { thinking: { type: "disabled" } },
};
Deno.serve(async (req) => {
  const { prompt, variant, system } = await req.json();
  const extra = VARIANTS[variant]; if (!extra) return new Response("bad", { status: 400 });
  const t0 = Date.now(); let first = 0, text = "", reasoning = 0;
  const r = await fetch(URL_, { method: "POST", headers: { Authorization: `Bearer ${Deno.env.get("BIONIC_API_KEY")}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "bionic/glm-5.3-flash", stream: true, max_tokens: 500, messages: [{ role: "system", content: system }, { role: "user", content: prompt }], ...extra }) });
  if (!r.ok) return Response.json({ variant, status: r.status, err: (await r.text()).slice(0, 200) });
  const rd = r.body!.getReader(); const dec = new TextDecoder(); let buf = "";
  while (true) { const { done, value } = await rd.read(); if (done) break; buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n"); buf = lines.pop() ?? "";
    for (const l of lines) { if (!l.startsWith("data:") || l.includes("[DONE]")) continue;
      try { const d = JSON.parse(l.slice(5)).choices?.[0]?.delta ?? {};
        if (d.reasoning_content || d.reasoning) reasoning += String(d.reasoning_content || d.reasoning).length;
        if (d.content) { if (!first) first = Date.now() - t0; text += d.content; } } catch { /* skip */ } } }
  return Response.json({ variant, firstWordMs: first, totalMs: Date.now() - t0, reasoningChars: reasoning, chars: text.length, text: text.slice(0, 700) });
});
