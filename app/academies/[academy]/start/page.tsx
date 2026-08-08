"use client";

import {
  Suspense,
} from "react";
import { useParams } from "next/navigation";

import AcademyStartClient from "@/app/components/academy/AcademyStartClient";

export default function AcademyStartPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen grid place-items-center">
          Preparing your learning pathway...
        </main>
      }
    >
      <DynamicStart />
    </Suspense>
  );
}

function DynamicStart() {
  const params = useParams<{
    academy: string;
  }>();

  return (
    <AcademyStartClient
      academySlug={params.academy}
    />
  );
}
