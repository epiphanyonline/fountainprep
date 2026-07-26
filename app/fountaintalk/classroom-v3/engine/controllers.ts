import type { CameraPreset, CharacterActor, LivingScene, ScenePhase } from "./types";
import type { TimelineSnapshot } from "./timeline";

export interface SceneDirectorState {
  phase: ScenePhase;
  camera: CameraPreset;
  actors: Array<CharacterActor & { runtimeAction: string; runtimeAnimation?: string }>;
  shouldPauseForInteraction: boolean;
  canAdvance: boolean;
}

export function directScene(scene: LivingScene, snapshot: TimelineSnapshot): SceneDirectorState {
  const actors = (scene.actors ?? [])
    .filter((actor) => snapshot.actors[actor.id]?.visible)
    .map((actor) => ({
      ...actor,
      runtimeAction: snapshot.actors[actor.id]?.action ?? "idle",
      runtimeAnimation: snapshot.actors[actor.id]?.animation ?? actor.animation,
    }));

  return {
    phase: snapshot.phase,
    camera: snapshot.camera,
    actors,
    shouldPauseForInteraction: Boolean(
      snapshot.interactionVisible &&
      scene.interaction?.pauseTimeline !== false &&
      scene.interaction?.mode !== "none"
    ),
    canAdvance: snapshot.complete || Boolean(snapshot.interactionVisible && scene.interaction?.skippable),
  };
}

export function cameraTransform(camera: CameraPreset): string {
  const transforms: Record<CameraPreset, string> = {
    wide: "scale(1)", medium: "scale(1.06)", close: "scale(1.16)", story: "scale(1.04)",
    diagram: "scale(1)", split: "scale(1)", reflection: "scale(1.02)", celebration: "scale(1.08)",
    tracking: "scale(1.08) translateX(-1.5%)", interview: "scale(1.07)", whiteboard: "scale(1)",
  };
  return transforms[camera];
}
