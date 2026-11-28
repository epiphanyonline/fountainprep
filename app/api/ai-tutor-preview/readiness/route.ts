import { getEligibleTutorModel } from "@/features/ai-tutor/tutorGateway";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Preview-only admission check. Makes no model generation call or charge.
 * A 200 result means the selected model is eligible under the team's
 * current AI Gateway configuration, not that educational quality is proven.
 */
export async function GET(): Promise<Response> {
  const headers = { "Cache-Control": "no-store" };
  if (process.env.VERCEL_ENV !== "preview" ||
      process.env.VERCEL_GIT_COMMIT_REF !== "feature/personal-ai-exam-tutor") {
    return Response.json({ ready: false }, { status: 404, headers });
  }
  if (process.env.FOUNTAIN_TUTOR_AI_PREVIEW_ENABLED !== "true" ||
      process.env.FOUNTAIN_TUTOR_AI_SPENDING_APPROVED !== "true") {
    return Response.json({ ready: false, reason: "disabled" }, { status: 503, headers });
  }
  try {
    const model = await getEligibleTutorModel();
    return Response.json({ ready: true, model }, { status: 200, headers });
  } catch (error) {
    // Fixed diagnostic categories only; never reveal tokens or provider details.
    const code = error instanceof Error ? error.message : "";
    const reason =
      code === "Missing project-scoped AI Gateway OIDC token" ? "oidc_not_configured" :
      code === "No eligible low-cost preview model" ? "no_eligible_model" :
      code === "Preview branch not permitted" ? "branch_restricted" :
      code === "Unexpected eligibility data" ? "invalid_catalogue_response" :
      code === "Model eligibility unavailable" ? "catalogue_unavailable" :
      "readiness_unavailable";
    return Response.json({ ready: false, reason }, { status: 503, headers });
  }
}
