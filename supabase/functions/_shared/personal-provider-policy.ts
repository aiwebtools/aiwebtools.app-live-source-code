// Public configuration only. Credentials never belong in this module.
export const PERSONAL_PROVIDERS = {
  bionic: { name: "Bionic", keyUrl: "https://lmstudio.ai?via=aiwebtools", models: ["bionic/glm-5.3-flash", "bionic/deepseek-v4.1-flash"], vision: true },
  openai: { name: "OpenAI", keyUrl: "https://platform.openai.com/api-keys?via=aiwebtools", models: ["gpt-6-astra", "gpt-6-luna", "gpt-4o-mini"], vision: true },
  gemini: { name: "Gemini", keyUrl: "https://aistudio.google.com/api-keys", models: ["gemini-flash-latest", "gemini-3.1-flash-lite", "gemini-2.5-flash"], vision: true },
  claude: { name: "Claude", keyUrl: "https://console.anthropic.com/settings/keys?via=aiwebtools", models: ["claude-haiku-5-5", "claude-haiku-4-5", "claude-haiku-4-5-20251001"], vision: true },
  deepseek: { name: "DeepSeek", keyUrl: "https://platform.deepseek.com/sign_in?via=aiwebtools", models: ["deepseek-flash", "deepseek-v4-pro"], vision: false },
} as const;
export type PersonalProvider = keyof typeof PERSONAL_PROVIDERS;
export type PersonalAi = { provider: PersonalProvider; apiKey: string; model: string };

export function parsePersonalAi(value: unknown, signedIn: boolean, checking = false): PersonalAi {
  if (!signedIn) throw new Error("Sign in to use a personal AI key.");
  if (!value || typeof value !== "object") throw new Error("Choose a personal AI provider.");
  const input = value as Record<string, unknown>;
  if (typeof input.provider !== "string" || !Object.prototype.hasOwnProperty.call(PERSONAL_PROVIDERS, input.provider)) throw new Error("That AI provider is not supported.");
  const provider = input.provider as PersonalProvider;
  if (typeof input.apiKey !== "string" || input.apiKey.trim().length < 10 || input.apiKey.length > 512 || /\s/.test(input.apiKey.trim())) throw new Error("Enter a valid API key.");
  const model = typeof input.model === "string" ? input.model : PERSONAL_PROVIDERS[provider].models[0];
  if (!checking && !(PERSONAL_PROVIDERS[provider].models as readonly string[]).includes(model)) throw new Error("That personal AI model is not supported.");
  return { provider, apiKey: input.apiKey.trim(), model };
}

export function personalProviderError(error: unknown): string {
  const status = error && typeof error === "object" && "statusCode" in error ? Number(error.statusCode) : 0;
  if (status === 401) return "Your provider rejected this key. Check it in your provider account.";
  if (status === 403) return "Your provider denied access. Check account permissions before trying again.";
  if (status === 402) return "Your provider needs available credit. Check your provider's billing.";
  if (status === 429) return "Your provider's quota or rate limit was reached. Check your provider account.";
  if (status === 404) return "Your selected model is unavailable on your provider account.";
  if (status === 400) return "Your provider could not accept this request. Its model may not support this input.";
  return "Your personal AI provider could not finish this reply. No default AI request was made.";
}