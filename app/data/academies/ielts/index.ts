import {
  createAcademy,
  createProgramme,
} from "@/features/academy-content";

import { ieltsAcademicFoundationCourse } from "./academic";
import { ieltsGeneralFoundationCourse } from "./general";

export const ieltsAcademy = createAcademy({
  code: "ielts",
  title: "IELTS Academy",
  description:
    "Structured preparation for Academic and General Training IELTS.",
  programmes: [
    createProgramme({
      id: "ielts-academic",
      academy: "ielts",
      title: "Academic IELTS",
      description:
        "Prepare for university study and other academic purposes.",
      suitableAgeGroups: [
        "14-17",
        "adult",
      ],
      courses: [ieltsAcademicFoundationCourse],
    }),
    createProgramme({
      id: "ielts-general",
      academy: "ielts",
      title: "General Training IELTS",
      description:
        "Prepare for migration, work and practical English requirements.",
      suitableAgeGroups: [
        "14-17",
        "adult",
      ],
      courses: [ieltsGeneralFoundationCourse],
    }),
  ],
});
