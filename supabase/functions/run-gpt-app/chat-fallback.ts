import { isBionicModel } from "./bionic-provider.ts";
import { isPaused, recordProviderFailure, type ProviderStore } from "../_shared/chat-provider-state.ts";

export const LOVABLE_FALLBACK_MODEL = "openai/gpt-6-luna";
type Payload = Record<string, unknown>;
type Transport = (payload: Payload) => Promise<Response>;
const pausedResponse = (provider: string, status?: number | null) => new Response(JSON.stringify({ error: `${provider} is paused. The site owner needs to restore access or credits and resume it.` }), { status: status || 503 });
export const RESTING_MESSAGE = "Our bots are resting — both Bionic and Lovable chat credits have run out. Please check back after credits are replenished.";

/** Site-paid default: Lovable first, with one safe pre-stream Bionic backup. */
export function createLovableFirstChat(store: ProviderStore, bionic: Transport, lovable: Transport, signal: AbortSignal, preferLovable = true) {
  const backup = createFallbackChat(store, bionic, lovable, signal);
  let model = LOVABLE_FALLBACK_MODEL;
  let reason: string | null = null;
  let switched = false;
  let started = false;
  return {
    getModel: () => switched ? backup.getModel() : model,
    getReason: () => reason,
    markStarted: () => { started = true; backup.markStarted(); },
    call: async (payload: Payload): Promise<Response> => {
      // Explicit site model selections retain their existing behavior.
      if (!preferLovable || !isBionicModel(payload.model)) {
        switched = true;
        return backup.call(payload);
      }
      if (switched) return backup.call(payload);
      model = LOVABLE_FALLBACK_MODEL;
      const state = await store.get("lovable_chat");
      let response: Response;
      if (isPaused(state)) {
        if (state?.status !== "credits" && state?.status !== "outage") return pausedResponse("Lovable chat", state?.http_status);
        response = pausedResponse("Lovable chat", state?.http_status);
        reason = state.status;
      } else {
        response = await lovable({ ...payload, model, reasoning_effort: "none" });
        if (signal.aborted) return response;
        await recordProviderFailure(store, "lovable_chat", response.status);
        if (response.ok) {
          if (state?.status === "outage") await store.set({ provider: "lovable_chat", status: "ready", http_status: null, retry_at: null });
          return response;
        }
        if (response.status !== 402 && !(response.status >= 500 && response.status <= 599)) return response;
        reason = response.status === 402 ? "credits" : "outage";
      }
      if (started) return response;
      await response.body?.cancel();
      if (reason === "outage") await new Promise(resolve => setTimeout(resolve, 1200));
      if (signal.aborted) return new Response(JSON.stringify({ error: "Reply stopped." }), { status: 499 });
      switched = true;
      return backup.call(payload);
    },
  };
}

/** One authorized provider switch before receiving a stream, never on refusals or partial replies. */
export function createFallbackChat(store: ProviderStore, bionic: Transport, lovable: Transport, signal: AbortSignal) {
  let fallback = false;
  let model = "";
  let reason: string | null = null;
  let started = false;
  const gateway = async (payload: Payload) => {
    const state = await store.get("lovable_chat");
    const bothExhausted = async () => state?.status === "credits" && (await store.get("bionic"))?.status === "credits";
    if (isPaused(state)) return await bothExhausted() ? new Response(JSON.stringify({ error: RESTING_MESSAGE }), { status: 402 }) : pausedResponse("Lovable chat", state?.http_status);
    model = String(payload.model);
    const response = await lovable(payload);
    await recordProviderFailure(store, "lovable_chat", response.status);
    if (response.status === 402 && (await store.get("bionic"))?.status === "credits") {
      const detail = await response.json().catch(() => ({}));
      const message = detail.message || (typeof detail.error === "string" ? detail.error : detail.error?.message);
      return new Response(JSON.stringify({ error: RESTING_MESSAGE + (message ? ` ${message}` : "") }), { status: 402 });
    }
    if (response.ok && state?.status === "outage") await store.set({ provider: "lovable_chat", status: "ready", http_status: null, retry_at: null });
    return response;
  };
  const useFallback = (payload: Payload) => {
    fallback = true;
    return gateway({ ...payload, model: LOVABLE_FALLBACK_MODEL, reasoning_effort: "none" });
  };
  return {
    getModel: () => model,
    getReason: () => reason,
    markStarted: () => { started = true; },
    call: async (payload: Payload): Promise<Response> => {
      model = String(payload.model);
      if (!isBionicModel(payload.model)) return gateway(payload);
      if (fallback) return useFallback(payload);
      const state = await store.get("bionic");
      if (isPaused(state)) {
        if (state?.status === "credits" || state?.status === "outage") {
          if (started) return pausedResponse("Bionic", state?.http_status);
          reason = state.status;
          return useFallback(payload);
        }
        return pausedResponse("Bionic", state?.http_status);
      }
      const response = await bionic(payload);
      if (signal.aborted) return response;
      const kind = response.headers.get("X-Bionic-Failure");
      // Missing configuration is not a service outage. Never bypass account/access problems.
      if (kind === "configuration") {
        await store.set({ provider: "bionic", status: "configuration", http_status: response.status, retry_at: null });
        return response;
      }
      await recordProviderFailure(store, "bionic", response.status);
      if (response.ok) {
        if (state?.status === "outage") await store.set({ provider: "bionic", status: "ready", http_status: null, retry_at: null });
        return response;
      }
      if (response.status !== 402 && !(response.status >= 500 && response.status <= 599)) return response;
      if (started) return response;
      reason = response.status === 402 ? "credits" : "outage";
      await response.body?.cancel();
      // Switching after an outage is delayed, not an immediate retry storm.
      if (reason === "outage") await new Promise((resolve) => setTimeout(resolve, 1200));
      if (signal.aborted) return new Response(JSON.stringify({ error: "Reply stopped." }), { status: 499 });
      return useFallback(payload);
    },
  };
}