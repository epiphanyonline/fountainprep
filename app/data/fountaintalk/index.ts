import type {
  LanguageCurriculum,
  SupportedLanguage,
} from "@/app/types/fountaintalk";

import { yorubaCurriculum } from "./yoruba";

const curriculumRegistry: Partial<
  Record<SupportedLanguage, LanguageCurriculum>
> = {
  yoruba: yorubaCurriculum,
};

export function getLanguageCurriculum(
  language: SupportedLanguage
): LanguageCurriculum {
  const curriculum = curriculumRegistry[language];

  if (!curriculum) {
    throw new Error(
      `A curriculum has not yet been created for "${language}".`
    );
  }

  return curriculum;
}