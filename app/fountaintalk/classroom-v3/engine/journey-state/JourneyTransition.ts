import type { JourneyPhase } from "./JourneyPhase";
import type { JourneyState } from "./JourneyState";

export interface JourneyTransition {
  from: JourneyPhase | null;
  to: JourneyPhase;
  sceneId: string;
  sceneIndex: number;
  occurredAt: string;
  state: JourneyState;
}
