import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Loader2, ArrowLeft, Star, ImageIcon, Repeat, SendHorizontal, Volume2, VolumeX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputFooter, PromptInputSubmit, PromptInputTextarea } from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { ImageProgress, splitImageProgress } from "@/components/ai-elements/image-progress";
import { ThinkingStatus } from "@/components/ai-elements/thinking-status";
import { useToast } from "@/hooks/use-toast";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useSpeechReader } from "@/hooks/useSpeechReader";
import { buildCanonicalUrl } from "@/utils/seo";
import { getGptAppTheme } from "@/utils/gptAppTheme";
import { getRoomMotto } from "@/components/tool-detail/gptRoomThemes";
import { getGptAvatar } from "@/components/tool-detail/gptAvatars";
import { loadToolImageMap } from "@/utils/search/toolImageMap";
import { getGuestId } from "@/utils/guestId";
import OpInstructionsButton from "@/components/tool-detail/OpInstructionsButton";
import MatrixRainBackdrop from "@/components/effects/MatrixRainBackdrop";
import { getGptVoiceProfile } from "@/utils/gptVoiceProfiles";

interface GptApp {
  slug: string;
  display_name: string;
  tool_title: string | null;
  tagline: string | null;
  greeting: string | null;
  starter_prompts: string[];
  supports_images?: boolean | null;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const FUNCTIONS_URL = "https://huupailptzvcykyqdkar.supabase.co/functions/v1/run-gpt-app";

const GptAppPage = () => {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, user, loading: sessionLoading } = useAuthSession();
  const voiceProfile = useMemo(() => getGptVoiceProfile(slug, app?.display_name), [app?.display_name, slug]);
  const speech = useSpeechReader(voiceProfile);

  const [app, setApp] = useState<GptApp | null>(null);
  const [loadingApp, setLoadingApp] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [siblings, setSiblings] = useState<GptApp[]>([]);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [toolImages, setToolImages] = useState<Map<string, string> | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const theme = useMemo(() => getGptAppTheme(slug, app?.display_name ?? ""), [slug, app]);
  const avatar = useMemo(() => {
    const matchingToolImage = app?.tool_title && toolImages?.get(app.tool_title.trim().toLowerCase());
    return matchingToolImage ?? getGptAvatar(theme.key);
  }, [app?.tool_title, theme.key, toolImages]);

  useEffect(() => {
    loadToolImageMap().then(setToolImages);
  }, []);

  useEffect(() => {
    let alive = true;
    setLoadingApp(true);
    setMessages([]);
    conversationIdRef.current = null;
    supabase
      .from("gpt_apps")
      .select("slug, display_name, tool_title, tagline, greeting, starter_prompts, supports_images")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle()
      .then(({ data }) => {
        if (!alive) return;
        setApp((data as GptApp) ?? null);
        setLoadingApp(false);
      });
    return () => {
      alive = false;
    };
  }, [slug]);

