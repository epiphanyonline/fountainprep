"use client";

import { useState } from "react";

import type {
  LessonActivity,
} from "@/features/academy-content";

type Props = {
  activity: LessonActivity;
  feedback: string;
  busy: boolean;
  onSubmit: (
    answer: string,
    selectedOptionId?: string,
  ) => Promise<boolean>;
};

export default function ActivityRenderer({
  activity,
  feedback,
  busy,
  onSubmit,
}: Props) {
  const [answer, setAnswer] = useState("");
  const [selectedOptionId, setSelectedOptionId] =
    useState<string | null>(null);

  const needsAnswer =
    activity.type === "multiple-choice" ||
    activity.type === "typed-response" ||
    activity.type === "voice-response" ||
    Boolean(activity.acceptedAnswers?.length) ||
    Boolean(activity.expectedAnswer);

  async function submit() {
    await onSubmit(
      answer,
      selectedOptionId ?? undefined,
    );
  }

  return (
    <section className="activityCard">
      <div className="activityTopline">
        <span>{activity.type.replaceAll("-", " ")}</span>
        <b>+{activity.points ?? 0} XP</b>
      </div>

      <h2>{activity.title}</h2>
      <p className="prompt">{activity.teacherPrompt}</p>

      {activity.explanation ? (
        <div className="explanation">
          {activity.explanation}
        </div>
      ) : null}

      {activity.learnerInstruction ? (
        <p className="instruction">
          {activity.learnerInstruction}
        </p>
      ) : null}

      {activity.options?.length ? (
        <div className="options">
          {activity.options.map((option) => (
            <button
              type="button"
              key={option.id}
              className={
                selectedOptionId === option.id
                  ? "option selected"
                  : "option"
              }
              onClick={() =>
                setSelectedOptionId(option.id)
              }
              disabled={busy}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}

      {needsAnswer && !activity.options?.length ? (
        <textarea
          value={answer}
          onChange={(event) =>
            setAnswer(event.target.value)
          }
          placeholder={
            activity.type === "voice-response"
              ? "Voice capture will be connected here. Type the response during MVP testing."
              : "Enter your answer..."
          }
          rows={5}
          disabled={busy}
        />
      ) : null}

      {activity.hints?.length ? (
        <details>
          <summary>Need a hint?</summary>
          <p>{activity.hints[0]}</p>
        </details>
      ) : null}

      {feedback ? (
        <div className="feedback" role="status">
          {feedback}
        </div>
      ) : null}

      {needsAnswer ? (
        <button
          type="button"
          className="submitButton"
          onClick={submit}
          disabled={
            busy ||
            (activity.options?.length
              ? !selectedOptionId
              : !answer.trim())
          }
        >
          {busy ? "Checking..." : "Check answer"}
        </button>
      ) : null}

      <style jsx>{`
        .activityCard {
          min-height: 520px;
          padding: 34px;
          border-radius: 32px;
          border: 1px solid rgba(111, 66, 193, 0.13);
          background: rgba(255, 255, 255, 0.97);
          box-shadow: 0 24px 70px rgba(48, 29, 82, 0.1);
        }

        .activityTopline {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          color: #6f42c1;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        h2 {
          margin: 18px 0 0;
          color: #241438;
          font-size: clamp(30px, 4vw, 48px);
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .prompt {
          margin: 22px 0 0;
          color: #4c4058;
          font-size: 18px;
          line-height: 1.75;
          font-weight: 650;
        }

        .explanation,
        .instruction,
        .feedback {
          margin-top: 18px;
          padding: 16px 18px;
          border-radius: 18px;
        }

        .explanation {
          color: #4a3761;
          background: #faf7ff;
        }

        .instruction {
          color: #39536e;
          background: #f2f8ff;
        }

        .options {
          display: grid;
          gap: 12px;
          margin-top: 24px;
        }

        .option {
          min-height: 58px;
          padding: 14px 18px;
          border: 2px solid #eee7f8;
          border-radius: 18px;
          color: #342344;
          background: white;
          text-align: left;
          font: inherit;
          font-weight: 800;
          cursor: pointer;
        }

        .option.selected {
          border-color: #7c3aed;
          background: #f5efff;
          color: #5b21b6;
        }

        textarea {
          width: 100%;
          margin-top: 24px;
          padding: 18px;
          resize: vertical;
          border: 2px solid #eee7f8;
          border-radius: 18px;
          color: #241438;
          background: white;
          font: inherit;
          line-height: 1.55;
        }

        details {
          margin-top: 18px;
          color: #6f42c1;
          font-weight: 800;
        }

        details p {
          color: #6b6075;
          font-weight: 650;
        }

        .feedback {
          color: #14532d;
          background: #ecfdf3;
          border: 1px solid #bbf7d0;
          font-weight: 800;
        }

        .submitButton {
          width: 100%;
          min-height: 56px;
          margin-top: 22px;
          border: 0;
          border-radius: 18px;
          color: white;
          background: linear-gradient(135deg, #6f42c1, #8a5cf6);
          font: inherit;
          font-weight: 900;
          cursor: pointer;
        }

        button:disabled,
        textarea:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </section>
  );
}
