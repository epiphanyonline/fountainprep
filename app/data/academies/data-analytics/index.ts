import {
  createAcademy,
  createProgramme,
} from "@/features/academy-content";

import { dataAnalyticsFoundationCourse } from "./foundation";

export const dataAnalyticsAcademy =
  createAcademy({
    code: "data-analytics",
    title: "Data Analytics Academy",
    description:
      "Learn to turn raw information into clear insight and better decisions.",
    programmes: [
      createProgramme({
        id: "data-analytics-foundation",
        academy: "data-analytics",
        title: "Data Analytics Foundation",
        description:
          "Start with analytical thinking, tables, data cleaning, Excel formulas and charts.",
        suitableAgeGroups: [
          "14-17",
          "adult",
        ],
        courses: [dataAnalyticsFoundationCourse],
      }),
    ],
  });
