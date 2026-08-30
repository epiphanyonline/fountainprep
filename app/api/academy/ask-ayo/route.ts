import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const MAX_QUESTION_LENGTH = 700;
const MAX_CONTEXT_LENGTH = 5000;

type RequestBody = {
  academyCode?: unknown;
  activity?: {
    id?: unknown;
    title?: unknown;
    type?: unknown;
    teacherPrompt?: unknown;
    explanation?: unknown;
    learnerInstruction?: unknown;
    narrationText?: unknown;
  };
  question?: unknown;
};

function cleanText(
  value: unknown,
  maxLength: number,
): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function bearerToken(
  request: Request,
): string | null {
  const authorization =
    request.headers.get("authorization");

  if (
    !authorization?.startsWith(
      "Bearer ",
    )
  ) {
    return null;
  }

  const token =
    authorization
      .slice("Bearer ".length)
      .trim();

  return token || null;
}

export async function POST(
  request: Request,
) {
  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseAnonKey =
      process.env
        .NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const openAiKey =
      process.env.OPENAI_API_KEY;

    if (
      !supabaseUrl ||
      !supabaseAnonKey
    ) {
      return NextResponse.json(
        {
          error:
            "Supabase server configuration is missing.",
        },
        { status: 500 },
      );
    }

    if (!openAiKey) {
      return NextResponse.json(
        {
          error:
            "Ayo's teaching service is not configured.",
        },
        { status: 500 },
      );
    }

    const token =
      bearerToken(request);

    if (!token) {
      return NextResponse.json(
        {
          error:
            "Please sign in to ask Ayo a question.",
        },
        { status: 401 },
      );
    }

    /*
     * Verify the caller on the server.
     * The client-provided question/context is never
     * treated as proof of identity or entitlement.
     */
    const supabase =
      createClient(
        supabaseUrl,
        supabaseAnonKey,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        },
      );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(
      token,
    );

    if (authError || !user) {
      return NextResponse.json(
        {
          error:
            "Your learning session has expired. Please sign in again.",
        },
        { status: 401 },
      );
    }

    const body =
      (await request.json()) as RequestBody;

    const question =
      cleanText(
        body.question,
        MAX_QUESTION_LENGTH,
      );

    if (!question) {
      return NextResponse.json(
        {
          error:
            "Ask Ayo a question first.",
        },
        { status: 400 },
      );
    }

    const academyCode =
      cleanText(
        body.academyCode,
        80,
      );

    const title =
      cleanText(
        body.activity?.title,
        240,
      );

    const activityType =
      cleanText(
        body.activity?.type,
        80,
      );

    const teacherPrompt =
      cleanText(
        body.activity?.teacherPrompt,
        1800,
      );

    const explanation =
      cleanText(
        body.activity?.explanation,
        1800,
      );

    const learnerInstruction =
      cleanText(
        body.activity
          ?.learnerInstruction,
        800,
      );

    const narrationText =
      cleanText(
        body.activity?.narrationText,
        1200,
      );

    const boundedContext = [
      `Academy: ${academyCode || "FountainPrep academy"}`,
      `Current activity: ${title || "Current lesson activity"}`,
      `Activity type: ${activityType || "learning activity"}`,
      teacherPrompt
        ? `Approved teaching prompt: ${teacherPrompt}`
        : "",
      explanation
        ? `Approved explanation: ${explanation}`
        : "",
      learnerInstruction
        ? `Learner instruction: ${learnerInstruction}`
        : "",
      narrationText
        ? `Approved narration: ${narrationText}`
        : "",
    ]
      .filter(Boolean)
      .join("\n")
      .slice(0, MAX_CONTEXT_LENGTH);

    const openai =
      new OpenAI({
        apiKey: openAiKey,
      });

    const completion =
      await openai.chat.completions.create({
        model:
          process.env
            .OPENAI_ACADEMY_CHAT_MODEL ??
          "gpt-4o-mini",
        temperature: 0.35,
        max_tokens: 260,
        messages: [
          {
            role: "system",
            content: [
              "You are Ayo, the warm, confident FountainPrep learning mentor.",
              "You are answering a learner who raised their hand during a structured lesson.",
              "Answer the learner's actual question directly and conversationally.",
              "Use the supplied approved lesson context as the primary source of truth.",
              "You may clarify the approved concept using a simple example, analogy or brief explanation.",
              "Do not invent facts that contradict the lesson context.",
              "Do not reveal hidden answers, correct options, expected answers or assessment keys before a genuine learner attempt.",
              "If the learner asks for the answer to an assessment question, teach the reasoning or give a hint instead of supplying the answer.",
              "Do not request unnecessary personal information.",
              "Keep the response concise enough to sound natural when spoken aloud: normally 2 to 5 short sentences.",
              "Do not use markdown headings, bullet lists, tables, emojis or citations.",
              "Sound like a teacher speaking naturally, not a chatbot.",
            ].join(" "),
          },
          {
            role: "user",
            content: [
              boundedContext,
              "",
              `Learner's raised-hand question: ${question}`,
            ].join("\n"),
          },
        ],
      });

    const reply =
      completion.choices[0]?.message
        ?.content
        ?.replace(/\s+/g, " ")
        .trim();

    if (!reply) {
      return NextResponse.json(
        {
          error:
            "Ayo could not form a response right now.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      reply,
    });
  } catch (error) {
    console.error(
      "Ask Ayo route error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Ayo could not answer that question right now. Please try again.",
      },
      { status: 500 },
    );
  }
}
