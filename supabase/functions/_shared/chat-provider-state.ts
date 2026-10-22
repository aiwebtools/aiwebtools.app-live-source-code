export type ProviderStatus = "ready" | "outage" | "credits" | "denied" | "unavailable" | "configuration";
export type ProviderState = { provider: string; status: ProviderStatus; http_status?: number | null; retry_at?: string | null };
export type ProviderStore = { get(provider: string): Promise<ProviderState | null>; set(state: ProviderState): Promise<void> };

export function providerFailure(status: number): ProviderStatus | null {
  if (status === 402) return "credits";
  if (status === 401 || status === 403) return "denied";
  if (status === 404) return "unavailable";
  if (status >= 500 && status <= 599) return "outage";
  return null;
}

export function isPaused(state: ProviderState | null, now = Date.now()): boolean {
  if (!state || state.status === "ready") return false;
  if (state.status === "outage") return !state.retry_at || Date.parse(state.retry_at) > now;
  return true;
}

// A fresh visitor request may recover an elapsed outage. Credit/denial pauses need owner action.
export async function recordProviderFailure(store: ProviderStore, provider: string, status: number, now = Date.now()): Promise<void> {
  const failure = providerFailure(status);
  if (!failure) return;
  await store.set({ provider, status: failure, http_status: status, retry_at: failure === "outage" ? new Date(now + 5 * 60_000).toISOString() : null });
}