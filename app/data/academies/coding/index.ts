import {
  createAcademy,
  createProgramme,
} from "@/features/academy-content";

import { codingExplorerFoundationCourse } from "./foundation";

export const codingAcademy = createAcademy({
  code: "coding",
  title: "Coding Academy",
  description:
    "Build computational thinking and practical programming skills through guided projects.",
  programmes: [
    createProgramme({
      id: "coding-explorer",
      academy: "coding",
      title: "Coding Explorer",
      description:
        "Understand the foundations of programming before choosing Scratch, Python or web development.",
      suitableAgeGroups: [
        "6-9",
        "10-13",
        "14-17",
        "adult",
      ],
      courses: [codingExplorerFoundationCourse],
    }),
  ],
});
