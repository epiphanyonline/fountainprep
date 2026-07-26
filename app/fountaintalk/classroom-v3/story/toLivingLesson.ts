import type { LivingLesson } from "../engine/types";
import type { StoryJourney } from "./types";

export function storyToLivingLesson(story: StoryJourney): LivingLesson {
  return {
    id: story.id,
    moduleId: story.moduleId,
    title: story.title,
    summary: story.summary,
    estimatedMinutes: story.estimatedMinutes,
    learningObjectives: story.learningObjectives,
    scenes: story.scenes,
    access: story.access,
  };
}
