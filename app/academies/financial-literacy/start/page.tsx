"use client";

import { Suspense } from "react";

import AcademyStartClient from "@/app/components/academy/AcademyStartClient";

export default function FinancialLiteracyStartPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen grid place-items-center">
          Preparing your learning pathway...
        </main>
      }
    >
      <AcademyStartClient
        academySlug="financial-literacy"
      />
    </Suspense>
  );
}
