import { expect, test } from "bun:test";
import { createScreenplayIntakeFilter } from "./screenplay-reply.ts";

test("observed screenplay intake repeats appear once across arbitrary stream chunks", () => {
  const scenes = "**How many scenes should the movie have, and how many segments would you like within each scene?**";
  const idea = "**What’s your movie idea or premise, and what genre and tone do you want?**";
  const credit = "**Do you have a title in mind, and what name should appear as the screenwriter credit?**";
  const first = [scenes, idea, credit].join("\n\n");
  const raw = `Authored opening\n\n${first}\n\n${first}`;
  for (const size of [1, 7, 53, raw.length]) {
    const filter = createScreenplayIntakeFilter(true);
    let output = "";
    for (let i = 0; i < raw.length; i += size) output += filter.push(raw.slice(i, i + size));
    output += filter.flush();
    expect(output.trim()).toBe(`Authored opening\n\n${first}`);
  }
});
test("dialogue, scene text and different follow-up questions stay unchanged", () => {
  const raw = "MARA: Is anyone there?\n\nMARA: Is anyone there?\n\nWhat genre do you want?\n\nWhat tone should the ending have?";
  const filter = createScreenplayIntakeFilter(true);
  expect(filter.push(raw) + filter.flush()).toBe(raw);
});
test("concatenated repeated opening and final intake question are removed", () => {
  const opening = "I Create Movies and Put Creativity into the Hollywood Script writing processes, Now lets create a masterpiece.";
  const question = "**What target length or format do you prefer, and are there any must-have characters?**";
  const raw = `${opening}\n\n${question} ${opening}\n\n${question}`;
  const filter = createScreenplayIntakeFilter(true);
  expect((filter.push(raw) + filter.flush()).trim()).toBe(`${opening}\n\n${question}`);
});
test("unrelated bots retain byte-identical output immediately", () => {
  const filter = createScreenplayIntakeFilter(false);
  const raw = "How many scenes?\n\nHow many scenes?";
  expect(filter.push(raw)).toBe(raw);
  expect(filter.flush()).toBe("");
});