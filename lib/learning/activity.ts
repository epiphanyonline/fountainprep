import type { AudioAsset, EntityId, ImageAsset, Sortable } from "./shared";

export const ACTIVITY_TYPES = [
  "multiple-choice",
  "true-false",
  "matching",
  "ordering",
  "typing",
  "listening",
  "conversation",
  "coding",
  "reflection",
  "upload",
  "project",
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export interface ActivityBase extends Sortable {
  id: EntityId;
  type: ActivityType;
  title: string;
  instructions: string;
  required: boolean;
  points?: number;
  hint?: string;
}

export interface ChoiceOption {
  id: EntityId;
  label: string;
  image?: ImageAsset;
}

export interface MultipleChoiceActivity extends ActivityBase {
  type: "multiple-choice";
  prompt: string;
  options: ChoiceOption[];
  correctOptionIds: EntityId[];
  allowMultiple?: boolean;
  explanation?: string;
}

export interface TrueFalseActivity extends ActivityBase {
  type: "true-false";
  statement: string;
  correctAnswer: boolean;
  explanation?: string;
}

export interface MatchingPair {
  id: EntityId;
  left: string;
  right: string;
}

export interface MatchingActivity extends ActivityBase {
  type: "matching";
  pairs: MatchingPair[];
}

export interface OrderingActivity extends ActivityBase {
  type: "ordering";
  items: Array<{ id: EntityId; label: string }>;
  correctOrder: EntityId[];
}

export interface TypingActivity extends ActivityBase {
  type: "typing";
  prompt: string;
  acceptedAnswers?: string[];
  caseSensitive?: boolean;
  minimumLength?: number;
  maximumLength?: number;
}

export interface ListeningActivity extends ActivityBase {
  type: "listening";
  audio: AudioAsset;
  prompt: string;
  acceptedAnswers?: string[];
}

export interface ConversationActivity extends ActivityBase {
  type: "conversation";
  scenario: string;
  ayoRole: string;
  learnerGoal: string;
  successCriteria: string[];
  starterPrompt?: string;
}

export interface CodingActivity extends ActivityBase {
  type: "coding";
  language: string;
  prompt: string;
  starterCode?: string;
  tests?: Array<{ name: string; input?: string; expectedOutput?: string }>;
}

export interface ReflectionActivity extends ActivityBase {
  type: "reflection";
  prompt: string;
  minimumLength?: number;
}

export interface UploadActivity extends ActivityBase {
  type: "upload";
  prompt: string;
  acceptedMimeTypes?: string[];
  maximumSizeMb?: number;
}

export interface ProjectActivity extends ActivityBase {
  type: "project";
  brief: string;
  deliverables: string[];
  rubric?: Array<{ criterion: string; description: string; weight: number }>;
}

export type Activity =
  | MultipleChoiceActivity
  | TrueFalseActivity
  | MatchingActivity
  | OrderingActivity
  | TypingActivity
  | ListeningActivity
  | ConversationActivity
  | CodingActivity
  | ReflectionActivity
  | UploadActivity
  | ProjectActivity;

export interface ActivitySubmission {
  id: EntityId;
  learnerId: EntityId;
  episodeId: EntityId;
  activityId: EntityId;
  answer: unknown;
  completed: boolean;
  score?: number;
  feedback?: string;
  submittedAt: string;
}
