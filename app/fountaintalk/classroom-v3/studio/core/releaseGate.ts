import type { StoryJourney } from "../../story/types";
import { assessReleaseReadiness, type ReleaseReadinessReport } from "../../engine/production/releaseReadiness";

export interface StudioReleaseGateResult {
  canPublish: boolean;
  report: ReleaseReadinessReport;
  blockingCheckIds: string[];
}

export function runStudioReleaseGate(story: StoryJourney): StudioReleaseGateResult {
  const report = assessReleaseReadiness(story);
  return {
    canPublish: report.ready,
    report,
    blockingCheckIds: report.checks.filter((check) => !check.passed).map((check) => check.id),
  };
}
