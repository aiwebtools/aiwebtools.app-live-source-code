// @ts-ignore -- project's Bun test runtime
import { expect, test } from "bun:test";
import { Bot } from "lucide-react";
import type { Tool } from "@/types/tools";
import { belongsToDirectoryCategory, directoryCategoryTools, filterDirectoryTools, sortDirectoryAlphabetically, uniqueDirectoryTools } from "./directoryIntegrity";
import { getCategoriesWithCounts, getMainCategoriesWithCounts, getToolsByCategory, getToolsByMainCategory } from "./categoryUtils/toolFiltering";

const tool = (title: string, category: string, rest: Partial<Tool> = {}): Tool =>
  ({ title, category, description: "AI tool", icon: Bot, color: "", emoji: "", tags: [], ...rest });

test("Image & Design excludes Veterinarian GPT and incidental art/image wording", () => {
  const veterinarian = tool("🐾Veterinarian GPT", "Health & Wellness", { description: "Smart companion: upload photos of pets for detailed assessments." });
  const workflow = tool("Activepieces", "Automation Platforms", { description: "Start designing workflows with artificial intelligence." });
  const graphic = tool("Graphic & Cover Design GPT", "Image & Design");
  expect(directoryCategoryTools([veterinarian, workflow, graphic], "IMAGE & DESIGN AI TOOLS").map(t => t.title)).toEqual(["Graphic & Cover Design GPT"]);
  expect(belongsToDirectoryCategory(veterinarian, "HEALTH, WELLNESS & PERSONAL LIFESTYLE")).toBe(true);
  expect(belongsToDirectoryCategory(tool("Voiceflow", "Phone & Voice Agents", { tags: ["conversation design", "visual design", "chatbot design"] }), "IMAGE & DESIGN AI TOOLS")).toBe(false);
  expect(belongsToDirectoryCategory(tool("Course Maker GPT", "Education & Research Tools", { tags: ["instructional design", "curriculum design"] }), "IMAGE & DESIGN AI TOOLS")).toBe(false);
  expect(belongsToDirectoryCategory(tool("FramePack", "Video & Multimedia", { tags: ["image to video free"] }), "IMAGE & DESIGN AI TOOLS")).toBe(false);
});

test("all/category counts equal the exact unique collections actually displayed", () => {
  const tools = [tool("Image Maker", "Image & Design"), tool("image maker", "Image & Design"), tool("Tutor", "Education & Learning")];
  const counts = getMainCategoriesWithCounts(tools);
  expect(counts["ALL AI TOOLS"]).toBe(2);
  expect(counts["IMAGE & DESIGN AI TOOLS"]).toBe(1);
  expect(counts["EDUCATION & LEARNING"]).toBe(1);
  for (const [name, count] of Object.entries(counts)) expect(getToolsByMainCategory(tools, name).length).toBe(count);
  const differentSameSize = [tool("A", "Education & Learning"), tool("B", "Education & Learning"), tool("C", "Education & Learning")];
  expect(getMainCategoriesWithCounts(differentSameSize)["IMAGE & DESIGN AI TOOLS"]).toBe(0);
  const categorySpellings = [tool("A", "AI Chat & Assistants"), tool("B", "AI Chat Assistants")];
  expect(getCategoriesWithCounts(categorySpellings)).toEqual({ "AI Chat & Assistants": 2 });
  expect(getToolsByCategory(categorySpellings, "AI Chat & Assistants")).toHaveLength(2);
});

test("Browse All search filters cards, keeps zero matches empty and restores on clear", () => {
  const tools = [tool("ChatGPT", "AI Chat"), tool("Claude", "AI Chat"), tool("Image Maker", "Image & Design")];
  expect(filterDirectoryTools(tools, "Claude").map(t => t.title)).toEqual(["Claude"]);
  expect(filterDirectoryTools(tools, "zzzxnonexistenttool")).toHaveLength(0);
  expect(filterDirectoryTools(tools, "   ")).toHaveLength(3);
});

test("A–Z sorts the whole collection without pinned GPTs or deprioritized assistants", () => {
  const tools = [tool("Zebra GPT", "Education"), tool("Siri", "AI Chat"), tool("Alpha", "Image"), tool("Beta", "Image")];
  expect(sortDirectoryAlphabetically(tools).map(t => t.title)).toEqual(["Alpha", "Beta", "Siri", "Zebra GPT"]);
  expect(sortDirectoryAlphabetically(tools, "desc").map(t => t.title)).toEqual(["Zebra GPT", "Siri", "Beta", "Alpha"]);
  expect(sortDirectoryAlphabetically([tool("🐾Veterinarian GPT", "Health"), tool("Alpha", "Image"), tool("🎓College Tutor", "Education")]).map(t => t.title)).toEqual(["Alpha", "🎓College Tutor", "🐾Veterinarian GPT"]);
});

test("free-only filtering agrees with free pricing, excludes freemium/trial and updates search", () => {
  const tools = [tool("Free Editor", "Image", { isFree: true }), tool("Source Editor", "Image", { tags: ["Open Source"] }), tool("Trial Editor", "Image", { tags: ["Freemium", "Free Trial"] }), tool("Paid Editor", "Image", { description: "Subscription only" })];
  expect(filterDirectoryTools(tools, "", true).map(t => t.title)).toEqual(["Free Editor", "Source Editor"]);
  expect(filterDirectoryTools(tools, "Trial", true)).toHaveLength(0);
  expect(filterDirectoryTools(tools, "", false)).toHaveLength(4);
});

test("Claude appears once and duplicate metadata is retained without mutating records", () => {
  const tools = [tool("Claude", "AI Chat", { directUrl: "https://claude.ai", tags: ["Chat"] }), tool("claude", "AI Chat", { directUrl: "https://anthropic.com", imageUrl: "original.webp", tags: ["Coding"] })];
  const result = uniqueDirectoryTools(tools);
  expect(result).toHaveLength(1);
  expect(result[0].imageUrl).toBe("original.webp");
  expect(result[0].tags).toEqual(["Coding", "Chat"]);
  expect(tools[0].tags).toEqual(["Chat"]);
  expect(tools).toHaveLength(2);
});