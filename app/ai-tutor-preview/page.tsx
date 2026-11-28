import type {Metadata} from "next";
import {notFound} from "next/navigation";
import TutorPilot from "@/features/ai-tutor/TutorPilot";

export const metadata:Metadata = {
  title:"Fountain Prep AI Tutor — Guided Product Preview",
  description:"Experience a guided, sample adaptive tutoring lesson. AI-powered tutoring is in development.",
  robots:{index:false,follow:false},
};

/** Isolated Vercel preview only — no production route or learner data. */
export default function AiTutorPreviewPage() {
  if (process.env.VERCEL_ENV !== "preview") notFound();
  return <>
    <div className="bg-violet-50 px-4 py-3 text-center text-sm text-violet-950">
      <strong>New:</strong> The conversational tutor is under development.{" "}
      <a href="/ai-tutor-preview/chat" className="font-semibold underline">
        Open the AI conversation preview
      </a>
      {" "}— model responses will remain disabled until a usage budget is approved.
    </div>
    {process.env.VERCEL_GIT_COMMIT_REF === "feature/unified-ai-tutor" && (
      <div className="bg-white px-4 py-5 text-center">
        <a href="/ai-tutor-preview/unified" className="inline-block rounded-xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white">
          Explore the unified AYO learning workspace
        </a>
      </div>
    )}
    <TutorPilot/>
  </>;
}
