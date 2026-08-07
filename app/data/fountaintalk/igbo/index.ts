import type { LanguageCurriculum } from "@/app/types/fountaintalk";
import { igboFoundationCourse } from "./foundation";

export const igboCurriculum: LanguageCurriculum = {
  language: "igbo",
  title: "Learn Igbo",
  description: "Build essential Igbo speaking and listening skills through greetings, introductions and simple everyday conversations.",
  courses: [igboFoundationCourse],
};
