import type { AcademyCourse } from "../../../types/academy";
import { davidAndGoliathLesson } from "./davidAndGoliath";

export const bibleFoundationCourse: AcademyCourse = {
  id: "bible-foundation",
  academyId: "bible",
  title: "Courage and Faith",
  subtitle: "Experience Bible stories through deep narrative, context, relationships and reflection.",
  level: "foundation",
  ageGroups: ["6-9", "10-13", "14-17", "adult"],
  units: [
    {
      id: "bible-unit-1",
      unitNumber: 1,
      title: "Faith in action",
      description: "Courage, preparation, compassion and practical faith.",
      lessons: [davidAndGoliathLesson],
    },
  ],
};
