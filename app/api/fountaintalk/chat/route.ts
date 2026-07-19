import OpenAI from "openai";
import { NextResponse } from "next/server";

import type {
  TutorAction,
  TutorReply,
  TutorRequestPayload,
} from "@/app/types/fountaintalk";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const allowedActions: TutorAction[] = [
  "continue_step",
  "complete_step",
  "repeat_step",
  "answer_detour",
  "complete_lesson",
];

function normaliseAnswer(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function learnerAnswerMatches(
  message: string,
  acceptedAnswers: string[] = []
): boolean {
  if (acceptedAnswers.length === 0) {
    return false;
  }

  const normalisedMessage = normaliseAnswer(message);

  return acceptedAnswers.some((answer) => {
    const normalisedAnswer = normaliseAnswer(answer);

    return (
      normalisedMessage === normalisedAnswer ||
      normalisedMessage.includes(normalisedAnswer)
    );
  });
}

function getNextAction(
  body: TutorRequestPayload,
  answerMatched: boolean
): TutorAction {
  if (body.mode === "free-conversation") {
    return "answer_detour";
  }

  const step = body.lesson.currentStep;

  if (
    answerMatched &&
    body.progress.currentStepIndex ===
      body.progress.totalSteps - 1
  ) {
    return "complete_lesson";
  }

  if (answerMatched) {
    return "complete_step";
  }

  if (
    step.type === "repeat" ||
    step.type === "question" ||
    step.type === "roleplay" ||
    step.type === "review"
  ) {
    return "repeat_step";
  }

  return "continue_step";
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "OPENAI_API_KEY is missing from the server environment.",
        },
        { status: 500 }
      );
    }

    const body =
      (await request.json()) as TutorRequestPayload;

    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json(
        {
          error: "A learner message is required.",
        },
        { status: 400 }
      );
    }

    if (
      !body.learner ||
      !body.lesson ||
      !body.lesson.currentStep ||
      !body.progress
    ) {
      return NextResponse.json(
        {
          error:
            "The learner, lesson and progress details are required.",
        },
        { status: 400 }
      );
    }

    const step = body.lesson.currentStep;

    const acceptedAnswers = [
      ...(step.acceptedAnswers ?? []),
      ...(step.expectedPhrase
        ? [step.expectedPhrase]
        : []),
    ];

    const answerMatched =
      learnerAnswerMatches(
        message,
        acceptedAnswers
      );

    const recommendedAction =
      getNextAction(body, answerMatched);

    const hints =
      step.hints?.length
        ? step.hints.join(" | ")
        : "No hints have been supplied.";

    const vocabulary =
      step.vocabulary?.length
        ? step.vocabulary
            .map(
              (item) =>
                `${item.source}: ${item.target}${
                  item.pronunciation
                    ? `, pronunciation guidance: ${item.pronunciation}`
                    : ""
                }${
                  item.pronunciationTip
                    ? `, pronunciation tip: ${item.pronunciationTip}`
                    : ""
                }`
            )
            .join("\n")
        : "No step-level vocabulary.";

    const response =
      await openai.responses.create({
        model: "gpt-4.1-mini",

        instructions: `
You are Ayo, FountainTalk's warm, patient and encouraging AI language tutor.

Learner:
- Name: ${body.learner.name}
- Age group: ${body.learner.ageGroup}
- Target language: ${body.learner.language}
- Level: ${body.learner.level}

Lesson:
- Title: ${body.lesson.title}
- Objective: ${body.lesson.objective}
- Current step title: ${step.title}
- Current step type: ${step.type}
- Teacher prompt: ${step.teacherPrompt}
- Expected phrase: ${step.expectedPhrase ?? "None"}
- Accepted answers: ${
          acceptedAnswers.length
            ? acceptedAnswers.join(" | ")
            : "None"
        }
- Hints: ${hints}
- Success reply: ${
          step.successReply ??
          "Praise the learner briefly."
        }
- Retry reply: ${
          step.retryReply ??
          "Encourage the learner to try again."
        }

Vocabulary:
${vocabulary}

Current progress:
- Step ${
          body.progress.currentStepIndex + 1
        } of ${body.progress.totalSteps}
- Mode: ${body.mode}

Learner said:
${message}

The application has already performed a basic accepted-answer comparison.
- Basic answer match: ${
          answerMatched ? "yes" : "no"
        }
- Recommended action: ${recommendedAction}

Teaching behaviour:

- Speak directly to the learner, never describe what the teacher should do.
- Do not say phrases such as "ask the learner", "teach the learner", or "explain to the learner".
- Keep the response short, natural and appropriate for the learner's age.
- Follow the current curriculum step.
- If the learner asks an unrelated but appropriate language question, answer briefly and naturally return to the current lesson.
- Do not move the learner forward merely because you explained the answer.
- Use "complete_step" only when the learner has successfully completed the requested activity.
- Use "complete_lesson" only when the learner successfully completes the final lesson step.
- Use "repeat_step" when the learner needs another attempt.
- Use "answer_detour" for an unrelated question answered outside the curriculum progression.
- Use "continue_step" when teaching or continuing the current activity.
- Preserve correct accents, tone marks and target-language spelling.
- Do not claim pronunciation was perfect unless there is enough evidence from the recognised text.
- Do not use Markdown, asterisks, headings or numbered lists.
- speechText must be natural spoken language, not labels or curriculum metadata.
- For Yoruba speech, do not invent English letter sounds.
- The pronunciation field is only a visual learning aid. Do not read punctuation, asterisks or formatting aloud.
- Native recorded audio, when available, is the authoritative pronunciation source.

Return only JSON matching the required schema.
        `.trim(),

        input: message,

        text: {
          format: {
            type: "json_schema",
            name: "fountaintalk_tutor_reply",
            strict: true,
            schema: {
              type: "object",
              properties: {
                displayText: {
                  type: "string",
                },
                speechText: {
                  type: "string",
                },
                action: {
                  type: "string",
                  enum: allowedActions,
                },
                correctedPhrase: {
                  anyOf: [
                    {
                      type: "string",
                    },
                    {
                      type: "null",
                    },
                  ],
                },
                encouragement: {
                  anyOf: [
                    {
                      type: "string",
                    },
                    {
                      type: "null",
                    },
                  ],
                },
              },
              required: [
                "displayText",
                "speechText",
                "action",
                "correctedPhrase",
                "encouragement",
              ],
              additionalProperties: false,
            },
          },
        },
      });

    if (!response.output_text) {
      return NextResponse.json(
        {
          error:
            "The tutor returned an empty response.",
        },
        { status: 502 }
      );
    }

    const result = JSON.parse(
      response.output_text
    ) as TutorReply;

    /*
     * Do not allow the model to advance progress when the
     * learner's response did not match a known accepted answer.
     */
    if (
      !answerMatched &&
      (result.action === "complete_step" ||
        result.action === "complete_lesson")
    ) {
      result.action = "repeat_step";
    }

    /*
     * Free conversation must never alter curriculum progress.
     */
    if (
      body.mode === "free-conversation"
    ) {
      result.action = "answer_detour";
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "FountainTalk API error:",
      error
    );

    if (
      error instanceof OpenAI.AuthenticationError
    ) {
      return NextResponse.json(
        {
          error:
            "The OpenAI API key is invalid or unavailable.",
        },
        { status: 401 }
      );
    }

    if (
      error instanceof OpenAI.RateLimitError
    ) {
      return NextResponse.json(
        {
          error:
            "The AI tutor is temporarily unavailable because of an API limit. Please try again shortly.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error:
          "The FountainTalk tutor could not answer right now.",
      },
      { status: 500 }
    );
  }
}