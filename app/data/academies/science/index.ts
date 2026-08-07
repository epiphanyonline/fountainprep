import {
  createAcademy,
  createProgramme,
} from "@/features/academy-content";

import { scienceFoundationCourse } from "./foundation";

export const scienceAcademy =
  createAcademy({
    code: "science",
    title: "Science Academy",
    description:
      "Explore biology, chemistry, physics, Earth science and scientific investigation.",
    programmes: [
      createProgramme({
        id: "science-foundation",
        academy: "science",
        title: "Science Foundation",
        description:
          "Build scientific understanding through evidence, explanation and practical investigation.",
        suitableAgeGroups: [
          "6-9",
          "10-13",
          "14-17",
          "adult",
        ],
        courses: [scienceFoundationCourse],
      }),
    ],
  });
