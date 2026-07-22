import {
  mathematicsCourses,
} from "./mathematics";

import {
  codingCourses,
} from "./coding";

import {
  musicCourses,
} from "./music";

import {
  wealthCourses,
} from "./wealth";

import {
  ethicsCourses,
} from "./ethics";

import {
  bibleCourses,
  
} from "./bible";

import type {
  AcademyCourse,
  AcademyCourseLevel,
  NonLanguageAcademyId,
} from "../../types/academy";

export const academyCurricula: Record<
  NonLanguageAcademyId,
  AcademyCourse[]
> = {
  mathematics: mathematicsCourses,
  coding: codingCourses,
  music: musicCourses,
  wealth: wealthCourses,
  ethics: ethicsCourses,
  bible: bibleCourses,
};

export function getAcademyCourses(
  academyId: NonLanguageAcademyId
): AcademyCourse[] {
  return academyCurricula[academyId];
}

export function getAcademyCourse(
  academyId: NonLanguageAcademyId,
  level: AcademyCourseLevel
): AcademyCourse {
  const course = academyCurricula[academyId].find(
    (candidate) => candidate.level === level
  );

  if (!course) {
    throw new Error(
      `No ${level} course exists for the ${academyId} academy.`
    );
  }

  return course;
}

export function getAcademyCourseById(
  academyId: NonLanguageAcademyId,
  courseId: string
): AcademyCourse {
  const course = academyCurricula[academyId].find(
    (candidate) => candidate.id === courseId
  );

  if (!course) {
    throw new Error(
      `Course "${courseId}" does not exist in the ${academyId} academy.`
    );
  }

  return course;
}
