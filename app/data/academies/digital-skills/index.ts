import {
  createAcademy,
  createProgramme,
} from "@/features/academy-content";

import { digitalSkillsFoundationCourse } from "./foundation";

export const digitalSkillsAcademy =
  createAcademy({
    code: "digital-skills",
    title: "Digital Skills Academy",
    description:
      "Build practical technology skills for learning, work, business and safe online participation.",
    programmes: [
      createProgramme({
        id: "digital-skills-foundation",
        academy: "digital-skills",
        title: "Digital Skills Foundation",
        description:
          "Learn computer navigation, files, documents, spreadsheets, presentations, email, research and digital safety.",
        suitableAgeGroups: [
          "6-9",
          "10-13",
          "14-17",
          "adult",
        ],
        courses: [digitalSkillsFoundationCourse],
      }),
    ],
  });
