import type { AccessRule, LivingScene, MemoryHook, RecommendationHook } from "../engine/types";

export interface StoryCharacter {
  id: string;
  displayName: string;
  role: string;
  assetId: string;
  description?: string;
}

export interface StoryChapter {
  id: string;
  order: number;
  title: string;
  summary: string;
  sceneIds: string[];
}

export interface StoryCredits {
  discoveries: number;
  questions: number;
  reflections: number;
}

export interface StoryJourney {
  id: string;
  academyId: string;
  moduleId: string;
  title: string;
  subtitle?: string;
  summary: string;
  takeaway: string;
  estimatedMinutes: number;
  learningObjectives: string[];
  access: AccessRule;
  characters: StoryCharacter[];
  chapters: StoryChapter[];
  scenes: LivingScene[];
  completion: {
    skills: string[];
    conceptIds: string[];
    memorableMoment: string;
    credits: StoryCredits;
    memoryHooks: MemoryHook[];
    recommendations: RecommendationHook[];
  };
}

export interface StoryValidationIssue {
  severity: "error" | "warning";
  code: string;
  message: string;
  path: string;
}

export interface StoryValidationResult {
  valid: boolean;
  issues: StoryValidationIssue[];
}
