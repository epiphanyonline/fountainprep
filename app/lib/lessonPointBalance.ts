export type LessonPointEntry = { points: number }

/** Positive awards and negative corrections form an append-only lesson ledger. */
export function lessonPointsTotal(entries: readonly LessonPointEntry[]): number {
  return entries.reduce((total, entry) => total + entry.points, 0)
}

/** UI preflight only: the database trigger is the final concurrent-write guard. */
export function canDeductLessonPoints(entries: readonly LessonPointEntry[], amount: number): boolean {
  return [1, 2, 5].includes(amount) && lessonPointsTotal(entries) >= amount
}
