import type { LanguageCurriculum } from "@/app/types/fountaintalk";
import { hausaFoundationCourse } from "./foundation";

export const hausaCurriculum: LanguageCurriculum = {
  language: "hausa",
  title: "Learn Hausa",
  description: "Build essential Hausa speaking and listening skills through greetings, introductions and practical everyday conversation.",
  courses: [hausaFoundationCourse],
};
