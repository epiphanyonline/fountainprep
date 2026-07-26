export type EntityId = string;
export type ISODateTime = string;

export type PublicationStatus = "draft" | "review" | "published" | "archived";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface AuditFields {
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface Sortable {
  order: number;
}

export interface Publishable {
  status: PublicationStatus;
  publishedAt?: ISODateTime;
}

export interface ImageAsset {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface AudioAsset {
  src: string;
  transcript?: string;
  durationSeconds?: number;
}

export interface VideoAsset {
  src: string;
  poster?: ImageAsset;
  transcript?: string;
  durationSeconds?: number;
}
