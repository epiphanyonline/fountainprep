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

    title:
      "Biography of Greatness",

    description:
      "Cinematic biographies of notable wealth creators, exploring where they started, what they owned, the businesses behind their fortunes, pivotal decisions, capital allocation, risk and legacy.",

    programmes: [
      createProgramme({
        id:
          "greatness-foundation",

        academy:
          "biography",

        title:
          "The Lives Behind the Capital",

        description:
          "Travel country by country through documented wealth journeys and discover the financial ideas hidden inside real businesses, ownership structures and major capital decisions.",

        suitableAgeGroups: [
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