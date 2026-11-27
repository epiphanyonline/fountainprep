import { handleUnifiedPreviewRequest } from "@/features/ai-tutor/unifiedPreviewBoundary";
import { queryTutorGateway } from "@/features/ai-tutor/tutorGateway";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  return handleUnifiedPreviewRequest(request, {
    environment: process.env.VERCEL_ENV,
    branch: process.env.VERCEL_GIT_COMMIT_REF,
    enabled: process.env.FOUNTAIN_UNIFIED_AI_ENABLED === "true",
    budgetApproved: process.env.FOUNTAIN_UNIFIED_BUDGET_APPROVED === "true",
    accessVerified: process.env.FOUNTAIN_UNIFIED_ACCESS_VERIFIED === "true",
  }, queryTutorGateway);
}
