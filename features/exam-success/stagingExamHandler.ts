/**
 * Unmounted Next.js-compatible request orchestration.
 *
 * Never import this file into a public route until there is an isolated
 * Supabase staging project, a transactional Postgres implementation and
 * a reviewed permission/entitlement model.
 */
import { handleExamRequest } from "./mockHttp";
import { createStagingAuthenticatedStore, type StagingEnvironment } from "./stagingAuthStore";
import type { ServerAuthVerifier } from "./verifiedLearner";
import type { ResumableExamStore } from "./mockResume";

export type ExamHandlerDependencies = {
  environment: StagingEnvironment;
  verifier: ServerAuthVerifier;
  makeStore: (learnerId: string) => Promise<ResumableExamStore>;
};

const noStore = (error: string, status: number): Response =>
  Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });

/** Compose one request, without ever consulting a body-supplied user ID. */
export async function handleStagingExamRequest(
  request: Request,
  dependencies: ExamHandlerDependencies,
): Promise<Response> {
  // Fail closed before contacting Supabase Auth or opening a DB connection.
  const { assertIsolatedExamStage } = await import("./verifiedLearner");
  try {
    assertIsolatedExamStage(
      dependencies.environment.stagingProjectRef,
      dependencies.environment.productionProjectRef,
      dependencies.environment.vercelEnvironment,
    );
  } catch {
    return noStore("staging_unavailable", 503);
  }

  // Require exact expected HTTP shape before doing auth/storage work.
  if (request.method !== "POST") return noStore("method_not_allowed", 405);
  try {
    const store = await createStagingAuthenticatedStore(
      request.headers.get("authorization"),
      dependencies.environment,
      dependencies.verifier,
      dependencies.makeStore,
    );
    if (!store) return noStore("unauthenticated", 401);
    return await handleExamRequest(request, store);
  } catch {
    // Do not expose adapter details, service keys or SQL diagnostics.
    return noStore("request_failed", 500);
  }
}
