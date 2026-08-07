import {
  createCourse,
  createUnit,
} from "@/features/academy-content";

import { createIeltsReadinessLessons } from "./shared";

const courseId = "ielts-academic-foundation";
const unitId = "ielts-academic-foundation-unit-1";

export const ieltsAcademicFoundationCourse =
  createCourse({
    id: courseId,
    programmeId: "ielts-academic",
    stage: "foundation",
    title: "Academic IELTS Readiness",
    description:
      "Build the core test strategies needed before progressing to full Academic IELTS practice.",
    learningOutcomes: [
      "Understand the IELTS test structure.",
      "Apply core Listening and Reading strategies.",
      "Write focused academic paragraphs.",
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
          "ielts-academic",
          courseId,
          unitId,
        ),
      }),
    ],
  });
