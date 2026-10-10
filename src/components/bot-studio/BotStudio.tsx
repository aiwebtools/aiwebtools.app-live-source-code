import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bot, Check, Copy, Download, Globe, History, ImageIcon, Menu, Mic, MicOff, Plus, Search, SendHorizontal, Settings2, Square, Volume2, VolumeX, Play, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputFooter, PromptInputSubmit, PromptInputTextarea } from "@/components/ai-elements/prompt-input";
import { ImageProgress, splitImageProgress } from "@/components/ai-elements/image-progress";
import { ThinkingStatus } from "@/components/ai-elements/thinking-status";
import MatrixRainBackdrop from "@/components/effects/MatrixRainBackdrop";
import OpInstructionsButton from "@/components/tool-detail/OpInstructionsButton";
import { getGptRoomTheme } from "@/components/tool-detail/gptRoomThemes";
import { getGptAvatar } from "@/components/tool-detail/gptAvatars";
import { getGptVoiceProfile, type GptVoiceProfile } from "@/utils/gptVoiceProfiles";
import { useSpeechReader } from "@/hooks/useSpeechReader";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useAuthSession } from "@/hooks/useAuthSession";
import { getGuestId } from "@/utils/guestId";
import { playTimeWarpVoice } from "@/utils/effects/timeWarpVoice";
import { conversationPath, openBotConversation, readBotConversations, saveBotConversation, type BotConversation, type BotMessage } from "@/utils/botConversations";
import { loadToolImageMap } from "@/utils/search/toolImageMap";
import { loadStudioBots, STUDIO_MODELS, type StudioBot } from "./botCatalog";
import BotPortrait from "./BotPortrait";
import StudioImageActions from "./StudioImageActions";
import { Tool, ToolHeader, ToolContent } from "@/components/ai-elements/tool";
import type { BotActivity } from "@/utils/botConversations";

