import { NextResponse } from "next/server";

const openAiApiKey = process.env.OPENAI_API_KEY;

if (!openAiApiKey) {
  throw new Error("Missing OPENAI_API_KEY");
}

type SpeechRequest = {
  text?: string;
};

const OPENAI_TTS_TIMEOUT_MS = 15000;

export async function POST(request: Request) {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    OPENAI_TTS_TIMEOUT_MS,
  );

  try {
    const rawBody = await request.text();

    if (!rawBody.trim()) {
      return NextResponse.json(
        { error: "Narration request was empty." },
        { status: 400 },
      );
    }

    let body: SpeechRequest;

    try {
      body = JSON.parse(rawBody) as SpeechRequest;
    } catch {
      return NextResponse.json(
        { error: "Narration request was invalid." },
        { status: 400 },
      );
    }

    const text = body.text?.trim();

    if (!text) {
      return NextResponse.json(
        { error: "Narration text is required." },
        { status: 400 },
      );
    }

    const safeText = text.slice(0, 4000);

    const response = await fetch(
      "https://api.openai.com/v1/audio/speech",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openAiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini-tts",
          voice: "cedar",
          input: safeText,
          response_format: "wav",
          speed: 0.9,
          instructions: `
Speak like an excellent human tutor teaching one learner privately.

Your voice should be warm, natural, calm, confident and conversational.

Speak at a slightly slower than normal conversational pace so the learner has time to understand each idea.

Do not sound like a screen reader, announcer, audiobook narrator or synthetic assistant.

Speak as though you genuinely understand what you are teaching rather than simply reading text aloud.

Use natural pauses between ideas and sentences.

Pause slightly around important concepts.

Vary emphasis gently and naturally.

Questions should sound like genuine questions directed at the learner.

Examples and stories should sound conversational and engaging.

Do not over-act or sound artificially enthusiastic.

Avoid a repetitive robotic rhythm.

Use clear, natural British English pronunciation.

The overall feeling should be an experienced, friendly private tutor sitting with the learner and guiding the lesson.
          `.trim(),
        }),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "OpenAI academy speech error:",
        response.status,
        errorText,
      );

      return NextResponse.json(
        {
          error:
            "The natural teaching voice could not be generated.",
        },
        { status: 502 },
      );
    }

    const audio = await response.arrayBuffer();

    console.log(
      "Academy speech generated:",
      audio.byteLength,
      "bytes",
    );

    return new Response(audio, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      console.error(
        "Academy speech timed out after",
        OPENAI_TTS_TIMEOUT_MS,
        "ms",
      );

      return NextResponse.json(
        {
          error:
            "Ayo's voice is taking too long to prepare. Please try again.",
        },
        { status: 504 },
      );
    }

    console.error("Academy speech error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate lesson narration.",
      },
      { status: 500 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
