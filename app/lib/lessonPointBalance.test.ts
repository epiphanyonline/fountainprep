import { describe, expect, it } from 'vitest'
import { canDeductLessonPoints, lessonPointsTotal } from './lessonPointBalance'

describe('lesson point corrections', () => {
  it('adds rewards and subtracts signed corrections without deleting history', () => {
    const ledger = [{ points: 5 }, { points: 2 }, { points: -2 }]
    expect(lessonPointsTotal(ledger)).toBe(5)
    expect(ledger).toHaveLength(3)
  })

  it('supports corrections of 1, 2 and 5 points only when available', () => {
    const ledger = [{ points: 5 }]
    expect(canDeductLessonPoints(ledger, 1)).toBe(true)
    expect(canDeductLessonPoints(ledger, 2)).toBe(true)
    expect(canDeductLessonPoints(ledger, 5)).toBe(true)
    expect(canDeductLessonPoints([{ points: 2 }], 5)).toBe(false)
    expect(canDeductLessonPoints([], 1)).toBe(false)
  })

  it('rejects invalid correction amounts', () => {
    for (const amount of [-5, -1, 0, 3, 6, 1.5, NaN]) {
      expect(canDeductLessonPoints([{ points: 10 }], amount)).toBe(false)
    }
  })

  it('a correction may reduce the balance to zero but not below it', () => {
    const ledger = [{ points: 5 }, { points: -2 }]
    expect(canDeductLessonPoints(ledger, 2)).toBe(true)
    expect(canDeductLessonPoints(ledger, 5)).toBe(false)
    expect(lessonPointsTotal([...ledger, { points: -2 }, { points: -1 }])).toBe(0)
  })
})
