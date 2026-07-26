import type { LivingScene } from "../../engine/types";
import type { StoryJourney } from "../../story/types";
import { deepClone } from "./clone";

export function updateScene(story: StoryJourney, sceneId: string, patch: Partial<LivingScene>): StoryJourney {
  const next = deepClone(story);
  const index = next.scenes.findIndex((scene) => scene.id === sceneId);
  if (index < 0) throw new Error(`Scene ${sceneId} was not found.`);
  next.scenes[index] = { ...next.scenes[index], ...patch };
  return next;
}

export function moveScene(story: StoryJourney, chapterId: string, sceneId: string, direction: -1 | 1): StoryJourney {
  const next = deepClone(story);
  const chapter = next.chapters.find((entry) => entry.id === chapterId);
  if (!chapter) throw new Error(`Chapter ${chapterId} was not found.`);
  const index = chapter.sceneIds.indexOf(sceneId);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= chapter.sceneIds.length) return next;
  [chapter.sceneIds[index], chapter.sceneIds[target]] = [chapter.sceneIds[target], chapter.sceneIds[index]];
  return next;
}
