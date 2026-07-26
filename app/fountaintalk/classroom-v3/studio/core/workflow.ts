import type { StudioStatus } from "./types";

const transitions: Record<StudioStatus, StudioStatus[]> = {
  draft: ["review"],
  review: ["draft", "approved"],
  approved: ["draft", "published"],
  published: ["draft"],
};

export function canTransition(from: StudioStatus, to: StudioStatus): boolean {
  return from === to || transitions[from].includes(to);
}

export function assertTransition(from: StudioStatus, to: StudioStatus): void {
  if (!canTransition(from, to)) throw new Error(`Invalid workflow transition: ${from} -> ${to}`);
}
