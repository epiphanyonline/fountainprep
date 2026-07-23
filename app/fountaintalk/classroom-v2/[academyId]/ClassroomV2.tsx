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
  const lesson = unit?.lessons[0];

  if (!unit || !lesson) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: 24,
          background: "#060911",
          color: "white",
        }}
      >
        <div>
          <h1>{academy.title}</h1>
          <p>This academy does not yet have a published opening lesson.</p>
        </div>
      </main>
    );
  }

  return (
    <ScenePlayer
      academy={academy}
      courseTitle={course.title}
      unitNumber={unit.unitNumber}
      lesson={lesson}
    />
  );
}
