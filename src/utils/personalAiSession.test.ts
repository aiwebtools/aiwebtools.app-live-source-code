// @ts-ignore -- Bun test-only import; browser project does not include Bun types.
import { expect, test } from "bun:test";
import { clearOtherPersonalAi, clearPersonalAi, getPersonalAi, setPersonalAi } from "./personalAiSession";
test("personal key activation stays owner-bound and clears explicitly", () => {
  const value = { provider: "deepseek" as const, apiKey: "test-placeholder-not-a-credential", model: "deepseek-flash" };
  setPersonalAi("owner-a", value);
  expect(getPersonalAi("owner-a")).toEqual(value);
  expect(getPersonalAi("owner-b")).toBeNull();
  clearOtherPersonalAi("owner-b");
  expect(getPersonalAi("owner-a")).toBeNull();
  setPersonalAi("owner-a", value);
  clearPersonalAi();
  expect(getPersonalAi("owner-a")).toBeNull();
});