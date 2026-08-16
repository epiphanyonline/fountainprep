import { NextResponse } from "next/server";

const openAiApiKey =
  process.env.OPENAI_API_KEY;

if (!openAiApiKey) {
  throw new Error(
    "Missing OPENAI_API_KEY",
  );
}

export async function POST(
  request: Request,
) {
  try {
    const incoming =
      await request.formData();

    const audio =
      incoming.get("audio");

    if (
      !audio ||
      !(audio instanceof File)
    ) {
      return NextResponse.json(
        {
          error:
            "An audio recording is required.",
        },
        { status: 400 },
      );
    }

    if (audio.size === 0) {
      return NextResponse.json(
        {
          error:
            "The recording was empty.",
        },
        { status: 400 },
      );
    }

    const language =
      String(
        incoming.get("language") ||
          "",
      )
        .trim()
        .toLowerCase();

    const expectedPhrase =
      String(
        incoming.get(
          "expectedPhrase",
        ) || "",
      ).trim();

    const formData =
      new FormData();

    formData.append(
      "file",
      audio,
      audio.name ||
        "learner-recording.webm",
    );

    formData.append(
      "model",
      "gpt-4o-transcribe",
    );

    /*
     * Give the transcription model some
     * useful context for language lessons.
     *
     * Do not force an incorrect language
     * code. The model can infer the speech,
     * while the prompt gives it context.
     */
    const promptParts = [
      "This is a learner speaking during a Fountain Prep language lesson.",
    ];

    if (language) {
      promptParts.push(
        `The target language is ${language}.`,
      );
    }

    if (expectedPhrase) {
      promptParts.push(
        `The learner may be attempting the phrase: ${expectedPhrase}.`,
      );
    }

    promptParts.push(
      "Preserve accented characters and transcribe what the learner actually says.",
    );

    formData.append(
      "prompt",
      promptParts.join(" "),
    );

    const response =
      await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${openAiApiKey}`,
          },
          body: formData,
        },
      );

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        "FountainTalk transcription error:",
        response.status,
        errorText,
      );

      return NextResponse.json(
        {
          error:
            "I could not understand the recording. Please try again.",
        },
        { status: 502 },
      );
    }

    const result =
      (await response.json()) as {
        text?: string;
      };

    const transcript =
      result.text?.trim() || "";

    if (!transcript) {
      return NextResponse.json(
        {
          error:
            "I did not hear enough speech to understand you. Please try again.",
        },
        { status: 422 },
      );
    }

    return NextResponse.json({
      transcript,
    });
  } catch (error) {
    console.error(
      "FountainTalk transcription route error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to process the learner recording.",
      },
      { status: 500 },
    );
  }
}