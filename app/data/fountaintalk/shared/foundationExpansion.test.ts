import { describe, expect, it } from "vitest";
import { expandFoundation } from "./foundationExpansion";
import { yorubaFoundationCourse } from "../yoruba/foundation";
import { igboFoundationCourse } from "../igbo/foundation";
import { hausaFoundationCourse } from "../hausa/foundation";
import { mandarinFoundationCourse } from "../mandarin/foundation";
import { frenchFoundationCourse } from "../french/foundation";
import { spanishFoundationCourse } from "../spanish/foundation";

describe("foundation expansion", () => {
 for (const base of [yorubaFoundationCourse, igboFoundationCourse, hausaFoundationCourse, mandarinFoundationCourse, frenchFoundationCourse, spanishFoundationCourse]) {
  it(`preserves existing ${base.language} lessons and adds ten new lessons`, () => {
   const course = expandFoundation(base);
   expect(course.units.slice(0, base.units.length)).toEqual(base.units);
   expect(course.units.length).toBe(base.units.length + 2);
   const oldLessons = base.units.flatMap(u => u.lessons);
   const lessons = course.units.flatMap(u => u.lessons);
   expect(lessons.length).toBe(oldLessons.length + 10);
   expect(new Set(lessons.map(l => l.id)).size).toBe(lessons.length);
   expect(course.completionPoints).toBe(lessons.reduce((n,l) => n+l.completionPoints,0));
   for (const lesson of lessons.slice(oldLessons.length)) {
    expect(lesson.steps).toHaveLength(5);
    expect(lesson.vocabulary[0].target).toBeTruthy();
    expect(lesson.steps[2].expectedPhrase).toBe(lesson.vocabulary[0].target);
   }
  });
 }
});
