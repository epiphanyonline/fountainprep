import type { LivingScene, SceneKind } from "../types";
import type { JourneyPhase } from "./JourneyPhase";
import { isJourneyPhase } from "./JourneyPhase";
import type {
  JourneyCheckpoint,
  JourneyState,
  JourneyStatePersistence,
  JourneyStateTelemetryEvent,
} from "./JourneyState";
import type { JourneyTransition } from "./JourneyTransition";

const phaseByKind: Partial<Record<SceneKind, JourneyPhase>> = {
  arrival: "arrival",
  story: "curiosity",
  documentary: "challenge",
  conversation: "curiosity",
  discovery: "discovery",
  explanation: "growth",
  diagram: "growth",
  whiteboard: "growth",
  comparison: "discovery",
  reflection: "reflection",
  assessment: "reflection",
  simulation: "challenge",
  recap: "growth",
  celebration: "celebration",
};

export function inferJourneyPhase(
  scene: LivingScene,
  sceneIndex = 0,
  sceneCount = 1,
): JourneyPhase {
  if (scene.journeyPhase && isJourneyPhase(scene.journeyPhase)) return scene.journeyPhase;
  if (scene.kind === "celebration") return sceneIndex >= sceneCount - 1 ? "invitation" : "celebration";
  return phaseByKind[scene.kind] ?? "curiosity";
}

export interface JourneyStateEngineOptions {
  learnerId: string;
  lessonId: string;
  persistence?: JourneyStatePersistence;
  now?: () => Date;
  onTransition?: (transition: JourneyTransition) => void;
  onTelemetry?: (event: JourneyStateTelemetryEvent) => void;
}

export class JourneyStateEngine {
  private state: JourneyState | null = null;
  private readonly now: () => Date;

  constructor(private readonly options: JourneyStateEngineOptions) {
    this.now = options.now ?? (() => new Date());
  }

  get current(): JourneyState | null {
    return this.state ? { ...this.state, completedSceneIds: [...this.state.completedSceneIds] } : null;
  }

  async restore(): Promise<JourneyCheckpoint | null> {
    const checkpoint = await this.options.persistence?.load(this.options.learnerId, this.options.lessonId) ?? null;
    if (!checkpoint || checkpoint.version !== 1) return null;
    this.state = { ...checkpoint, completedSceneIds: [...checkpoint.completedSceneIds] };
    this.emit("journey_resumed", checkpoint);
    return this.current;
  }

  enter(scene: LivingScene, sceneIndex: number, sceneCount: number): JourneyTransition {
    const occurredAt = this.now().toISOString();
    const previousPhase = this.state?.phase ?? null;
    const phase = inferJourneyPhase(scene, sceneIndex, sceneCount);
    const completedSceneIds = this.state?.completedSceneIds ?? [];
    const startedAt = this.state?.startedAt ?? occurredAt;

    this.state = {
      learnerId: this.options.learnerId,
      lessonId: this.options.lessonId,
      sceneId: scene.id,
      sceneIndex,
      sceneCount,
      phase,
      completedSceneIds: [...completedSceneIds],
      startedAt,
      updatedAt: occurredAt,
      version: 1,
    };

    const transition: JourneyTransition = {
      from: previousPhase,
      to: phase,
      sceneId: scene.id,
      sceneIndex,
      occurredAt,
      state: this.current!,
    };
    this.options.onTransition?.(transition);
    if (previousPhase !== phase) this.emit("journey_phase_entered", this.state, previousPhase ?? undefined);
    return transition;
  }

  completeScene(sceneId: string): JourneyState | null {
    if (!this.state) return null;
    if (!this.state.completedSceneIds.includes(sceneId)) {
      this.state.completedSceneIds = [...this.state.completedSceneIds, sceneId];
      this.state.updatedAt = this.now().toISOString();
    }
    return this.current;
  }

  async checkpoint(): Promise<JourneyCheckpoint | null> {
    if (!this.state || !this.options.persistence) return this.current;
    const checkpoint = this.current!;
    await this.options.persistence.save(checkpoint);
    this.emit("journey_checkpoint_saved", checkpoint);
    return checkpoint;
  }

  async complete(): Promise<JourneyState | null> {
    if (!this.state) return null;
    const occurredAt = this.now().toISOString();
    this.state = {
      ...this.state,
      phase: "complete",
      updatedAt: occurredAt,
      completedAt: occurredAt,
    };
    await this.checkpoint();
    this.emit("journey_completed", this.state);
    return this.current;
  }

  private emit(
    type: JourneyStateTelemetryEvent["type"],
    state: JourneyState,
    previousPhase?: JourneyPhase,
  ) {
    this.options.onTelemetry?.({
      type,
      learnerId: state.learnerId,
      lessonId: state.lessonId,
      sceneId: state.sceneId,
      sceneIndex: state.sceneIndex,
      phase: state.phase,
      occurredAt: this.now().toISOString(),
      previousPhase,
    });
  }
}
