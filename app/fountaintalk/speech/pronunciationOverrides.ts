import type { SupportedLanguage } from "@/app/types/fountaintalk";
import { normalisePhrase } from "./voiceProfiles";

export type PronunciationOverride = {
  language: SupportedLanguage;
  phrase: string;
  normalAudio: string;
  slowAudio?: string;
  // Only native-speaker-reviewed assets should be committed here.
  reviewReference: string;
};

// Version-controlled pilot library. Existing curriculum recordings remain in use.
// Add reviewed local audio paths here; an admin-managed library is a later migration.
export const pronunciationOverrides: readonly PronunciationOverride[] = [];

export function findPronunciationOverride(
  language: SupportedLanguage,
  phrase: string,
  entries: readonly PronunciationOverride[] = pronunciationOverrides,
): PronunciationOverride | undefined {
  return entries.find(entry =>
    entry.language === language &&
    normalisePhrase(entry.phrase) === normalisePhrase(phrase) &&
    entry.reviewReference.trim() !== "" &&
    /^\/audio\/[a-zA-Z0-9_./-]+\.(mp3|wav|ogg)$/.test(entry.normalAudio) &&
    !entry.normalAudio.includes("..") &&
    (!entry.slowAudio || (/^\/audio\/[a-zA-Z0-9_./-]+\.(mp3|wav|ogg)$/.test(entry.slowAudio) && !entry.slowAudio.includes("..")))
  );
}
