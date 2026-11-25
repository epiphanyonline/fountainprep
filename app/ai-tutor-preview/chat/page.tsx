import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TutorConversationPreview from "@/features/ai-tutor/TutorConversationPreview";

export const metadata: Metadata = {
  title: "Fountain Prep AI Tutor — Conversational Preview",
  robots: { index: false, follow: false },
};

export default function TutorChatPreviewPage() {
  if (process.env.VERCEL_ENV !== "preview") notFound();
  return <TutorConversationPreview />;
}
