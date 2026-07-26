import type { StoryJourney } from "../../story/types";
import { validateStory } from "../../story/validateStory";

export interface ReleaseReadinessCheck { id: string; passed: boolean; message: string; }
export interface ReleaseReadinessReport { ready: boolean; score: number; checks: ReleaseReadinessCheck[]; }

export function assessReleaseReadiness(story: StoryJourney): ReleaseReadinessReport {
  const validation = validateStory(story);
  const checks: ReleaseReadinessCheck[] = [
    { id: "story-validation", passed: validation.valid, message: validation.valid ? "Story validation passed." : "Story has blocking validation errors." },
    { id: "accessibility", passed: story.scenes.every((s) => Boolean(s.background?.alt?.trim())), message: "Every scene must include meaningful background alternative text." },
    { id: "journey-phases", passed: story.scenes.every((s) => Boolean(s.journeyPhase)), message: "Every release scene should declare a journey phase." },
    { id: "completion", passed: story.scenes.every((s) => s.timeline?.some((e) => e.type === "complete-scene") ?? false), message: "Every scene must have a deterministic completion event." },
    { id: "interaction-fallbacks", passed: story.scenes.every((s) => !s.interaction || s.interaction.mode === "none" || Boolean(s.interaction.fallbackResponse?.trim() || s.interaction.explanation?.trim())), message: "Interactive scenes need a fallback or explanation." },
  ];
  const passed = checks.filter((c) => c.passed).length;
  return { ready: checks.every((c) => c.passed), score: Math.round((passed / checks.length) * 100), checks };
}
