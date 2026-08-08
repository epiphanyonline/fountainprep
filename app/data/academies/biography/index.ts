import {
  createAcademy,
  createProgramme,
} from "@/features/academy-content";

import {
  biographyFoundationCourse,
} from "./foundation";

export const biographyAcademy =
  createAcademy({
    code: "biography",
    title: "Biography of Greatness",
    description:
      "Immersive narrated biographies that turn remarkable lives into lessons in courage, curiosity, service, enterprise and leadership.",
    programmes: [
      createProgramme({
        id: "greatness-foundation",
        academy: "biography",
        title: "Greatness Foundation",
        description:
          "Meet remarkable people, understand the choices behind their impact and reflect on lessons for your own life.",
        suitableAgeGroups: [
          "6-9",
          "10-13",
          "14-17",
          "adult",
        ],
        courses: [
          biographyFoundationCourse,
        ],
      }),
    ],
  });
