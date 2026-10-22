import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
const SiteMenu = lazy(() => import("@/components/header/DesktopMenu"));
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Bot, Check, Copy, Download, Globe, History, ImageIcon, Menu, Mic, Home, MicOff, Plus, Search, SendHorizontal, Settings2, Square, Volume2, VolumeX, Play, Paperclip, Camera, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getBotStarters } from "@/utils/botStarters";
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
import { getBotPortrait } from "./botAvatars";
import { getBundledCommunityImage } from "@/utils/communityBots";
import { getGptVoiceProfile, type GptVoiceProfile } from "@/utils/gptVoiceProfiles";
import { useSpeechReader } from "@/hooks/useSpeechReader";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useAuthSession } from "@/hooks/useAuthSession";
import { getGuestId } from "@/utils/guestId";
import { playTimeWarpVoice } from "@/utils/effects/timeWarpVoice";
import { conversationTitle, displayConversationTitle, conversationPath, openBotConversation, readBotConversations, saveBotConversation, type BotConversation, type BotMessage } from "@/utils/botConversations";
import { loadToolImageMap } from "@/utils/search/toolImageMap";
import { groupBotsByCategory } from "./botCategories";
import { botFamilyKey, loadStudioBots, refreshStudioBots, STUDIO_MODELS, type StudioBot } from "./botCatalog";
import BotPortrait from "./BotPortrait";
import BotBuilder from "./BotBuilder";
import BotCommercial from "./BotCommercial";
import { deleteCustomBot, readCustomBots } from "@/utils/customBots";
import { Trash2, Wand2 } from "lucide-react";
import StudioImageActions from "./StudioImageActions";
import ReplyTools from "./ReplyTools";
import { Tool, ToolHeader, ToolContent } from "@/components/ai-elements/tool";
import type { BotActivity } from "@/utils/botConversations";
import { celebrateReply } from "@/utils/replyCelebrations";
import { ATTACHMENT_ACCEPT, validateChatFile, type BotAttachment } from "@/utils/botAttachments";
import BotQuickSwitch from "./BotQuickSwitch";
import { searchStudioBots } from "./botSubjects";

import { prepareVisualAttachment } from "@/utils/prepareBotAttachment";
import PersonalAiSettings from "./PersonalAiSettings";
import { usePersonalAi } from "@/utils/personalAiSession";
import { PERSONAL_PROVIDERS } from "../../../supabase/functions/_shared/personal-provider-policy";
import type { ChatUsage } from "../../../supabase/functions/_shared/chat-usage";

