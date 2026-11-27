import type { Metadata } from "next";
import { notFound } from "next/navigation";
import UnifiedTutorWorkspace from "@/features/ai-tutor/UnifiedTutorWorkspace";
import { isUnifiedPreview } from "@/features/ai-tutor/unifiedPreviewBoundary";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "AYO — Unified learning workspace preview",
  robots: { index: false, follow: false },
};
export default function UnifiedTutorPreviewPage() {
  if (!isUnifiedPreview(process.env.VERCEL_ENV, process.env.VERCEL_GIT_COMMIT_REF)) notFound();
  return <UnifiedTutorWorkspace />;
}
