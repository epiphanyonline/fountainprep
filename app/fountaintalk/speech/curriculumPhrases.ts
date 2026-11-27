import { getLanguageCurriculum, hasLanguageCurriculum } from "@/app/data/fountaintalk";
import type { SupportedLanguage } from "@/app/types/fountaintalk";
import { normalisePhrase } from "./voiceProfiles";

// Only fixed, published curriculum text is eligible for shared caching and reports.
// Never store free conversation, names provided by learners, or microphone transcripts.
export function curriculumPhrase(language: SupportedLanguage, raw: string, lessonId?: string) {
  if (!hasLanguageCurriculum(language)) return undefined;
  const phrase = normalisePhrase(raw);
  if (!phrase || phrase.length > 400) return undefined;
  for (const course of getLanguageCurriculum(language).courses)
    for (const unit of course.units)
      for (const lesson of unit.lessons) {
        if (lessonId && lesson.id !== lessonId) continue;
        const matches = lesson.steps.some(step => step.expectedPhrase && normalisePhrase(step.expectedPhrase) === phrase);
        if (matches) return { phrase, lessonId: lesson.id };
      }
  return undefined;
}
