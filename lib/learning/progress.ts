import type { ActivitySubmission } from "./activity";
import type { Episode } from "./episode";
import type { EntityId, ISODateTime } from "./shared";

export type ProgressStatus = "not-started" | "in-progress" | "completed";

export interface EpisodeProgress {
  learnerId: EntityId;
  episodeId: EntityId;
  status: ProgressStatus;
  completionPercentage: number;
  completedActivityIds: EntityId[];
  reflectionCompleted: boolean;
  applicationCompleted: boolean;
  startedAt?: ISODateTime;
  completedAt?: ISODateTime;
  lastVisitedAt?: ISODateTime;
  timeSpentSeconds: number;
  score?: number;
}

export interface JourneyProgress {
  learnerId: EntityId;
  journeyId: EntityId;
  status: ProgressStatus;
  completedEpisodeIds: EntityId[];
  currentEpisodeId?: EntityId;
  completionPercentage: number;
  timeSpentSeconds: number;
  startedAt?: ISODateTime;
  completedAt?: ISODateTime;
}

export interface AcademyProgress {
  learnerId: EntityId;
  academyId: EntityId;
  status: ProgressStatus;
  completedJourneyIds: EntityId[];
  currentJourneyId?: EntityId;
  completionPercentage: number;
  timeSpentSeconds: number;
  startedAt?: ISODateTime;
  completedAt?: ISODateTime;
}

export interface EpisodeCompletionInput {
  episode: Episode;
  submissions: ActivitySubmission[];
  reflectionCompleted?: boolean;
  applicationCompleted?: boolean;
}

export interface EpisodeCompletionResult {
  completed: boolean;
  completionPercentage: number;
  requiredActivityCount: number;
  completedRequiredActivityCount: number;
  missingRequirements: string[];
}

export function calculateEpisodeCompletion(
  input: EpisodeCompletionInput,
): EpisodeCompletionResult {
  const requiredActivities = input.episode.activities.filter(
    (activity) => activity.required,
  );

  const completedActivityIds = new Set(
    input.submissions
      .filter((submission) => submission.completed)
      .map((submission) => submission.activityId),
  );

  const completedRequiredActivityCount = requiredActivities.filter((activity) =>
    completedActivityIds.has(activity.id),
  ).length;

  const requirements: Array<{ complete: boolean; label: string }> = [
    ...requiredActivities.map((activity) => ({
      complete: completedActivityIds.has(activity.id),
      label: `Complete activity: ${activity.title}`,
    })),
  ];

  if (input.episode.reflection) {
    requirements.push({
      complete: input.reflectionCompleted === true,
      label: "Complete the reflection",
    });
  }

  if (input.episode.application) {
    requirements.push({
      complete: input.applicationCompleted === true,
      label: "Complete the application",
    });
  }

  if (requirements.length === 0) {
    return {
      completed: true,
      completionPercentage: 100,
      requiredActivityCount: 0,
      completedRequiredActivityCount: 0,
      missingRequirements: [],
    };
  }

  const completeCount = requirements.filter((requirement) => requirement.complete).length;
  const completionPercentage = Math.round((completeCount / requirements.length) * 100);

  return {
    completed: completionPercentage === 100,
    completionPercentage,
    requiredActivityCount: requiredActivities.length,
    completedRequiredActivityCount,
    missingRequirements: requirements
      .filter((requirement) => !requirement.complete)
      .map((requirement) => requirement.label),
  };
}
