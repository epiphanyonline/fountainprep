import type {
  ActorAction,
  CameraPreset,
  LivingScene,
  MemoryHook,
  RecommendationHook,
  ScenePhase,
  TimelineEvent,
} from "./types";
import { cinematicEvents } from "./cinematic/CinematicDirector";

export interface ActorRuntimeState {
  visible: boolean;
  action: ActorAction;
  animation?: string;
}

export interface TimelineSnapshot {
  elapsedMs: number;
  phase: ScenePhase;
  completedEventIds: string[];
  backgroundVisible: boolean;
  visibleArtworkIds: string[];
  actors: Record<string, ActorRuntimeState>;
  visibleActorIds: string[];
  visibleOverlayIds: string[];
  narrationStarted: boolean;
  interactionVisible: boolean;
  camera: CameraPreset;
  ambienceId?: string;
  memoryHooks: MemoryHook[];
  recommendationHooks: RecommendationHook[];
  celebrating: boolean;
  complete: boolean;
}

const phaseForKind = (scene: LivingScene): ScenePhase => {
  if (scene.kind === "discovery") return "discovery";
  if (scene.kind === "reflection") return "reflection";
  if (scene.kind === "assessment") return "assessment";
  if (scene.kind === "celebration") return "celebration";
  return "story";
};

export function orderedTimeline(scene: LivingScene): TimelineEvent[] {
  const explicit = [...(scene.timeline ?? []), ...cinematicEvents(scene)].sort((a, b) => a.atMs - b.atMs);
  if (explicit.length) return explicit;

  const duration = scene.durationMs ?? 9000;
  const openingDelay = scene.cinematic?.openingDelayMs ?? 0;
  const narrationAt = scene.cinematic?.narrationDelayMs ?? (950 + openingDelay);
  const interactionLead = scene.cinematic?.interactionLeadMs ?? 1800;
  const interactionAt = Math.max(1800, duration - interactionLead);

  return [
    { id: `${scene.id}:preload`, atMs: 0, type: "set-phase", payload: { phase: "preload" } },
    { id: `${scene.id}:background`, atMs: 80 + openingDelay, type: "show-background" },
    { id: `${scene.id}:ambience`, atMs: 120, type: "set-ambience", targetId: scene.ambience?.id },
    { id: `${scene.id}:intro`, atMs: 180, type: "set-phase", payload: { phase: "intro" } },
    ...(scene.artwork ?? []).map((art, index) => ({
      id: `${scene.id}:artwork:${art.id}`,
      atMs: 300 + index * 160,
      type: "show-artwork" as const,
      targetId: art.id,
    })),
    ...(scene.actors ?? []).map((actor, index) => ({
      id: `${scene.id}:actor:${actor.id}`,
      atMs: 520 + index * 240,
      type: "show-actor" as const,
      targetId: actor.id,
    })),
    { id: `${scene.id}:phase`, atMs: 780, type: "set-phase", payload: { phase: phaseForKind(scene) } },
    { id: `${scene.id}:narration`, atMs: narrationAt, type: "start-narration" },
    ...cinematicEvents(scene),
    ...(scene.overlays ?? []).map((overlay, index) => ({
      id: `${scene.id}:overlay:${overlay.id}`,
      atMs: 1100 + index * 180,
      type: "show-overlay" as const,
      targetId: overlay.id,
    })),
    ...(scene.interaction && scene.interaction.mode !== "none"
      ? [
          { id: `${scene.id}:interaction-phase`, atMs: interactionAt - 100, type: "set-phase" as const, payload: { phase: "interaction" } },
          { id: `${scene.id}:interaction`, atMs: interactionAt, type: "show-interaction" as const },
        ]
      : []),
    ...(scene.memoryHooks ?? []).map((hook, index) => ({
      id: `${scene.id}:memory:${hook.id}`,
      atMs: duration - 500 + index * 10,
      type: "memory-hook" as const,
      targetId: hook.id,
    })),
    ...(scene.recommendationHooks ?? []).filter((hook) => hook.trigger === "scene_completed").map((hook, index) => ({
      id: `${scene.id}:recommendation:${hook.id}`,
      atMs: duration - 400 + index * 10,
      type: "recommendation-hook" as const,
      targetId: hook.id,
    })),
    { id: `${scene.id}:complete-phase`, atMs: duration - 120, type: "set-phase", payload: { phase: "transition" } },
    { id: `${scene.id}:complete`, atMs: duration, type: "complete-scene" },
  ];
}

