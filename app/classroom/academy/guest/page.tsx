"use client";

import {
  Suspense,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

import {
  getBiographyById,
} from "@/app/data/academies/biography/biographyLibrary";

import GuestBiographyClassroom from "./GuestBiographyClassroom";

export default function GuestAcademyPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight:
              "100vh",
            display:
              "grid",
            placeItems:
              "center",
          }}
        >
          Preparing your complimentary
          learning experience...
        </main>
      }
    >
      <GuestLoader />
    </Suspense>
  );
}

function GuestLoader() {
  const params =
    useSearchParams();

  const academy =
    params.get(
      "academy",
    );

  const programme =
    params.get(
      "programme",
    );

  const biographyId =
    params.get(
      "biographyId",
    );

  if (
    academy !==
      "biography" ||
    !biographyId
  ) {
    return (
      <main
        style={{
          minHeight:
            "100vh",
          display:
            "grid",
          placeItems:
            "center",
          padding: 30,
        }}
      >
        This complimentary experience
        could not be found.
      </main>
    );
  }

  const biography =
    getBiographyById(
      biographyId,
    );

  if (!biography) {
    return (
      <main
        style={{
          minHeight:
            "100vh",
          display:
            "grid",
          placeItems:
            "center",
          padding: 30,
        }}
      >
        Biography not found.
      </main>
    );
  }

  return (
    <GuestBiographyClassroom
      academyCode="biography"
      programmeId={
        programme ??
        "greatness-foundation"
      }
      lessonId={
        biography.lessonId
      }
      experienceId={
        biography.id
      }
      biographyTitle={
        biography.subject
      }
    />
  );
}