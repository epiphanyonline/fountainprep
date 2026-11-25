import { NextResponse } from "next/server";
import { speechAccess, SpeechAccessError } from "@/app/fountaintalk/speech/serverAccess";
import { isSpeechLanguage, normalisePhrase } from "@/app/fountaintalk/speech/voiceProfiles";
import { detectAudioType, MAX_REVIEW_BYTES } from "@/app/fountaintalk/speech/audioValidation";

export const runtime = "nodejs";
const fail = (error: string, status: number) => NextResponse.json({ error }, { status });
function handle(error: unknown) {
  if (error instanceof SpeechAccessError) return fail(error.message, error.status);
  return fail("Pronunciation library request failed.", 503);
}

export async function GET(request: Request) {
  try {
    const { db } = await speechAccess(request, true);
    const language = new URL(request.url).searchParams.get("language");
    if (!isSpeechLanguage(language)) return fail("Select a supported language.", 400);
    const { data, error } = await db.from("fountaintalk_pronunciation_revisions")
      .select("id,language,phrase,review_note,created_at").eq("language", language)
      .order("id", { ascending: false }).limit(50);
    if (error) return fail("Review library is not ready.", 503);
    return NextResponse.json({ revisions: data }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) { return handle(error); }
}

export async function POST(request: Request) {
  try {
    const { db, userId } = await speechAccess(request, true);
    if (Number(request.headers.get("content-length") ?? "0") > 1_600_000) return fail("Recording too large.", 413);
    const form = await request.formData();
    const language = form.get("language");
    const text = form.get("phrase");
    const note = form.get("reviewNote");
    const audio = form.get("audio");
    if (!isSpeechLanguage(language) || typeof text !== "string" || typeof note !== "string" || !(audio instanceof File))
      return fail("Language, exact phrase, review note and recording are required.", 400);
    const phrase = normalisePhrase(text);
    if (!phrase || phrase.length > 400 || /[\u0000-\u001f\u007f]/.test(phrase) || !note.trim() || note.length > 500)
      return fail("Invalid phrase or review note.", 400);
    if (form.get("confirmed") !== "yes") return fail("Confirm pronunciation review and permission to use this recording.", 400);
    if (!audio.size || audio.size > MAX_REVIEW_BYTES) return fail("Upload a WAV or MP3 recording under 1.5 MB.", 400);
    const bytes = new Uint8Array(await audio.arrayBuffer());
    const type = detectAudioType(bytes);
    if (!type) return fail("Upload a valid WAV or MP3 recording.", 400);

    // New revision; previous approved recordings are retained for the audit history.
    const { data, error } = await db.from("fountaintalk_pronunciation_revisions").insert({
      language, phrase, review_note: note.trim(), approved_by: userId,
      audio_base64: Buffer.from(bytes).toString("base64"), content_type: type,
    }).select("id,language,phrase,review_note,created_at").single();
    if (error) return fail("Recording was not published. Check the review library setup.", 503);
    return NextResponse.json({ revision: data }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
  } catch (error) { return handle(error); }
}