function stringPayload(event: TimelineEvent, key: string): string | undefined {
  const value = event.payload?.[key];
  return typeof value === "string" ? value : undefined;
}

export function snapshotAt(scene: LivingScene, elapsedMs: number): TimelineSnapshot {
  const due = orderedTimeline(scene).filter((event) => event.atMs <= elapsedMs);
  const artwork = new Set<string>();
  const overlays = new Set<string>();
  const actors: Record<string, ActorRuntimeState> = {};
  const memories: MemoryHook[] = [];
  const recommendations: RecommendationHook[] = [];

  let phase: ScenePhase = "initialize";
  let backgroundVisible = false;
  let narrationStarted = false;
  let interactionVisible = false;
  let camera = scene.camera;
  let ambienceId: string | undefined;
  let celebrating = false;
  let complete = false;

  for (const event of due) {
    switch (event.type) {
      case "set-phase": {
        const next = stringPayload(event, "phase") as ScenePhase | undefined;
        if (next) phase = next;
        break;
      }
      case "show-background": backgroundVisible = true; break;
      case "show-artwork": if (event.targetId) artwork.add(event.targetId); break;
      case "hide-artwork": if (event.targetId) artwork.delete(event.targetId); break;
      case "show-actor":
        if (event.targetId) actors[event.targetId] = { ...(actors[event.targetId] ?? { action: "idle" }), visible: true, action: "enter" };
        break;
      case "hide-actor":
        if (event.targetId) actors[event.targetId] = { ...(actors[event.targetId] ?? { action: "idle" }), visible: false, action: "exit" };
        break;
      case "set-actor-action":
        if (event.targetId) actors[event.targetId] = {
          ...(actors[event.targetId] ?? { visible: true, action: "idle" }),
          action: (stringPayload(event, "action") as ActorAction | undefined) ?? "idle",
        };
        break;
      case "play-animation":
        if (event.targetId) actors[event.targetId] = {
          ...(actors[event.targetId] ?? { visible: true, action: "idle" }),
          animation: stringPayload(event, "animation"),
        };
        break;
      case "start-narration": narrationStarted = true; break;
      case "stop-narration": narrationStarted = false; break;
      case "show-overlay": if (event.targetId) overlays.add(event.targetId); break;
      case "hide-overlay": if (event.targetId) overlays.delete(event.targetId); break;
      case "show-interaction": interactionVisible = true; break;
      case "hide-interaction": interactionVisible = false; break;
      case "set-camera": camera = (stringPayload(event, "camera") as CameraPreset | undefined) ?? scene.camera; break;
      case "set-ambience": ambienceId = event.targetId; break;
      case "memory-hook": {
        const hook = scene.memoryHooks?.find((item) => item.id === event.targetId);
        if (hook) memories.push(hook);
        break;
      }
      case "recommendation-hook": {
        const hook = scene.recommendationHooks?.find((item) => item.id === event.targetId);
        if (hook) recommendations.push(hook);
        break;
      }
      case "celebrate": celebrating = true; phase = "celebration"; break;
      case "complete-scene": complete = true; phase = "complete"; break;
    }
  }

  return {
    elapsedMs,
    phase,
    completedEventIds: due.map((event) => event.id),
    backgroundVisible,
    visibleArtworkIds: [...artwork],
    actors,
    visibleActorIds: Object.entries(actors).filter(([, value]) => value.visible).map(([id]) => id),
    visibleOverlayIds: [...overlays],
    narrationStarted,
    interactionVisible,
    camera,
    ambienceId,
    memoryHooks: memories,
    recommendationHooks: recommendations,
    celebrating,
    complete,
  };
}
