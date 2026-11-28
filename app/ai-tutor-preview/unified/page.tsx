import {visionAllowed} from "@/features/ai-tutor/visionAttachment";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import UnifiedTutorWorkspace from "@/features/ai-tutor/UnifiedTutorWorkspace";
import { isUnifiedPreview, unifiedLiveAllowed } from "@/features/ai-tutor/unifiedPreviewBoundary";

import { voicePreviewAllowed } from "@/features/ai-tutor/unifiedVoice";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "AYO — Unified learning workspace preview",
  robots: { index: false, follow: false },
};
export default function UnifiedTutorPreviewPage() {
  if (!isUnifiedPreview(process.env.VERCEL_ENV, process.env.VERCEL_GIT_COMMIT_REF)) notFound();
  return <UnifiedTutorWorkspace visionEnabled={visionAllowed({environment:process.env.VERCEL_ENV,branch:process.env.VERCEL_GIT_COMMIT_REF,enabled:process.env.AYO_VISION_ENABLED==="true",accessVerified:process.env.AYO_VISION_ACCESS_VERIFIED==="true",budgetApproved:process.env.AYO_VISION_BUDGET_APPROVED==="true"})} voiceEnabled={voicePreviewAllowed({environment:process.env.VERCEL_ENV,branch:process.env.VERCEL_GIT_COMMIT_REF,enabled:process.env.AYO_VOICE_ENABLED==="true",accessVerified:process.env.AYO_VOICE_ACCESS_VERIFIED==="true",budgetApproved:process.env.AYO_VOICE_BUDGET_APPROVED==="true"})} liveEnabled={unifiedLiveAllowed({
    environment: process.env.VERCEL_ENV,
    branch: process.env.VERCEL_GIT_COMMIT_REF,
    enabled: process.env.FOUNTAIN_UNIFIED_AI_ENABLED === "true",
    budgetApproved: process.env.FOUNTAIN_UNIFIED_BUDGET_APPROVED === "true",
    accessVerified: process.env.FOUNTAIN_UNIFIED_ACCESS_VERIFIED === "true",
  })} />;
}
