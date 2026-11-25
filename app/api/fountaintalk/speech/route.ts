import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isSpeechLanguage, makeSsml, normalisePhrase, voiceProfiles } from "@/app/fountaintalk/speech/voiceProfiles";

export const runtime = "nodejs";
const MAX_CHARS = 400;

function fail(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: Request) {
  // Separate from /api/academy/speech: financial literacy and other English narration stay unchanged.
  if (process.env.FOUNTAINTALK_MULTILINGUAL_SPEECH !== "true") {
    return fail("Multilingual speech is not enabled.", 404);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const token = request.headers.get("authorization")?.match(/^Bearer (.+)$/i)?.[1];
  if (!token) return fail("Authentication required.", 401);
  if (!url || !anon) return fail("Speech pilot authentication is unavailable.", 503);

  try {
    const auth = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await auth.auth.getUser(token);
    if (error || !data.user) return fail("Invalid session.", 401);
    // Explicit, server-only pilot account allowlist. No public paid endpoint.
    const pilots = (process.env.FOUNTAINTALK_SPEECH_PILOT_USERS ?? "").split(",").map(s => s.trim()).filter(Boolean);
    if (!pilots.includes(data.user.id)) return fail("This account is not enrolled in the speech pilot.", 403);

    let body: unknown;
    try {
      const raw = await request.text();
      if (raw.length > 4000) return fail("Request too large.", 413);
      body = JSON.parse(raw);
    } catch {
      return fail("Invalid speech request.", 400);
    }
    if (!body || typeof body !== "object") return fail("Invalid speech request.", 400);
    const { language, text } = body as { language?: unknown; text?: unknown };
    if (!isSpeechLanguage(language) || typeof text !== "string") return fail("Language and text are required.", 400);
    const phrase = normalisePhrase(text);
    if (!phrase || phrase.length > MAX_CHARS || /[\u0000-\u001f\u007f]/.test(phrase)) return fail("Provide a phrase of 1–400 characters.", 400);

    const profile = voiceProfiles[language];
    let response: Response;
    const signal = AbortSignal.timeout(15000);
    if (profile.provider === "orinode") {
      const key = process.env.ORINODE_API_KEY;
      if (!key) return fail("African-language voice provider has not been configured.", 503);
      const voice = language === "igbo" ? process.env.ORINODE_IGBO_VOICE : profile.voice;
      if (!voice) return fail("Igbo voice ID has not been confirmed.", 503);
      response = await fetch("https://maraba.ai/api/v1/tts/", {
        method: "POST",
        headers: { "X-API-Key": key, "Content-Type": "application/json" },
        body: JSON.stringify({ text: phrase, voice, format: "mp3", sample_rate: 16000 }),
        signal,
      });
    } else {
      const key = process.env.AZURE_SPEECH_KEY;
      const region = process.env.AZURE_SPEECH_REGION;
      if (!key || !region || !/^[a-z0-9]+$/.test(region)) return fail("Global-language voice provider has not been configured.", 503);
      response = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": key,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
        },
        body: makeSsml(profile.locale, profile.voice, phrase),
        signal,
      });
    }
    if (!response.ok) {
      console.error("FountainTalk speech provider error", profile.provider, response.status);
      return fail("The selected language voice is temporarily unavailable.", 502);
    }
    const mediaType = response.headers.get("content-type")?.split(";")[0].trim();
    if (!mediaType || !["audio/mpeg", "audio/mp3", "application/octet-stream"].includes(mediaType)) {
      return fail("Speech provider returned an unexpected format.", 502);
    }
    const audio = await response.arrayBuffer();
    if (!audio.byteLength || audio.byteLength > 5 * 1024 * 1024) return fail("Invalid speech audio.", 502);
    return new Response(audio, { headers: { "Content-Type": "audio/mpeg", "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
  } catch (error) {
    console.error("FountainTalk multilingual speech request failed", error instanceof Error ? error.name : "UnknownError");
    return fail("Language speech could not be generated. Please try again.", 502);
  }
}
