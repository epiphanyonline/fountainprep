import {
  createAcademy,
  createProgramme,
} from "@/features/academy-content";

import { moneyFoundationCourse } from "./foundation";

export const personalFinanceAcademy =
  createAcademy({
    code: "personal-finance",
    title: "Personal Finance Academy",
    description:
      "Build practical money habits, financial confidence and productive-asset thinking.",
    programmes: [
      createProgramme({
        id: "money-foundation",
        academy: "personal-finance",
        title: "Money Foundation",
        description:
          "Learn saving, budgeting, borrowing, interest, investing and responsible financial decision-making.",
        suitableAgeGroups: [
          "6-9",
          "10-13",
          "14-17",
          "adult",
        ],
        courses: [moneyFoundationCourse],
      }),
    ],
  });
