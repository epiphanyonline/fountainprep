import type {
  AuditFields,
  Difficulty,
  EntityId,
  ImageAsset,
  Publishable,
  Sortable,
} from "./shared";

export interface Journey extends AuditFields, Publishable, Sortable {
  id: EntityId;
  academyId: EntityId;
  pathwayId: EntityId;
  slug: string;
  title: string;
  tagline?: string;
  description: string;
  heroImage?: ImageAsset;
  difficulty: Difficulty;
  estimatedMinutes: number;
  learningOutcomes: string[];
  skills: string[];
  recommendedAge?: string;
  prerequisites?: EntityId[];
}
