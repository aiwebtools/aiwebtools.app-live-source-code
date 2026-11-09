// @ts-nocheck
import { describe, it, expect } from "bun:test";
import { getDisplayedCategory, getStaticToolTitle } from "./toolCategoryDisplay";

describe("getDisplayedCategory", () => {
  it("uses the AI Agents category in Muse's first-paint title", () => {
    const tool = { title: "Muse", category: "AI Development & Platforms", directUrl: "https://muse.ai/join?via=aiwebtools" };
    expect(getStaticToolTitle(tool)).toBe("Muse — AI Agents Tool | AI Web Tools");
    expect(getDisplayedCategory(tool)).toBe("AI Agents");
    expect(tool.category).toBe("AI Development & Platforms");
  });
  it("shows Muse under AI Agents on its own page", () => {
    expect(
      getDisplayedCategory({
        title: "Muse",
        category: "AI Development & Platforms",
        directUrl: "https://muse.ai/join?via=aiwebtools",
      })
    ).toBe("AI Agents");
  });

  it("keeps every other tool's own catalog category", () => {
    expect(
      getDisplayedCategory({
        title: "Zo Computer",
        category: "AI Development & Platforms",
        directUrl: "https://www.zo.computer/?via=aiwebtools",
      })
    ).toBe("AI Development & Platforms");
  });

  it("does not rename a different tool that merely mentions muse", () => {
    expect(
      getDisplayedCategory({
        title: "Muses Reply",
        category: "Writing & Text Generation",
        directUrl: "https://muses.example.com/",
      })
    ).toBe("Writing & Text Generation");
  });

  it("returns an empty label when there is no category", () => {
    expect(getDisplayedCategory({ title: "Mystery Tool" })).toBe("");
    expect(getDisplayedCategory(null)).toBe("");
  });
});
