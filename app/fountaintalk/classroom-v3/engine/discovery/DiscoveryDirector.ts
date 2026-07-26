import type { SceneInteraction } from "../types";

export interface DiscoveryTheme {
  id: string;
  label: string;
  keywords: string[];
  acknowledgement: string;
  followUp?: string;
  hint?: string;
}

export interface DiscoveryResolution {
  response: string;
  matchedThemeIds: string[];
  mentorResponse: string;
  followUp?: string;
  confidence: "emerging" | "developing" | "strong";
}

function terms(value: string): string[] {
  return value.toLowerCase().match(/[\p{L}\p{N}']+/gu) ?? [];
}

export function resolveDiscoveryResponse(
  interaction: SceneInteraction,
  response: string,
): DiscoveryResolution {
  const normalized = new Set(terms(response));
  const themes = interaction.themes ?? [];
  const matched = themes.filter((theme) =>
    theme.keywords.some((keyword) => normalized.has(keyword.toLowerCase())),
  );
  const wordCount = terms(response).length;
  const confidence = wordCount >= 14 || matched.length >= 2
    ? "strong"
    : wordCount >= 5 || matched.length === 1
      ? "developing"
      : "emerging";

  const primary = matched[0];
  const mentorResponse = primary?.acknowledgement
    ?? interaction.fallbackResponse
    ?? (confidence === "emerging"
      ? "That's a useful beginning. Let's hold that thought and look for evidence in the story."
      : "That's a thoughtful observation. Let's see what the next moment adds to it.");

  return {
    response,
    matchedThemeIds: matched.map((theme) => theme.id),
    mentorResponse,
    followUp: primary?.followUp ?? interaction.challengePrompt,
    confidence,
  };
}
