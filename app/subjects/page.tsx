import { Suspense } from "react";
import SubjectsPageClient from "./SubjectsPageClient";

export default function SubjectsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f8f5ff] px-4 py-6">
          <div className="mx-auto max-w-6xl animate-pulse">
            <div className="mb-6 h-10 w-48 rounded-2xl bg-purple-100" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-40 rounded-3xl border border-purple-100 bg-white shadow-sm"
                />
              ))}
            </div>
          </div>
        </main>
      }
    >
      <SubjectsPageClient />
    </Suspense>
  );
}