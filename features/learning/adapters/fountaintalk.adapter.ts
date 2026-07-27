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

function mapCollectionToUnit(
  collection: EpisodeCollection & {
    episodes: Episode[];
  },
  registry: FountainTalkContentRegistry,
  unitNumber: number,
): CurriculumUnit {
  const lessons = collection.episodes
    .map((episode) => findExistingLesson(registry, episode))
    .filter(
      (lesson): lesson is CurriculumLesson => lesson !== null,
    );

  return {
    id: collection.id,
    language: lessons[0]?.language ?? "yoruba",
    level: lessons[0]?.level ?? "foundation",
    unitNumber,
    title: collection.title,
    description: collection.description ?? "",
    lessons,
  };
}

export function adaptLearningPathToFountainTalkCourse(
  path: JourneyLearningPath,
  registry: FountainTalkContentRegistry,
): CurriculumCourse {
  const units = path.collections.map((collection, index) =>
    mapCollectionToUnit(collection, registry, index + 1),
  );

  return {
    id: path.journey.id,
    language: units[0]?.language ?? "yoruba",
    level: units[0]?.level ?? "foundation",
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
            unitTotal + lesson.completionPoints,
          0,
        ),
      0,
    ),
  };
}