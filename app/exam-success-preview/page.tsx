import { notFound } from "next/navigation";
import MockExamPrototype from "@/features/exam-success/MockExamPrototype";

export const metadata = {
  title: "Mock Exam Centre — Development Preview | Fountain Prep",
  robots: { index: false, follow: false },
};

/**
 * Development-only page. Never present real assessment content here.
 * Production deployment returns 404 even if this route is accidentally merged.
 */
export default function MockExamDemoPage() {
  if (process.env.VERCEL_ENV !== "preview") {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto mb-6 max-w-3xl rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <strong>Development preview only.</strong> This is an interactive design demonstration using two fictional questions. It does not save answers to Fountain Prep, grade exams or accept payments.
      </div>
      <MockExamPrototype />
    </main>
  );
}
