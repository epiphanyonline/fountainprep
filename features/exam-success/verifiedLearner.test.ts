import { describe, expect, it, vi } from "vitest";
import {
  assertIsolatedExamStage,
  resolveVerifiedLearner,
  type ServerAuthVerifier,
} from "./verifiedLearner";

const validUserId = "00000000-0000-4000-8000-000000000001";
function verifier(id: string | null = validUserId): ServerAuthVerifier {
  return {
    getUser: vi.fn(async () => ({
      data: { user: id ? { id } : null },
      error: null,
    })),
  };
}

describe("verified Supabase learner boundary", () => {
  it("accepts the user only after remote token verification", async () => {
    const auth = verifier();
    const result = await resolveVerifiedLearner("Bearer test.jwt.token", auth);
    expect(result).toEqual({ id: validUserId });
    expect(auth.getUser).toHaveBeenCalledWith("test.jwt.token");
  });
  it("rejects missing, malformed and oversized bearer headers", async () => {
    const auth = verifier();
    for (const header of [null, "Basic test", "Bearer ", "Bearer a b", "Bearer " + "a".repeat(5000)]) {
      expect(await resolveVerifiedLearner(header, auth)).toBeNull();
    }
    expect(auth.getUser).not.toHaveBeenCalled();
  });
  it("rejects missing or invalid user IDs and remote errors", async () => {
    expect(await resolveVerifiedLearner("Bearer test", verifier(null))).toBeNull();
    expect(await resolveVerifiedLearner("Bearer test", verifier("not-a-uuid"))).toBeNull();
    const failing: ServerAuthVerifier = {
      getUser: vi.fn(async () => ({ data: { user: { id: validUserId } }, error: { message: "invalid token" } })),
    };
    expect(await resolveVerifiedLearner("Bearer test", failing)).toBeNull();
    const throwing: ServerAuthVerifier = { getUser: vi.fn(async () => { throw new Error("network issue"); }) };
    expect(await resolveVerifiedLearner("Bearer test", throwing)).toBeNull();
  });
});

describe("exam isolated staging protection", () => {
  const staging = "abcdefghijklmnopqrst";
  const prod = "cxuizqygogdzhcehhbmc";
  it("accepts distinct well-formed staging ref only in preview/test", () => {
    expect(() => assertIsolatedExamStage(staging, prod, "preview")).not.toThrow();
    expect(() => assertIsolatedExamStage(staging, prod, "test")).not.toThrow();
  });
  it("blocks production environment even with staging credentials", () => {
    expect(() => assertIsolatedExamStage(staging, prod, "production")).toThrow();
  });
  it("blocks absent, equal or malformed staging credentials", () => {
    expect(() => assertIsolatedExamStage(undefined, prod, "preview")).toThrow();
    expect(() => assertIsolatedExamStage(prod, prod, "preview")).toThrow();
    expect(() => assertIsolatedExamStage("123", prod, "preview")).toThrow();
    expect(() => assertIsolatedExamStage(staging, undefined, "preview")).toThrow();
  });
});
