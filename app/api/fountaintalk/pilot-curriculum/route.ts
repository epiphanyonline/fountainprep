import { NextResponse } from "next/server";
import { speechAccess, SpeechAccessError } from "@/app/fountaintalk/speech/serverAccess";
import { voiceProfiles } from "@/app/fountaintalk/speech/voiceProfiles";
import { getLanguageCurriculum, hasLanguageCurriculum } from "@/app/data/fountaintalk";
import type { SupportedLanguage } from "@/app/types/fountaintalk";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    await speechAccess(request);
    const curricula = (Object.keys(voiceProfiles) as SupportedLanguage[])
      .filter(hasLanguageCurriculum)
      .map(language => getLanguageCurriculum(language));
    // Never return credential values or real learner details.
    const readiness = {
      orinode: Boolean(process.env.ORINODE_API_KEY),
      azure: Boolean(process.env.AZURE_SPEECH_KEY && process.env.AZURE_SPEECH_REGION),
      cacheEnabled: process.env.FOUNTAINTALK_SPEECH_CACHE === "true",
    };
    return NextResponse.json({ curricula, readiness }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    const status = error instanceof SpeechAccessError ? error.status : 503;
    return NextResponse.json({ error: error instanceof SpeechAccessError ? error.message : "Pilot unavailable." }, { status });
  }
}
