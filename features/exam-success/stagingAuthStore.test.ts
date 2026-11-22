import { describe, expect, it, vi } from "vitest";
import { createStagingAuthenticatedStore } from "./stagingAuthStore";
import type { AuthenticatedExamStore } from "./mockService";
import type { ServerAuthVerifier } from "./verifiedLearner";
const learnerId = "00000000-0000-4000-8000-000000000001";
const env = {
  vercelEnvironment: "preview",
  productionProjectRef: "cxuizqygogdzhcehhbmc",
  stagingProjectRef: "abcdefghijklmnopqrst",
};
const verifier: ServerAuthVerifier = {
  getUser: vi.fn(async () => ({ data: { user: { id: learnerId } }, error: null })),
};
function store(identity: string): AuthenticatedExamStore {
  return {
    authenticatedLearnerId: async () => identity,
    loadPublishedPaper: async () => null,
    createAttempt: async () => ({ attemptId: "test", expiresAt: "" }),
    saveAnswerIfOpen: async () => "forbidden",
    submitAndScore: async () => ({ earned: 0, possible: 0, alreadySubmitted: false }),
  };
}

describe("staging-only authenticated mock adapter composition", () => {
  it("constructs storage only for a Supabase-verified learner", async () => {
    const make = vi.fn(async (id: string) => store(id));
    const result = await createStagingAuthenticatedStore("Bearer token", env, verifier, make);
    expect(result).not.toBeNull();
    expect(make).toHaveBeenCalledExactlyOnceWith(learnerId);
  });
  it("does not construct a store for anonymous callers", async () => {
    const make = vi.fn(async (id: string) => store(id));
    expect(await createStagingAuthenticatedStore(null, env, verifier, make)).toBeNull();
    expect(make).not.toHaveBeenCalled();
  });
  it("blocks production or a staging ref equal to production", async () => {
    const make = vi.fn(async (id: string) => store(id));
    await expect(createStagingAuthenticatedStore(
      "Bearer token", { ...env, vercelEnvironment: "production" },
      verifier, make,
    )).rejects.toThrow();
    await expect(createStagingAuthenticatedStore(
      "Bearer token", { ...env, stagingProjectRef: env.productionProjectRef },
      verifier, make,
    )).rejects.toThrow();
    expect(make).not.toHaveBeenCalled();
  });
  it("rejects a store bound to an unexpected learner", async () => {
    await expect(createStagingAuthenticatedStore(
      "Bearer token", env, verifier, async () => store("another_learner"),
    )).rejects.toThrow("Verified learner and storage identity mismatch");
  });
});
