import type { StoryJourney, StoryValidationResult } from "../../story/types";

export type StudioStatus = "draft" | "review" | "approved" | "published";

export interface StudioActor {
  id: string;
  displayName: string;
  email?: string;
}

export interface StoryVersion {
  id: string;
  storyId: string;
  version: string;
  status: StudioStatus;
  createdAt: string;
  createdBy: StudioActor;
  notes?: string;
  snapshot: StoryJourney;
}

export interface StudioStoryRecord {
  id: string;
  status: StudioStatus;
  currentVersion: string;
  updatedAt: string;
  updatedBy: StudioActor;
  assignedAuthor?: StudioActor;
  draft: StoryJourney;
  versions: StoryVersion[];
}

export interface StudioAsset {
  id: string;
  kind: "character" | "background" | "artwork" | "music" | "animation";
  title: string;
  src: string;
  alt?: string;
  tags: string[];
}

export interface PublishRequest {
  actor: StudioActor;
  expectedVersion: string;
  nextVersion: string;
  notes?: string;
}

export type PublishResult =
  | { ok: true; record: StudioStoryRecord; validation: StoryValidationResult }
  | { ok: false; reason: "validation" | "version-conflict" | "workflow"; record: StudioStoryRecord; validation?: StoryValidationResult };
