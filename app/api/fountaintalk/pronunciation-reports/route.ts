import { NextResponse } from "next/server";
import { speechAccess, SpeechAccessError } from "@/app/fountaintalk/speech/serverAccess";
import { isSpeechLanguage } from "@/app/fountaintalk/speech/voiceProfiles";
import { curriculumPhrase } from "@/app/fountaintalk/speech/curriculumPhrases";

export const runtime = "nodejs";
const fail = (error: string, status: number) => NextResponse.json({ error }, { status });
const result = (data: unknown) => NextResponse.json(data, { headers: { "Cache-Control": "private, no-store" } });
function handle(error: unknown) {
  return error instanceof SpeechAccessError ? fail(error.message, error.status) : fail("Pronunciation report service unavailable.", 503);
}
async function readBody(request: Request) {
  const raw = await request.text();
  if (raw.length > 4000) return null;
  try { return JSON.parse(raw) as { language?: unknown; phrase?: unknown; lessonId?: unknown }; }
  catch { return null; }
}
export async function POST(request: Request) {
  try {
    const { db, userId } = await speechAccess(request);
    const body = await readBody(request);
    if (!body || !isSpeechLanguage(body.language) || typeof body.phrase !== "string" || typeof body.lessonId !== "string") return fail("Invalid report.", 400);
    const match = curriculumPhrase(body.language, body.phrase, body.lessonId);
    if (!match) return fail("Only a fixed curriculum phrase can be reported.", 400);
    // Database derives current revision and deduplicates per account/phrase/revision.
    const { error } = await db.rpc("fountaintalk_report_pronunciation", {
      p_reporter: userId, p_language: body.language, p_phrase: match.phrase, p_lesson: match.lessonId,
    });
    if (error) return fail("Report could not be saved.", 503);
    return result({ reported: true });
  } catch (error) { return handle(error); }
}
export async function GET(request: Request) {
  try {
    const { db } = await speechAccess(request, true);
    const language = new URL(request.url).searchParams.get("language");
    if (!isSpeechLanguage(language)) return fail("Select a language.", 400);
    const { data, error } = await db.rpc("fountaintalk_open_pronunciation_issues", { p_language: language });
    if (error) return fail("Report inbox unavailable.", 503);
    return result({ issues: data });
  } catch (error) { return handle(error); }
}
export async function PATCH(request: Request) {
  try {
    const { db } = await speechAccess(request, true);
    const body = await readBody(request);
    if (!body || !isSpeechLanguage(body.language) || typeof body.phrase !== "string") return fail("Invalid issue.", 400);
    const match = curriculumPhrase(body.language, body.phrase);
    if (!match) return fail("Unknown curriculum phrase.", 400);
    const { error } = await db.from("fountaintalk_pronunciation_reports").update({ dismissed: true })
      .eq("language", body.language).eq("phrase", match.phrase).eq("dismissed", false);
    if (error) return fail("Issue could not be dismissed.", 503);
    return result({ dismissed: true });
  } catch (error) { return handle(error); }
}
