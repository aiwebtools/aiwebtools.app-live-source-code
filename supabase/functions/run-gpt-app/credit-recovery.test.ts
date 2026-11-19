import { expect, test } from "bun:test";
import { isPaused, recordProviderFailure } from "../_shared/chat-provider-state";
test("a credit pause is rechecked after 30 minutes", async () => {
  let saved: any = null;
  await recordProviderFailure({ get: async () => null, set: async (s: any) => { saved = s; } } as any, "lovable_chat", 402, 0);
  expect(saved.status).toBe("credits");
  expect(isPaused(saved, 29 * 60_000)).toBe(true);
  expect(isPaused(saved, 31 * 60_000)).toBe(false);
});
test("denials still need the owner", () => {
  expect(isPaused({ provider: "lovable_chat", status: "denied", http_status: 403, retry_at: null } as any, Date.now() + 1e9)).toBe(true);
});
