import {
  createAcademy,
  createProgramme,
} from "@/features/academy-content";

import { mathematicsFoundationCourse } from "./foundation";

export const mathematicsAcademy =
  createAcademy({
    code: "mathematics",
    title: "Mathematics Academy",
    description:
      "Build mathematical confidence through concepts, reasoning and real-world problem solving.",
    programmes: [
      createProgramme({
        id: "mathematics-foundation",
        academy: "mathematics",
        title: "Mathematics Foundation",
        description:
          "Progress through number, fractions, decimals, percentages, algebra, geometry and data without being locked to one age band.",
        suitableAgeGroups: [
          "6-9",
          "10-13",
          "14-17",
          "adult",
        ],
        courses: [mathematicsFoundationCourse],
      }),
    ],
  });
