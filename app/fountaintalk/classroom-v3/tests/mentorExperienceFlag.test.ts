import { describe, expect, it, vi } from "vitest";
import { conductMentorExperience } from "../engine/mentorExperience";
import type { LivingLesson } from "../engine/types";

const lesson: LivingLesson = {
  id: "lesson",
  moduleId: "module",
  title: "Courage",
  summary: "A journey",
  estimatedMinutes: 5,
  learningObjectives: ["courage"],
  access: { tier: "explorer" },
  scenes: [{ id: "opening", kind: "story", title: "Opening", narration: "Begin.", camera: "story" }],
};

const memory = {
  currentTopics: ["courage"],
  memories: [{ id: "m1", topic: "courage", insight: "Act while afraid", importance: "high" as const }],
};

describe("mentor decision feature flag", () => {
  it("preserves RC1 memory behavior while disabled", () => {
    const scenes = conductMentorExperience(lesson, { memory, ending: false });
    expect(scenes[0].narration).toContain("Act while afraid");
  });

  it("routes enabled scenes through the decision engine", () => {
    const onDecision = vi.fn();
    const scenes = conductMentorExperience(lesson, {
      memory,
      ending: false,
      decisionEngine: { enabled: true, onDecision },
    });
    expect(onDecision).toHaveBeenCalled();
    expect(scenes[0].narration).toContain("Act while afraid");
  });
});
