import { describe, expect, it } from "vitest";

import type {
  CurriculumCourse,
  LessonStep,
} from "@/app/types/fountaintalk";

import type {
  JourneyLearningPath,
} from "@/features/learning";

import {
  adaptLearningPathToFountainTalkCourse,
} from "./fountaintalk.adapter";

const TEST_STEP_TYPE =
  "practice" as LessonStep["type"];

const registryCourse: CurriculumCourse = {
  id: "registry-course",
  language: "yoruba",
  level: "foundation",
  title: "Registry Course",
  description: "",
  proficiencyCode: "A0",
  learningOutcomes: [],
  suitableGoals: [],
  estimatedHours: 1,
  completionPoints: 10,
  units: [
    {
      id: "registry-unit",
      language: "yoruba",
      level: "foundation",
      unitNumber: 1,
      title: "Registry Unit",
      description: "",
      lessons: [
        {
          id: "registry-lesson",
          language: "yoruba",
          level: "foundation",
          unitNumber: 1,
          lessonNumber: 1,
          title: "Good Morning",
          objective: "Learn a greeting",
          vocabulary: [],
          completionPoints: 10,
          steps: [
            {
              id: "registry-step-1",
              type: TEST_STEP_TYPE,
              title: "Listen",
              instruction: "Listen carefully",
              teacherPrompt:
                "Guide the learner through this step.",
              expectedPhrase: "Ẹ káàárọ̀",
              nativeAudioUrl: undefined,
              slowAudioUrl: undefined,
            },
          ],
        },
      ],
    },
  ],
};

const path: JourneyLearningPath = {
  journey: {
    id: "journey-1",
    subjectId: "subject-1",
    stageId: "stage-1",
    title: "Yoruba Foundation",
    description: "Foundation Yoruba journey",
    proficiencyCode: "A0",
    proficiencyName: "Foundation",
    estimatedHours: 1,
    isActive: true,
    sortOrder: 1,
    createdAt: null,
  },
  collections: [
    {
      id: "unit-1",
      journeyId: "journey-1",
      title: "Greetings",
      description: "Greeting lessons",
      sortOrder: 1,
      createdAt: null,
      episodes: [
        {
          id: "lesson-1",
          episodeCollectionId: "unit-1",
          title: "Good Morning",
          objective: "Say good morning",
          homeworkHint: null,
          sortOrder: 1,
          createdAt: null,
        },
      ],
    },
    {
      id: "unit-2",
      journeyId: "journey-1",
      title: "Meeting People",
      description: "Meeting lessons",
      sortOrder: 2,
      createdAt: null,
      episodes: [
        {
          id: "lesson-2",
          episodeCollectionId: "unit-2",
          title: "Nice to Meet You",
          objective: "Meet someone politely",
          homeworkHint: null,
          sortOrder: 1,
          createdAt: null,
        },
      ],
    },
  ],
  totalEpisodes: 2,
};

describe("fountaintalk adapter", () => {
  it("maps database IDs onto matching rich lesson content", () => {
    const course =
      adaptLearningPathToFountainTalkCourse(
        path,
        {
          courses: [registryCourse],
        },
      );

    const lesson =
      course.units[0].lessons[0];

    expect(lesson.id).toBe("lesson-1");
    expect(lesson.title).toBe("Good Morning");
    expect(lesson.objective).toBe(
      "Say good morning",
    );
    expect(lesson.steps).toHaveLength(1);
    expect(lesson.steps[0].id).toBe(
      "lesson-1-step-1",
    );
  });

  it("creates fallback content for an unmatched database lesson", () => {
    const course =
      adaptLearningPathToFountainTalkCourse(
        path,
        {
          courses: [registryCourse],
        },
      );

    const lesson =
      course.units[1].lessons[0];

    expect(lesson.id).toBe("lesson-2");
    expect(lesson.title).toBe(
      "Nice to Meet You",
    );
    expect(lesson.steps).toHaveLength(1);
    expect(lesson.steps[0].id).toBe(
      "lesson-2-step-1",
    );
  });

  it("keeps multiple non-empty units", () => {
    const course =
      adaptLearningPathToFountainTalkCourse(
        path,
        {
          courses: [registryCourse],
        },
      );

    expect(course.units).toHaveLength(2);
    expect(course.units[0].unitNumber).toBe(1);
    expect(course.units[1].unitNumber).toBe(2);
  });

  it("filters empty units and renumbers remaining units", () => {
    const course =
      adaptLearningPathToFountainTalkCourse(
        {
          ...path,
          collections: [
            {
              id: "empty-unit",
              journeyId: "journey-1",
              title: "Empty Unit",
              description: "",
              sortOrder: 0,
              createdAt: null,
              episodes: [],
            },
            path.collections[0],
          ],
          totalEpisodes: 1,
        },
        {
          courses: [registryCourse],
        },
      );

    expect(course.units).toHaveLength(1);
    expect(course.units[0].id).toBe("unit-1");
    expect(course.units[0].unitNumber).toBe(1);
  });
});