  // Resume the most recent conversation for this bot, and load the saved state.
  useEffect(() => {
    if (!user || !slug) return;
    let alive = true;

    supabase
      .from("gpt_conversations")
      .select("id")
      .eq("user_id", user.id)
      .eq("app_slug", slug)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(async ({ data }) => {
        if (!alive || !data?.id) return;
        const { data: rows } = await supabase
          .from("gpt_messages")
          .select("role, content")
          .eq("conversation_id", data.id)
          .order("created_at", { ascending: true })
          .limit(60);
        if (!alive || !rows?.length) return;
        conversationIdRef.current = data.id;
        setMessages(rows as ChatMessage[]);
      });

    supabase
      .from("gpt_favorites")
      .select("app_slug")
      .eq("user_id", user.id)
      .eq("app_slug", slug)
      .maybeSingle()
      .then(({ data }) => {
        if (alive) setFavorite(Boolean(data));
      });

    supabase
      .from("gpt_apps")
      .select("slug, display_name, tagline")
      .eq("is_active", true)
      .order("display_name")
      .limit(300)
      .then(({ data }) => {
        if (alive) setSiblings((data as GptApp[]) ?? []);
      });

    return () => {
      alive = false;
    };
  }, [user, slug]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, streaming]);

  useEffect(() => {
    if (!streaming) inputRef.current?.focus();
  }, [streaming, slug]);

  const toggleFavorite = useCallback(async () => {
    if (!user) {
      navigate(`/join?next=/app/${slug}`);
      return;
    }
    if (favorite) {
      setFavorite(false);
      await supabase.from("gpt_favorites").delete().eq("user_id", user.id).eq("app_slug", slug);
    } else {
      setFavorite(true);
      const { error } = await supabase.from("gpt_favorites").insert({ user_id: user.id, app_slug: slug });
      if (error) setFavorite(false);
    }
  }, [favorite, navigate, slug, user]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || streaming) return;
      const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
      setMessages(nextMessages);
      setInput("");
      setStreaming(true);
      speech.reset();

      let assistant = "";
      try {
        const response = await fetch(FUNCTIONS_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
          },
          body: JSON.stringify({
            slug,
            conversationId: conversationIdRef.current,
            messages: nextMessages,
            ...(session ? {} : { guestId: getGuestId() }),
          }),
        });

        const convId = response.headers.get("X-Conversation-Id");
        if (convId) conversationIdRef.current = convId;

        if (!response.ok || !response.body) {
          const detail = await response.json().catch(() => ({}));
          throw new Error(detail?.error || "The assistant is unavailable right now.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        setMessages([...nextMessages, { role: "assistant", content: "" }]);

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
              const parsed = JSON.parse(payload);
              const delta = parsed?.choices?.[0]?.delta?.content;
              if (typeof delta === "string" && delta) {
                assistant += delta;
                setMessages([...nextMessages, { role: "assistant", content: assistant }]);
                speech.feed(assistant);
              }
            } catch {
              /* partial frame */
            }
          }
        }
        speech.flush();
        if (!assistant.trim()) {
          setMessages(nextMessages);
          toast({ title: "Reply interrupted", description: "The assistant returned an empty reply. Please try again.", variant: "destructive" });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Something went wrong.";
        toast({ title: "Assistant paused", description: message, variant: "destructive" });
        if (!assistant.trim()) setMessages(nextMessages);
      } finally {
        setStreaming(false);
      }
    },
    [messages, navigate, session, slug, speech, streaming, toast],
  );

  const starters = useMemo(() => app?.starter_prompts?.slice(0, 4) ?? [], [app]);

  if (loadingApp || sessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <h1 className="text-2xl font-bold text-primary">This in-site tool is not available</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          It may have been renamed or retired. Browse the directory to find the tool you need.
        </p>
        <Button asChild>
          <Link to="/">Back to the directory</Link>
        </Button>
      </div>
    );
  }

  const themeVars = {
    "--bot-accent": theme.accent,
    "--bot-accent-2": theme.accent2,
    "--bot-soft": theme.soft,
    "--bot-deep": theme.deep,
  } as React.CSSProperties;

  return (
    <div className="gpt-app-room relative min-h-screen text-foreground" data-room-pattern={theme.pattern} style={themeVars}>
      <Helmet>
        <title>{`${app.display_name} — Run it free on AIWebTools.ai`}</title>
        <meta
          name="description"
          content={app.tagline || `Run ${app.display_name} directly on AIWebTools.ai — the in-site version of this custom GPT.`}
        />
        <link rel="canonical" href={buildCanonicalUrl(`/app/${app.slug}`)} />
      </Helmet>

      {/* Living Matrix code rain + embers behind the whole room */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, hsl(var(--bot-soft) / 0.7) 0%, transparent 55%)",
          }}
        />
        <MatrixRainBackdrop className="opacity-[0.55]" intensity={0.85} />
      </div>

      <header
        className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur"
        style={{ borderColor: "hsl(var(--bot-accent) / 0.35)" }}
      >
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <img src={avatar} alt={`${app.display_name} AI assistant avatar`} className="gpt-room-avatar h-10 w-10 shrink-0 rounded-full" onError={(event) => { event.currentTarget.src = getGptAvatar(theme.key); }} />
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold" style={{ color: "hsl(var(--bot-accent))" }}>
              <span className="gpt-glitch-title truncate" data-text={app.display_name}>
                {app.display_name}
              </span>
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              {theme.roomLabel} · UNIT {theme.consoleNumber}
              {app.tagline ? ` · ${app.tagline}` : ""}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <OpInstructionsButton slug={app.slug} name={app.display_name} compact className="hidden text-[10px] sm:inline-flex" />
            {speech.supported && (
              <button
                type="button"
                onClick={speech.toggle}
                aria-pressed={speech.enabled}
                className="gpt-room-icon-btn"
                title={speech.enabled ? `${voiceProfile.label} — tap to mute` : `Enable ${voiceProfile.label}`}
                aria-label={speech.enabled ? `Mute ${voiceProfile.label}` : `Enable ${voiceProfile.label}`}
              >
                {speech.enabled ? <Volume2 className="h-4 w-4" aria-hidden="true" /> : <VolumeX className="h-4 w-4" aria-hidden="true" />}
              </button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFavorite}
              aria-label={favorite ? "Remove from saved bots" : "Save this bot"}
              title={favorite ? "Saved" : "Save this bot"}
            >
              <Star className="h-4 w-4" fill={favorite ? "currentColor" : "none"} style={favorite ? { color: "hsl(var(--bot-accent))" } : undefined} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSwitcherOpen((v) => !v)}
              aria-label="Switch to another in-site tool"
              title="Switch tool"
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {switcherOpen && (
          <div className="mx-auto max-w-3xl px-4 pb-3">
            <div className="max-h-64 overflow-y-auto rounded-xl border border-border/70 bg-card/80 p-2">
              {siblings.length === 0 && <p className="p-2 text-xs text-muted-foreground">Loading tools…</p>}
              {siblings.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => {
                    setSwitcherOpen(false);
                    navigate(`/app/${item.slug}`);
                  }}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-primary/10 ${
                    item.slug === slug ? "text-primary" : "text-foreground/90"
                  }`}
                >
                  {item.display_name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10 mx-auto flex max-w-3xl flex-col gap-4 px-3 pb-52 pt-4 sm:px-4 sm:pb-40 sm:pt-6">
        <OpInstructionsButton slug={app.slug} name={app.display_name} className="justify-center text-center sm:hidden" />
        {messages.length === 0 && (
          <section
            className="rounded-2xl border p-4 sm:p-5"
            style={{
              borderColor: "hsl(var(--bot-accent) / 0.35)",
              background: "hsl(var(--bot-soft) / 0.45)",
            }}
          >
            <img src={avatar} alt={`${app.display_name} AI assistant`} className="gpt-room-avatar mb-3 h-20 w-20 rounded-full" onError={(event) => { event.currentTarget.src = getGptAvatar(theme.key); }} />
            <p className="text-sm text-foreground/90">
              {app.greeting || `Hello. I am ${app.display_name}. What would you like to work on?`}
            </p>
            {app.supports_images && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs text-muted-foreground"
                 style={{ borderColor: "hsl(var(--bot-accent) / 0.4)" }}>
                <ImageIcon className="h-3 w-3" aria-hidden="true" /> This tool can create pictures for you
              </p>
            )}
            {starters.length > 0 && (
              <>
              <p className="gpt-room-accent mt-4 text-[10px] font-bold uppercase tracking-[0.2em]">Try one of these</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {starters.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => send(prompt)}
                    className="rounded-lg border border-border/70 bg-background/60 p-3 text-left text-[13px] leading-snug text-muted-foreground transition hover:text-foreground sm:text-xs"
                    style={{ borderColor: "hsl(var(--bot-accent) / 0.25)" }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              </>
            )}
            {!session && (
              <p className="mt-4 text-xs text-muted-foreground">
                Free to try — 10 messages a day.{" "}
                <Link className="font-semibold text-primary hover:underline" to={`/join?next=/app/${app.slug}`}>
                  Create a free account
                </Link>{" "}
                to save your chats and get more.
              </p>
            )}
          </section>
        )}

        {messages.map((message, index) => (
          <Message
            key={`${message.role}-${index}`}
            from={message.role}
          >
            <MessageContent className={message.role === "user" ? "gpt-msg-user" : "gpt-msg-bot"}>
              <div className="gpt-msg-meta">
                {message.role === "assistant" && <img src={avatar} alt="" className="gpt-msg-avatar" aria-hidden="true" onError={(event) => { event.currentTarget.src = getGptAvatar(theme.key); }} />}
                <span>{message.role === "user" ? "You" : app.display_name}</span>
              </div>
              {message.role === "assistant" ? (
                (() => {
                  const { text, working } = splitImageProgress(message.content);
                  if (!text && !working) return <Shimmer>Writing…</Shimmer>;
                  return (
                    <>
                      {text && <MessageResponse className="gpt-generated-content">{text}</MessageResponse>}
                      {working && <ImageProgress />}
                    </>
                  );
                })()
              ) : <p className="whitespace-pre-wrap">{message.content}</p>}
            </MessageContent>
          </Message>
        ))}
        {streaming && messages.at(-1)?.role !== "assistant" && (
          <ThinkingStatus avatar={avatar} name={app.display_name} />
        )}
        <div ref={bottomRef} />
      </main>

      <div
        className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur sm:p-3"
        style={{ borderColor: "hsl(var(--bot-accent) / 0.35)" }}
      >
        <PromptInput onSubmit={({ text }) => send(text)} className="gpt-room-input mx-auto max-w-3xl">
          <PromptInputTextarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              app.supports_images ? "Ask anything — or ask for a picture…" : "Ask anything…"
            }
            rows={2}
            maxLength={6000}
            className="max-h-32 min-h-[56px] resize-none text-base sm:max-h-40 sm:min-h-[64px]"
          />
          <PromptInputFooter className="flex-wrap gap-2">
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.18em] sm:inline" style={{ color: "hsl(var(--bot-accent))" }}>{getRoomMotto(theme)}</span>
            <PromptInputSubmit
              status={streaming ? "streaming" : "ready"}
              disabled={streaming || !input.trim()}
              className="gpt-room-send w-full justify-center px-4 sm:ml-auto sm:w-auto sm:min-w-[9rem]"
              size="sm"
              aria-label={`Send message to ${app.display_name}`}
            >
              <SendHorizontal className="h-4 w-4" aria-hidden="true" />
              Send message
            </PromptInputSubmit>
          </PromptInputFooter>
        </PromptInput>
        <p className="mx-auto mt-1 max-w-3xl text-center text-[10px] sm:text-right text-muted-foreground">Press Enter to send · Shift+Enter for a new line</p>
      </div>
    </div>
  );
};

export default GptAppPage;