export default function BotStudio({ app, threadId, embedded = false }: { app: StudioBot; threadId?: string; embedded?: boolean }) {
  const navigate = useNavigate();
  const { session } = useAuthSession();
  const [thread, setThread] = useState(() => openBotConversation(app.slug, threadId));
  const [threads, setThreads] = useState(readBotConversations);
  const [bots, setBots] = useState<StudioBot[]>([]);
  const [query, setQuery] = useState("");
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [notice, setNotice] = useState("");
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const [imageMap, setImageMap] = useState<Map<string, string> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const threadRef = useRef(thread);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const theme = useMemo(() => getGptRoomTheme(app.slug, app.tagline || "", app.display_name), [app.slug, app.tagline, app.display_name]);
  const defaultProfile = useMemo(() => getGptVoiceProfile(app.slug, app.display_name, app.tagline || ""), [app.slug, app.display_name, app.tagline]);
  const [voice, setVoice] = useState<GptVoiceProfile["voice"]>(defaultProfile.voice);
  const [speed, setSpeed] = useState(defaultProfile.speed);
  const profile = useMemo(() => ({ ...defaultProfile, voice, speed }), [defaultProfile, voice, speed]);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const speech = useSpeechReader(profile);
  const avatar = (app.tool_title ? imageMap?.get(app.tool_title.trim().toLowerCase()) : null) || getGptAvatar(theme.key);
  const themeVars = { "--bot-accent": theme.accent, "--bot-accent-2": theme.accent2, "--bot-soft": theme.soft, "--bot-deep": theme.deep } as React.CSSProperties;
  const welcome = theme.key === "time-machine" && app.slug === "time-machine-gpt" ? "Great Scott! User, what date would you like to teleport to, & where do you want to go?" : app.greeting || `Hello, I am ${app.display_name}. What would you like to explore?`;

  useEffect(() => {
    void loadStudioBots().then(setBots).catch((error) => setNotice(error.message));
    void loadToolImageMap().then(setImageMap);
  }, []);
  useEffect(() => {
    if (!embedded && !threadId) navigate(conversationPath(app.slug, thread.id), { replace: true });
  }, [app.slug, embedded, navigate, thread.id, threadId]);
  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(() => {
    if (!streaming && window.matchMedia("(pointer: fine)").matches) inputRef.current?.focus({ preventScroll: true });
  }, [streaming, thread.id]);

  const commit = useCallback((next: BotConversation) => {
    threadRef.current = next;
    setThread(next);
    if (!saveBotConversation(next)) setNotice("This browser could not save your chat. Free device storage to keep your history.");
    setThreads(readBotConversations());
  }, []);
  const stop = useCallback(() => { abortRef.current?.abort(); speech.stop(); }, [speech]);
  const send = useCallback(async (text: string) => {
    if (!text.trim() || streaming) return;
    const current = threadRef.current;
    const messages: BotMessage[] = [...current.messages, { role: "user", content: text.trim() }];
    const base = { ...current, messages, title: current.messages.length ? current.title : text.trim().slice(0, 70), updatedAt: Date.now() };
    commit(base);
    setInput(""); setNotice(""); setStreaming(true); speech.reset();
    const controller = new AbortController(); abortRef.current = controller;
    let assistant = "";
    const activities: BotActivity[] = [];
    let serverId = current.serverId;
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/run-gpt-app`, {
        method: "POST", signal: controller.signal,
        headers: { "Content-Type": "application/json", ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}) },
        body: JSON.stringify({ slug: app.slug, conversationId: current.serverId, messages, ...(current.model !== "default" ? { model: current.model } : {}), ...(session ? {} : { guestId: getGuestId() }) }),
      });
      if (!response.ok || !response.body) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail.error || detail.message || "The assistant is unavailable right now.");
      }
      serverId = response.headers.get("X-Conversation-Id") || serverId;
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        buffer += done ? decoder.decode() : decoder.decode(value, { stream: true });
        const lines = buffer.split("\n"); buffer = done ? "" : lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim(); if (!payload || payload === "[DONE]") continue;
          let parsed; try { parsed = JSON.parse(payload); } catch { continue; }
          if (parsed.error) { setNotice(parsed.error); continue; }
          if (parsed.activity) {
            const activity = parsed.activity as BotActivity;
            const found = activities.findIndex((item) => item.id === activity.id);
            if (found >= 0) activities[found] = activity; else activities.push(activity);
            setThread({ ...base, serverId, messages: [...messages, { role: "assistant", content: assistant, activities: [...activities] }] });
          }
          const delta = parsed?.choices?.[0]?.delta?.content;
          if (typeof delta === "string") {
            assistant += delta;
            // Keep streamed state responsive; save the complete turn at the end.
            setThread({ ...base, serverId, messages: [...messages, { role: "assistant", content: assistant, activities: [...activities] }] });
            speech.feed(assistant);
          }
        }
        if (done) break;
      }
      speech.flush();
      if (!assistant.trim()) setNotice("The reply ended without an answer. Your message is saved; please try again.");
    } catch (error) {
      if (!controller.signal.aborted) setNotice(error instanceof Error ? error.message : "The reply could not load.");
    } finally {
      commit({ ...base, serverId, messages: assistant || activities.length ? [...messages, { role: "assistant", content: assistant, activities: activities.map((activity) => activity.state === "input-available" ? { ...activity, state: "output-error", error: "This action was interrupted." } : activity) }] : messages, updatedAt: Date.now() });
      setStreaming(false); abortRef.current = null;
    }
  }, [app.slug, commit, session, speech, streaming]);
  const mic = useVoiceInput((text) => { if (streaming) setInput(text); else void send(text); }, speech.pauseForMicrophone, speech.resumeAfterMicrophone);

  const chooseThread = (item: BotConversation) => {
    stop(); setLeftOpen(false); playTimeWarpVoice();
    if (embedded && item.slug === app.slug) { commit(item); setInput(""); }
    else navigate(conversationPath(item.slug, item.id));
  };
  const newChat = () => {
    const item = openBotConversation(app.slug, crypto.randomUUID());
    chooseThread(item);
  };
  const chooseBot = (slug: string) => chooseThread(openBotConversation(slug));
  const exportChat = () => {
    const blob = new Blob([`# ${app.display_name}\n\n${thread.messages.map((message) => `## ${message.role === "user" ? "You" : app.display_name}\n\n${message.content}`).join("\n\n")}`], { type: "text/markdown;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = href; link.download = `${app.slug}-conversation.md`; link.click();
    setTimeout(() => URL.revokeObjectURL(href), 10000);
  };
  const sidebar = <>
    <Button className="studio-new w-full gap-2" onClick={newChat} disabled={streaming}><Plus className="h-4 w-4" />New chat</Button>
    <h2 className="studio-label mt-6"><Bot className="h-4 w-4" />My GPTs</h2>
    <div className="relative my-3"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><input aria-label="Search bots" placeholder="Find an assistant…" value={query} onChange={(e) => setQuery(e.target.value)} className="studio-search w-full rounded-md border bg-background pl-9 pr-2 text-sm" /></div>
    <div className="studio-bots">
      {bots.filter((bot) => `${bot.display_name} ${bot.tagline}`.toLowerCase().includes(query.toLowerCase())).map((bot) => <Button key={bot.slug} variant="ghost" disabled={streaming} onClick={() => chooseBot(bot.slug)} className={`studio-row ${bot.slug === app.slug ? "studio-selected" : ""}`}><span className="studio-bot-mark">{getGptRoomTheme(bot.slug).emblem}</span><span className="truncate">{bot.display_name}</span></Button>)}
    </div>
    <h2 className="studio-label mt-5"><History className="h-4 w-4" />Recent chats</h2>
    <div className="studio-history mt-2">{threads.map((item) => <Button key={item.id} variant="ghost" disabled={streaming} onClick={() => chooseThread(item)} className={`studio-row ${item.id === thread.id ? "studio-selected" : ""}`}><History className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{item.title}</span></Button>)}</div>
    <p className="mt-4 text-xs text-muted-foreground">Saved on this device · {threads.length} conversations</p>
  </>;
  const settings = <>
    <h2 className="studio-label"><Settings2 className="h-4 w-4" />Model selection</h2>
    <Select value={thread.model} disabled={streaming} onValueChange={(model) => commit({ ...threadRef.current, model })}><SelectTrigger className="mt-3" aria-label="Choose AI model"><SelectValue /></SelectTrigger><SelectContent>{STUDIO_MODELS.map((model) => <SelectItem key={model.id} value={model.id}>{model.label}</SelectItem>)}</SelectContent></Select>
    <p className="mt-2 break-words text-xs text-muted-foreground">{thread.model === "default" ? app.model : thread.model}</p>
    <div className="studio-setting-section"><h2 className="studio-label"><Volume2 className="h-4 w-4" />Voice settings</h2><p className="mt-3 text-sm gpt-room-accent">{profile.label}</p><Select value={voice} onValueChange={(value) => { speech.stop(); setVoice(value as GptVoiceProfile["voice"]); }}><SelectTrigger className="mt-3" aria-label="Choose speaking voice"><SelectValue /></SelectTrigger><SelectContent>{(["alloy", "ash", "ballad", "coral", "echo", "fable", "nova", "onyx", "sage", "shimmer", "verse"] as const).map((item) => <SelectItem key={item} value={item}>{item.charAt(0).toUpperCase() + item.slice(1)}{item === defaultProfile.voice ? " · Character default" : ""}</SelectItem>)}</SelectContent></Select><label className="studio-voice-control">Speed · {speed.toFixed(2)}×<input aria-label="Voice speed" type="range" min="0.75" max="1.25" step="0.05" value={speed} onChange={(event) => { speech.stop(); setSpeed(Number(event.target.value)); }} /></label><Button variant="outline" className="mt-3 w-full gap-2" onClick={speech.toggle} aria-pressed={speech.enabled}>{speech.enabled ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}{speech.enabled ? "Mute voice" : "Enable voice"}</Button><Button variant="ghost" className="mt-2 w-full gap-2" onClick={() => speech.speakNow(welcome)}><Play className="h-4 w-4" />Preview voice</Button></div>
    <div className="studio-setting-section"><h2 className="studio-label">Tools & capabilities</h2>{[[Globe, "Live web search"], [ImageIcon, "Image generation"], [Mic, mic.supported ? "Voice conversation" : "Microphone unavailable"], [History, "Device memory"]].map(([Icon, label]) => { const Component = Icon as typeof Globe; return <div className="studio-capability" key={String(label)}><Component className="h-4 w-4" /><span>{String(label)}</span>{label === "Microphone unavailable" ? <span className="ml-auto text-muted-foreground">—</span> : <Check className="ml-auto h-4 w-4 text-primary" />}</div>; })}</div>
    <div className="studio-setting-section"><OpInstructionsButton slug={app.slug} name={app.display_name} singleOnly compact label="Instructions (PDF)" /><Button variant="ghost" className="mt-3 w-full gap-2" onClick={exportChat}><Download className="h-4 w-4" />Export conversation</Button></div>
  </>;
  return <section id="try-bot" aria-label={`Run ${app.display_name} here`} className={`gpt-room studio ${embedded ? "studio-embedded" : "studio-full"}`} data-room-pattern={theme.pattern} style={themeVars}>
    <MatrixRainBackdrop className="studio-rain" intensity={embedded ? 0.55 : 0.8} />
    <div className="studio-topbar"><Link to="/" className="studio-brand"><span>AI</span>WEBTOOLS<span>.APP</span></Link><span className="studio-label hidden sm:flex"><span className="studio-live-dot" />AI CONVERSATION STUDIO</span><div className="ml-auto flex gap-1"><Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setLeftOpen(true)} aria-label="Open bots and chat history"><Menu className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="xl:hidden" onClick={() => setRightOpen(true)} aria-label="Open model and voice settings"><Settings2 className="h-4 w-4" /></Button></div></div>
    <div className="studio-grid">
      <aside className="studio-sidebar hidden lg:flex">{sidebar}</aside>
      <main className="studio-main">
        <header className="studio-bot-header"><BotPortrait src={avatar} name={app.display_name} themeKey={theme.key} emblem={theme.emblem} className="gpt-room-avatar h-11 w-11 shrink-0 rounded-md" /><div className="min-w-0 flex-1"><h1 className="break-words text-base font-bold sm:text-xl gpt-room-accent"><span className="gpt-glitch-title" data-text={app.display_name}>{app.display_name}</span></h1><p className="mt-1 truncate text-xs text-muted-foreground">{theme.roomLabel}</p></div><Button variant="ghost" size="icon" className="shrink-0" onClick={speech.toggle} aria-label={speech.enabled ? "Mute the voice" : "Enable the voice"} title={speech.enabled ? "Mute the voice" : "Enable the voice"}>{speech.enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}</Button><div className="studio-header-pdf"><OpInstructionsButton slug={app.slug} name={app.display_name} singleOnly compact label="PDF" /></div></header>
        <Conversation className="studio-transcript"><ConversationContent className="gap-5 p-4 sm:p-6">
          {!thread.messages.length && <div className="studio-welcome"><BotPortrait src={avatar} name={app.display_name} themeKey={theme.key} emblem={theme.emblem} className="gpt-room-avatar mb-5 h-20 w-20 rounded-md" /><p className="text-sm leading-7 text-foreground">{welcome}</p><div className="mt-5 grid gap-2 sm:grid-cols-2">{(app.starter_prompts || []).slice(0, 2).map((prompt) => <Button variant="ghost" className="studio-starter h-auto whitespace-normal text-left text-xs" key={prompt} onClick={() => send(prompt)}>{prompt}</Button>)}</div></div>}
          {thread.messages.map((message, index) => { const { text, working } = splitImageProgress(message.content); return <Message key={index} from={message.role}><MessageContent className={message.role === "user" ? "gpt-msg-user" : "gpt-msg-bot"}><div className="gpt-msg-meta">{message.role === "assistant" && <BotPortrait src={avatar} name={app.display_name} themeKey={theme.key} emblem={theme.emblem} className="gpt-msg-avatar" />}<span>{message.role === "user" ? "You" : app.display_name}</span></div>{message.role === "user" ? <p className="whitespace-pre-wrap">{message.content}</p> : <>{(message.activities || []).map((activity) => <Tool key={activity.id} defaultOpen={false}><ToolHeader type="dynamic-tool" toolName={activity.name} title={activity.name === "generate_image" ? "Image generation" : "Web search"} state={activity.state} /><ToolContent><p className="text-xs break-words">{activity.input}</p>{activity.error && <p className="text-xs text-destructive">{activity.error}</p>}</ToolContent></Tool>)}{text && <MessageResponse className="gpt-generated-content">{text}</MessageResponse>}{working && streaming && index === thread.messages.length - 1 && <ImageProgress />}<StudioImageActions content={message.content} name={app.display_name} busy={streaming} onError={setNotice} onPrompt={(text) => { setInput(text); inputRef.current?.focus(); }} />{text && <div className="mt-2 flex gap-1"><Button variant="ghost" size="icon" onClick={() => speech.speakNow(text)} aria-label={speech.speaking ? "Stop reading" : "Play reply"} title="Play or stop reply">{speech.speaking ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}</Button><Button variant="ghost" size="icon" aria-label="Copy reply" title="Copy reply" onClick={() => { void navigator.clipboard.writeText(text).then(() => setCopied(index)).catch(() => setNotice("Copy is unavailable in this browser.")); }}>{copied === index ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}</Button></div>}</>}</MessageContent></Message>; })}
          {streaming && !thread.messages.at(-1)?.content && <ThinkingStatus avatar={avatar} name={app.display_name} />}
          {streaming && thread.messages.at(-1)?.role === "user" && <ThinkingStatus avatar={avatar} name={app.display_name} />}
        </ConversationContent><ConversationScrollButton className="gpt-room-scroll" /></Conversation>
        <div className="studio-composer">{notice && <p role="alert" className="mb-2 text-xs text-destructive">{notice}</p>}<PromptInput onSubmit={({ text }) => send(text)} className="gpt-room-input"><PromptInputTextarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder={theme.placeholder} rows={2} maxLength={6000} className="max-h-32 min-h-12 text-base" /><PromptInputFooter className="gap-1"><input ref={fileRef} className="hidden" type="file" accept=".txt,.md,.csv,.json" aria-label="Attach text or data file" onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; if (file.size > 24000) { setNotice("Choose a smaller text file that fits in your message."); event.target.value = ""; return; } const text = await file.text(); if (text.length + input.length > 6000) setNotice("This file is too long for one message. Please attach a smaller excerpt."); else setInput((value) => `${value}\n\nAttached file: ${file.name}\n${text}`.trim()); event.target.value = ""; }} /><Button type="button" variant="ghost" size="icon" onClick={() => fileRef.current?.click()} title="Attach text, CSV or JSON" aria-label="Attach text or data"><Paperclip className="h-4 w-4" /></Button><Button type="button" variant="ghost" size="icon" onClick={mic.toggle} aria-label={mic.listening ? "Stop microphone" : "Speak to the bot"} aria-pressed={mic.listening}>{mic.listening ? <MicOff className="h-4 w-4 animate-pulse" /> : <Mic className="h-4 w-4" />}</Button><Button type="button" variant="ghost" size="icon" onClick={() => { setInput("Search the web for "); inputRef.current?.focus(); }} title="Search the web" aria-label="Search the web"><Globe className="h-4 w-4" /></Button><Button type="button" variant="ghost" size="icon" onClick={() => { setInput("Create an image of "); inputRef.current?.focus(); }} title="Create an image" aria-label="Create an image"><ImageIcon className="h-4 w-4" /></Button><span className="hidden text-xs text-muted-foreground sm:inline">{mic.listening ? "Listening…" : speech.speaking ? "Speaking…" : theme.signature}</span><PromptInputSubmit onStop={stop} status={streaming ? "streaming" : "ready"} disabled={!streaming && !input.trim()} className="gpt-room-send ml-auto h-11 w-11 shrink-0" aria-label={streaming ? "Stop reply" : `Send message to ${app.display_name}`}>{streaming ? <Square className="h-4 w-4" /> : <SendHorizontal className="h-4 w-4" />}</PromptInputSubmit></PromptInputFooter></PromptInput><div className="studio-status"><span className="studio-live-dot" />{mic.listening ? "Listening" : speech.speaking ? profile.label : streaming ? "Assistant active" : "Ready"}<span className="ml-auto truncate">{theme.mottoText}</span></div></div>
      </main><aside className="studio-settings hidden xl:block">{settings}</aside>
    </div>
    <Sheet open={leftOpen} onOpenChange={setLeftOpen}><SheetContent side="left" className="studio-drawer overflow-y-auto"><SheetTitle>Bots & conversations</SheetTitle><SheetDescription className="sr-only">Your assistants and chats saved on this device</SheetDescription><div className="mt-6">{sidebar}</div></SheetContent></Sheet>
    <Sheet open={rightOpen} onOpenChange={setRightOpen}><SheetContent className="studio-drawer overflow-y-auto"><SheetTitle>Assistant settings</SheetTitle><SheetDescription className="sr-only">Model, voice and operational instructions</SheetDescription><div className="mt-6">{settings}</div></SheetContent></Sheet>
  </section>;
}