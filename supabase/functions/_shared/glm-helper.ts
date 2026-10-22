// Background helper jobs (Care Bot, weekly digest, community-app review) use the
// builder's Bionic GLM first; callers keep their existing Lovable AI call as the
// fallback whenever Bionic is unconfigured, out of credit, or unavailable.
export const GLM_HELPER_URL = "https://api.lmstudio.ai/v1/chat/completions";
export const GLM_HELPER_MODEL = "bionic/glm-5.3-flash";

export async function callGlmHelper(
  body: Record<string, unknown>,
  request: typeof fetch = fetch,
): Promise<Response | null> {
  const key = Deno.env.get("BIONIC_API_KEY");
  if (!key) return null;
  try {
    const res = await request(GLM_HELPER_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, model: GLM_HELPER_MODEL }),
      redirect: "error",
    });
    if (res.ok) return res;
    console.error("glm helper unavailable", res.status);
    await res.body?.cancel().catch(() => {});
    return null;
  } catch (err) {
    console.error("glm helper failed", err instanceof Error ? err.message : "unknown");
    return null;
  }
}

/** Parses JSON even when the model wraps it in ``` fences or adds stray text. */
export function parseLooseJson<T>(text: string): T | null {
  const cleaned = text.replace(/```(?:json)?/gi, "").trim();
  try { return JSON.parse(cleaned) as T; } catch { /* try object slice */ }
  const start = cleaned.indexOf("{"), end = cleaned.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try { return JSON.parse(cleaned.slice(start, end + 1)) as T; } catch { return null; }
}
