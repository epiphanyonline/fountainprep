import type {
  AcademyCourse,
  AcademyDefinition,
  AcademyLesson,
  AcademyProgramme,
  AcademyUnit,
} from "./types";

export type AcademySelection = {
  academy: AcademyDefinition;
  programme: AcademyProgramme;
  course: AcademyCourse;
  unit: AcademyUnit;
  lesson: AcademyLesson;
  lessonIndex: number;
  allLessons: AcademyLesson[];
};

export function selectAcademyPath(
  academy: AcademyDefinition,
  programmeId?: string | null,
  courseId?: string | null,
  lessonId?: string | null,
): AcademySelection {
  const programme =
    academy.programmes.find(
      (candidate) => candidate.id === programmeId,
    ) ?? academy.programmes[0];

  if (!programme) {
    throw new Error(
      `Academy "${academy.code}" does not contain a programme.`,
    );
  }

  const course =
    programme.courses.find(
      (candidate) => candidate.id === courseId,
    ) ?? programme.courses[0];

  if (!course) {
    throw new Error(
      `Programme "${programme.id}" does not contain a course.`,
    );
  }

  const allLessons = course.units.flatMap(
    (unit) => unit.lessons,
  );

  if (allLessons.length === 0) {
    throw new Error(
      `Course "${course.id}" does not contain any lessons.`,
    );
  }

  const lessonIndex = Math.max(
    allLessons.findIndex(
      (candidate) => candidate.id === lessonId,
    ),
    0,
  );

  const lesson = allLessons[lessonIndex] ?? allLessons[0];

  const unit = course.units.find(
    (candidate) =>
      candidate.lessons.some(
        (unitLesson) => unitLesson.id === lesson.id,
      ),
  );

  if (!unit) {
    throw new Error(
      `The unit for lesson "${lesson.id}" could not be found.`,
    );
  }

  return {
    academy,
    programme,
    course,
    unit,
    lesson,
    lessonIndex,
    allLessons,
  };
}
