import { handleUnifiedPreviewRequest } from "@/features/ai-tutor/unifiedPreviewBoundary";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  return handleUnifiedPreviewRequest(request, {
    environment: process.env.VERCEL_ENV,
    branch: process.env.VERCEL_GIT_COMMIT_REF,
  });
}
