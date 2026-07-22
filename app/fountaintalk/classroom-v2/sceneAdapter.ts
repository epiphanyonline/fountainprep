import type {
  AcademyLesson,
  AyoPose,
  LessonStep,
  StepKind,
} from "../types/academy";

import type {
  ClassroomScene,
  SceneCamera,
  SceneInteractionMode,
  SceneTransition,
} from "./types";

function poseForKind(kind: StepKind): AyoPose {
  switch (kind) {
    case "welcome":
      return "welcome";

    case "story":
    case "illustration":
    case "diagram":
    case "transition":
      return "point-slide";

    case "question":
    case "quiz":
    case "assessment":
    case "reflection":
      return "listen";

    case "challenge":
      return "encourage";

    case "example":
    case "worked-example":
    case "case-study":
    case "practice":
      return "open-hands";

    case "teach":
    case "concept":
    case "decision-framework":
    case "summary":
    default:
      return "explain";
  }
}

function cameraForStep(step: LessonStep): SceneCamera {
  if (
    step.kind === "diagram" ||
    step.visual?.type === "diagram" ||
    step.visual?.type === "chart"
  ) {
    return "visual-focus";
  }

  if (
    step.kind === "story" ||
    step.kind === "case-study" ||
    step.visual?.type === "comparison"
  ) {
    return "split";
  }

  if (step.kind === "welcome" || step.kind === "summary") {
    return "presenter";
  }

  return "wide";
}

function transitionForStep(
  index: number,
  step: LessonStep
): SceneTransition {
  if (index === 0) return "fade";
  if (step.kind === "story") return "zoom";
  if (step.kind === "diagram") return "wipe";
  if (step.kind === "transition") return "slide";
  return "fade";
}

function interactionForStep(
  step: LessonStep
): SceneInteractionMode {
  /**
   * Choices take priority. This fixes older lessons whose
   * responseType may not have been updated consistently.
   */
  if (step.choices?.length) return "choice";

  if (step.responseType === "choice") return "choice";

  if (step.responseType === "text") {
    return step.kind === "reflection"
      ? "reflection"
      : "text";
  }

  /**
   * Questions without predefined choices begin as spoken/typed
   * responses. The player may reveal choices after repeated errors.
   */
  if (
    step.kind === "question" ||
    step.kind === "quiz" ||
    step.kind === "assessment"
  ) {
    return "text";
  }

  return "lecture";
}

function sceneDuration(step: LessonStep): number {
  if (
    step.responseType !== "none" ||
    step.choices?.length
  ) {
    return 0;
  }

  const requested = step.durationSeconds ?? 14;

  return Math.max(
    7000,
    Math.min(requested * 1000, 70000)
  );
}

export function lessonToScenes(
  lesson: AcademyLesson
): ClassroomScene[] {
  return lesson.steps.map((step, index) => ({
    id: step.id,
    title: step.title,
    eyebrow: lesson.title,
    narration: step.teacherPrompt,
    displayText:
      step.displayText ??
      step.question ??
      lesson.objective,
    kind: step.kind,
    camera: cameraForStep(step),
    transition: transitionForStep(index, step),
    durationMs: sceneDuration(step),
    ayoPose: step.ayoPose ?? poseForKind(step.kind),
    interactionMode: interactionForStep(step),
    visual: step.visual,
    choices: step.choices,
    question: step.question,
    acceptedAnswers: step.acceptedAnswers,
    hint: step.hint,
    explanation: step.explanation,
    sourceStep: step,
  }));
}
