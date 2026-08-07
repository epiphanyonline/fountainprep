import {
  createCourse,
  createUnit,
} from "@/features/academy-content";

import { createIeltsReadinessLessons } from "./shared";

const courseId = "ielts-general-foundation";
const unitId = "ielts-general-foundation-unit-1";

export const ieltsGeneralFoundationCourse =
  createCourse({
    id: courseId,
    programmeId: "ielts-general",
    stage: "foundation",
    title: "General Training IELTS Readiness",
    description:
      "Build the core test strategies needed before progressing to full General Training IELTS practice.",
    learningOutcomes: [
      "Understand the IELTS test structure.",
      "Apply core Listening and Reading strategies.",
      "Write clear functional and discursive English.",
      "Give developed spoken responses.",
    ],
    estimatedHours: 3,
    units: [
      createUnit({
        id: unitId,
        courseId,
        unitNumber: 1,
        title: "IELTS Core Skills",
        description:
          "A structured introduction to all four IELTS sections.",
        learningOutcomes: [
          "Understand test expectations.",
          "Use efficient comprehension strategies.",
          "Organise written and spoken answers.",
        ],
        lessons: createIeltsReadinessLessons(
          "ielts-general",
          courseId,
          unitId,
        ),
      }),
    ],
  });
