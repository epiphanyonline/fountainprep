import type {
  AcademyCourse,
  AcademyDefinition,
  AcademyLesson,
  AcademyProgramme,
  AcademyUnit,
  LessonActivity,
} from "./types";

function assertNonEmpty(value: string, field: string): void {
  if (!value.trim()) {
    throw new Error(`${field} cannot be empty.`);
  }
}

export function createActivity(
  activity: LessonActivity,
): LessonActivity {
  assertNonEmpty(activity.id, "Activity id");
  assertNonEmpty(activity.title, "Activity title");
  assertNonEmpty(activity.teacherPrompt, "Activity teacherPrompt");

  return {
    required: true,
    points: 0,
    ...activity,
  };
}

export function createLesson(
  lesson: AcademyLesson,
): AcademyLesson {
  assertNonEmpty(lesson.id, "Lesson id");
  assertNonEmpty(lesson.title, "Lesson title");
  assertNonEmpty(lesson.objective, "Lesson objective");

  if (lesson.activities.length === 0) {
    throw new Error(
      `Lesson "${lesson.id}" must contain at least one activity.`,
    );
  }

  return lesson;
}

export function createUnit(
  unit: AcademyUnit,
): AcademyUnit {
  assertNonEmpty(unit.id, "Unit id");
  assertNonEmpty(unit.title, "Unit title");

  if (unit.lessons.length === 0) {
    throw new Error(
      `Unit "${unit.id}" must contain at least one lesson.`,
    );
  }

  return unit;
}

export function createCourse(
  course: AcademyCourse,
): AcademyCourse {
  assertNonEmpty(course.id, "Course id");
  assertNonEmpty(course.title, "Course title");

  if (course.units.length === 0) {
    throw new Error(
      `Course "${course.id}" must contain at least one unit.`,
    );
  }

  return course;
}

export function createProgramme(
  programme: AcademyProgramme,
): AcademyProgramme {
  assertNonEmpty(programme.id, "Programme id");
  assertNonEmpty(programme.title, "Programme title");

  if (programme.courses.length === 0) {
    throw new Error(
      `Programme "${programme.id}" must contain at least one course.`,
    );
  }

  return programme;
}

export function createAcademy(
  academy: AcademyDefinition,
): AcademyDefinition {
  assertNonEmpty(academy.title, "Academy title");

  if (academy.programmes.length === 0) {
    throw new Error(
      `Academy "${academy.code}" must contain at least one programme.`,
    );
  }

  return academy;
}

export function getAcademyLessons(
  academy: AcademyDefinition,
): AcademyLesson[] {
  return academy.programmes.flatMap((programme) =>
    programme.courses.flatMap((course) =>
      course.units.flatMap((unit) => unit.lessons),
    ),
  );
}
