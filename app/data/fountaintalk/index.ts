import type {
  LanguageCurriculum,
  SupportedLanguage,
} from "@/app/types/fountaintalk";

import { frenchCurriculum } from "./french";
import { hausaCurriculum } from "./hausa";
import { igboCurriculum } from "./igbo";
import { mandarinCurriculum } from "./mandarin";
import { yorubaCurriculum } from "./yoruba";
import { spanishCurriculum } from "./spanish";
import { expandFoundation } from "./shared/foundationExpansion";

function withPilotExpansion(curriculum: LanguageCurriculum): LanguageCurriculum {
  // Preserve current learner progress and course access until the pilot is approved.
  if (process.env.NEXT_PUBLIC_FOUNTAINTALK_MULTILINGUAL_SPEECH !== "true") return curriculum;
  return { ...curriculum, courses: curriculum.courses.map(course => course.level === "foundation" ? expandFoundation(course) : course) };
}

const curriculumRegistry: Partial<
  Record<SupportedLanguage, LanguageCurriculum>
> = {
  yoruba: withPilotExpansion(yorubaCurriculum),
  igbo: withPilotExpansion(igboCurriculum),
  hausa: withPilotExpansion(hausaCurriculum),
  french: withPilotExpansion(frenchCurriculum),
  mandarin: withPilotExpansion(mandarinCurriculum),
  ...(process.env.NEXT_PUBLIC_FOUNTAINTALK_MULTILINGUAL_SPEECH === "true" ? { spanish: withPilotExpansion(spanishCurriculum) } : {}),
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
