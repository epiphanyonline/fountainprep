export const STORY_FIRST_LESSON_SEQUENCE = [
  "cold-open",
  "character-profile",
  "tension",
  "surprising-outcome",
  "big-question",
  "why-it-matters",
  "core-teaching",
  "story-return",
  "case-study",
  "reflection",
  "assessment",
  "closing-insight",
] as const;

export type StoryFirstLessonStage =
  (typeof STORY_FIRST_LESSON_SEQUENCE)[number];

export const STORY_FIRST_AUTHORING_RULES = {
  minimumHookScenes: 3,
  preferredHookMinutes: "2-4",
  returnToStoryDuringTeaching: true,
  requireResponsibleInterpretation: true,
  requireReflection: true,
  requireAssessment: true,
} as const;
