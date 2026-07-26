import { describe, expect, it, vi } from "vitest";
import { MentorDecisionEngine, createExperiencePlan } from "../engine/mentor";
import type { LivingLesson, LivingScene } from "../engine/types";

const scene = (overrides: Partial<LivingScene> = {}): LivingScene => ({
  id: "scene-1",
  kind: "story",
  title: "A quiet field",
  camera: "story",
  ...overrides,
});

const lesson: LivingLesson = {
  id: "lesson-1",
  moduleId: "module-1",
  title: "David",
  summary: "Courage before the giant.",
  estimatedMinutes: 10,
  learningObjectives: ["courage"],
  access: { tier: "explorer" },
  scenes: [scene()],
};

function context(currentScene: LivingScene) {
  return {
    lesson,
    scene: currentScene,
    progress: { sceneIndex: 0, sceneCount: 1 },
  };
}

describe("MentorDecisionEngine", () => {
  it("asks before explaining when an unresolved interaction exists", () => {
    const current = scene({
      kind: "discovery",
      interaction: { id: "notice", mode: "discovery", prompt: "What do you notice?" },
    });
    const decision = new MentorDecisionEngine().decide(context(current));
    expect(decision.action).toBe("ask_question");
    expect(decision.policyIds).toContain("curiosity-before-explanation");
  });

  it("uses a safe continue-story fallback", () => {
    const decision = new MentorDecisionEngine().decide(context(scene()));
    expect(decision.action).toBe("continue_story");
  });

  it("emits decision telemetry", () => {
    const onTelemetry = vi.fn();
    new MentorDecisionEngine({
      onTelemetry,
      now: () => new Date("2026-07-23T12:00:00.000Z"),
    }).decide(context(scene()));
    expect(onTelemetry).toHaveBeenCalledWith(expect.objectContaining({
      type: "mentor_decision",
      lessonId: "lesson-1",
      sceneId: "scene-1",
      occurredAt: "2026-07-23T12:00:00.000Z",
    }));
  });
});

describe("ExperiencePlanner", () => {
  it("maps scenes to learner-facing intents", () => {
    const plan = createExperiencePlan({
      ...lesson,
      scenes: [scene({ kind: "arrival" }), scene({ id: "reflection", kind: "reflection" })],
    });
    expect(plan.steps.map((step) => step.intent)).toEqual(["welcome", "growth"]);
  });
});
