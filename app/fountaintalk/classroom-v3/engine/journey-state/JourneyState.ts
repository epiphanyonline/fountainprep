import type { JourneyPhase } from "./JourneyPhase";

export interface JourneyState {
  learnerId: string;
  lessonId: string;
  sceneId: string;
  sceneIndex: number;
  sceneCount: number;
  phase: JourneyPhase;
  completedSceneIds: string[];
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
  version: 1;
}

export interface JourneyCheckpoint extends JourneyState {}

export interface JourneyStatePersistence {
  load(learnerId: string, lessonId: string): Promise<JourneyCheckpoint | null>;
  save(checkpoint: JourneyCheckpoint): Promise<void>;
  clear?(learnerId: string, lessonId: string): Promise<void>;
}

export interface JourneyStateTelemetryEvent {
  type: "journey_phase_entered" | "journey_checkpoint_saved" | "journey_resumed" | "journey_completed";
  learnerId: string;
  lessonId: string;
  sceneId: string;
  sceneIndex: number;
  phase: JourneyPhase;
  occurredAt: string;
  previousPhase?: JourneyPhase;
}
