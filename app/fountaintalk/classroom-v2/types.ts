import type {
  AyoPose,
  LessonStep,
  StepKind,
} from "../types/academy";

export type SceneCamera =
  | "wide"
  | "presenter"
  | "split"
  | "visual-focus"
  | "full-visual";

export type SceneTransition =
  | "fade"
  | "slide"
  | "zoom"
  | "wipe"
  | "none";

export type SceneInteractionMode =
  | "lecture"
  | "choice"
  | "text"
  | "reflection";

export type ClassroomScene = {
  id: string;
  title: string;
  eyebrow: string;
  narration: string;
  displayText: string;
  kind: StepKind;
  camera: SceneCamera;
  transition: SceneTransition;
  durationMs: number;
  ayoPose: AyoPose;
  interactionMode: SceneInteractionMode;
  visual?: LessonStep["visual"];
  choices?: LessonStep["choices"];
  question?: string;
  acceptedAnswers?: string[];
  hint?: string;
  explanation?: string;
  sourceStep: LessonStep;
};
