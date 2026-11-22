/**
 * Strict, server-only auth boundary for the future staging mock API.
 * Do not mount in a route until an isolated staging DB is configured.
 *
 * For privacy and safety, caller identity is always resolved using
 * Supabase Auth's remote getUser(accessToken) validation. Do not decode
 * tokens locally without signature checking or trust supplied learner IDs.
 */
export type VerifiedLearner = { id: string };
export type ServerAuthVerifier = {
  getUser(jwt: string): Promise<{
    data: { user: { id: string } | null };
    error: { message: string } | null;
  }>;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function resolveVerifiedLearner(
  authorization: string | null,
  verifier: ServerAuthVerifier,
): Promise<VerifiedLearner | null> {
  // No cookies, query strings or body properties can impersonate a learner.
  // Bearer token is deliberately capped to prevent oversized headers.
  if (!authorization || authorization.length > 4096) return null;
  const match = /^Bearer ([A-Za-z0-9._~+\/-]+={0,2})$/.exec(authorization);
  if (!match) return null;
  try {
    const { data, error } = await verifier.getUser(match[1]);
    if (error || !data.user || !UUID.test(data.user.id)) return null;
    return { id: data.user.id };
  } catch {
    return null;
  }
}

/**
 * Fail closed unless an isolated, non-production staging project reference
 * has been explicitly configured. Even preview Vercel deployments may carry
 * production environment variables: NEVER infer safety from VERCEL_ENV alone.
 */
export function assertIsolatedExamStage(
  stageProjectRef: string | undefined,
  productionProjectRef: string | undefined,
  environment: string | undefined,
): void {
  if (environment !== "preview" && environment !== "test") {
    throw new Error("Exam staging integration is disabled outside preview/test");
  }
  if (!stageProjectRef || !/^[a-z0-9]{20}$/.test(stageProjectRef)) {
    throw new Error("An isolated staging Supabase project is required");
  }
  if (!productionProjectRef || stageProjectRef === productionProjectRef) {
    throw new Error("Exam staging cannot share the production Supabase project");
  }
}
