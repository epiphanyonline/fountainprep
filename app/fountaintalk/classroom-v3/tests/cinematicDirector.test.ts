import { describe, expect, it } from "vitest";
import { cinematicEvents } from "../engine/cinematic/CinematicDirector";
import type { LivingScene } from "../engine/types";

describe("CinematicDirector", () => {
  it("turns camera beats and silence windows into timeline events", () => {
    const scene: LivingScene = {
      id: "valley", kind: "story", title: "The Valley", camera: "wide",
      cinematic: { cameraBeats: [{ atMs: 2000, camera: "close" }], silenceWindows: [{ startMs: 3000, endMs: 4200 }] },
    };
    expect(cinematicEvents(scene).map((event) => event.type)).toEqual(["set-camera", "stop-narration", "start-narration"]);
  });
});
