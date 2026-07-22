import {
  academyCurricula,
  getAcademyCourse,
} from "./curricula";

import type {
  AcademyCourse,
  NonLanguageAcademyId,
} from "../types/academy";

/**
 * Compatibility export for the existing classroom.
 *
 * Each academy currently exposes its foundation course here.
 * Future paid tiers can load beginner, intermediate, advanced,
 * and professional courses directly from `academyCurricula`.
 */
export const starterCurricula: Record<
  NonLanguageAcademyId,
  AcademyCourse
> = {
  mathematics: academyCurricula.mathematics[0],
  coding: academyCurricula.coding[0],
  music: academyCurricula.music[0],
  wealth: academyCurricula.wealth[0],
  ethics: academyCurricula.ethics[0],
  bible: academyCurricula.bible[0],
};

export function getStarterCourse(
  academyId: NonLanguageAcademyId
): AcademyCourse {
  return getAcademyCourse(academyId, "foundation");
}
