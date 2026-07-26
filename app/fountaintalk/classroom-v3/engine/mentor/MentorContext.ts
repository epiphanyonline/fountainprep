import type { LivingLesson, LivingScene, RecommendationHook } from "../types";
import type { LearnerMemoryRecord, MemoryRecall } from "../memory/MemoryDirector";
import type { JourneyPhase } from "../journey-state";

export type MentorEmotionalState =
  | "neutral"
  | "curious"
  | "uncertain"
  | "confident"
  | "reflective"
  | "celebrating";

export interface MentorProgressContext {
  sceneIndex: number;
  sceneCount: number;
  completedSceneIds?: string[];
}

export interface MentorContext {
  lesson: LivingLesson;
  scene: LivingScene;
  progress: MentorProgressContext;
  memories?: LearnerMemoryRecord[];
  memoryRecall?: MemoryRecall;
  recommendations?: RecommendationHook[];
  emotionalState?: MentorEmotionalState;
  interactionResolved?: boolean;
  learnerAnswer?: string;
  journeyPhase?: JourneyPhase;
}
