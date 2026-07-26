import type { SubscriptionTier } from "../engine/types";

export type AgeGroup = "child" | "teen" | "adult";
export type GrowthDimension =
  | "faith" | "leadership" | "communication" | "critical-thinking"
  | "financial-literacy" | "logic" | "creativity" | "programming"
  | "languages" | "career-readiness";

export interface LearnerIdentity {
  learnerId: string;
  accountName?: string;
  preferredName: string;
  namePronunciation?: string;
  avatarUrl?: string;
  ageGroup?: AgeGroup;
  language?: string;
  timezone?: string;
  birthday?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LearnerMission {
  id: string;
  title: string;
  reason?: string;
  startedAt: string;
  targetDate?: string;
  progress: number;
  status: "active" | "paused" | "completed";
}

export interface GrowthSignal {
  dimension: GrowthDimension;
  value: number;
  confidence: number;
  evidenceCount: number;
  updatedAt: string;
}

export interface MentorMemory {
  id: string;
  type: "strength" | "challenge" | "interest" | "achievement" | "preference";
  topic: string;
  note?: string;
  confidence: number;
  sourceId?: string;
  observedAt: string;
}

export interface LearnerProfile {
  identity: LearnerIdentity;
  subscriptionTier: SubscriptionTier;
  activeMission?: LearnerMission;
  growth: GrowthSignal[];
  mentorMemories: MentorMemory[];
  completedLessonIds: string[];
  completedModuleIds: string[];
  academyInterests: Record<string, number>;
  preferences: {
    allowMentorLetters: boolean;
    allowNameInNarration: boolean;
    reducedMotion?: boolean;
  };
}

export interface LearnerProfilePatch {
  preferredName?: string;
  namePronunciation?: string;
  avatarUrl?: string;
  language?: string;
  timezone?: string;
  birthday?: string;
  allowMentorLetters?: boolean;
  allowNameInNarration?: boolean;
}
