import { ACTIVITY_TYPES, type Activity } from "./activity";
import type { Academy } from "./academy";
import type { Episode } from "./episode";
import type { Journey } from "./journey";

export interface ValidationIssue {
  path: string;
  message: string;
}

export type ValidationResult =
  | { valid: true; issues: [] }
  | { valid: false; issues: ValidationIssue[] };

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

function result(issues: ValidationIssue[]): ValidationResult {
  return issues.length === 0
    ? { valid: true, issues: [] }
    : { valid: false, issues };
}

export function validateAcademy(academy: Academy): ValidationResult {
  const issues: ValidationIssue[] = [];
  if (!isNonEmptyString(academy.id)) issues.push({ path: "id", message: "Academy id is required." });
  if (!isNonEmptyString(academy.slug)) issues.push({ path: "slug", message: "Academy slug is required." });
  if (!isNonEmptyString(academy.title)) issues.push({ path: "title", message: "Academy title is required." });
  if (!isNonEmptyString(academy.description)) issues.push({ path: "description", message: "Academy description is required." });
  if (!isNonEmptyString(academy.theme.primary)) issues.push({ path: "theme.primary", message: "A primary theme value is required." });
  return result(issues);
}

export function validateJourney(journey: Journey): ValidationResult {
  const issues: ValidationIssue[] = [];
  if (!isNonEmptyString(journey.id)) issues.push({ path: "id", message: "Journey id is required." });
  if (!isNonEmptyString(journey.academyId)) issues.push({ path: "academyId", message: "Academy id is required." });
  if (!isNonEmptyString(journey.pathwayId)) issues.push({ path: "pathwayId", message: "Pathway id is required." });
  if (!isNonEmptyString(journey.title)) issues.push({ path: "title", message: "Journey title is required." });
  if (journey.estimatedMinutes < 1) issues.push({ path: "estimatedMinutes", message: "Estimated minutes must be positive." });
  if (journey.learningOutcomes.length === 0) issues.push({ path: "learningOutcomes", message: "At least one learning outcome is required." });
  return result(issues);
}

export function validateActivity(activity: Activity, path = "activity"): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!isNonEmptyString(activity.id)) issues.push({ path: `${path}.id`, message: "Activity id is required." });
  if (!ACTIVITY_TYPES.includes(activity.type)) issues.push({ path: `${path}.type`, message: "Unsupported activity type." });
  if (!isNonEmptyString(activity.title)) issues.push({ path: `${path}.title`, message: "Activity title is required." });
  if (!isNonEmptyString(activity.instructions)) issues.push({ path: `${path}.instructions`, message: "Activity instructions are required." });
  if (!Number.isInteger(activity.order) || activity.order < 0) issues.push({ path: `${path}.order`, message: "Activity order must be a non-negative integer." });

  if (activity.type === "multiple-choice") {
    if (activity.options.length < 2) issues.push({ path: `${path}.options`, message: "Multiple-choice activities need at least two options." });
    if (activity.correctOptionIds.length === 0) issues.push({ path: `${path}.correctOptionIds`, message: "At least one correct option is required." });
  }

  if (activity.type === "matching" && activity.pairs.length < 2) {
    issues.push({ path: `${path}.pairs`, message: "Matching activities need at least two pairs." });
  }

  if (activity.type === "ordering") {
    const itemIds = new Set(activity.items.map((item) => item.id));
    const validOrder = activity.correctOrder.length === activity.items.length && activity.correctOrder.every((id) => itemIds.has(id));
    if (!validOrder) issues.push({ path: `${path}.correctOrder`, message: "Correct order must contain every item exactly once." });
  }

  return issues;
}

export function validateEpisode(episode: Episode): ValidationResult {
  const issues: ValidationIssue[] = [];
  if (!isNonEmptyString(episode.id)) issues.push({ path: "id", message: "Episode id is required." });
  if (!isNonEmptyString(episode.academyId)) issues.push({ path: "academyId", message: "Academy id is required." });
  if (!isNonEmptyString(episode.pathwayId)) issues.push({ path: "pathwayId", message: "Pathway id is required." });
  if (!isNonEmptyString(episode.journeyId)) issues.push({ path: "journeyId", message: "Journey id is required." });
  if (!isNonEmptyString(episode.slug)) issues.push({ path: "slug", message: "Episode slug is required." });
  if (!isNonEmptyString(episode.title)) issues.push({ path: "title", message: "Episode title is required." });
  if (episode.learningObjectives.length === 0) issues.push({ path: "learningObjectives", message: "At least one learning objective is required." });
  if (episode.estimatedMinutes < 1) issues.push({ path: "estimatedMinutes", message: "Estimated minutes must be positive." });
  if (episode.sections.length === 0) issues.push({ path: "sections", message: "At least one episode section is required." });

  const activityIds = new Set<string>();
  episode.activities.forEach((activity, index) => {
    issues.push(...validateActivity(activity, `activities.${index}`));
    if (activityIds.has(activity.id)) {
      issues.push({ path: `activities.${index}.id`, message: "Activity ids must be unique within an episode." });
    }
    activityIds.add(activity.id);
  });

  episode.sections.forEach((section, index) => {
    section.activityIds?.forEach((activityId) => {
      if (!activityIds.has(activityId)) {
        issues.push({ path: `sections.${index}.activityIds`, message: `Unknown activity id: ${activityId}.` });
      }
    });
  });

  return result(issues);
}
