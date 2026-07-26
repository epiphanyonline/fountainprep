import type { StoryJourney, StoryValidationIssue, StoryValidationResult } from "./types";

const issue = (severity: "error" | "warning", code: string, message: string, path: string): StoryValidationIssue => ({ severity, code, message, path });

export function validateStory(story: StoryJourney): StoryValidationResult {
  const issues: StoryValidationIssue[] = [];
  const sceneIds = new Set<string>();
  const chapterSceneIds = new Set<string>();
  const characterIds = new Set(story.characters.map((character) => character.id));

  if (!story.title.trim()) issues.push(issue("error", "story.title.missing", "Story title is required.", "title"));
  if (!story.takeaway.trim()) issues.push(issue("error", "story.takeaway.missing", "A memorable takeaway is required.", "takeaway"));
  if (story.estimatedMinutes < 15) issues.push(issue("warning", "story.duration.short", "Flagship journeys should normally last at least 15 minutes.", "estimatedMinutes"));
  if (story.chapters.length < 3) issues.push(issue("warning", "story.chapters.few", "A story journey should contain at least three chapters.", "chapters"));

  story.scenes.forEach((scene, index) => {
    const path = `scenes[${index}]`;
    if (sceneIds.has(scene.id)) issues.push(issue("error", "scene.id.duplicate", `Duplicate scene id: ${scene.id}.`, `${path}.id`));
    sceneIds.add(scene.id);
    if (!scene.title.trim()) issues.push(issue("error", "scene.title.missing", "Scene title is required.", `${path}.title`));
    if (!scene.background?.alt?.trim()) issues.push(issue("error", "scene.accessibility.background-alt", "Every scene background needs accessibility text.", `${path}.background.alt`));
    if (!scene.transition) issues.push(issue("warning", "scene.transition.missing", "Scene transition should be explicit.", `${path}.transition`));
    if (!scene.timeline?.some((event) => event.type === "complete-scene")) issues.push(issue("error", "scene.timeline.incomplete", "Scene timeline must contain complete-scene.", `${path}.timeline`));
    const timelineIds = new Set<string>();
    let previous = -1;
    scene.timeline?.forEach((event, eventIndex) => {
      if (timelineIds.has(event.id)) issues.push(issue("error", "timeline.id.duplicate", `Duplicate timeline event id: ${event.id}.`, `${path}.timeline[${eventIndex}].id`));
      timelineIds.add(event.id);
      if (event.atMs < previous) issues.push(issue("error", "timeline.order.invalid", "Timeline events must be ordered by atMs.", `${path}.timeline[${eventIndex}].atMs`));
      previous = event.atMs;
      if (scene.durationMs !== undefined && event.atMs > scene.durationMs) issues.push(issue("error", "timeline.event.out-of-range", "Timeline event occurs after scene duration.", `${path}.timeline[${eventIndex}].atMs`));
    });
    scene.actors?.forEach((actor, actorIndex) => {
      if (!characterIds.has(actor.id)) issues.push(issue("error", "actor.reference.unknown", `Actor ${actor.id} is not defined in story.characters.`, `${path}.actors[${actorIndex}].id`));
    });
    if (scene.interaction && scene.interaction.mode !== "none" && !scene.interaction.prompt?.trim()) issues.push(issue("error", "interaction.prompt.missing", "Interactive scenes require a prompt.", `${path}.interaction.prompt`));
  });

  story.chapters.forEach((chapter, chapterIndex) => {
    chapter.sceneIds.forEach((sceneId, sceneIndex) => {
      chapterSceneIds.add(sceneId);
      if (!sceneIds.has(sceneId)) issues.push(issue("error", "chapter.scene.unknown", `Chapter references unknown scene ${sceneId}.`, `chapters[${chapterIndex}].sceneIds[${sceneIndex}]`));
    });
  });

  story.scenes.forEach((scene, index) => {
    if (!chapterSceneIds.has(scene.id)) issues.push(issue("error", "scene.chapter.missing", `Scene ${scene.id} is not assigned to a chapter.`, `scenes[${index}].id`));
  });

  return { valid: !issues.some((entry) => entry.severity === "error"), issues };
}
