import { randomUUID } from "node:crypto";
import { detectAudioType, MAX_SYNTHESIS_BYTES } from "./audioValidation";

export const orinodeLanguages = { yoruba: "yo", igbo: "ig", hausa: "ha" } as const;
export type OrinodeLanguage = keyof typeof orinodeLanguages;

export async function synthesizeOrinode(language: OrinodeLanguage, phrase: string, key: string, send: typeof fetch = fetch) {
  const response = await send("https://api.maraba.ai/api/developer/v1/tts/", {
    method: "POST",
    headers: { "X-API-Key": key, "Content-Type": "application/json", "Idempotency-Key": randomUUID() },
    body: JSON.stringify({ text: phrase, language: orinodeLanguages[language], voice_tone: "friendly" }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("African language provider request failed.");
  const raw = await response.text();
  if (raw.length > 7_000_000) throw new Error("Audio response too large.");
  const result = JSON.parse(raw) as { audio_base64?: unknown; format?: unknown; mode?: unknown };
  if (result.mode !== "live" || result.format !== "wav" || typeof result.audio_base64 !== "string")
    throw new Error("Provider did not return live WAV audio.");
  const bytes = Buffer.from(result.audio_base64, "base64");
  if (bytes.length > MAX_SYNTHESIS_BYTES || detectAudioType(bytes) !== "audio/wav")
    throw new Error("Invalid provider audio.");
  return new Uint8Array(bytes);
}
