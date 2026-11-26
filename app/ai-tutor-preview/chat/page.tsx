import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TutorConversationPreview from "@/features/ai-tutor/TutorConversationPreview";

export const metadata: Metadata = {
  title: "Fountain Prep AI Tutor — Conversational Preview",
  robots: { index: false, follow: false },
};

export default function TutorChatPreviewPage() {
  if (process.env.VERCEL_ENV !== "preview") notFound();
  const liveEnabled = process.env.FOUNTAIN_TUTOR_AI_PREVIEW_ENABLED === "true" &&
    process.env.FOUNTAIN_TUTOR_AI_SPENDING_APPROVED === "true" &&
    process.env.VERCEL_GIT_COMMIT_REF === "feature/personal-ai-exam-tutor";
  return <TutorConversationPreview liveEnabled={liveEnabled} />;
}
