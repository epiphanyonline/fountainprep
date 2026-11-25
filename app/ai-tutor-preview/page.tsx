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
  return <TutorPilot/>;
}
