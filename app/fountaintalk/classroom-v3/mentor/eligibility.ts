import type { LearnerProfile } from "../learner-os/types";
import type { MentorLetterKind } from "./types";

export function canReceiveMentorLetter(profile: LearnerProfile, kind: MentorLetterKind): boolean {
  if (!profile.preferences.allowMentorLetters) return false;
  if (kind === "birthday") return Boolean(profile.identity.birthday);
  return true;
}
