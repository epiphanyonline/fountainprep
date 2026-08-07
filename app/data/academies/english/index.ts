import {
  createAcademy,
  createProgramme,
} from "@/features/academy-content";

import { englishFoundationCourse } from "./foundation";

export const englishAcademy =
  createAcademy({
    code: "english",
    title: "English Academy",
    description:
      "Build strong reading, writing, vocabulary, grammar and speaking skills.",
    programmes: [
      createProgramme({
        id: "english-foundation",
        academy: "english",
        title: "English Foundation",
        description:
          "Progress through comprehension, vocabulary, grammar, paragraph writing, creative writing, speaking and editing.",
        suitableAgeGroups: [
          "6-9",
          "10-13",
          "14-17",
          "adult",
        ],
        courses: [englishFoundationCourse],
      }),
    ],
  });
