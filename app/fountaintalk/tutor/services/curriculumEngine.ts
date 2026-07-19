import type {
  CurriculumCourse,
  CurriculumLesson,
  CurriculumUnit,
  LanguageCurriculum,
  LearnerLevel,
  SupportedLanguage,
} from "@/app/types/fountaintalk";

export type CurriculumSelection = {
  course: CurriculumCourse;
  unit: CurriculumUnit;
  lesson: CurriculumLesson;
};

export function getCourseByLevel(
  curriculum: LanguageCurriculum,
  level: LearnerLevel
): CurriculumCourse {
  const course = curriculum.courses.find(
    (curriculumCourse) => curriculumCourse.level === level
  );

  if (!course) {
    throw new Error(
      `No ${level} course exists for ${curriculum.language}.`
    );
  }

  return course;
}

export function getUnitById(
  course: CurriculumCourse,
  unitId: string
): CurriculumUnit {
  const unit = course.units.find(
    (curriculumUnit) => curriculumUnit.id === unitId
  );

  if (!unit) {
    throw new Error(
      `Unit "${unitId}" does not exist in course "${course.id}".`
    );
  }

  return unit;
}

export function getLessonById(
  unit: CurriculumUnit,
  lessonId: string
): CurriculumLesson {
  const lesson = unit.lessons.find(
    (curriculumLesson) => curriculumLesson.id === lessonId
  );

  if (!lesson) {
    throw new Error(
      `Lesson "${lessonId}" does not exist in unit "${unit.id}".`
    );
  }

  return lesson;
}

export function getFirstCurriculumSelection(
  curriculum: LanguageCurriculum,
  level: LearnerLevel
): CurriculumSelection {
  const course = getCourseByLevel(curriculum, level);
  const unit = course.units[0];

  if (!unit) {
    throw new Error(
      `Course "${course.id}" does not contain any units.`
    );
  }

  const lesson = unit.lessons[0];

  if (!lesson) {
    throw new Error(
      `Unit "${unit.id}" does not contain any lessons.`
    );
  }

  return {
    course,
    unit,
    lesson,
  };
}

export function createCourseId(
  language: SupportedLanguage,
  level: LearnerLevel
): string {
  return `${language}-${level}`;
}