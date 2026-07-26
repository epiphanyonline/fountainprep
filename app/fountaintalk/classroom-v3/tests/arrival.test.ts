import { describe, expect, it } from "vitest";
import { ARRIVAL_SCENE_ID, createArrivalScene } from "../engine/arrival";
import type { LivingLesson } from "../engine/types";
import { snapshotAt } from "../engine/timeline";

const lesson: LivingLesson = {
  id: "david",
  moduleId: "bible-foundations",
  title: "David: Before the Giant",
  summary: "Discover the courage that formed before the battle.",
  estimatedMinutes: 18,
  learningObjectives: ["Recognize quiet courage"],
  scenes: [],
  access: { tier: "explorer" },
};

describe("Arrival Scene", () => {
  it("personalizes Ayo's welcome and keeps arrival inside the scene engine", () => {
    const scene = createArrivalScene(lesson, {
      preferredName: "Daniel",
      journeyRecall: "Yesterday we stood with David on the hillside.",
      todayPromise: "Today we will discover what everyone else failed to see.",
    });

    expect(scene.id).toBe(ARRIVAL_SCENE_ID);
    expect(scene.kind).toBe("arrival");
    expect(scene.narration).toContain("Welcome back, Daniel.");
    expect(scene.narration).toContain("Yesterday we stood with David");
    expect(scene.interaction?.mode).toBe("continue");
  });

  it("reveals the ready interaction after Ayo has welcomed the learner", () => {
    const scene = createArrivalScene(lesson, { firstVisit: true });

    expect(snapshotAt(scene, 1_000).phase).toBe("arrival");
    expect(snapshotAt(scene, 1_000).narrationStarted).toBe(true);
    expect(snapshotAt(scene, 2_600).interactionVisible).toBe(true);
    expect(snapshotAt(scene, 2_600).phase).toBe("interaction");
  });
});
