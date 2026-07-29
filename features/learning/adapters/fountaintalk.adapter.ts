import type {
  CurriculumCourse,
  CurriculumLesson,
  CurriculumUnit,
} from "@/app/types/fountaintalk";

import type {
  Episode,
  EpisodeCollection,
  JourneyLearningPath,
} from "@/features/learning";

export type FountainTalkContentRegistry = {
  courses: CurriculumCourse[];
};

function findExistingLesson(
  registry: FountainTalkContentRegistry,
  episode: Episode,
): CurriculumLesson | null {
  for (const course of registry.courses) {
    for (const unit of course.units) {
      const lesson = unit.lessons.find(
        (candidate) =>
          candidate.id === episode.id ||
          candidate.title.trim().toLowerCase() ===
            episode.title.trim().toLowerCase(),
      );

      if (lesson) {
        return lesson;
      }
    }
  }

  return null;
}

function findFallbackLesson(
  registry: FountainTalkContentRegistry,
): CurriculumLesson | null {
  for (const course of registry.courses) {
    for (const unit of course.units) {
      const lesson = unit.lessons[0];

      if (lesson) {
        return lesson;
      }
    }
  }

  return null;
}

function mapEpisodeToLesson(
  episode: Episode,
  registry: FountainTalkContentRegistry,
): CurriculumLesson | null {
  const existingLesson =
    findExistingLesson(registry, episode);

  if (existingLesson) {
    return {
      ...existingLesson,
      id: episode.id,
      title: episode.title,
      objective:
        episode.objective ??
        existingLesson.objective,
      steps: existingLesson.steps.map(
        (step, index) => ({
          ...step,
          id: `${episode.id}-step-${index + 1}`,
        }),
      ),
    };
  }

  const fallbackLesson =
    findFallbackLesson(registry);

  if (!fallbackLesson) {
    return null;
  }

  return {
    ...fallbackLesson,
    id: episode.id,
    title: episode.title,
    objective:
      episode.objective ??
      `Complete the ${episode.title} lesson.`,
    steps: fallbackLesson.steps.map(
      (step, index) => ({
        ...step,
        id: `${episode.id}-step-${index + 1}`,
      }),
    ),
  };
}

function mapCollectionToUnit(
  collection: EpisodeCollection & {
    episodes: Episode[];
  },
  registry: FountainTalkContentRegistry,
  unitNumber: number,
): CurriculumUnit {
  const lessons = collection.episodes
    .map((episode) =>
      mapEpisodeToLesson(
        episode,
        registry,
      ),
    )
    .filter(
      (
        lesson,
      ): lesson is CurriculumLesson =>
        lesson !== null,
    );

  return {
    id: collection.id,
    language:
      lessons[0]?.language ?? "yoruba",
    level:
      lessons[0]?.level ?? "foundation",
    unitNumber,
    title: collection.title,
    description:
      collection.description ?? "",
    lessons,
  };
}

export function adaptLearningPathToFountainTalkCourse(
  path: JourneyLearningPath,
  registry: FountainTalkContentRegistry,
): CurriculumCourse {
  const units = path.collections.map(
    (collection, index) =>
      mapCollectionToUnit(
        collection,
        registry,
        index + 1,
      ),
  );

  return {
    id: path.journey.id,
    language:
      units[0]?.language ?? "yoruba",
    level:
      units[0]?.level ?? "foundation",
    title: path.journey.title,
    description: "",
    proficiencyCode: "A0",
    learningOutcomes: [],
    suitableGoals: [],
    units,
    estimatedHours: 0,
    completionPoints: units.reduce(
      (courseTotal, unit) =>
        courseTotal +
        unit.lessons.reduce(
          (unitTotal, lesson) =>
            unitTotal +
            lesson.completionPoints,
          0,
        ),
      0,
    ),
  };
}