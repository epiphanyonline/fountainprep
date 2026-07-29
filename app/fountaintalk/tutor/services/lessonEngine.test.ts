import { describe, expect, it } from "vitest";

import type {
  CurriculumCourse,
  LearnerProgress,
  LessonStep,
} from "@/app/types/fountaintalk";

import {
  completeCurrentLesson,
  completeCurrentStep,
  createInitialProgress,
  getActiveLessonState,
  moveToPreviousStep,
} from "./lessonEngine";

const TEST_STEP_TYPE =
  "practice" as LessonStep["type"];

const course: CurriculumCourse = {
  id: "course-1",
  language: "yoruba",
  level: "foundation",
  title: "Test Yoruba Course",
  description: "",
  proficiencyCode: "A0",
  learningOutcomes: [],
  suitableGoals: [],
  estimatedHours: 1,
  completionPoints: 40,
  units: [
    {
      id: "unit-1",
      language: "yoruba",
      level: "foundation",
      unitNumber: 1,
      title: "Unit One",
      description: "",
      lessons: [
        {
          id: "lesson-1",
          language: "yoruba",
          level: "foundation",
          unitNumber: 1,
          lessonNumber: 1,
          title: "Lesson One",
          objective: "Complete lesson one",
          vocabulary: [],
          completionPoints: 10,
          steps: [
            {
              id: "lesson-1-step-1",
              type: TEST_STEP_TYPE,
              title: "Step One",
              instruction: "Start",
              teacherPrompt:
                "Guide the learner through this step.",
              expectedPhrase: undefined,
              nativeAudioUrl: undefined,
              slowAudioUrl: undefined,
            },
            {
              id: "lesson-1-step-2",
              type: TEST_STEP_TYPE,
              title: "Step Two",
              instruction: "Finish",
              teacherPrompt:
                "Guide the learner through this step.",
              expectedPhrase: undefined,
              nativeAudioUrl: undefined,
              slowAudioUrl: undefined,
            },
          ],
        },
        {
          id: "lesson-2",
          language: "yoruba",
          level: "foundation",
          unitNumber: 1,
          lessonNumber: 2,
          title: "Lesson Two",
          objective: "Complete lesson two",
          vocabulary: [],
          completionPoints: 10,
          steps: [
            {
              id: "lesson-2-step-1",
              type: TEST_STEP_TYPE,
              title: "Step One",
              instruction: "Start",
              teacherPrompt:
                "Guide the learner through this step.",
              expectedPhrase: undefined,
              nativeAudioUrl: undefined,
              slowAudioUrl: undefined,
            },
          ],
        },
      ],
    },
    {
      id: "unit-2",
      language: "yoruba",
      level: "foundation",
      unitNumber: 2,
      title: "Unit Two",
      description: "",
      lessons: [
        {
          id: "lesson-3",
          language: "yoruba",
          level: "foundation",
          unitNumber: 2,
          lessonNumber: 1,
          title: "Lesson Three",
          objective: "Complete lesson three",
          vocabulary: [],
          completionPoints: 20,
          steps: [
            {
              id: "lesson-3-step-1",
              type: TEST_STEP_TYPE,
              title: "Step One",
              instruction: "Start",
              teacherPrompt:
                "Guide the learner through this step.",
              expectedPhrase: undefined,
              nativeAudioUrl: undefined,
              slowAudioUrl: undefined,
            },
          ],
        },
      ],
    },
  ],
};

describe("lessonEngine", () => {
  it("creates progress at the first lesson and first step", () => {
    const progress =
      createInitialProgress("student-1", course);

    expect(progress.currentUnitId).toBe("unit-1");
    expect(progress.currentLessonId).toBe("lesson-1");
    expect(progress.currentStepIndex).toBe(0);
  });

  it("moves to the next step within a lesson", () => {
    const progress =
      createInitialProgress("student-1", course);

    const next =
      completeCurrentStep(course, progress);

    expect(next.currentStepIndex).toBe(1);
    expect(next.currentLessonId).toBe("lesson-1");
  });

  it("moves to the next lesson after completing a lesson", () => {
    const progress =
      createInitialProgress("student-1", course);

    const next =
      completeCurrentLesson(course, progress);

    expect(next.currentLessonId).toBe("lesson-2");
    expect(next.currentUnitId).toBe("unit-1");
    expect(next.completedLessonIds).toContain(
      "lesson-1",
    );
  });

  it("moves into the next unit after the last lesson in a unit", () => {
    let progress =
      createInitialProgress("student-1", course);

    progress =
      completeCurrentLesson(course, progress);

    progress =
      completeCurrentLesson(course, progress);

    expect(progress.currentUnitId).toBe("unit-2");
    expect(progress.currentLessonId).toBe("lesson-3");
  });

  it("moves back across a unit boundary", () => {
    const progress: LearnerProgress = {
      ...createInitialProgress("student-1", course),
      currentUnitId: "unit-2",
      currentLessonId: "lesson-3",
      currentStepIndex: 0,
    };

    const previous =
      moveToPreviousStep(course, progress);

    expect(previous.currentUnitId).toBe("unit-1");
    expect(previous.currentLessonId).toBe("lesson-2");
  });

  it("returns the correct active lesson state", () => {
    const progress =
      createInitialProgress("student-1", course);

    const active =
      getActiveLessonState(course, progress);

    expect(active.unit.id).toBe("unit-1");
    expect(active.lesson.id).toBe("lesson-1");
    expect(active.step.id).toBe(
      "lesson-1-step-1",
    );
    expect(active.isLastUnit).toBe(false);
  });
});