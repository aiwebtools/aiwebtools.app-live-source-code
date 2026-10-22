import { expect, test } from "bun:test";
import { callPersonalBionic, checkPersonalBionic } from "./personal-bionic";
const config = { provider: "bionic" as const, apiKey: "test-placeholder-not-a-credential", model: "bionic/glm-5.3-flash" };
test("personal Bionic checks only its fixed endpoint and returns supported models", async () => {
  const result = await checkPersonalBionic(config, new AbortController().signal, (async (url, init) => {
    expect(String(url)).toBe("https://api.lmstudio.ai/v1/models");
    expect(new Headers(init?.headers).get("Authorization")).toBe(`Bearer ${config.apiKey}`);
    return Response.json({ data: [{ id: config.model }, { id: "unknown" }] });
  }) as typeof fetch);
  expect(result.models).toEqual(["bionic/glm-5.3-flash"]);
});
test("personal Bionic sends visitor key and intact tools with no site fallback", async () => {
  let calls = 0;
  const response = await callPersonalBionic(config, { messages: [{ role: "system", content: "Original instructions" }], tools: [{ type: "function" }], stream: true }, new AbortController().signal, (async (url, init) => {
    calls++;
    expect(String(url)).toBe("https://api.lmstudio.ai/v1/chat/completions");
    expect(new Headers(init?.headers).get("Authorization")).toBe(`Bearer ${config.apiKey}`);
    const body = JSON.parse(String(init?.body));
    expect(body.model).toBe("bionic/glm-5.3-flash");
    expect(body.messages[0].content).toBe("Original instructions");
    expect(body.tools).toEqual([{ type: "function" }]);
    return Response.json({ error: "sensitive upstream detail" }, { status: 402 });
  }) as typeof fetch);
  expect(calls).toBe(1);
  expect(response.status).toBe(402);
  expect(await response.text()).not.toContain("sensitive");
});