import { handleTutorPreviewChat } from "@/features/ai-tutor/conversationBoundary";
import { queryTutorGateway } from "@/features/ai-tutor/tutorGateway";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  // Explicit budget/usage sign-off is required before provider calls.
  // Do not turn these on merely because preview has provider credentials.
  return handleTutorPreviewChat(request, queryTutorGateway, {
    environment: process.env.VERCEL_ENV,
    enabled: process.env.FOUNTAIN_TUTOR_AI_PREVIEW_ENABLED === "true",
    budgetApproved: process.env.FOUNTAIN_TUTOR_AI_SPENDING_APPROVED === "true",
  });
}
