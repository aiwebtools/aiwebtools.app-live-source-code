import { sanitizeExternalUrl } from "@/utils/links/linkSafety";
import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Loader2, Sparkles, Bot, Volume2, VolumeX, Play, Square } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import useSpeechReader from "@/hooks/useSpeechReader";
import MatrixRainBackdrop from "@/components/effects/MatrixRainBackdrop";
import type { Tool } from "@/types/tools";
import { getGptVoiceProfile } from "@/utils/gptVoiceProfiles";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/care-bot`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Keep slug behavior consistent with the rest of the app (see PinnedVideoPlayer / ToolDetail).
const slugifyToolTitle = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

type SearchIndexEntry = Pick<Tool, "title" | "description" | "category" | "directUrl"> & {
  pageUrl: string;
  tags: string;
  haystack: string;
};

let searchIndexPromise: Promise<SearchIndexEntry[]> | null = null;

const getSearchIndex = async () => {
  if (!searchIndexPromise) {
    searchIndexPromise = import("@/data/toolsData").then(({ allTools }) =>
      allTools.map((t) => {
        const slug = slugifyToolTitle(t.title);
        return {
          title: t.title,
          description: t.description,
          category: t.category,
          directUrl: t.directUrl,
          pageUrl: `https://aiwebtools.app/${slug}`,
          tags: (t.tags || []).join(" "),
          haystack: `${t.title} ${t.description} ${t.category || ""} ${(t.tags || []).join(" ")}`.toLowerCase(),
        };
      })
    );
  }
  return searchIndexPromise;
};

async function selectRelevantTools(query: string, max = 18) {
  const searchIndex = await getSearchIndex();
  const terms = query.toLowerCase().split(/\W+/).filter((w) => w.length > 2);
  if (!terms.length) {
    // Default: return some flagship custom GPTs
    return searchIndex
      .filter((t) => t.directUrl?.includes("lovable.app"))
      .slice(0, max)
      .map(({ haystack, tags, ...rest }) => rest);
  }
  const scored = searchIndex.map((t) => {
    let score = 0;
    for (const term of terms) {
      if (t.title.toLowerCase().includes(term)) score += 10;
      if (t.category?.toLowerCase().includes(term)) score += 4;
      if (t.tags.toLowerCase().includes(term)) score += 3;
      if (t.haystack.includes(term)) score += 1;
    }
    // Boost AIWebTools custom GPTs
    if (t.directUrl?.includes("lovable.app")) score += 2;
    return { t, score };
  });
  return scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map(({ t }) => {
      const { haystack, tags, ...rest } = t;
      return rest;
    });
}

const SUGGESTIONS = [
  "I want to make a music video",
  "Best AI for writing a book",
  "Find me a tool for graphic design",
  "How do I submit my AI tool?",
];

