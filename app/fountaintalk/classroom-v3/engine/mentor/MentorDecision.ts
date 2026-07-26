export type MentorAction =
  | "continue_story"
  | "ask_question"
  | "recall_memory"
  | "celebrate"
  | "reflect"
  | "recommend"
  | "pause";

export type MentorPriority = "low" | "medium" | "high";

export interface MentorDecision<TPayload = unknown> {
  action: MentorAction;
  confidence: number;
  priority: MentorPriority;
  reason: string;
  payload?: TPayload;
  policyIds: string[];
}

export interface MentorDecisionTelemetryEvent {
  type: "mentor_decision";
  occurredAt: string;
  lessonId: string;
  sceneId: string;
  action: MentorAction;
  confidence: number;
  priority: MentorPriority;
  reason: string;
  policyIds: string[];
}
