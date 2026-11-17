/**
 * Server-only composition boundary. No API route imports this module yet.
 * Authentication is resolved against Supabase Auth before creating a learner-
 * scoped data adapter; the client must never supply or override learner ID.
 */
import type { AuthenticatedExamStore } from "./mockService";
import {
  assertIsolatedExamStage,
  resolveVerifiedLearner,
  type ServerAuthVerifier,
} from "./verifiedLearner";

export type StagingStoreFactory = (verifiedLearnerId: string) =>
  Promise<AuthenticatedExamStore>;

export type StagingEnvironment = {
  vercelEnvironment: string | undefined;
  productionProjectRef: string | undefined;
  stagingProjectRef: string | undefined;
};

/**
 * Future Next.js integration:
 * 1. Read Authorization header from request.
 * 2. Assert separate staging project (not the production one).
 * 3. Verify JWT remotely using staging project's Supabase Auth getUser.
 * 4. Construct a transactional store bound to this verified learner.
 * 5. Run mock HTTP handler against that store.
 *
 * Never mount this with production Supabase credentials.
 */
export async function createStagingAuthenticatedStore(
  authorization: string | null,
  environment: StagingEnvironment,
  verifier: ServerAuthVerifier,
  makeStore: StagingStoreFactory,
): Promise<AuthenticatedExamStore | null> {
  assertIsolatedExamStage(
    environment.stagingProjectRef,
    environment.productionProjectRef,
    environment.vercelEnvironment,
  );
  const learner = await resolveVerifiedLearner(authorization, verifier);
  if (!learner) return null;
  const store = await makeStore(learner.id);
  // Adapter must not provide a different learner identity. Fail closed.
  if (await store.authenticatedLearnerId() !== learner.id) {
    throw new Error("Verified learner and storage identity mismatch");
  }
  return store;
}
