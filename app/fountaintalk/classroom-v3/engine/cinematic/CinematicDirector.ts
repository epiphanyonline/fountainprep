import type { CameraPreset, LivingScene, TimelineEvent } from "../types";

export interface CameraBeat {
  atMs: number;
  camera: CameraPreset;
}

export interface SilenceWindow {
  startMs: number;
  endMs: number;
}

export interface CinematicDirection {
  openingDelayMs?: number;
  narrationDelayMs?: number;
  interactionLeadMs?: number;
  cameraBeats?: CameraBeat[];
  silenceWindows?: SilenceWindow[];
}

export function cinematicEvents(scene: LivingScene): TimelineEvent[] {
  const direction = scene.cinematic;
  if (!direction) return [];

  const cameraEvents = (direction.cameraBeats ?? []).flatMap((beat, index) => ([{
    id: `${scene.id}:cinematic:camera:${index}`,
    atMs: beat.atMs,
    type: "set-camera" as const,
    payload: { camera: beat.camera },
  }]));

  const silenceEvents = (direction.silenceWindows ?? []).flatMap((window, index) => ([
    {
      id: `${scene.id}:cinematic:silence:${index}:start`,
      atMs: window.startMs,
      type: "stop-narration" as const,
    },
    {
      id: `${scene.id}:cinematic:silence:${index}:end`,
      atMs: window.endMs,
      type: "start-narration" as const,
    },
  ]));

  return [...cameraEvents, ...silenceEvents].sort((a, b) => a.atMs - b.atMs);
}
