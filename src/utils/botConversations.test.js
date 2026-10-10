import { beforeEach, expect, test } from "bun:test";
import { openBotConversation, readBotConversations, saveBotConversation, conversationPath } from "./botConversations";
const storage = new Map();
globalThis.localStorage = { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => { storage.set(key, value); }, removeItem: (key) => { storage.delete(key); }, clear: () => storage.clear(), key: () => null, length: 0 };
beforeEach(() => storage.clear());
test("device history keeps separate bot conversations without login", () => {
  const first = openBotConversation("time-machine-gpt", "trip-one");
  saveBotConversation({ ...first, messages: [{ role: "user", content: "Mira has my compass" }] });
  openBotConversation("time-machine-gpt", "trip-two");
  openBotConversation("einstein-gpt", "physics");
  expect(readBotConversations()).toHaveLength(3);
  expect(openBotConversation("time-machine-gpt", "trip-one").messages[0]?.content).toBe("Mira has my compass");
  expect(openBotConversation("time-machine-gpt", "trip-two").messages).toEqual([]);
});
test("reloading a thread restores its identity without duplicating it", () => {
  openBotConversation("time-machine-gpt", "trip-one");
  expect(openBotConversation("time-machine-gpt", "trip-one").id).toBe("trip-one");
  expect(readBotConversations()).toHaveLength(1);
  expect(conversationPath("time-machine-gpt", "trip-one")).toBe("/app/time-machine-gpt/chat/trip-one");
});
test("selected model and completed tool activity survive device restoration", () => {
  const thread = openBotConversation("time-machine-gpt", "model-trip");
  saveBotConversation({ ...thread, model: "google/gemini-3-flash-preview", messages: [{ role: "assistant", content: "A journey", activities: [{ id: "image-1", name: "generate_image", input: "A time portal", state: "output-available" }] }] });
  const restored = openBotConversation("time-machine-gpt", "model-trip");
  expect(restored.model).toBe("google/gemini-3-flash-preview");
  expect(restored.messages[0].activities[0].state).toBe("output-available");
});