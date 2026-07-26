import type { EntityId, ISODateTime } from "./shared";

export type AyoInteractionPoint =
  | "welcome"
  | "story-introduction"
  | "teaching-support"
  | "activity-hint"
  | "reflection"
  | "celebration"
  | "recommendation";

export interface AyoContext {
  learnerId: EntityId;
  academyId: EntityId;
  journeyId?: EntityId;
  episodeId?: EntityId;
  interactionPoint: AyoInteractionPoint;
  learnerName?: string;
  learningObjectives?: string[];
  recentChallenges?: string[];
  recentSuccesses?: string[];
}

export interface AyoMemory {
  id: EntityId;
  learnerId: EntityId;
  key: string;
  value: unknown;
  confidence: number;
  source: "learner" | "progress" | "tutor" | "parent" | "system";
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  expiresAt?: ISODateTime;
}
