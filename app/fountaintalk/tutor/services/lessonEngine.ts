import type {
  CurriculumCourse,
  CurriculumLesson,
  CurriculumUnit,
  LearnerProgress,
  LessonStep,
} from "@/app/types/fountaintalk";

export type ActiveLessonState = {
  course: CurriculumCourse;
  unit: CurriculumUnit;
  lesson: CurriculumLesson;
  step: LessonStep;

  unitIndex: number;
  lessonIndex: number;
  stepIndex: number;

  lessonProgressPercentage: number;
  unitProgressPercentage: number;
  courseProgressPercentage: number;

  isFirstUnit: boolean;
  isLastUnit: boolean;
  isFirstLesson: boolean;
  isLastLesson: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
};

function addUniqueId(
  ids: string[],
  id: string
): string[] {
  return ids.includes(id)
    ? ids
    : [...ids, id];
}

function getCourseLessons(
  course: CurriculumCourse
): CurriculumLesson[] {
  return course.units.flatMap(
    (unit) => unit.lessons
  );
}

export function createInitialProgress(
  learnerId: string,
  course: CurriculumCourse
): LearnerProgress {
  const firstUnit = course.units[0];

  if (!firstUnit) {
    throw new Error(
      `Course "${course.id}" does not contain any units.`
    );
  }

  const firstLesson = firstUnit.lessons[0];

  if (!firstLesson) {
    throw new Error(
      `Curriculum unit "${firstUnit.id}" does not contain any lessons.`
    );
  }

  return {
    learnerId,

    language: course.language,
    level: course.level,

    currentCourseId: course.id,
    currentUnitId: firstUnit.id,
    currentLessonId: firstLesson.id,
    currentStepIndex: 0,

    completedCourseIds: [],
    completedUnitIds: [],
    completedLessonIds: [],
    completedStepIds: [],

    lessonScores: {},
    lessonAttempts: {},

    points: 0,
    streak: 0,
    lastStudiedAt: null,
  };
}

export function getActiveLessonState(
  course: CurriculumCourse,
  progress: LearnerProgress
): ActiveLessonState {
  const foundUnitIndex =
    course.units.findIndex(
      (unit) =>
        unit.id === progress.currentUnitId
    );

  const unitIndex =
    foundUnitIndex >= 0
      ? foundUnitIndex
      : 0;

  const unit = course.units[unitIndex];

  if (!unit) {
    throw new Error(
      `Course "${course.id}" does not contain any units.`
    );
  }

  const foundLessonIndex =
    unit.lessons.findIndex(
      (lesson) =>
        lesson.id === progress.currentLessonId
    );

  const lessonIndex =
    foundLessonIndex >= 0
      ? foundLessonIndex
      : 0;

  const lesson = unit.lessons[lessonIndex];

  if (!lesson) {
    throw new Error(
      `No lesson could be loaded from curriculum unit "${unit.id}".`
    );
  }

  if (lesson.steps.length === 0) {
    throw new Error(
      `Lesson "${lesson.id}" does not contain any steps.`
    );
  }

  const maximumStepIndex =
    lesson.steps.length - 1;

  const stepIndex = Math.min(
    Math.max(
      progress.currentStepIndex,
      0
    ),
    maximumStepIndex
  );

  const step = lesson.steps[stepIndex];

  if (!step) {
    throw new Error(
      `Step ${stepIndex} could not be loaded from lesson "${lesson.id}".`
    );
  }

  const completedStepsInLesson =
    lesson.steps.filter((lessonStep) =>
      progress.completedStepIds.includes(
        lessonStep.id
      )
    ).length;

  const lessonProgressPercentage =
    Math.round(
      (completedStepsInLesson /
        lesson.steps.length) *
        100
    );

  const completedLessonsInUnit =
    unit.lessons.filter((unitLesson) =>
      progress.completedLessonIds.includes(
        unitLesson.id
      )
    ).length;

  const unitProgressPercentage =
    unit.lessons.length > 0
      ? Math.round(
          (completedLessonsInUnit /
            unit.lessons.length) *
            100
        )
      : 0;

  const courseLessons =
    getCourseLessons(course);

  const completedLessonsInCourse =
    courseLessons.filter((courseLesson) =>
      progress.completedLessonIds.includes(
        courseLesson.id
      )
    ).length;

  const courseProgressPercentage =
    courseLessons.length > 0
      ? Math.round(
          (completedLessonsInCourse /
            courseLessons.length) *
            100
        )
      : 0;

  return {
    course,
    unit,
    lesson,
    step,

    unitIndex,
    lessonIndex,
    stepIndex,

    lessonProgressPercentage,
    unitProgressPercentage,
    courseProgressPercentage,

    isFirstUnit:
      unitIndex === 0,

    isLastUnit:
      unitIndex ===
      course.units.length - 1,

    isFirstLesson:
      lessonIndex === 0,

    isLastLesson:
      lessonIndex ===
      unit.lessons.length - 1,

    isFirstStep:
      stepIndex === 0,

    isLastStep:
      stepIndex ===
      lesson.steps.length - 1,
  };
}

