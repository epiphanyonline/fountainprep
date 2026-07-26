import { describe, expect, it } from "vitest";
import { resolveDiscoveryResponse } from "../engine/discovery/DiscoveryDirector";

describe("DiscoveryDirector", () => {
  it("responds to ideas rather than correct-or-wrong labels", () => {
    const result = resolveDiscoveryResponse({
      id: "fear-question",
      mode: "discovery",
      prompt: "What held the army back?",
      themes: [{ id: "fear", label: "Fear", keywords: ["fear", "afraid"], acknowledgement: "Fear was certainly part of it.", followUp: "What did fear make them overlook?" }],
    }, "They were afraid");
    expect(result.matchedThemeIds).toEqual(["fear"]);
    expect(result.mentorResponse).toContain("Fear");
  });
});
