import { describe, expect, it, vi } from "vitest";
import {
  JourneyStateEngine,
  inferJourneyPhase,
  type JourneyCheckpoint,
  type JourneyStatePersistence,
} from "../engine/journey-state";
import type { LivingScene } from "../engine/types";

const scene = (id: string, kind: LivingScene["kind"], journeyPhase?: LivingScene["journeyPhase"]): LivingScene => ({
  id,
  kind,
  title: id,
  camera: "story",
  journeyPhase,
});

function memoryPersistence(initial: JourneyCheckpoint | null = null): JourneyStatePersistence & { saved: JourneyCheckpoint[] } {
  const saved: JourneyCheckpoint[] = [];
  return {
    saved,
    async load() { return initial; },
    async save(value) { saved.push(value); },
  };
}

describe("JourneyStateEngine", () => {
  it("infers phases while respecting author intent", () => {
    expect(inferJourneyPhase(scene("a", "arrival"))).toBe("arrival");
    expect(inferJourneyPhase(scene("b", "story"))).toBe("curiosity");
    expect(inferJourneyPhase(scene("c", "story", "challenge"))).toBe("challenge");
  });

  it("tracks transitions, completion, and checkpoints", async () => {
    const persistence = memoryPersistence();
    const onTransition = vi.fn();
    const engine = new JourneyStateEngine({
      learnerId: "learner-1",
      lessonId: "david",
      persistence,
      onTransition,
      now: () => new Date("2026-07-23T12:00:00.000Z"),
    });

    engine.enter(scene("field", "story"), 0, 2);
    engine.completeScene("field");
    engine.enter(scene("reflect", "reflection"), 1, 2);
    await engine.checkpoint();

    expect(onTransition).toHaveBeenCalledTimes(2);
    expect(engine.current?.phase).toBe("reflection");
    expect(engine.current?.completedSceneIds).toEqual(["field"]);
    expect(persistence.saved).toHaveLength(1);
  });

  it("restores a prior session and emits resume telemetry", async () => {
    const checkpoint: JourneyCheckpoint = {
      learnerId: "learner-1",
      lessonId: "david",
      sceneId: "reflect",
      sceneIndex: 3,
      sceneCount: 8,
      phase: "reflection",
      completedSceneIds: ["arrival", "field"],
      startedAt: "2026-07-20T10:00:00.000Z",
      updatedAt: "2026-07-20T10:10:00.000Z",
      version: 1,
    };
    const onTelemetry = vi.fn();
    const engine = new JourneyStateEngine({
      learnerId: "learner-1",
      lessonId: "david",
      persistence: memoryPersistence(checkpoint),
      onTelemetry,
    });

    const restored = await engine.restore();
    expect(restored?.sceneId).toBe("reflect");
    expect(onTelemetry).toHaveBeenCalledWith(expect.objectContaining({ type: "journey_resumed" }));
  });

  it("marks a journey complete", async () => {
    const engine = new JourneyStateEngine({ learnerId: "l", lessonId: "lesson" });
    engine.enter(scene("ending", "celebration"), 0, 1);
    await engine.complete();
    expect(engine.current?.phase).toBe("complete");
    expect(engine.current?.completedAt).toBeTruthy();
  });
});
