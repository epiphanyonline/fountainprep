import { NextResponse } from "next/server";
import { isSpeechLanguage, makeSsml, normalisePhrase, voiceProfiles } from "@/app/fountaintalk/speech/voiceProfiles";
import { detectAudioType, MAX_REVIEW_BYTES, MAX_SYNTHESIS_BYTES } from "@/app/fountaintalk/speech/audioValidation";
import { speechAccess, SpeechAccessError } from "@/app/fountaintalk/speech/serverAccess";
import { synthesizeOrinode, type OrinodeLanguage } from "@/app/fountaintalk/speech/providers";
import { curriculumPhrase } from "@/app/fountaintalk/speech/curriculumPhrases";

export const runtime = "nodejs";

function fail(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

function audioResponse(bytes: Uint8Array, source: "reviewed" | "orinode" | "azure" | "cached-ai") {
  const contentType = detectAudioType(bytes);
  if (!contentType) return fail("Invalid audio.", 502);
  return new Response(new Uint8Array(bytes), { headers: {
    "Content-Type": contentType, "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff", "X-FountainTalk-Audio-Source": source,
  } });
}

export async function POST(request: Request) {
  try {
    const { userId, db } = await speechAccess(request);
    let body: unknown;
    try {
      const raw = await request.text();
      if (raw.length > 4000) return fail("Request too large.", 413);
      body = JSON.parse(raw);
    } catch { return fail("Invalid speech request.", 400); }
    if (!body || typeof body !== "object") return fail("Invalid speech request.", 400);
    const { language, text, mode } = body as { language?: unknown; text?: unknown; mode?: unknown };
    if (!isSpeechLanguage(language) || typeof text !== "string" || (mode !== undefined && mode !== "approved" && mode !== "generated"))
      return fail("Invalid language, phrase or playback mode.", 400);
    const phrase = normalisePhrase(text);
    if (!phrase || phrase.length > 400 || /[\u0000-\u001f\u007f]/.test(phrase)) return fail("Provide a phrase of 1–400 characters.", 400);

    // A reviewer can deliberately compare freshly generated audio with the approved recording.
    // Other pilot accounts cannot bypass a correction.
    if (mode === "generated") await speechAccess(request, true);
    if (mode !== "generated") {
      const { data, error } = await db.from("fountaintalk_pronunciation_revisions")
        .select("audio_base64").eq("language", language).eq("phrase", phrase)
        .order("id", { ascending: false }).limit(1).maybeSingle();
      if (error) return fail("Pronunciation library is not ready.", 503);
      if (data) {
        const bytes = Buffer.from(data.audio_base64, "base64");
        if (bytes.length > MAX_REVIEW_BYTES || !detectAudioType(bytes)) return fail("Reviewed audio is invalid. Please notify a reviewer.", 502);
        return audioResponse(bytes, "reviewed");
      }
      if (mode === "approved") return fail("No reviewed recording for this phrase.", 404);
    }

    const profile = voiceProfiles[language];
    // Shared cache is opt-in after confirming provider audio reuse rights.
    const cacheable = process.env.FOUNTAINTALK_SPEECH_CACHE === "true" && Boolean(curriculumPhrase(language, phrase));
    const voiceVersion = `${profile.provider}:${profile.voice}:${process.env.FOUNTAINTALK_SPEECH_CACHE_VERSION ?? "v1"}`;
    if (cacheable) {
      const { data, error } = await db.from("fountaintalk_speech_cache").select("audio_base64")
        .eq("language", language).eq("phrase", phrase).eq("voice_version", voiceVersion).maybeSingle();
      if (!error && data) {
        const bytes = Buffer.from(data.audio_base64, "base64");
        if (bytes.length <= MAX_REVIEW_BYTES && detectAudioType(bytes)) return audioResponse(bytes, "cached-ai");
      }
    }
    const saveAudio = async (bytes: Uint8Array) => {
      if (!cacheable || bytes.length > MAX_REVIEW_BYTES || !detectAudioType(bytes)) return;
      // Best-effort caching: missing cache storage never prevents AI delivery.
      try {
        const { error } = await db.from("fountaintalk_speech_cache").upsert({
          language, phrase, voice_version: voiceVersion, audio_base64: Buffer.from(bytes).toString("base64"),
        }, { onConflict: "language,phrase,voice_version", ignoreDuplicates: true });
        if (error) console.warn("FountainTalk cache write unavailable", error.code);
      } catch { console.warn("FountainTalk cache write unavailable"); }
    };
    const key = profile.provider === "orinode" ? process.env.ORINODE_API_KEY : process.env.AZURE_SPEECH_KEY;
    if (!key) return fail("The language voice provider has not been configured.", 503);
    const region = process.env.AZURE_SPEECH_REGION;
    if (profile.provider === "azure" && (!region || !/^[a-z0-9]+$/.test(region))) return fail("Azure Speech region has not been configured.", 503);
    // Atomic, database-backed daily quota; failure is closed, not a paid request.
    const { data: allowed, error: quotaError } = await db.rpc("fountaintalk_reserve_speech_pilot", { p_user_id: userId });
    if (quotaError) return fail("Pilot quota service is not ready.", 503);
    if (allowed !== true) return fail("Daily speech pilot quota reached.", 429);

    if (profile.provider === "orinode") {
      const bytes = await synthesizeOrinode(language as OrinodeLanguage, phrase, key);
      await saveAudio(bytes);
      return audioResponse(bytes, "orinode");
    }
    const response = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key, "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
      },
      body: makeSsml(profile.locale, profile.voice, phrase),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) return fail("The selected language voice is temporarily unavailable.", 502);
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.length > MAX_SYNTHESIS_BYTES) return fail("Invalid speech audio.", 502);
    await saveAudio(bytes);
    return audioResponse(bytes, "azure");
  } catch (error) {
    if (error instanceof SpeechAccessError) return fail(error.message, error.status);
    console.error("FountainTalk speech failure", error instanceof Error ? error.name : "UnknownError");
    return fail("Language speech could not be generated. Please try again.", 502);
  }
}
