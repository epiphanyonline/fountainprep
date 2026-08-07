import type {
  LanguageCurriculum,
  SupportedLanguage,
} from "@/app/types/fountaintalk";

import { frenchCurriculum } from "./french";
import { hausaCurriculum } from "./hausa";
import { igboCurriculum } from "./igbo";
import { mandarinCurriculum } from "./mandarin";
import { yorubaCurriculum } from "./yoruba";

const curriculumRegistry: Partial<
  Record<SupportedLanguage, LanguageCurriculum>
> = {
  yoruba: yorubaCurriculum,
  igbo: igboCurriculum,
  hausa: hausaCurriculum,
  french: frenchCurriculum,
  mandarin: mandarinCurriculum,
};

export function getLanguageCurriculum(
  language: SupportedLanguage,
): LanguageCurriculum {
  const curriculum = curriculumRegistry[language];

  if (!curriculum) {
    throw new Error(
      `A curriculum has not yet been created for "${language}".`,
    );
  }

  return curriculum;
}

export function hasLanguageCurriculum(
  language: SupportedLanguage,
): boolean {
  return Boolean(curriculumRegistry[language]);
}
