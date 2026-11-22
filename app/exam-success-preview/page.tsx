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
        <strong>Development preview only.</strong> This is an interactive design demonstration using fictional questions. It does not store real learner results, grade examinations or accept payments.
      </div>
      <div className="mx-auto mb-5 max-w-4xl rounded-xl border border-violet-200 bg-violet-50 p-5 text-slate-900">
        <h2 className="text-lg font-semibold">Coming next: Weekend Mock Challenge</h2>
        <p className="mt-2 text-sm text-slate-700">
          A new reviewed question mix each weekend, timed assessments and
          personalised revision feedback. Paid entry will be activated only
          after secure payment verification and staging tests.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-violet-900">
          <span className="rounded-full bg-white px-3 py-1">Question bank</span>
          <span className="rounded-full bg-white px-3 py-1">Weekly editions</span>
          <span className="rounded-full bg-white px-3 py-1">Performance insights</span>
          <span className="rounded-full bg-white px-3 py-1">Paid access: not active</span>
        </div>
      </div>
      <MockExamPrototype />
    </main>
  );
}
