import type { LivingLesson, LivingScene } from "./types";
import { recallMemory, type MemoryRecallContext } from "./memory/MemoryDirector";
import { createJourneyEndingScene, type JourneyEndingContext } from "./journey/JourneyEndingDirector";
import {
  MentorDecisionEngine,
  type MentorDecision,
  type MentorDecisionTelemetryEvent,
} from "./mentor";
import { inferJourneyPhase } from "./journey-state";

export interface MentorDecisionEngineConfig {
  /** Safe rollout switch. Defaults to false so RC1 behavior is unchanged. */
  enabled?: boolean;
  onDecision?: (decision: MentorDecision, scene: LivingScene) => void;
  onTelemetry?: (event: MentorDecisionTelemetryEvent) => void;
}

export interface MentorExperienceContext {
  memory?: MemoryRecallContext;
  ending?: JourneyEndingContext | false;
  decisionEngine?: MentorDecisionEngineConfig;
}

function lessonTopics(lesson: LivingLesson): string[] {
  return [...lesson.learningObjectives, ...lesson.scenes.flatMap((scene) => scene.memoryHooks?.map((hook) => hook.topic) ?? [])];
}

export function conductMentorExperience(
  lesson: LivingLesson,
  context: MentorExperienceContext = {},
): LivingScene[] {
  const scenes = lesson.scenes.map((scene) => ({ ...scene }));
  const memory = recallMemory({
    ...context.memory,
    currentTopics: context.memory?.currentTopics ?? lessonTopics(lesson),
  });

  if (context.decisionEngine?.enabled) {
    const engine = new MentorDecisionEngine({ onTelemetry: context.decisionEngine.onTelemetry });
    scenes.forEach((scene, sceneIndex) => {
      const decision = engine.decide({
        lesson,
        scene,
        progress: { sceneIndex, sceneCount: scenes.length },
        memories: context.memory?.memories,
        memoryRecall: memory,
        recommendations: scene.recommendationHooks,
        journeyPhase: inferJourneyPhase(scene, sceneIndex, scenes.length),
      });
      context.decisionEngine?.onDecision?.(decision, scene);

      if (decision.action === "recall_memory" && memory && sceneIndex === 0) {
        scenes[sceneIndex] = {
          ...scene,
          narration: `${memory.line} ${scene.narration ?? ""}`.trim(),
        };
      }
    });
  } else if (memory && scenes[0]) {
    // RC1 compatibility path. Remove after the feature flag reaches 100%.
    scenes[0] = {
      ...scenes[0],
      narration: `${memory.line} ${scenes[0].narration ?? ""}`.trim(),
    };
  }

  if (context.ending !== false) {
    scenes.push(createJourneyEndingScene(lesson, {
      ...context.ending,
      rememberedMoment: context.ending?.rememberedMoment ?? memory?.line,
    }));
  }

  return scenes;
}
