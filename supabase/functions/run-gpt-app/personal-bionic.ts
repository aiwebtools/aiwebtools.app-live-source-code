import { callBionic } from "./bionic-provider.ts";
import { PERSONAL_PROVIDERS, personalProviderError, type PersonalAi } from "../_shared/personal-provider-policy.ts";

export async function callPersonalBionic(config: PersonalAi, payload: Record<string, unknown>, signal: AbortSignal, request: typeof fetch = fetch): Promise<Response> {
  const response = await callBionic(config.apiKey, { ...payload, model: config.model }, signal, request);
  if (response.ok) return response;
  return new Response(JSON.stringify({ error: personalProviderError({ statusCode: response.status }) }), { status: response.status });
}

export async function checkPersonalBionic(config: PersonalAi, signal: AbortSignal, request: typeof fetch = fetch) {
  const response = await request("https://api.lmstudio.ai/v1/models", {
    headers: { Authorization: `Bearer ${config.apiKey}` }, signal, redirect: "error",
  });
  if (!response.ok) throw Object.assign(new Error(personalProviderError({ statusCode: response.status })), { statusCode: response.status });
  const data = await response.json();
  const available = new Set((Array.isArray(data.data) ? data.data : []).map((row: { id?: unknown }) => row?.id));
  const models = PERSONAL_PROVIDERS.bionic.models.filter(id => available.has(id));
  if (!models.length) throw Object.assign(new Error(personalProviderError({ statusCode: 404 })), { statusCode: 404 });
  return { models, message: "Key accepted by your provider. Billing, quota and replies are checked when you send a message." };
}