import type { AccessRule, LearnerProgress, SubscriptionTier } from "./types";

const rank: Record<SubscriptionTier, number> = {
  explorer: 0,
  scholar: 1,
  professional: 2,
  institution: 3,
};

export function canAccess(rule: AccessRule, progress: LearnerProgress): boolean {
  if (rank[progress.subscriptionTier] < rank[rule.tier]) return false;
  if (rule.requiresModuleIds?.some((id) => !progress.completedModuleIds.includes(id))) return false;
  if (rule.requiresLessonIds?.some((id) => !progress.completedLessonIds.includes(id))) return false;
  return true;
}

export function accessReason(rule: AccessRule, progress: LearnerProgress): string | null {
  if (rank[progress.subscriptionTier] < rank[rule.tier]) {
    return `Requires the ${rule.tier} plan.`;
  }
  const moduleId = rule.requiresModuleIds?.find((id) => !progress.completedModuleIds.includes(id));
  if (moduleId) return "Complete the previous module to unlock this one.";
  const lessonId = rule.requiresLessonIds?.find((id) => !progress.completedLessonIds.includes(id));
  if (lessonId) return "Complete the required lesson to continue.";
  return null;
}
