import { describe, expect, it } from "vitest";
import { canTransition } from "../core/workflow";

describe("studio workflow", () => {
  it("requires review before approval", () => {
    expect(canTransition("draft", "approved")).toBe(false);
    expect(canTransition("draft", "review")).toBe(true);
    expect(canTransition("review", "approved")).toBe(true);
  });
});
