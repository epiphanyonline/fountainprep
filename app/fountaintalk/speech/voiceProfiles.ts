import type { SupportedLanguage } from "@/app/types/fountaintalk";

export const voiceProfiles = {
  yoruba: { provider: "orinode", locale: "yo-NG", voice: "yo-adunni" },
  igbo: { provider: "orinode", locale: "ig-NG", voice: "ig-chiamaka" },
  hausa: { provider: "orinode", locale: "ha-NG", voice: "ha-aisha" },
  french: { provider: "azure", locale: "fr-FR", voice: "fr-FR-DeniseNeural" },
  mandarin: { provider: "azure", locale: "zh-CN", voice: "zh-CN-XiaoxiaoNeural" },
  spanish: { provider: "azure", locale: "es-ES", voice: "es-ES-ElviraNeural" },
} as const satisfies Record<SupportedLanguage, { provider: string; locale: string; voice: string }>;

export function isSpeechLanguage(value: unknown): value is SupportedLanguage {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(voiceProfiles, value);
}

export function normalisePhrase(text: string): string {
  // NFC joins canonically equivalent characters, but never strips tone marks.
  return text.normalize("NFC").trim();
}

export function escapeXml(text: string): string {
  return text.replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
  })[char] ?? char);
}

export function makeSsml(locale: string, voice: string, text: string): string {
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${escapeXml(locale)}"><voice name="${escapeXml(voice)}">${escapeXml(text)}</voice></speak>`;
}

export function splitTargetPhrase(text: string, phrase: string) {
  if (!phrase) return null;
  const index = text.indexOf(phrase);
  if (index < 0) return null;
  return { before: text.slice(0, index).trim(), phrase, after: text.slice(index + phrase.length).trim() };
}
