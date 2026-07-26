import type { Activity } from "./activity";
import type {
  AuditFields,
  AudioAsset,
  Difficulty,
  EntityId,
  ImageAsset,
  Publishable,
  Sortable,
  VideoAsset,
} from "./shared";

export type EpisodeSectionType =
  | "welcome"
  | "story"
  | "discovery"
  | "teaching"
  | "example"
  | "activity"
  | "reflection"
  | "application"
  | "celebration";

export interface EpisodeMedia {
  image?: ImageAsset;
  audio?: AudioAsset;
  video?: VideoAsset;
}

export interface EpisodeSection extends Sortable {
  id: EntityId;
  type: EpisodeSectionType;
  title?: string;
  body?: string;
  prompt?: string;
  media?: EpisodeMedia;
  activityIds?: EntityId[];
  ayoInstruction?: string;
}

export interface ReflectionPrompt {
  prompt: string;
  minimumLength?: number;
  privateByDefault?: boolean;
}

export interface ApplicationPrompt {
  title: string;
  instructions: string;
  evidenceRequired?: boolean;
}

export interface Celebration {
  title: string;
  message: string;
  points?: number;
  badgeId?: EntityId;
}

export interface Episode extends AuditFields, Publishable, Sortable {
  id: EntityId;
  academyId: EntityId;
  pathwayId: EntityId;
  journeyId: EntityId;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  learningObjectives: string[];
  estimatedMinutes: number;
  difficulty: Difficulty;
  sections: EpisodeSection[];
  activities: Activity[];
  reflection?: ReflectionPrompt;
  application?: ApplicationPrompt;
  celebration?: Celebration;
  prerequisiteEpisodeIds?: EntityId[];
  nextEpisodeId?: EntityId;
}
