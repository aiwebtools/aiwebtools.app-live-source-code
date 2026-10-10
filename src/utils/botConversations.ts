export interface BotActivity { id: string; name: string; input: string; state: "input-available" | "output-available" | "output-error"; error?: string }
export interface BotMessage { role: "user" | "assistant"; content: string; activities?: BotActivity[] }
export interface BotConversation {
  id: string;
  slug: string;
  title: string;
  updatedAt: number;
  messages: BotMessage[];
  model: string;
  serverId?: string | null;
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
  const thread: BotConversation = { id: id || crypto.randomUUID(), slug, title: "New conversation", updatedAt: Date.now(), messages: [], model: "default" };
  saveBotConversation(thread);
  return thread;
}

export function conversationPath(slug: string, id: string): string {
  return `/app/${encodeURIComponent(slug)}/chat/${encodeURIComponent(id)}`;
}