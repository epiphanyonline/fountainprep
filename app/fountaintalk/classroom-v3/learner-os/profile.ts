import type { LearnerProfile, LearnerProfilePatch } from "./types";

const cleanName = (value: string) => value.trim().replace(/\s+/g, " ").slice(0, 40);

export function createLearnerProfile(input: {
  learnerId: string;
  preferredName: string;
  accountName?: string;
  now?: Date;
}): LearnerProfile {
  const now = (input.now ?? new Date()).toISOString();
  const preferredName = cleanName(input.preferredName);
  if (!preferredName) throw new Error("A preferred name is required.");

  return {
    identity: {
      learnerId: input.learnerId,
      accountName: input.accountName,
      preferredName,
      createdAt: now,
      updatedAt: now,
    },
    subscriptionTier: "explorer",
    growth: [],
    mentorMemories: [],
    completedLessonIds: [],
    completedModuleIds: [],
    academyInterests: {},
    preferences: {
      allowMentorLetters: true,
      allowNameInNarration: true,
    },
  };
}

export function updateLearnerProfile(
  profile: LearnerProfile,
  patch: LearnerProfilePatch,
  now = new Date(),
): LearnerProfile {
  const preferredName = patch.preferredName === undefined
    ? profile.identity.preferredName
    : cleanName(patch.preferredName);

  if (!preferredName) throw new Error("A preferred name cannot be empty.");

  return {
    ...profile,
    identity: {
      ...profile.identity,
      preferredName,
      namePronunciation: patch.namePronunciation ?? profile.identity.namePronunciation,
      avatarUrl: patch.avatarUrl ?? profile.identity.avatarUrl,
      language: patch.language ?? profile.identity.language,
      timezone: patch.timezone ?? profile.identity.timezone,
      birthday: patch.birthday ?? profile.identity.birthday,
      updatedAt: now.toISOString(),
    },
    preferences: {
      ...profile.preferences,
      allowMentorLetters: patch.allowMentorLetters ?? profile.preferences.allowMentorLetters,
      allowNameInNarration: patch.allowNameInNarration ?? profile.preferences.allowNameInNarration,
    },
  };
}

export function learnerDisplayName(profile?: LearnerProfile | null): string {
  return profile?.identity.preferredName?.trim() || "learner";
}
