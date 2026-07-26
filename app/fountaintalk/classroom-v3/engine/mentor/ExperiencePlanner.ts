import type { LivingLesson, LivingScene, SceneKind } from "../types";

export type ExperienceIntent =
  | "welcome"
  | "curiosity"
  | "immersion"
  | "thinking"
  | "discovery"
  | "understanding"
  | "celebration"
  | "growth"
  | "invitation";

export interface ExperiencePlanStep {
  sceneId: string;
  sceneIndex: number;
  intent: ExperienceIntent;
}

export interface ExperiencePlan {
  lessonId: string;
  steps: ExperiencePlanStep[];
}

const intentByKind: Partial<Record<SceneKind, ExperienceIntent>> = {
  arrival: "welcome",
  story: "immersion",
  documentary: "immersion",
  conversation: "thinking",
  discovery: "discovery",
  explanation: "understanding",
  diagram: "understanding",
  whiteboard: "understanding",
  comparison: "thinking",
  reflection: "growth",
  assessment: "thinking",
  simulation: "discovery",
  recap: "growth",
  celebration: "celebration",
};

export function inferExperienceIntent(scene: LivingScene): ExperienceIntent {
  return intentByKind[scene.kind] ?? "curiosity";
}

export function createExperiencePlan(lesson: LivingLesson): ExperiencePlan {
  return {
    lessonId: lesson.id,
    steps: lesson.scenes.map((scene, sceneIndex) => ({
      sceneId: scene.id,
      sceneIndex,
      intent: inferExperienceIntent(scene),
    })),
  };
}
