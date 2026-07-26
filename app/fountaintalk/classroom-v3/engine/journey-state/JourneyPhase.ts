export const JOURNEY_PHASES = [
  "arrival",
  "curiosity",
  "challenge",
  "discovery",
  "reflection",
  "growth",
  "celebration",
  "invitation",
  "complete",
] as const;

export type JourneyPhase = (typeof JOURNEY_PHASES)[number];

export function isJourneyPhase(value: unknown): value is JourneyPhase {
  return typeof value === "string" && (JOURNEY_PHASES as readonly string[]).includes(value);
}
