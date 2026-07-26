import type { StoryJourney } from "../../story/types";

export interface StoryCompletionRecord {
  learnerId: string;
  storyId: string;
  completedAt: string;
  skills: string[];
  conceptIds: string[];
  memorableMoment: string;
  recommendationIds: string[];
}

export function createStoryCompletionRecord(
  learnerId: string,
  story: StoryJourney,
  completedAt = new Date(),
): StoryCompletionRecord {
  if (!learnerId.trim()) throw new Error("learnerId is required");
  return {
    learnerId,
    storyId: story.id,
    completedAt: completedAt.toISOString(),
    skills: [...story.completion.skills],
    conceptIds: [...story.completion.conceptIds],
    memorableMoment: story.completion.memorableMoment,
    recommendationIds: story.completion.recommendations.map((item) => item.id),
  };
}
