"use client";

import {
  getAcademy,
} from "../../data/academyRegistry";
import {
  getStarterCourse,
} from "../../data/starterCurricula";

import type {
  NonLanguageAcademyId,
} from "../../types/academy";

import ScenePlayer from "../components/ScenePlayer";

type Props = {
  academyId: NonLanguageAcademyId;
};

export default function ClassroomV2({
  academyId,
}: Props) {
  const academy = getAcademy(academyId);
  const course = getStarterCourse(academyId);
  const unit = course.units[0];
  const lesson = unit.lessons[0];

  return (
    <ScenePlayer
      academy={academy}
      courseTitle={course.title}
      unitNumber={unit.unitNumber}
      lesson={lesson}
    />
  );
}
