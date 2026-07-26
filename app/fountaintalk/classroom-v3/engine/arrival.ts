import type { LivingLesson, LivingScene, TimelineEvent } from "./types";

export interface ArrivalContext {
  /** The name Ayo should use. Falls back to "friend". */
  preferredName?: string;
  /** True when this is the learner's first Living Classroom visit. */
  firstVisit?: boolean;
  /** A short, conversational recall from the learner's latest journey. */
  journeyRecall?: string;
  /** The curiosity-led promise for today's experience. */
  todayPromise?: string;
  /** Optional visual treatment supplied by the host application. */
  background?: LivingScene["background"];
  ambience?: LivingScene["ambience"];
}

export const ARRIVAL_SCENE_ID = "living-classroom:arrival";

function arrivalNarration(lesson: LivingLesson, context: ArrivalContext): string {
  const name = context.preferredName?.trim() || "friend";
  const welcome = context.firstVisit
    ? `Welcome to FountainTalk, ${name}.`
    : `Welcome back, ${name}.`;
  const recall = context.journeyRecall?.trim();
  const promise = context.todayPromise?.trim() || lesson.summary;

  return [welcome, recall, promise].filter(Boolean).join(" ");
}

function arrivalTimeline(sceneId: string, hasAmbience: boolean): TimelineEvent[] {
  return [
    { id: `${sceneId}:preload`, atMs: 0, type: "set-phase", payload: { phase: "preload" } },
    { id: `${sceneId}:background`, atMs: 120, type: "show-background" },
    ...(hasAmbience
      ? [{ id: `${sceneId}:ambience`, atMs: 180, type: "set-ambience" as const, targetId: "arrival-ambience" }]
      : []),
    { id: `${sceneId}:arrival`, atMs: 420, type: "set-phase", payload: { phase: "arrival" } },
    { id: `${sceneId}:narration`, atMs: 900, type: "start-narration" },
    { id: `${sceneId}:interaction-phase`, atMs: 2500, type: "set-phase", payload: { phase: "interaction" } },
    { id: `${sceneId}:ready`, atMs: 2600, type: "show-interaction" },
  ];
}

/**
 * Builds the first scene of every V3 classroom experience.
 * Arrival is content, not a route or modal: "everything is a scene".
 */
export function createArrivalScene(
  lesson: LivingLesson,
  context: ArrivalContext = {},
): LivingScene {
  const firstVisit = context.firstVisit ?? false;

  return {
    id: ARRIVAL_SCENE_ID,
    kind: "arrival",
    eyebrow: firstVisit ? "Welcome to FountainTalk" : "Continue your journey",
    title: firstVisit ? "A new journey begins" : "You’re back",
    displayText: context.todayPromise?.trim() || lesson.summary,
    narration: arrivalNarration(lesson, context),
    durationMs: 60_000,
    camera: "wide",
    transition: "dissolve",
    background: context.background ?? {
      id: "arrival-background",
      gradient: "radial-gradient(circle at 72% 24%, #312e81 0%, #111827 42%, #030712 100%)",
      alt: "A calm, welcoming Living Classroom",
    },
    ambience: context.ambience
      ? { ...context.ambience, id: "arrival-ambience" }
      : undefined,
    interaction: {
      id: "arrival-ready",
      mode: "continue",
      prompt: firstVisit ? "Ready to begin your first journey?" : "Ready to continue?",
      pauseTimeline: true,
    },
    timeline: arrivalTimeline(ARRIVAL_SCENE_ID, Boolean(context.ambience)),
  };
}
