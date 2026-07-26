import type { LivingScene } from "./types";
import { orderedTimeline, snapshotAt, type TimelineSnapshot } from "./timeline";
import { directScene, type SceneDirectorState } from "./controllers";

export interface OrchestratedScene {
  scene: LivingScene;
  snapshot: TimelineSnapshot;
  director: SceneDirectorState;
  durationMs: number;
  eventCount: number;
}

export function orchestrateScene(scene: LivingScene, elapsedMs: number): OrchestratedScene {
  const timeline = orderedTimeline(scene);
  const snapshot = snapshotAt(scene, elapsedMs);
  return {
    scene,
    snapshot,
    director: directScene(scene, snapshot),
    durationMs: Math.max(scene.durationMs ?? 0, timeline.at(-1)?.atMs ?? 0),
    eventCount: timeline.length,
  };
}
