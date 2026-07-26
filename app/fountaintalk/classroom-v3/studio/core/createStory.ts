import type { LivingScene } from "../../engine/types";
import type { StoryJourney } from "../../story/types";

export function createEmptyScene(id: string, title = "Untitled scene"): LivingScene {
  return {
    id,
    kind: "story",
    title,
    displayText: "",
    narration: "",
    durationMs: 15000,
    camera: "wide",
    transition: "fade",
    background: { id: `${id}-background`, gradient: "linear-gradient(135deg, #172554, #020617)", alt: "Describe the scene background." },
    actors: [],
    artwork: [],
    overlays: [],
    interaction: { id: `${id}-interaction`, mode: "none" },
    timeline: [
      { id: `${id}-intro`, atMs: 0, type: "set-phase", payload: { phase: "intro" } },
      { id: `${id}-complete`, atMs: 15000, type: "complete-scene" },
    ],
  };
}

export function createEmptyStory(id: string, academyId: string, moduleId: string): StoryJourney {
  const firstScene = createEmptyScene(`${id}-scene-1`, "Opening scene");
  return {
    id,
    academyId,
    moduleId,
    title: "Untitled journey",
    subtitle: "",
    summary: "",
    takeaway: "",
    estimatedMinutes: 20,
    learningObjectives: [],
    access: { tier: "explorer", previewAllowed: true },
    characters: [],
    chapters: [{ id: `${id}-chapter-1`, order: 1, title: "Chapter 1", summary: "", sceneIds: [firstScene.id] }],
    scenes: [firstScene],
    completion: {
      skills: [],
      conceptIds: [],
      memorableMoment: "",
      credits: { discoveries: 0, questions: 0, reflections: 0 },
      memoryHooks: [],
      recommendations: [],
    },
  };
}
