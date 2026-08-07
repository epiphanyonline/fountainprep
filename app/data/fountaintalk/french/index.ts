import type { LanguageCurriculum } from "@/app/types/fountaintalk";
import { frenchFoundationCourse } from "./foundation";

export const frenchCurriculum: LanguageCurriculum = {
  language: "french",
  title: "Learn French",
  description: "Build essential French speaking and listening skills through greetings, introductions and useful everyday exchanges.",
  courses: [frenchFoundationCourse],
};
