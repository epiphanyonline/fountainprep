import { describe, expect, it } from "vitest";
import { curriculumPhrase } from "./curriculumPhrases";
import { getLanguageCurriculum } from "@/app/data/fountaintalk";

describe("fixed curriculum phrase eligibility", () => {
  const lessons = getLanguageCurriculum("yoruba").courses.flatMap(c => c.units.flatMap(u => u.lessons));
  const lesson = lessons.find(l => l.steps.some(s => s.expectedPhrase))!;
  const phrase = lesson.steps.find(s => s.expectedPhrase)!.expectedPhrase!;
  it("accepts exact lesson text and canonical Unicode equivalents", () => {
    expect(curriculumPhrase("yoruba", phrase, lesson.id)?.lessonId).toBe(lesson.id);
    expect(curriculumPhrase("yoruba", phrase.normalize("NFD"), lesson.id)?.phrase).toBe(phrase.normalize("NFC"));
  });
  it("rejects arbitrary text, wrong lesson, and absent courses", () => {
    expect(curriculumPhrase("yoruba", "private learner conversation")).toBeUndefined();
    expect(curriculumPhrase("yoruba", phrase, "not-a-real-lesson")).toBeUndefined();
    expect(curriculumPhrase("spanish", "private learner conversation")).toBeUndefined();
  });
});