export default function BotStudio({ app, threadId, embedded = false, onExit }: { app: StudioBot; threadId?: string; embedded?: boolean; onExit?: () => void }) {
  const navigate = useNavigate();
  const { session } = useAuthSession();
  const personalAi = usePersonalAi(session?.user.id);
  const [thread, setThread] = useState(() => openBotConversation(app.slug, threadId));
  const [threads, setThreads] = useState(readBotConversations);
  const [bots, setBots] = useState<StudioBot[]>([]);
  const [customBots, setCustomBots] = useState(readCustomBots);
  const [builderOpen, setBuilderOpen] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("awt-open-builder") === "1" || new URLSearchParams(window.location.search).get("builder") === "1") {
      sessionStorage.removeItem("awt-open-builder");
      setBuilderOpen(true);
    }
    // Header shortcuts fire this when a bot room is already open, so the builder still opens without a remount.
    const openBuilder = () => { sessionStorage.removeItem("awt-open-builder"); setBuilderOpen(true); };
    window.addEventListener("awt-open-builder", openBuilder);
    return () => window.removeEventListener("awt-open-builder", openBuilder);
  }, []);
  const [celebrations, setCelebrations] = useState(true);
  const [celebrationSound, setCelebrationSound] = useState(true);
  const studioRef = useRef<HTMLElement | null>(null);
  const celebrationCleanup = useRef<(() => void) | null>(null);
  const celebrationIndex = useRef(Math.floor(Math.random() * 20));
  const [query, setQuery] = useState("");
  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState<BotAttachment | null>(null);
  const [readingFile, setReadingFile] = useState(false);
  const attachmentWorker = useRef<Worker | null>(null);
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
  const [voice, setVoice] = useState<GptVoiceProfile["voice"]>(app.custom?.voice || app.voice || defaultProfile.voice);
  const [speed, setSpeed] = useState(defaultProfile.speed);
  const profile = useMemo(() => ({ ...defaultProfile, voice, speed }), [defaultProfile, voice, speed]);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const cameraRef = useRef<HTMLInputElement | null>(null);
  const speech = useSpeechReader(profile);
  const botAvatar = (bot: Pick<StudioBot, "slug" | "display_name" | "tagline"> & Partial<StudioBot>): string => {
    const family = botFamilyKey(bot.slug);
    const base = family !== bot.slug ? bots.find((b) => b.slug === family || b.slug === `community-${family}`) : undefined;
    return bot.image_url || getBotPortrait(bot.slug) || getBotPortrait(family) || getBundledCommunityImage(bot.slug)
      || (base && base.slug !== bot.slug ? botAvatar(base) : null)
      || (bot.tool_title ? imageMap?.get(bot.tool_title.trim().toLowerCase()) : null)
      || imageMap?.get(bot.display_name.replace(/\s*\(V\d+\)$/, "").trim().toLowerCase())
      || getGptAvatar(getGptRoomTheme(bot.slug, bot.tagline || "", bot.display_name).key);
  };
  const avatar = botAvatar(app);
  const sidebarPortrait = (bot: Pick<StudioBot, "slug" | "display_name" | "tagline"> & Partial<StudioBot>) => {
    const room = getGptRoomTheme(bot.slug, bot.tagline || "", bot.display_name);
    return <BotPortrait key={bot.slug} src={botAvatar(bot)} name={bot.display_name} themeKey={room.key} emblem={room.emblem} className="h-8 w-8 shrink-0 rounded-md object-cover" />;
  };
  const themeVars = { "--bot-accent": theme.accent, "--bot-accent-2": theme.accent2, "--bot-soft": theme.soft, "--bot-deep": theme.deep } as React.CSSProperties;
  const welcome = theme.key === "time-machine" && app.slug === "time-machine-gpt" ? "Great Scott! User, what date would you like to teleport to, & where do you want to go?" : app.greeting || `Hello, I am ${app.display_name}. What would you like to explore?`;

  useEffect(() => {
    void loadStudioBots().then(setBots).catch((error) => setNotice(error.message));
    void loadToolImageMap().then(setImageMap);
  }, []);
  useEffect(() => {
    if (!embedded && !threadId) navigate(`${conversationPath(app.slug, thread.id)}${window.location.search}`, { replace: true });
  }, [app.slug, embedded, navigate, thread.id, threadId]);
  useEffect(() => () => { abortRef.current?.abort(); attachmentWorker.current?.terminate(); }, []);
  useEffect(() => () => celebrationCleanup.current?.(), []);
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
    if ((!text.trim() && !attachment) || streaming || readingFile) return;
    const prompt = text.trim() || "Analyze the attached data, summarize findings and identify issues.";
    const current = threadRef.current;
    const messages: BotMessage[] = [...current.messages, { role: "user", content: prompt, ...(attachment ? { attachments: [attachment] } : {}) }];
    const base = { ...current, messages, title: current.messages.length ? displayConversationTitle(current) : conversationTitle(text.trim() || (attachment ? `Analysis of ${attachment.name}` : prompt)), updatedAt: Date.now() };
    commit(base);
    setInput(""); setAttachment(null); setNotice(""); setStreaming(true); speech.reset();
    const controller = new AbortController(); abortRef.current = controller;
    let assistant = "";
    let usage: ChatUsage | undefined;
    const activities: BotActivity[] = [];
    let serverId = current.serverId;
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/run-gpt-app`, {
        method: "POST", signal: controller.signal,
        headers: { "Content-Type": "application/json", ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}) },
        body: JSON.stringify({ slug: app.slug, conversationId: current.serverId, messages, ...(personalAi ? { personalAi } : current.model !== "default" ? { model: current.model } : {}), ...(app.custom ? { custom: { name: app.display_name, tagline: app.tagline || "", instructions: app.custom.instructions } } : {}), ...(session ? {} : { guestId: getGuestId() }) }),
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
          if (parsed.error) throw new Error(typeof parsed.error === "string" ? parsed.error : parsed.error.message || "The assistant could not finish this reply.");
          if (parsed.usage && typeof parsed.usage.model === "string") {
            usage = parsed.usage as ChatUsage;
            setThread({ ...base, serverId, messages: [...messages, { role: "assistant", content: assistant, activities: [...activities], usage }] });
          }
          if (parsed.activity) {
            const activity = parsed.activity as BotActivity;
            const found = activities.findIndex((item) => item.id === activity.id);
            if (found >= 0) activities[found] = activity; else activities.push(activity);
            setThread({ ...base, serverId, messages: [...messages, { role: "assistant", content: assistant, activities: [...activities], usage }] });
          }
          const delta = parsed?.choices?.[0]?.delta?.content;
          if (typeof delta === "string") {
            assistant += delta;
            // Keep streamed state responsive; save the complete turn at the end.
            setThread({ ...base, serverId, messages: [...messages, { role: "assistant", content: assistant, activities: [...activities], usage }] });
            speech.feed(assistant);
          }
        }
        if (done) break;
      }
      speech.flush();
      if (assistant.trim() && celebrations && studioRef.current && !controller.signal.aborted) {
        celebrationCleanup.current?.();
        celebrationCleanup.current = celebrateReply(celebrationIndex.current++, celebrationSound, studioRef.current);
      }
      if (!assistant.trim()) setNotice("The reply ended without an answer. Your message is saved; please try again.");
    } catch (error) {
      if (!controller.signal.aborted) { const msg = error instanceof Error ? error.message : "The reply could not load."; setNotice(msg); reportFailure("stream_error", msg); }
    } finally {
      commit({ ...base, serverId, messages: assistant || activities.length ? [...messages, { role: "assistant", content: assistant, usage, activities: activities.map((activity) => activity.state === "input-available" ? { ...activity, state: "output-error", error: "This action was interrupted." } : activity) }] : messages, updatedAt: Date.now() });
      setStreaming(false); abortRef.current = null;
    }
  }, [app.slug, app.custom, app.display_name, app.tagline, celebrations, celebrationSound, commit, session, speech, streaming, attachment, readingFile, personalAi]);
  /** Fire-and-forget failure report so the chat watchdog sees browser-side problems too. */
  const reportFailure = (kind: string, message: string, detail = "") => {
    void fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/run-gpt-app`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug: app.slug, report: { kind, message, detail } }) }).catch(() => undefined);
  };
  const attachFile = async (file: File) => {
    attachmentWorker.current?.terminate();
    try { validateChatFile(file.name, file.size); } catch (error) { setNotice(error instanceof Error ? error.message : "Unsupported file."); return; }
    setReadingFile(true); setNotice(""); setAttachment(null);
    try {
      const visual = await prepareVisualAttachment(file);
      if (visual) { setAttachment(visual); setReadingFile(false); return; }
    } catch (error) { const msg = error instanceof Error ? error.message : "This file could not be opened."; setNotice(msg); reportFailure("attachment_error", msg, `${file.type || "unknown"} ${(file.size / 1048576).toFixed(2)}MB`); setReadingFile(false); return; }
    const worker = new Worker(new URL("../../utils/botAttachment.worker.ts", import.meta.url), { type: "module" });
    attachmentWorker.current = worker;
    worker.onmessage = (event: MessageEvent<{ attachment?: BotAttachment; error?: string }>) => {
      if (event.data.attachment) setAttachment(event.data.attachment);
      if (event.data.error) { setNotice(event.data.error); reportFailure("analysis_error", event.data.error, file.type || file.name.split(".").pop() || ""); }
      setReadingFile(false); worker.terminate(); attachmentWorker.current = null;
    };
    worker.onerror = () => { setNotice("This file could not be analyzed. Please try again."); reportFailure("analysis_error", "File worker crashed", file.type || ""); setReadingFile(false); worker.terminate(); attachmentWorker.current = null; };
    worker.postMessage(file);
  };
  const mic = useVoiceInput((text) => { if (streaming) setInput(text); else void send(text); }, speech.pauseForMicrophone, speech.resumeAfterMicrophone);

  const chooseThread = (item: BotConversation) => {
    stop(); setLeftOpen(false); playTimeWarpVoice();
    if (embedded && item.slug === app.slug) { commit(item); setInput(""); }
    else { onExit?.(); navigate(conversationPath(item.slug, item.id)); }
  };
  const goBack = () => {
    stop(); setLeftOpen(false); setRightOpen(false);
    if (onExit) onExit();
    else if (window.history.state?.idx > 0) navigate(-1);
    else navigate("/");
  };
  const newChat = () => {
    stop(); setAttachment(null); setNotice(""); setInput("");
    const item = openBotConversation(app.slug, crypto.randomUUID());
    chooseThread(item);
  };
  const chooseBot = (slug: string) => chooseThread(openBotConversation(slug));
  const exportChat = () => {
    setNotice("Preparing your PDF with images…");
    void import("@/utils/chatPdfExport").then(({ exportChatPdf }) => exportChatPdf(app.display_name, app.slug, thread.messages))
      .then(() => setNotice(""))
      .catch(() => setNotice("The PDF could not be created. Please try again."));
  };
  const sidebar = <>
    <Button className="studio-new w-full gap-2" onClick={newChat}><Plus className="h-4 w-4" />New chat</Button>
    <Button variant="ghost" className="studio-row mt-3 w-full gap-2 gpt-room-accent" onClick={() => { setLeftOpen(false); setBuilderOpen(true); }} disabled={streaming}><Wand2 className="h-4 w-4" />Create your own custom model</Button>
    {customBots.length > 0 && <><h2 className="studio-label mt-5"><Wand2 className="h-4 w-4" />My creations</h2><div className="mt-2">{customBots.map((bot) => <div key={bot.slug} className="flex items-center gap-1"><Button variant="ghost" disabled={streaming} onClick={() => chooseBot(bot.slug)} title={bot.display_name} className={`studio-row flex-1 ${bot.slug === app.slug ? "studio-selected" : ""}`}>{sidebarPortrait(bot)}<span className="studio-tool-name">{bot.display_name}</span></Button><Button variant="ghost" size="icon" aria-label={`Delete ${bot.display_name}`} title="Delete from this device" onClick={() => { if (window.confirm(`Delete ${bot.display_name} from this device?`)) { deleteCustomBot(bot.slug); setCustomBots(readCustomBots()); } }}><Trash2 className="h-3.5 w-3.5" /></Button></div>)}</div></>}
    <h2 className="studio-label mt-6"><Bot className="h-4 w-4" />My GPTs</h2>
    <div className="relative my-3"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><input aria-label="Search bots" placeholder="Find an assistant…" value={query} onChange={(e) => setQuery(e.target.value)} className="studio-search w-full rounded-md border bg-background pl-9 pr-2 text-sm" /></div>
    <p className="text-[11px] text-muted-foreground">{bots.length} assistants · grouped by subject</p>
    <div className="studio-bots">
      {groupBotsByCategory(searchStudioBots(bots, query)).map(([category, families]) => <details key={category} open={Boolean(query) || families.some((f) => f.versions.some((bot) => bot.slug === app.slug))} className="mt-2"><summary className="studio-label cursor-pointer select-none py-1">{category} <span className="ml-auto text-[10px] text-muted-foreground">{families.length}</span></summary>{families.map(({ key, base, versions }) => versions.length === 1
        ? <Tooltip key={base.slug}><TooltipTrigger asChild><Button variant="ghost" disabled={streaming} onClick={() => chooseBot(base.slug)} className={`studio-row ${base.slug === app.slug ? "studio-selected" : ""}`}>{sidebarPortrait(base)}<span className="studio-tool-name">{base.display_name}</span>{base.slug.startsWith("community-") && <span title="Community GPT" aria-label="Community GPT" className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}</Button></TooltipTrigger><TooltipContent side="right" className="max-w-64 break-words">{base.display_name}</TooltipContent></Tooltip>
        : <details key={key} data-testid="version-accordion" open={versions.some((bot) => bot.slug === app.slug)} className="studio-versions"><summary className={`studio-row flex list-none items-center gap-2 cursor-pointer select-none [&::-webkit-details-marker]:hidden ${versions.some((bot) => bot.slug === app.slug) ? "studio-selected" : ""}`}>{sidebarPortrait(base)}<span className="studio-tool-name">{base.display_name}</span><span className="ml-auto shrink-0 rounded border border-primary/40 px-1 text-[10px] text-primary">{versions.length} versions</span></summary><div className="ml-6 grid grid-cols-4 gap-1 py-1">{versions.map((bot, i) => <Button key={bot.slug} size="sm" variant={bot.slug === app.slug ? "default" : "outline"} disabled={streaming} onClick={() => chooseBot(bot.slug)} title={bot.display_name} aria-label={`${base.display_name} version ${i + 1}`} className="h-7 px-1 text-xs">V{i + 1}</Button>)}</div></details>)}</details>)}
    </div>
    <h2 className="studio-label mt-5"><History className="h-4 w-4" />Recent chats</h2>
    <div className="studio-history mt-2">{threads.filter((item) => item.messages.length > 0 || item.id === thread.id).map((item) => <Button key={item.id} variant="ghost" disabled={streaming} onClick={() => chooseThread(item)} className={`studio-row ${item.id === thread.id ? "studio-selected" : ""}`}><History className="h-3.5 w-3.5 shrink-0" /><span className="truncate" title={displayConversationTitle(item)}>{displayConversationTitle(item)}</span></Button>)}</div>
    <p className="mt-4 text-xs text-muted-foreground">Saved on this device · {threads.length} conversations</p>
  </>;
  const settings = <>
    <div className="mb-5 flex gap-2"><Button variant="outline" aria-pressed={celebrations} onClick={() => { setCelebrations(!celebrations); celebrationCleanup.current?.(); }}>Reply effects {celebrations ? "on" : "off"}</Button><Button variant="ghost" size="icon" aria-label={celebrationSound ? "Mute celebration sounds" : "Enable celebration sounds"} title="Celebration sounds" onClick={() => setCelebrationSound(!celebrationSound)}>{celebrationSound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}</Button></div>
    <h2 className="studio-label"><Settings2 className="h-4 w-4" />Model selection</h2>
    <Select value={thread.model} disabled={streaming || Boolean(personalAi)} onValueChange={(model) => commit({ ...threadRef.current, model })}><SelectTrigger className="mt-3" aria-label="Choose AI model"><SelectValue /></SelectTrigger><SelectContent className="z-[190]">{STUDIO_MODELS.map((model) => <SelectItem key={model.id} value={model.id}>{model.label}</SelectItem>)}</SelectContent></Select>
    <p className="mt-2 break-words text-xs text-muted-foreground">{personalAi ? `${PERSONAL_PROVIDERS[personalAi.provider].name} · ${personalAi.model}` : thread.model === "default" ? "GLM default · DeepSeek for advanced reasoning and code" : thread.model}</p>
    <PersonalAiSettings session={session} busy={streaming} />
    <div className="studio-setting-section"><h2 className="studio-label"><Volume2 className="h-4 w-4" />Voice settings</h2><p className="mt-3 text-sm gpt-room-accent">{profile.label}</p><Select value={voice} onValueChange={(value) => { speech.stop(); setVoice(value as GptVoiceProfile["voice"]); }}><SelectTrigger className="mt-3" aria-label="Choose speaking voice"><SelectValue /></SelectTrigger><SelectContent className="z-[190]">{(["alloy", "ash", "ballad", "coral", "echo", "fable", "nova", "onyx", "sage", "shimmer", "verse"] as const).map((item) => <SelectItem key={item} value={item}>{item.charAt(0).toUpperCase() + item.slice(1)}{item === defaultProfile.voice ? " · Character default" : ""}</SelectItem>)}</SelectContent></Select><label className="studio-voice-control">Speed · {speed.toFixed(2)}×<input aria-label="Voice speed" type="range" min="0.75" max="1.25" step="0.05" value={speed} onChange={(event) => { speech.stop(); setSpeed(Number(event.target.value)); }} /></label><Button variant="outline" className="mt-3 w-full gap-2" onClick={speech.toggle} aria-pressed={speech.enabled}>{speech.enabled ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}{speech.enabled ? "Mute voice" : "Enable voice"}</Button><Button variant="ghost" className="mt-2 w-full gap-2" onClick={() => speech.speakNow(welcome)}><Play className="h-4 w-4" />Preview voice</Button></div>
    <div className="studio-setting-section"><h2 className="studio-label">Tools & capabilities</h2>{[[Paperclip, "Photos & documents"], [Globe, "Live web search"], [ImageIcon, "Image generation"], [Mic, mic.supported ? "Voice conversation" : "Microphone unavailable"], [History, "Device memory"]].map(([Icon, label]) => { const Component = Icon as typeof Globe; return <div className="studio-capability" key={String(label)}><Component className="h-4 w-4" /><span>{String(label)}</span>{label === "Microphone unavailable" ? <span className="ml-auto text-muted-foreground">—</span> : <Check className="ml-auto h-4 w-4 text-primary" />}</div>; })}</div>
    <div className="studio-setting-section">{app.custom ? <Button variant="ghost" className="w-full gap-2" onClick={() => { const href = URL.createObjectURL(new Blob([`${app.display_name}\n${app.tagline || ""}\n\n${app.custom?.instructions || ""}`], { type: "text/plain;charset=utf-8" })); const a = document.createElement("a"); a.href = href; a.download = `${app.slug}-instructions.txt`; a.click(); setTimeout(() => URL.revokeObjectURL(href), 10000); }}><Download className="h-4 w-4" />Instructions (TXT)</Button> : <OpInstructionsButton slug={app.slug} name={app.display_name} singleOnly compact label="Instructions (PDF)" />}<Button variant="ghost" className="mt-3 w-full gap-2" onClick={exportChat}><Download className="h-4 w-4" />Export conversation</Button></div>
  </>;
  return <section ref={studioRef} id="try-bot" aria-label={`Run ${app.display_name} here`} className={`relative gpt-room studio ${embedded ? "studio-embedded" : "studio-full"}`} data-room-pattern={theme.pattern} style={themeVars}>
    <MatrixRainBackdrop className="studio-rain" intensity={embedded ? 0.55 : 0.8} />
    <div className="studio-topbar"><Button variant="ghost" size="icon" className="studio-nav-control shrink-0" onClick={goBack} aria-label="Back to previous screen" title="Back"><ArrowLeft className="h-5 w-5" /></Button><Button asChild variant="ghost" size="icon" className="studio-nav-control shrink-0"><Link to="/" onClick={() => { stop(); onExit?.(); }} aria-label="Go to the AIWebTools home page" title="Home"><Home className="h-5 w-5" /></Link></Button><Link to="/" onClick={() => { stop(); onExit?.(); }} className="studio-brand"><span>AI</span>WEBTOOLS<span>.APP</span></Link><span className="studio-label hidden md:flex"><span className="studio-live-dot" />AI CONVERSATION STUDIO</span><div className="ml-auto flex shrink-0 gap-1"><div className="hidden lg:flex items-center"><Suspense fallback={null}><SiteMenu /></Suspense></div><Button variant="ghost" className="studio-nav-control studio-refresh gap-1.5" onClick={newChat} aria-label="Refresh chat and start a fresh conversation" title="Refresh chat (start fresh)"><RotateCcw className="h-4 w-4" /><span>Refresh</span></Button><Button variant="ghost" className="studio-nav-control studio-bot-menu gap-1.5 lg:hidden" onClick={() => setLeftOpen(true)} aria-label="Open bots and chat history" title="Bots and saved chats"><Menu className="h-4 w-4" /><span>Bots</span></Button><Button variant="ghost" size="icon" className="studio-nav-control xl:hidden" onClick={() => setRightOpen(true)} aria-label="Open model and voice settings" title="Model and voice settings"><Settings2 className="h-4 w-4" /></Button></div></div>
    <div className="studio-grid">
      <aside className="studio-sidebar hidden lg:flex">{sidebar}</aside>
      <main className="studio-main">
        <header className="studio-bot-header"><BotPortrait src={avatar} name={app.display_name} themeKey={theme.key} emblem={theme.emblem} className="gpt-room-avatar h-11 w-11 shrink-0 rounded-md" /><div className="studio-bot-identity min-w-0 flex-1"><h1 className="break-words text-base font-bold sm:text-xl gpt-room-accent"><span className="gpt-glitch-title" data-text={app.display_name}>{app.display_name}</span></h1><p className="studio-bot-description mt-1 text-xs text-muted-foreground">{app.tagline || theme.roomLabel}</p></div><Button variant="ghost" size="icon" className="studio-voice-toggle shrink-0" onClick={speech.toggle} aria-label={speech.enabled ? "Mute the voice" : "Enable the voice"} title={speech.enabled ? "Mute the voice" : "Enable the voice"}>{speech.enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}</Button>{!app.custom && <div className="studio-header-pdf"><OpInstructionsButton slug={app.slug} name={app.display_name} singleOnly compact label="GPT Instructions PDF" /></div>}</header>
        <BotQuickSwitch bots={[...customBots, ...bots]} onChoose={chooseBot} portrait={sidebarPortrait} />
        {thread.messages.some((message) => message.usage) && (() => {
          const usage = thread.messages.filter((message) => message.usage).at(-1)?.usage;
          return usage ? <p data-testid="chat-usage" className="shrink-0 break-words px-4 py-1 text-[10px] leading-4 text-muted-foreground" title={usage.complete ? `Latest reply including tool rounds: ${usage.inputTokens} input + ${usage.outputTokens} output tokens` : "Provider token totals are pending or incomplete; no estimated count is shown."}>{usage.model} · {usage.complete ? `${usage.totalTokens.toLocaleString()} tokens · ${usage.inputTokens.toLocaleString()} in / ${usage.outputTokens.toLocaleString()} out` : "Tokens unavailable / pending"} · latest reply</p> : null;
        })()}
        <Conversation className="studio-transcript"><ConversationContent className="studio-messages gap-5 p-4 sm:p-6">
          {!thread.messages.length && <div className="studio-welcome"><BotPortrait src={avatar} name={app.display_name} themeKey={theme.key} emblem={theme.emblem} className="gpt-room-avatar mb-3 h-14 w-14 rounded-md" /><p className="text-sm leading-6 text-foreground">{welcome}</p><div className="mt-3"><p className="studio-starter-label mb-1.5">STARTER PROMPT</p>{getBotStarters(app).map((prompt) => <Button variant="ghost" className="studio-starter h-auto whitespace-normal text-left" key={prompt} disabled={streaming} onClick={() => send(prompt)}>{prompt}</Button>)}</div></div>}
          {thread.messages.map((message, index) => { const { text, working } = splitImageProgress(message.content); return <Message key={index} from={message.role}><MessageContent className={message.role === "user" ? "gpt-msg-user" : "gpt-msg-bot"}><div className="gpt-msg-meta">{message.role === "assistant" && <BotPortrait src={avatar} name={app.display_name} themeKey={theme.key} emblem={theme.emblem} className="gpt-msg-avatar" />}<span>{message.role === "user" ? "You" : app.display_name}</span></div>{message.role === "user" ? <><p className="whitespace-pre-wrap">{message.content}</p>{message.attachments?.map((file) => <p key={file.name} className="mt-2 break-words text-xs text-muted-foreground"><Paperclip className="mr-1 inline h-3 w-3" />{file.name} · {(file.size / (1024 * 1024)).toFixed(2)} MB</p>)}</> : <>{(message.activities || []).map((activity) => <Tool key={activity.id} className="studio-tool" defaultOpen={false}><ToolHeader type="dynamic-tool" toolName={activity.name} title={activity.name === "generate_image" ? "Image generation" : "Web search"} state={activity.state} /><ToolContent><p className="text-xs break-words">{activity.input}</p>{activity.error && <p className="text-xs text-destructive">{activity.error}</p>}</ToolContent></Tool>)}{text && <MessageResponse className="gpt-generated-content">{text}</MessageResponse>}{working && streaming && index === thread.messages.length - 1 && <ImageProgress />}<StudioImageActions content={message.content} name={app.display_name} busy={streaming} onError={setNotice} onPrompt={(text) => { setInput(text); inputRef.current?.focus(); }} /><ReplyTools text={text} name={app.display_name} busy={streaming && index === thread.messages.length - 1} onError={setNotice} />{text && <div className="mt-2 flex gap-1"><Button variant="ghost" size="icon" onClick={() => speech.speakNow(text)} aria-label={speech.speaking ? "Stop reading" : "Play reply"} title="Play or stop reply">{speech.speaking ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}</Button><Button variant="ghost" size="icon" aria-label="Copy reply" title="Copy reply" onClick={() => { void navigator.clipboard.writeText(text).then(() => setCopied(index)).catch(() => setNotice("Copy is unavailable in this browser.")); }}>{copied === index ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}</Button></div>}</>}</MessageContent></Message>; })}
          {streaming && !thread.messages.at(-1)?.content && <ThinkingStatus avatar={avatar} name={app.display_name} />}
          {streaming && thread.messages.at(-1)?.role === "user" && <ThinkingStatus avatar={avatar} name={app.display_name} />}
        </ConversationContent><ConversationScrollButton className="gpt-room-scroll" /></Conversation>
        <div className="studio-composer">{notice && <p role="alert" className="mb-2 text-xs text-destructive">{notice}</p>}{readingFile && <p role="status" className="mb-2 text-xs text-muted-foreground">Analyzing file…</p>}{attachment && <div className="mb-2 flex min-w-0 items-center gap-2 text-sm"><>{attachment.imageUrl ? <img src={attachment.imageUrl} alt="Attached photo preview" className="h-12 w-12 shrink-0 rounded-md object-cover" /> : <Paperclip className="h-4 w-4 shrink-0 text-primary" />}</><span className="min-w-0 flex-1 break-words">{attachment.name} · {(attachment.size / (1024 * 1024)).toFixed(2)} MB</span><Button variant="ghost" size="icon" aria-label="Remove attachment" onClick={() => setAttachment(null)}><X className="h-4 w-4" /></Button></div>}<PromptInput onSubmit={({ text }) => send(text)} className="gpt-room-input"><PromptInputTextarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder={theme.placeholder} rows={2} maxLength={6000} className="max-h-32 min-h-12 text-base" /><PromptInputFooter className="studio-input-tools studio-labeled-tools">
              <Button type="button" variant="ghost" className="studio-tool-action" aria-label="Download this chat" disabled={!thread.messages.length} onClick={exportChat}><Download /><span>Save chat</span></Button>
              <input ref={fileRef} className="hidden" type="file" accept={ATTACHMENT_ACCEPT} aria-label="Attach photo or document" disabled={streaming || readingFile} onChange={(event) => { const file = event.target.files?.[0]; if (file) void attachFile(file); event.target.value = ""; }} />
              <input ref={cameraRef} className="hidden" type="file" accept="image/*" capture="environment" aria-label="Take a photo" disabled={streaming || readingFile} onChange={(event) => { const file = event.target.files?.[0]; if (file) void attachFile(file); event.target.value = ""; }} />
              <Button type="button" variant="ghost" className="studio-tool-action" disabled={streaming || readingFile} onClick={() => fileRef.current?.click()} aria-label="Attach photo or document"><Paperclip /><span>Attach</span></Button>
              <Button type="button" variant="ghost" className="studio-tool-action" disabled={streaming || readingFile} onClick={() => cameraRef.current?.click()} aria-label="Take a photo"><Camera /><span>Camera</span></Button>
              <Button type="button" variant="ghost" className="studio-tool-action" onClick={mic.toggle} aria-label={mic.listening ? "Stop microphone" : "Speak to the bot"} aria-pressed={mic.listening}>{mic.listening ? <MicOff className="animate-pulse" /> : <Mic />}<span>{mic.listening ? "Stop mic" : "Speak"}</span></Button>
              <Button type="button" variant="ghost" className="studio-tool-action" onClick={() => { setInput("Search the web for "); inputRef.current?.focus(); }} aria-label="Search the web"><Globe /><span>Search</span></Button>
              <Button type="button" variant="ghost" className="studio-tool-action" onClick={() => { setInput("Create an image of "); inputRef.current?.focus(); }} aria-label="Create an image"><ImageIcon /><span>Create image</span></Button>
              <Button type="button" variant="ghost" className="studio-tool-action" onClick={speech.toggle} aria-label={speech.enabled ? "Mute the voice" : "Enable the voice"}>{speech.enabled ? <Volume2 /> : <VolumeX />}<span>{speech.enabled ? "Mute voice" : "Voice on"}</span></Button>
              <PromptInputSubmit onStop={stop} status={streaming ? "streaming" : "ready"} disabled={!streaming && (readingFile || (!input.trim() && !attachment))} className="gpt-room-send studio-tool-action" aria-label={streaming ? "Stop reply" : `Send message to ${app.display_name}`}><span className="flex flex-col items-center gap-1">{streaming ? <Square /> : <SendHorizontal />}<span>{streaming ? "Stop" : "Send"}</span></span></PromptInputSubmit>
            </PromptInputFooter></PromptInput><div className="studio-status"><span className="studio-live-dot" />{mic.listening ? "Listening" : speech.speaking ? profile.label : streaming ? "Assistant active" : "Ready"}<span className="ml-auto truncate">{theme.mottoText}</span></div></div>
      </main><aside className="studio-settings hidden xl:block">{settings}</aside>
    </div>
    <Sheet open={leftOpen} onOpenChange={setLeftOpen}><SheetContent side="left" overlayClassName="studio-drawer-overlay z-[170]" className="studio-drawer z-[180] overflow-y-auto"><SheetTitle>Bots & conversations</SheetTitle><SheetDescription className="sr-only">Your assistants and chats saved on this device</SheetDescription><div className="mt-6">{sidebar}</div></SheetContent></Sheet>
    <Sheet open={rightOpen} onOpenChange={setRightOpen}><SheetContent overlayClassName="studio-drawer-overlay z-[170]" className="studio-drawer z-[180] overflow-y-auto"><SheetTitle>Assistant settings</SheetTitle><SheetDescription className="sr-only">Model, voice and operational instructions</SheetDescription><div className="mt-6">{settings}</div></SheetContent></Sheet>
    <BotCommercial slug={app.slug} name={app.display_name} toolTitle={app.tool_title} userId={session?.user.id} voice={defaultProfile.voice} custom={!!app.custom} />
    <BotBuilder open={builderOpen} onOpenChange={(open) => { setBuilderOpen(open); if (!open && window.location.search.includes("builder=1")) navigate(window.location.pathname, { replace: true }); }} onSaved={(bot, publishedSlug) => { setCustomBots(readCustomBots()); setBuilderOpen(false); if (publishedSlug) void refreshStudioBots().then(setBots); chooseThread(openBotConversation(publishedSlug || bot.slug, crypto.randomUUID())); }} />
  </section>;
}