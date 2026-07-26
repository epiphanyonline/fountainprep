import type {
  AuditFields,
  EntityId,
  ImageAsset,
  Publishable,
  Sortable,
} from "./shared";

export interface AcademyTheme {
  primary: string;
  secondary?: string;
  accent?: string;
  icon?: string;
  coverImage?: ImageAsset;
}

export interface AcademySettings {
  certificateEnabled?: boolean;
  ayoEnabled?: boolean;
  communityEnabled?: boolean;
  minimumAge?: number;
  maximumAge?: number;
}

export interface Academy extends AuditFields, Publishable {
  id: EntityId;
  slug: string;
  title: string;
  description: string;
  shortDescription?: string;
  theme: AcademyTheme;
  settings: AcademySettings;
}

export interface Pathway extends AuditFields, Publishable, Sortable {
  id: EntityId;
  academyId: EntityId;
  slug: string;
  title: string;
  description: string;
  recommendedAge?: string;
}
