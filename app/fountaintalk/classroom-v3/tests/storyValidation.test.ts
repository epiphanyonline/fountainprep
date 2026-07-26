import { describe, expect, it } from "vitest";
import { davidBeforeTheGiant } from "../content/david-before-the-giant";
import { validateStory } from "../story/validateStory";

 describe("David: Before the Giant", () => {
  it("contains ten chapters and thirty scenes", () => {
    expect(davidBeforeTheGiant.chapters).toHaveLength(10);
    expect(davidBeforeTheGiant.scenes).toHaveLength(30);
  });

  it("passes story validation", () => {
    const result = validateStory(davidBeforeTheGiant);
    expect(result.issues.filter((issue) => issue.severity === "error")).toEqual([]);
    expect(result.valid).toBe(true);
  });

  it("keeps every scene in exactly one chapter", () => {
    const all = davidBeforeTheGiant.chapters.flatMap((chapter) => chapter.sceneIds);
    expect(new Set(all).size).toBe(davidBeforeTheGiant.scenes.length);
    expect(all).toHaveLength(davidBeforeTheGiant.scenes.length);
  });
});
