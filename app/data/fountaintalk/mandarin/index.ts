import type { LanguageCurriculum } from "@/app/types/fountaintalk";
import { mandarinFoundationCourse } from "./foundation";

export const mandarinCurriculum: LanguageCurriculum = {
  language: "mandarin",
  title: "Learn Mandarin",
  description: "Build essential Mandarin listening and speaking skills through pinyin, tones, greetings and short everyday exchanges.",
  courses: [mandarinFoundationCourse],
};
