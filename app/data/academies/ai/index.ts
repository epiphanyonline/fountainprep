import {
  createAcademy,
  createProgramme,
} from "@/features/academy-content";

import { aiExplorerFoundationCourse } from "./foundation";

export const aiAcademy = createAcademy({
  code: "ai",
  title: "AI Academy",
  description:
    "Practical, safe and creative AI learning for children, teenagers and adults.",
  programmes: [
    createProgramme({
      id: "ai-explorer",
      academy: "ai",
      title: "AI Explorer",
      description:
        "Learn what AI is, how to communicate with it and how to use it responsibly.",
      suitableAgeGroups: [
        "6-9",
        "10-13",
        "14-17",
        "adult",
      ],
      courses: [aiExplorerFoundationCourse],
    }),
  ],
});
