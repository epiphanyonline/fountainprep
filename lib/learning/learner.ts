import type { EntityId, ISODateTime } from "./shared";

export interface LearnerProfile {
  id: EntityId;
  userId: EntityId;
  displayName: string;
  dateOfBirth?: string;
  ageGroup?: "3-5" | "6-9" | "10-13" | "14-17" | "adult";
  interests: string[];
  goals: string[];
  preferredLearningModes: Array<"visual" | "audio" | "reading" | "practice">;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