export function completeCurrentStep(
  course: CurriculumCourse,
  progress: LearnerProgress
): LearnerProgress {
  const active =
    getActiveLessonState(
      course,
      progress
    );

  const completedStepIds =
    addUniqueId(
      progress.completedStepIds,
      active.step.id
    );

  if (!active.isLastStep) {
    return {
      ...progress,
      currentStepIndex:
        active.stepIndex + 1,
      completedStepIds,
      lastStudiedAt:
        new Date().toISOString(),
    };
  }

  return completeCurrentLesson(
    course,
    {
      ...progress,
      completedStepIds,
    }
  );
}

export function completeCurrentLesson(
  course: CurriculumCourse,
  progress: LearnerProgress
): LearnerProgress {
  const active =
    getActiveLessonState(
      course,
      progress
    );

  const lessonWasAlreadyCompleted =
    progress.completedLessonIds.includes(
      active.lesson.id
    );

  const completedLessonIds =
    addUniqueId(
      progress.completedLessonIds,
      active.lesson.id
    );

  const earnedPoints =
    lessonWasAlreadyCompleted
      ? 0
      : active.lesson.completionPoints;

  const nextLesson =
    active.unit.lessons[
      active.lessonIndex + 1
    ];

  if (nextLesson) {
    return {
      ...progress,

      currentLessonId:
        nextLesson.id,

      currentStepIndex: 0,

      completedLessonIds,

      points:
        progress.points +
        earnedPoints,

      lastStudiedAt:
        new Date().toISOString(),
    };
  }

  const completedUnitIds =
    addUniqueId(
      progress.completedUnitIds,
      active.unit.id
    );

  const nextUnit =
    course.units[
      active.unitIndex + 1
    ];

  if (nextUnit) {
    const firstLesson =
      nextUnit.lessons[0];

    if (!firstLesson) {
      throw new Error(
        `Curriculum unit "${nextUnit.id}" does not contain any lessons.`
      );
    }

    return {
      ...progress,

      currentUnitId:
        nextUnit.id,

      currentLessonId:
        firstLesson.id,

      currentStepIndex: 0,

      completedLessonIds,
      completedUnitIds,

      points:
        progress.points +
        earnedPoints,

      lastStudiedAt:
        new Date().toISOString(),
    };
  }

  const completedCourseIds =
    addUniqueId(
      progress.completedCourseIds,
      course.id
    );

  return {
    ...progress,

    completedLessonIds,
    completedUnitIds,
    completedCourseIds,

    points:
      progress.points +
      earnedPoints,

    currentStepIndex:
      active.stepIndex,

    lastStudiedAt:
      new Date().toISOString(),
  };
}

export function repeatCurrentStep(
  progress: LearnerProgress
): LearnerProgress {
  return {
    ...progress,
    lastStudiedAt:
      new Date().toISOString(),
  };
}

export function moveToPreviousStep(
  course: CurriculumCourse,
  progress: LearnerProgress
): LearnerProgress {
  const active =
    getActiveLessonState(
      course,
      progress
    );

  if (active.stepIndex > 0) {
    return {
      ...progress,
      currentStepIndex:
        active.stepIndex - 1,
    };
  }

  const previousLesson =
    active.unit.lessons[
      active.lessonIndex - 1
    ];

  if (previousLesson) {
    return {
      ...progress,

      currentLessonId:
        previousLesson.id,

      currentStepIndex:
        Math.max(
          previousLesson.steps.length - 1,
          0
        ),
    };
  }

  const previousUnit =
    course.units[
      active.unitIndex - 1
    ];

  if (!previousUnit) {
    return progress;
  }

  const finalLesson =
    previousUnit.lessons[
      previousUnit.lessons.length - 1
    ];

  if (!finalLesson) {
    throw new Error(
      `Curriculum unit "${previousUnit.id}" does not contain any lessons.`
    );
  }

  return {
    ...progress,

    currentUnitId:
      previousUnit.id,

    currentLessonId:
      finalLesson.id,

    currentStepIndex:
      Math.max(
        finalLesson.steps.length - 1,
        0
      ),
  };
}

export function getStepOpeningMessage(
  learnerName: string,
  lesson: CurriculumLesson,
  step: LessonStep
): string {
  return step.teacherPrompt
    .replaceAll(
      "{learnerName}",
      learnerName
    )
    .replaceAll(
      "{lessonTitle}",
      lesson.title
    );
}