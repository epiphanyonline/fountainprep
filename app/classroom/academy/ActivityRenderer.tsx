"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import AcademyMediaPanel, {
  type AcademyMediaPanelHandle,
} from "./AcademyMediaPanel";

import {
  storyForActivity,
  visualForActivity,
} from "./mediaExamples";

import type {
  LessonActivity,
} from "@/features/academy-content";

import { supabase } from "@/app/lib/supabase";

type Props = {
  academyCode: string;
  activity: LessonActivity;
  feedback: string;
  busy: boolean;
  onSubmit: (
    answer: string,
    selectedOptionId?: string,
  ) => Promise<boolean>;
};

type ListeningPurpose =
  | "answer"
  | "question";

export default function ActivityRenderer({
  academyCode,
  activity,
  feedback,
  busy,
  onSubmit,
}: Props) {
  const [answer, setAnswer] =
    useState("");

  const [
    selectedOptionId,
    setSelectedOptionId,
  ] = useState<string | null>(null);

  const [speaking, setSpeaking] =
    useState(false);

  const [micActive, setMicActive] =
    useState(false);

  const [micError, setMicError] =
    useState("");

  const [
    raiseHandOpen,
    setRaiseHandOpen,
  ] = useState(false);

  const [
    raisedQuestion,
    setRaisedQuestion,
  ] = useState("");

  const [
    ayoQuestionReply,
    setAyoQuestionReply,
  ] = useState("");

  const [
    askingAyo,
    setAskingAyo,
  ] = useState(false);

  const [
    askAyoError,
    setAskAyoError,
  ] = useState("");

  const [
    listeningPurpose,
    setListeningPurpose,
  ] = useState<ListeningPurpose | null>(
    null,
  );

  const mediaRef =
    useRef<AcademyMediaPanelHandle | null>(
      null,
    );

  const recognitionRef =
    useRef<SpeechRecognition | null>(null);

  const autoNarrationTimerRef =
    useRef<number | null>(null);

  const needsAnswer =
    activity.type === "multiple-choice" ||
    activity.type === "typed-response" ||
    activity.type === "voice-response" ||
    Boolean(
      activity.acceptedAnswers?.length,
    ) ||
    Boolean(activity.expectedAnswer);

  const canUseVoiceAnswer =
    needsAnswer &&
    !activity.options?.length;

  function clearAutoNarrationTimer() {
    if (
      autoNarrationTimerRef.current !== null
    ) {
      window.clearTimeout(
        autoNarrationTimerRef.current,
      );

      autoNarrationTimerRef.current =
        null;
    }
  }

  function stopListening() {
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    setMicActive(false);
    setListeningPurpose(null);
  }

  useEffect(() => {
    /*
     * ActivityRenderer is the SINGLE OWNER of
     * automatic narration.
     *
     * Nothing speaks on the course-complete page,
     * because this component is not mounted there.
     * When an activity changes or unmounts, both
     * pending narration and live audio are stopped.
     */
    clearAutoNarrationTimer();
    stopListening();
    mediaRef.current?.stop();

    setSpeaking(false);
    setMicError("");
    setRaiseHandOpen(false);
    setRaisedQuestion("");
    setAyoQuestionReply("");
    setAskAyoError("");
    setAskingAyo(false);
    setAnswer("");
    setSelectedOptionId(null);

    if (activity.autoNarrate !== false) {
      autoNarrationTimerRef.current =
        window.setTimeout(() => {
          mediaRef.current?.speak();
        }, 700);
    }

    return () => {
      clearAutoNarrationTimer();
      stopListening();
      mediaRef.current?.stop();
    };
  }, [
    activity.id,
    activity.autoNarrate,
  ]);

  async function submit() {
    stopListening();

    await onSubmit(
      answer,
      selectedOptionId ?? undefined,
    );
  }

  function startListening(
    purpose: ListeningPurpose,
  ) {
    if (busy) {
      return;
    }

    if (
      purpose === "answer" &&
      !canUseVoiceAnswer
    ) {
      return;
    }

    clearAutoNarrationTimer();
    mediaRef.current?.stop();
    stopListening();
    setMicError("");

    const Recognition =
      window.SpeechRecognition ??
      window.webkitSpeechRecognition;

    if (!Recognition) {
      setMicError(
        "Voice input is not available in this browser. You can type instead.",
      );
      return;
    }

    const recognition =
      new Recognition();

    recognition.lang = "en-GB";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;

    let transcript = "";

    recognition.onstart = () => {
      setListeningPurpose(purpose);
      setMicActive(true);
    };

    recognition.onresult = (event) => {
      let combined = "";

      for (
        let index = 0;
        index < event.results.length;
        index += 1
      ) {
        combined +=
          event.results[index]?.[0]
            ?.transcript ?? "";
      }

      transcript = combined.trim();

      if (!transcript) {
        return;
      }

      if (purpose === "question") {
        setRaisedQuestion(transcript);
      } else {
        setAnswer(transcript);
      }
    };

    recognition.onerror = (event) => {
      recognitionRef.current = null;
      setMicActive(false);
      setListeningPurpose(null);

      if (event.error === "aborted") {
        return;
      }

      setMicError(
        event.error === "not-allowed"
          ? "Microphone permission was blocked. Allow microphone access in your browser and try again."
          : "Ayo could not hear that clearly. Try again or type instead.",
      );
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      setMicActive(false);
      setListeningPurpose(null);

      if (!transcript.trim()) {
        setMicError(
          "I did not catch anything. Try the microphone again or type instead.",
        );
      }
    };

    recognitionRef.current =
      recognition;

    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setMicActive(false);
      setListeningPurpose(null);

      setMicError(
        "The microphone could not start. Please try again.",
      );
    }
  }

  function toggleRaiseHand() {
    if (raiseHandOpen) {
      stopListening();
      setRaiseHandOpen(false);
      return;
    }

    clearAutoNarrationTimer();
    mediaRef.current?.stop();
    stopListening();
    setMicError("");
    setAskAyoError("");
    setAyoQuestionReply("");
    setRaiseHandOpen(true);
  }

  async function askAyoQuestion() {
    const question =
      raisedQuestion.trim();

    if (!question || askingAyo) {
      return;
    }

    clearAutoNarrationTimer();
    stopListening();
    mediaRef.current?.stop();

    setAskAyoError("");
    setAyoQuestionReply("");
    setAskingAyo(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error(
          "Your learning session has expired. Please sign in again.",
        );
      }

      const response = await fetch(
        "/api/academy/ask-ayo",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            academyCode,
            activity: {
              id: activity.id,
              title: activity.title,
              type: activity.type,
              teacherPrompt:
                activity.teacherPrompt,
              explanation:
                activity.explanation ?? "",
              learnerInstruction:
                activity.learnerInstruction ?? "",
              narrationText:
                activity.narrationText ?? "",
            },
            question,
          }),
        },
      );

      const result =
        (await response.json()) as {
          reply?: string;
          error?: string;
        };

      if (
        !response.ok ||
        !result.reply?.trim()
      ) {
        throw new Error(
          result.error ??
            "Ayo could not answer that question right now.",
        );
      }

      const reply =
        result.reply.trim();

      setAyoQuestionReply(reply);

      /*
       * The same single natural-voice player
       * speaks Ayo's conversational reply.
       */
      mediaRef.current?.speakText(
        reply,
      );
    } catch (error) {
      setAskAyoError(
        error instanceof Error
          ? error.message
          : "Ayo could not answer that question right now.",
      );
    } finally {
      setAskingAyo(false);
    }
  }

  function resumeLesson() {
    stopListening();
    setRaiseHandOpen(false);
    setMicError("");
    mediaRef.current?.speak();
  }

  return (
    <section className="activityCard">
      <div className="activityTopline">
        <span>
          {activity.type.replaceAll(
            "-",
            " ",
          )}
        </span>

        <b>Learning activity</b>
      </div>

      <h2>{activity.title}</h2>

      <p className="prompt">
        {activity.teacherPrompt}
      </p>

      {activity.explanation ? (
        <div className="explanation">
          {activity.explanation}
        </div>
      ) : null}

      <AcademyMediaPanel
        ref={mediaRef}
        academyCode={academyCode}
        activityId={activity.id}
        title={activity.title}
        text={activity.teacherPrompt}
        explanation={
          activity.explanation
        }
        instruction={
          activity.learnerInstruction
        }
        narrationText={
          activity.narrationText
        }
        story={
          activity.story ??
          storyForActivity(
            academyCode,
            activity.id,
          )
        }
        visualTitle={
          activity.visualTitle ??
          visualForActivity(
            activity.id,
          )?.title
        }
        visualDescription={
          activity.visualDescription ??
          visualForActivity(
            activity.id,
          )?.description
        }
        onSpeakingChange={setSpeaking}
      />

      <div className="ayoControls">
        <button
          type="button"
          onClick={() => {
            clearAutoNarrationTimer();

            if (speaking) {
              mediaRef.current?.stop();
            } else {
              mediaRef.current?.speak();
            }
          }}
        >
          {speaking
            ? "❚❚ Pause Ayo"
            : "🔊 Hear Ayo again"}
        </button>

        <button
          type="button"
          className={
            raiseHandOpen
              ? "raiseHand active"
              : "raiseHand"
          }
          onClick={toggleRaiseHand}
          disabled={busy}
        >
          ✋ Raise hand
        </button>

        {canUseVoiceAnswer ? (
          <button
            type="button"
            className={
              micActive &&
              listeningPurpose ===
                "answer"
                ? "micButton active"
                : "micButton"
            }
            onClick={() => {
              if (
                micActive &&
                listeningPurpose ===
                  "answer"
              ) {
                stopListening();
              } else {
                startListening(
                  "answer",
                );
              }
            }}
            disabled={busy}
          >
            {micActive &&
            listeningPurpose === "answer"
              ? "🎙 Listening…"
              : "🎙 Answer by voice"}
          </button>
        ) : null}
      </div>

      {raiseHandOpen ? (
        <div className="raiseHandPanel">
          <div className="raiseHandHeader">
            <div>
              <strong>
                Ayo has paused.
              </strong>

              <span>
                Ask your question by voice or
                type it below. This does not
                count as your assessed answer.
              </span>
            </div>

            <button
              type="button"
              onClick={resumeLesson}
            >
              Resume lesson
            </button>
          </div>

          <div className="questionComposer">
            <textarea
              value={raisedQuestion}
              onChange={(event) => {
                setRaisedQuestion(
                  event.target.value,
                );
                setAyoQuestionReply("");
                setAskAyoError("");
              }}
              rows={3}
              placeholder="What would you like to ask Ayo?"
              disabled={busy}
            />

            <button
              type="button"
              className={
                micActive &&
                listeningPurpose ===
                  "question"
                  ? "questionMic active"
                  : "questionMic"
              }
              onClick={() => {
                if (
                  micActive &&
                  listeningPurpose ===
                    "question"
                ) {
                  stopListening();
                } else {
                  startListening(
                    "question",
                  );
                }
              }}
              disabled={busy}
            >
              {micActive &&
              listeningPurpose ===
                "question"
                ? "🎙 Listening…"
                : "🎙 Ask by voice"}
            </button>
          </div>

          {raisedQuestion.trim() ? (
            <div className="questionCaptured">
              <small>
                YOUR QUESTION
              </small>

              <p>{raisedQuestion}</p>

              <button
                type="button"
                className="askAyoButton"
                onClick={() => {
                  void askAyoQuestion();
                }}
                disabled={
                  askingAyo ||
                  !raisedQuestion.trim()
                }
              >
                {askingAyo
                  ? "Ayo is thinking…"
                  : "Ask Ayo →"}
              </button>
            </div>
          ) : null}

          {askAyoError ? (
            <div
              className="askAyoError"
              role="status"
            >
              {askAyoError}
            </div>
          ) : null}

          {ayoQuestionReply ? (
            <div
              className="ayoReply"
              role="status"
            >
              <div className="ayoReplyTop">
                <small>AYO ANSWERS</small>

                <button
                  type="button"
                  onClick={() => {
                    mediaRef.current?.speakText(
                      ayoQuestionReply,
                    );
                  }}
                >
                  🔊 Hear answer again
                </button>
              </div>

              <p>
                {ayoQuestionReply}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      {activity.learnerInstruction ? (
        <p className="instruction">
          {activity.learnerInstruction}
        </p>
      ) : null}

      {activity.options?.length ? (
        <div className="options">
          {activity.options.map(
            (option) => (
              <button
                type="button"
                key={option.id}
                className={
                  selectedOptionId ===
                  option.id
                    ? "option selected"
                    : "option"
                }
                onClick={() =>
                  setSelectedOptionId(
                    option.id,
                  )
                }
                disabled={busy}
              >
                {option.label}
              </button>
            ),
          )}
        </div>
      ) : null}

      {needsAnswer &&
      !activity.options?.length ? (
        <>
          <textarea
            value={answer}
            onChange={(event) =>
              setAnswer(
                event.target.value,
              )
            }
            placeholder={
              activity.type ===
              "voice-response"
                ? "Answer Ayo aloud or type your answer here..."
                : "Type your answer here, or use Answer by voice."
            }
            rows={5}
            disabled={busy}
          />

          <div className="answerStatus">
            {micActive &&
            listeningPurpose === "answer" ? (
              <span className="listening">
                ● Ayo is listening
              </span>
            ) : answer.trim() ? (
              <span>
                Your answer is ready to
                check.
              </span>
            ) : (
              <span>
                You can speak or type your
                answer.
              </span>
            )}
          </div>
        </>
      ) : null}

      {micError ? (
        <div
          className="micError"
          role="status"
        >
          {micError}
        </div>
      ) : null}

      {activity.hints?.length ? (
        <details>
          <summary>Need a hint?</summary>
          <p>{activity.hints[0]}</p>
        </details>
      ) : null}

      {feedback ? (
        <div
          className="feedback"
          role="status"
        >
          <strong>Ayo:</strong>{" "}
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
          {busy
            ? "Ayo is checking..."
            : "Check my answer"}
        </button>
      ) : null}

      <style jsx>{`
        .activityCard {
          min-height: 520px;
          padding: 34px;
          border-radius: 32px;
          border:
            1px solid
            rgba(111, 66, 193, 0.13);
          background:
            rgba(255, 255, 255, 0.97);
          box-shadow:
            0 24px 70px
            rgba(48, 29, 82, 0.1);
        }

        .activityTopline {
          display: flex;
          justify-content:
            space-between;
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
          font-size:
            clamp(30px, 4vw, 48px);
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
        .feedback,
        .micError,
        .raiseHandPanel {
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

        .ayoControls {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 16px;
          padding: 12px;
          border:
            1px solid #e9def5;
          border-radius: 18px;
          background: #fcfaff;
        }

        .ayoControls button,
        .raiseHandPanel button {
          min-height: 43px;
          padding: 0 14px;
          border:
            1px solid #e7def2;
          border-radius: 13px;
          color: #5f4378;
          background: #fff;
          font: inherit;
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
        }

        .ayoControls .active,
        .questionMic.active {
          color: #fff;
          background: #6f42c1;
          border-color: #6f42c1;
        }

        .raiseHandPanel {
          color: #5c4631;
          background: #fff8e8;
          border:
            1px solid #f5dfac;
        }

        .raiseHandHeader {
          display: flex;
          align-items: center;
          justify-content:
            space-between;
          gap: 16px;
        }

        .raiseHandHeader strong,
        .raiseHandHeader span {
          display: block;
        }

        .raiseHandHeader span {
          margin-top: 4px;
          line-height: 1.45;
        }

        .questionComposer {
          display: grid;
          grid-template-columns:
            1fr auto;
          gap: 10px;
          margin-top: 14px;
          align-items: stretch;
        }

        .questionComposer textarea {
          margin-top: 0;
          min-height: 84px;
        }

        .questionComposer button {
          min-width: 140px;
        }

        .questionCaptured {
          margin-top: 12px;
          padding: 12px 14px;
          border-radius: 14px;
          background:
            rgba(255, 255, 255, 0.68);
        }

        .questionCaptured small {
          color: #8a5a00;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .questionCaptured p {
          margin: 5px 0 0;
          line-height: 1.5;
        }

        .askAyoButton {
          width: 100%;
          margin-top: 12px;
          color: #ffffff !important;
          background:
            linear-gradient(
              135deg,
              #6f42c1,
              #8a5cf6
            ) !important;
          border: 0 !important;
        }

        .ayoReply {
          margin-top: 14px;
          padding: 16px 17px;
          border-radius: 16px;
          color: #39294d;
          background: #ffffff;
          border: 1px solid #e6d9f6;
          box-shadow:
            0 12px 30px
            rgba(73, 43, 110, 0.07);
        }

        .ayoReplyTop {
          display: flex;
          align-items: center;
          justify-content:
            space-between;
          gap: 12px;
        }

        .ayoReplyTop small {
          color: #6f42c1;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.09em;
        }

        .ayoReplyTop button {
          min-height: 36px;
          padding: 0 11px;
          font-size: 11px;
        }

        .ayoReply p {
          margin: 10px 0 0;
          line-height: 1.65;
          font-weight: 700;
        }

        .askAyoError {
          margin-top: 12px;
          padding: 12px 14px;
          border-radius: 14px;
          color: #9a3412;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          font-size: 13px;
          font-weight: 750;
        }

        .options {
          display: grid;
          gap: 12px;
          margin-top: 24px;
        }

        .option {
          min-height: 58px;
          padding: 14px 18px;
          border:
            2px solid #eee7f8;
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
          border:
            2px solid #eee7f8;
          border-radius: 18px;
          color: #241438;
          background: white;
          font: inherit;
          line-height: 1.55;
        }

        .answerStatus {
          margin-top: 8px;
          color: #81758a;
          font-size: 12px;
          font-weight: 700;
        }

        .answerStatus .listening {
          color: #15803d;
        }

        .micError {
          color: #9a3412;
          background: #fff7ed;
          border: 1px solid #fed7aa;
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
          background:
            linear-gradient(
              135deg,
              #6f42c1,
              #8a5cf6
            );
          font: inherit;
          font-weight: 900;
          cursor: pointer;
        }

        button:disabled,
        textarea:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 620px) {
          .activityCard {
            padding: 22px 16px;
            border-radius: 24px;
          }

          .ayoControls,
          .questionComposer {
            display: grid;
            grid-template-columns: 1fr;
          }

          .ayoControls button,
          .questionComposer button {
            width: 100%;
          }

          .raiseHandHeader {
            align-items: stretch;
            flex-direction: column;
          }

          .raiseHandHeader button {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