const CareBotWidget = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const voice = useSpeechReader(getGptVoiceProfile("aiwebtools-care-bot", "AIWebTools Care Bot"));

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Msg = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    voice.reset();

    let assistantSoFar = "";
    const appendDelta = (chunk: string) => {
      assistantSoFar += chunk;
      voice.feed(assistantSoFar);
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const toolContext = await selectRelevantTools(trimmed);
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ANON}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          toolContext,
        }),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({ error: "Network error" }));
        appendDelta(`\n\n⚠️ ${err.error || "Care Bot is unavailable right now. Please try again shortly."}`);
        setLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let done = false;

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        if (streamDone) break;
        buf += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) appendDelta(content);
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (e) {
      console.error("[CareBot] error", e);
      appendDelta("\n\n⚠️ Connection issue. Please try again.");
    } finally {
      voice.flush();
      setLoading(false);
    }
  }, [loading, messages, voice]);

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open AIWebTools Care Bot — Web Tools 24/7 Questions"
          title="Web Tools 24/7 Questions"
          className="fixed z-[9998] group flex flex-col items-center gap-1 focus:outline-none
                     bottom-3 right-3 sm:bottom-4 sm:right-4"
        >
          <span
            className="relative flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-green-400 via-emerald-500 to-green-700 text-black transition-transform group-hover:scale-110 group-focus:ring-4 group-focus:ring-green-400/50"
            style={{ boxShadow: "0 0 22px rgba(0,255,65,0.55), 0 0 44px rgba(0,255,65,0.25)" }}
          >
            {/* Pulsing ring */}
            <span className="absolute inset-0 rounded-full border-2 border-green-300/60" />
            <Bot className="w-6 h-6 sm:w-7 sm:h-7 relative z-10" strokeWidth={2.5} />
            {/* 24/7 badge */}
            <span className="absolute -top-1 -right-1 z-20 text-[7px] sm:text-[8px] font-mono font-bold px-1 sm:px-1.5 py-0.5 rounded-full bg-black text-green-300 border border-green-400 leading-none">
              24/7
            </span>
          </span>
          <span
            className="hidden sm:inline text-[9px] font-mono font-bold uppercase tracking-wider text-green-300 bg-black/80 px-2 py-0.5 rounded border border-green-500/40 whitespace-nowrap"
            style={{ textShadow: "0 0 6px #00ff41" }}
          >
            ASK OUR AI WEB TOOLS HELPER
          </span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed inset-x-2 bottom-16 sm:inset-x-auto sm:right-4 sm:bottom-4 z-[9999] w-auto sm:w-[380px] max-h-[72vh] sm:max-h-[80vh] flex flex-col rounded-2xl border border-green-500/40 bg-black/95 shadow-2xl"
          style={{ boxShadow: "0 0 40px rgba(0, 255, 0, 0.35)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-green-500/30 bg-gradient-to-r from-green-900/40 to-emerald-900/40 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-black" />
              </div>
              <div>
                <div className="font-bold text-green-300 text-sm leading-tight">
                  <span className="gpt-glitch-title" data-text="AIWebTools Care Bot">AIWebTools Care Bot</span>
                </div>
                <div className="text-[10px] text-green-500/70">Powered by AI · 5,500+ tools indexed</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {voice.supported && (
                <button
                  onClick={voice.toggle}
                  aria-label={voice.enabled ? "Turn off read-aloud" : "Turn on read-aloud"}
                  title={voice.enabled ? "Read-aloud is ON — tap to mute" : "Read-aloud is OFF — tap to unmute"}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    voice.enabled
                      ? "text-green-200 border-green-400/60 bg-green-500/20"
                      : "text-green-600 border-green-700/40 hover:text-green-300"
                  }`}
                >
                  {voice.enabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              )}
              <button
                onClick={() => { voice.stop(); setOpen(false); }}
                aria-label="Close chat"
                className="text-green-300 hover:text-green-100 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages — living Matrix code rain behind the conversation */}
          <div className="relative flex-1 overflow-hidden">
          <MatrixRainBackdrop className="opacity-[0.34]" intensity={0.55} />
          <div ref={scrollRef} className="relative z-10 h-full overflow-y-auto px-3 py-3 space-y-3 min-h-[280px]">
            {messages.length === 0 ? (
              <div className="space-y-3">
                <div className="text-green-200 text-sm leading-relaxed">
                  👋 Hey! I'm your AIWebTools Care Bot. Ask me anything about our <strong>5,500+ AI tools</strong> — I can recommend tools, explain how they work, and link you straight to them.
                </div>
                <div className="space-y-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="w-full text-left text-xs px-3 py-2 rounded-lg border border-green-500/30 bg-green-500/5 text-green-300 hover:bg-green-500/15 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                      m.role === "user"
                        ? "bg-green-600 text-black font-medium"
                        : "bg-green-500/10 text-green-100 border border-green-500/20"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_strong]:text-green-300">
                        <ReactMarkdown
                          components={{
                            a: ({ href, children }) => {
                              const url = String(href || "");
                              // Detect internal AIWebTools tool-page links so they
                              // navigate INSIDE the app instantly (no full reload,
                              // no new tab) — the bot's recommendations should
                              // land users on our own pages first.
                              let internalPath: string | null = null;
                              try {
                                const u = new URL(url, window.location.origin);
                                const isInternalHost =
                                  u.origin === window.location.origin ||
                                  /(^|\.)aiwebtools\.ai$/i.test(u.hostname) ||
                                  /(^|\.)aiwebtools\.lovable\.app$/i.test(u.hostname);
                                if (isInternalHost) {
                                  internalPath = `${u.pathname}${u.search}${u.hash}` || "/";
                                }
                              } catch { /* relative or bad URL — treat as external */ }

                              return (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (internalPath) {
                                      // In-app navigation to the tool's detail page.
                                      setOpen(false);
                                      navigate(internalPath);
                                    } else {
                                      // External tool launcher — open instantly in a
                                      // new tab, no time-warp, no middle-man loader.
                                      window.open(sanitizeExternalUrl(url), "_blank", "noopener,noreferrer");
                                    }
                                  }}
                                  className={
                                    internalPath
                                      ? "inline-flex items-center gap-1 mx-0.5 my-0.5 px-2 py-0.5 rounded-md bg-green-500/20 hover:bg-green-500/40 border border-green-400/50 text-green-100 hover:text-white text-xs font-semibold transition-colors no-underline"
                                      : "inline-flex items-center gap-1 mx-0.5 my-0.5 px-2 py-0.5 rounded-md bg-cyan-500/15 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 hover:text-white text-xs font-semibold transition-colors no-underline"
                                  }
                                  title={url}
                                >
                                  {children}
                                  <span aria-hidden className="text-[10px] opacity-80">{internalPath ? "→" : "↗"}</span>
                                </button>
                              );
                            },
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                        {voice.supported && m.content.trim().length > 0 && (
                          <button
                            type="button"
                            onClick={() => voice.speakNow(m.content)}
                            aria-label={voice.speaking ? "Stop reading this answer" : "Read this answer out loud"}
                            title={voice.speaking ? "Stop reading" : "Read this answer out loud"}
                            className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-md border border-green-400/50 bg-green-500/15 hover:bg-green-500/30 text-green-200 text-[11px] font-semibold transition-colors"
                          >
                            {voice.speaking ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                            {voice.speaking ? "Stop" : "Play"}
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{m.content}</div>
                    )}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex items-center gap-2 text-green-400 text-xs">
                <Loader2 className="w-3 h-3 animate-spin" /> Thinking…
              </div>
            )}
          </div>
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="border-t border-green-500/30 p-3 flex items-end gap-2"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask about any AI tool…"
              rows={1}
              className="flex-1 resize-none bg-black/60 border border-green-500/30 rounded-lg px-3 py-2 text-sm text-green-100 placeholder:text-green-700 focus:outline-none focus:border-green-400 max-h-32"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-green-500 hover:bg-green-400 disabled:bg-green-900 disabled:cursor-not-allowed text-black p-2 rounded-lg transition-colors"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default CareBotWidget;