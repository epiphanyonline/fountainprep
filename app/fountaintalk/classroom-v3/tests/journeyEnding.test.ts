import { describe, expect, it } from "vitest";
import { createJourneyEndingScene, JOURNEY_ENDING_SCENE_ID } from "../engine/journey/JourneyEndingDirector";
import type { LivingLesson } from "../engine/types";

const lesson: LivingLesson = {
  id: "david", moduleId: "bible", title: "David", summary: "", estimatedMinutes: 10,
  learningObjectives: ["courage"], scenes: [], access: { tier: "explorer" },
};

describe("JourneyEndingDirector", () => {
  it("ends with growth and an invitation instead of lesson complete", () => {
    const scene = createJourneyEndingScene(lesson, { learnerName: "Ada" });
    expect(scene.id).toBe(JOURNEY_ENDING_SCENE_ID);
    expect(scene.narration).toContain("Ada");
    expect(scene.title).toContain("grow next");
  });
});
