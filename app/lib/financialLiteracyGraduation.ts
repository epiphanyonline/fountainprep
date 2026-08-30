import {
  personalFinanceAcademy,
} from "@/app/data/academies/personal-finance";

export const FINANCIAL_LITERACY_ACADEMY_CODE =
  "personal-finance" as const;

export const FINANCIAL_LITERACY_PROGRAMME_ID =
  "money-foundation" as const;

/**
 * Returns every required lesson ID in the complete
 * Financial Literacy Academy programme.
 *
 * This deliberately traverses:
 *
 * programme -> courses -> units -> lessons
 *
 * so graduation is never based on the current course alone.
 */
export function getFinancialLiteracyLessonIds(): string[] {
  const programme =
    personalFinanceAcademy.programmes.find(
      (item) =>
        item.id ===
        FINANCIAL_LITERACY_PROGRAMME_ID,
    );

  if (!programme) {
    return [];
  }

  return programme.courses.flatMap(
    (course) =>
      course.units.flatMap(
        (unit) =>
          unit.lessons.map(
            (lesson) => lesson.id,
          ),
      ),
  );
}
