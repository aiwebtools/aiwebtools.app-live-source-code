// Builder-owned chat transport only; image generation and search retain their shared executors.
export const BIONIC_CHAT_URL = "https://api.lmstudio.ai/v1/chat/completions";
export const BIONIC_GLM_MODEL = "bionic/glm-5.3-flash";
export const BIONIC_DEEPSEEK_MODEL = "bionic/deepseek-v4.1-flash";
export const isBionicModel = (model: unknown) => model === BIONIC_GLM_MODEL || model === BIONIC_DEEPSEEK_MODEL;

export function bionicError(status: number): string {
  if (status === 401 || status === 403) return "Bionic rejected the site's access. The site owner needs to check the Bionic account.";
  if (status === 402) return "The site's Bionic balance is unavailable. Please try again after it is replenished.";
  if (status === 429) return "Bionic is busy. Please try again shortly.";
  return "Bionic could not finish this reply. Please try again.";
}

export async function callBionic(
  key: string | undefined,
  payload: Record<string, unknown>,
  signal: AbortSignal,
  request: typeof fetch = fetch,
): Promise<Response> {
  if (!isBionicModel(payload.model)) return new Response(JSON.stringify({ error: "Unsupported Bionic model." }), { status: 400 });
  if (!key) return new Response(JSON.stringify({ error: "The site's Bionic connection is not configured." }), { status: 503, headers: { "X-Bionic-Failure": "configuration" } });
  // Keep full prompt/history, multimodal content, tool_choice and tool results unchanged.
  // Gateway-specific reasoning settings are not part of the verified Bionic contract.
  const { reasoning_effort: _reasoning, ...body } = payload;
  try {
    const response = await request(BIONIC_CHAT_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
      redirect: "error",
    });
    if (response.ok) return response;
    const detail = await response.json().catch(() => ({}));
    const type = String(detail?.error?.type || detail?.type || detail?.error?.code || detail?.code || "");
    const accountProblem = /account|configuration|authentication|invalid_api_key|permission|access_denied/i.test(type);
    return new Response(JSON.stringify({ error: bionicError(response.status) }), {
      status: response.status,
      headers: accountProblem ? { "X-Bionic-Failure": "configuration" } : {},
    });
  } catch {
    return new Response(JSON.stringify({ error: signal.aborted ? "Reply stopped." : bionicError(502) }), { status: signal.aborted ? 499 : 502 });
  }
}