import type { LanguageCurriculum } from "@/app/types/fountaintalk";
import { yorubaFoundationCourse } from "./foundation";

export const yorubaCurriculum: LanguageCurriculum = {
  language: "yoruba",

  title: "Learn Yoruba",

  description:
    "A practical Yoruba language curriculum for children, teenagers, and adults, adapted by proficiency level, age group, and learning goal.",

  courses: [
    yorubaFoundationCourse,
  ],
};