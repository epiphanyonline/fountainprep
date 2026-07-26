import type { LivingLesson, LivingScene, RecommendationHook } from "../types";

export const JOURNEY_ENDING_SCENE_ID = "__journey-ending__";

export interface JourneyEndingContext {
  learnerName?: string;
  growthTheme?: string;
  rememberedMoment?: string;
  nextInvitation?: string;
  recommendation?: RecommendationHook;
}

export function createJourneyEndingScene(
  lesson: LivingLesson,
  context: JourneyEndingContext = {},
): LivingScene {
  const name = context.learnerName?.trim();
  const growth = context.growthTheme ?? lesson.learningObjectives[0] ?? "a new way of seeing";
  const acknowledgement = name ? `${name}, today you strengthened ${growth}.` : `Today you strengthened ${growth}.`;
  const remembered = context.rememberedMoment ? ` ${context.rememberedMoment}` : " I'll remember this moment.";

  return {
    id: JOURNEY_ENDING_SCENE_ID,
    kind: "celebration",
    eyebrow: "Your journey continues",
    title: "Where shall we grow next?",
    displayText: acknowledgement,
    narration: `${acknowledgement}${remembered} ${context.nextInvitation ?? "When you're ready, another path is waiting."}`,
    durationMs: 9000,
    camera: "celebration",
    transition: "light",
    background: { id: "journey-ending", gradient: "linear-gradient(135deg,#312e81,#0f172a 55%,#064e3b)", alt: "A calm glowing classroom" },
    interaction: {
      id: "journey-ending-continue",
      mode: "continue",
      prompt: "Keep this moment with you.",
      pauseTimeline: true,
    },
    timeline: [
      { id: "ending:preload", atMs: 0, type: "set-phase", payload: { phase: "preload" } },
      { id: "ending:bg", atMs: 100, type: "show-background" },
      { id: "ending:celebrate", atMs: 500, type: "celebrate" },
      { id: "ending:narration", atMs: 1500, type: "start-narration" },
      { id: "ending:interaction", atMs: 6200, type: "show-interaction" },
      ...(context.recommendation ? [{ id: "ending:recommendation", atMs: 6600, type: "recommendation-hook" as const, targetId: context.recommendation.id }] : []),
      { id: "ending:complete", atMs: 9000, type: "complete-scene" },
    ],
    recommendationHooks: context.recommendation ? [context.recommendation] : undefined,
  };
}
