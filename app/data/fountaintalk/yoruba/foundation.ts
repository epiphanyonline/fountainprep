import type { CurriculumCourse } from "@/app/types/fountaintalk";
import { yorubaBeginnerUnitOne } from "./beginner";

export const yorubaFoundationCourse: CurriculumCourse = {
  id: "yoruba-foundation",

  language: "yoruba",
  level: "foundation",

  title: "Yoruba Foundation",
  description:
    "Build essential Yoruba speaking and listening skills through greetings, introductions, everyday vocabulary, and simple conversations.",

  proficiencyCode: "A0",

  learningOutcomes: [
    "Use basic Yoruba greetings appropriately.",
    "Introduce yourself and ask someone their name.",
    "Understand and respond to simple everyday questions.",
    "Recognise essential Yoruba words and expressions.",
    "Take part in short guided conversations.",
  ],

  suitableGoals: [
    "conversation",
    "education",
    "family",
    "culture",
    "heritage",
    "travel",
  ],

  units: [yorubaBeginnerUnitOne],

  estimatedHours: 10,

  completionPoints: yorubaBeginnerUnitOne.lessons.reduce(
    (total, lesson) => total + lesson.completionPoints,
    0
  ),
};