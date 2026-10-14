import type { BotAttachment } from "./botAttachments";
export interface BotActivity { id: string; name: string; input: string; state: "input-available" | "output-available" | "output-error"; error?: string }
export interface BotMessage { role: "user" | "assistant"; content: string; activities?: BotActivity[]; attachments?: BotAttachment[] }
export interface BotConversation {
  id: string;
  slug: string;
  title: string;
  updatedAt: number;
  messages: BotMessage[];
  model: string;
  serverId?: string | null;
}
export const NEW_CONVERSATION_TITLE = "New conversation";

/** Builds a short, readable sidebar title from the first user message. */
export function conversationTitle(text: string): string {
  const clean = text.replace(/[#*_`>\[\]]/g, " ").replace(/\s+/g, " ").trim();
  if (!clean) return NEW_CONVERSATION_TITLE;
  const sentence = clean.split(/(?<=[.?!])\s/)[0];
  const words = sentence.split(" ").slice(0, 8).join(" ");
  const title = words.length > 48 ? `${words.slice(0, 47).trimEnd()}…` : words;
  return title.charAt(0).toUpperCase() + title.slice(1);
}

/** Returns the stored title, or derives one for older chats saved without a real title. */
export function displayConversationTitle(thread: BotConversation): string {
  if (thread.title && thread.title !== NEW_CONVERSATION_TITLE) return thread.title;
  const first = thread.messages.find((message) => message.role === "user");
  return first ? conversationTitle(first.content) : NEW_CONVERSATION_TITLE;
}

export const BOT_HISTORY_KEY = "awt-bot-conversations-v1";

export function readBotConversations(): BotConversation[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(BOT_HISTORY_KEY) || "[]");
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is BotConversation => Boolean(item && typeof item.id === "string" && typeof item.slug === "string" && Array.isArray(item.messages)));
  } catch { return []; }
}

export function saveBotConversation(thread: BotConversation): boolean {
  try {
    const threads = readBotConversations();
    localStorage.setItem(BOT_HISTORY_KEY, JSON.stringify([thread, ...threads.filter((item) => item.id !== thread.id)].sort((a, b) => b.updatedAt - a.updatedAt)));
    return true;
  } catch { return false; }
}

export function openBotConversation(slug: string, id?: string): BotConversation {
  const threads = readBotConversations();
  const existing = id ? threads.find((item) => item.id === id && item.slug === slug) : threads.find((item) => item.slug === slug);
  if (existing) return existing;
  const thread: BotConversation = { id: id || crypto.randomUUID(), slug, title: NEW_CONVERSATION_TITLE, updatedAt: Date.now(), messages: [], model: "default" };
  saveBotConversation(thread);
  return thread;
}

export function conversationPath(slug: string, id: string): string {
  return `/app/${encodeURIComponent(slug)}/chat/${encodeURIComponent(id)}`;
}