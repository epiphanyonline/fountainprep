"use client";

import type {
  ConversationMessage,
  LessonStatus,
} from "../types/classroom";

type ConversationPanelProps = {
  messages: ConversationMessage[];
  status: LessonStatus;
  teacherName?: string;
};

function getStatusText(status: LessonStatus) {
  switch (status) {
    case "listening":
      return "Listening to you";
    case "thinking":
      return "Preparing feedback";
    case "speaking":
      return "Ayo is speaking";
    case "paused":
      return "Lesson paused";
    case "completed":
      return "Lesson completed";
    case "loading":
      return "Preparing lesson";
    case "ready":
      return "Ready";
    default:
      return "Current conversation";
  }
}

function getSpeakerLabel(
  speaker: ConversationMessage["speaker"],
  teacherName: string,
) {
  return speaker === "ayo" ? teacherName : "You";
}

function getScoreLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Very good";
  if (score >= 60) return "Good effort";
  return "Keep practising";
}

export default function ConversationPanel({
  messages,
  status,
  teacherName = "Ayo",
}: ConversationPanelProps) {
  const visibleMessages = messages.slice(-2);

  return (
    <aside
      className="conversationCard"
      aria-label="Current lesson conversation"
    >
      <div className="panelHeader">
        <div>
          <p className="eyebrow">Current exchange</p>
          <h2>Conversation</h2>
        </div>

        <div className={`statusBadge status-${status}`}>
          <span className="statusDot" aria-hidden="true" />
          <span>{getStatusText(status)}</span>
        </div>
      </div>

      <div className="conversationBody" aria-live="polite">
        {visibleMessages.length === 0 ? (
          <div className="emptyState">
            <div className="emptyIcon" aria-hidden="true">
              💬
            </div>

            <h3>Your conversation will appear here</h3>

            <p>
  Listen to {teacherName}, press Start speaking, then press Stop and
  submit when you have finished. Your words will appear here.
</p>
          </div>
        ) : (
          <div className="messageList">
            {visibleMessages.map((message) => {
              const isTeacher = message.speaker === "ayo";
              const score =
                typeof message.pronunciationScore === "number"
                  ? Math.max(
                      0,
                      Math.min(100, message.pronunciationScore),
                    )
                  : null;

              return (
                <article
                  key={message.id}
                  className={
                    isTeacher
                      ? "message teacherMessage"
                      : "message learnerMessage"
                  }
                >
                  <div className="messageTopline">
                    <div className="speakerIdentity">
                      <span
                        className="speakerAvatar"
                        aria-hidden="true"
                      >
                        {isTeacher ? "A" : "Y"}
                      </span>

                      <div>
                        <p>
                          {getSpeakerLabel(
                            message.speaker,
                            teacherName,
                          )}
                        </p>

                        <span>
                          {isTeacher
                            ? "Your teacher"
                            : "Your response"}
                        </span>
                      </div>
                    </div>

                    {score !== null ? (
                      <div
                        className="scoreBadge"
                        aria-label={`Pronunciation score ${score} percent`}
                      >
                        <strong>{score}%</strong>
                        <span>{getScoreLabel(score)}</span>
                      </div>
                    ) : null}
                  </div>

                  <p className="messageText">{message.message}</p>

                  {score !== null ? (
                    <div
                      className="scoreTrack"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={score}
                      aria-label="Pronunciation score"
                    >
                      <div
                        className="scoreFill"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </div>

      <div className="panelFooter">
        <span aria-hidden="true">
          {status === "listening"
            ? "🎤"
            : status === "thinking"
              ? "✨"
              : status === "speaking"
                ? "🔊"
                : "🌟"}
        </span>

        <p>
          {status === "listening"
            ? "Speak clearly and take your time."
            : status === "thinking"
              ? "Ayo is preparing gentle feedback."
              : status === "speaking"
                ? "Listen carefully to the pronunciation."
                : "Only the current exchange is shown to keep the lesson focused."}
        </p>
      </div>

      <style jsx>{`
        .conversationCard {
          display: flex;
          flex-direction: column;
          min-height: 0;
height: 100%;
          overflow: hidden;
          border-radius: 34px;
          border: 1px solid rgba(111, 66, 193, 0.13);
          background:
            radial-gradient(
              circle at top right,
              rgba(138, 92, 246, 0.1),
              transparent 32%
            ),
            #ffffff;
          box-shadow: 0 24px 70px rgba(48, 29, 82, 0.1);
        }

        .panelHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          padding: 24px;
          border-bottom: 1px solid rgba(111, 66, 193, 0.09);
          background: rgba(250, 247, 255, 0.78);
        }

        .eyebrow {
          margin: 0 0 5px;
          color: #6f42c1;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        h2 {
          margin: 0;
          color: #241438;
          font-size: 28px;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .statusBadge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 38px;
          padding: 0 12px;
          border-radius: 999px;
          background: #ffffff;
          border: 1px solid rgba(111, 66, 193, 0.1);
          color: #756985;
          font-size: 11px;
          font-weight: 850;
          white-space: nowrap;
        }

        .statusDot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #aaa0b5;
        }

        .status-listening .statusDot {
          background: #16a34a;
          animation: pulse 1.2s infinite;
        }

        .status-speaking .statusDot {
          background: #6f42c1;
          animation: pulse 1.2s infinite;
        }

        .status-thinking .statusDot {
          background: #d89a00;
          animation: pulse 1.2s infinite;
        }

        .status-completed .statusDot {
          background: #16a34a;
        }

        .conversationBody {
          flex: 1;
          display: flex;
          padding: 22px;
        }

        .emptyState {
          width: 100%;
          min-height: 390px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          text-align: center;
          border-radius: 26px;
          background: #faf7ff;
          border: 1px dashed rgba(111, 66, 193, 0.17);
        }

        .emptyIcon {
          width: 64px;
          height: 64px;
          display: grid;
          place-items: center;
          border-radius: 22px;
          background: #f0e8ff;
          font-size: 30px;
        }

        .emptyState h3 {
          margin: 18px 0 0;
          color: #241438;
          font-size: 21px;
          letter-spacing: -0.02em;
        }

        .emptyState p {
          max-width: 300px;
          margin: 10px 0 0;
          color: #756985;
          font-size: 14px;
          font-weight: 650;
          line-height: 1.65;
        }

        .messageList {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 16px;
        }

        .message {
          padding: 18px;
          border-radius: 24px;
          border: 1px solid rgba(111, 66, 193, 0.1);
        }

        .teacherMessage {
          background:
            radial-gradient(
              circle at top right,
              rgba(255, 255, 255, 0.18),
              transparent 35%
            ),
            linear-gradient(135deg, #6f42c1, #8a5cf6);
          color: #ffffff;
          box-shadow: 0 18px 42px rgba(111, 66, 193, 0.2);
        }

        .learnerMessage {
          background: #faf7ff;
          color: #241438;
        }

        .messageTopline {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .speakerIdentity {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .speakerAvatar {
          flex: 0 0 auto;
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.18);
          border: 1px solid rgba(255, 255, 255, 0.18);
          font-weight: 950;
        }

        .learnerMessage .speakerAvatar {
          color: #6f42c1;
          background: #efe6ff;
          border-color: rgba(111, 66, 193, 0.1);
        }

        .speakerIdentity p {
          margin: 0;
          font-size: 14px;
          font-weight: 950;
        }

        .speakerIdentity span {
          display: block;
          margin-top: 3px;
          font-size: 11px;
          font-weight: 750;
          opacity: 0.74;
        }

        .scoreBadge {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .scoreBadge strong {
          font-size: 17px;
          line-height: 1;
        }

        .scoreBadge span {
          margin-top: 4px;
          font-size: 10px;
          font-weight: 800;
          opacity: 0.76;
        }

        .messageText {
          margin: 17px 0 0;
          font-size: 18px;
          font-weight: 760;
          line-height: 1.55;
        }

        .scoreTrack {
          height: 7px;
          overflow: hidden;
          margin-top: 16px;
          border-radius: 999px;
          background: rgba(111, 66, 193, 0.12);
        }

        .scoreFill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #22c55e, #86efac);
          transition: width 300ms ease;
        }

        .panelFooter {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 11px;
          align-items: center;
          padding: 17px 20px;
          border-top: 1px solid rgba(111, 66, 193, 0.09);
          background: #faf7ff;
        }

        .panelFooter span {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: #ffffff;
          font-size: 18px;
        }

        .panelFooter p {
          margin: 0;
          color: #756985;
          font-size: 13px;
          font-weight: 720;
          line-height: 1.5;
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }

          50% {
            transform: scale(1.45);
            opacity: 0.55;
          }
        }

        @media (max-width: 760px) {
          .conversationCard {
            min-height: 500px;
            border-radius: 28px;
          }

          .panelHeader,
          .conversationBody {
            padding: 20px;
          }

          .emptyState {
            min-height: 300px;
          }
        }

        @media (max-width: 480px) {
          .panelHeader {
            flex-direction: column;
          }

          .statusBadge {
            align-self: flex-start;
          }

          .messageTopline {
            flex-direction: column;
          }

          .scoreBadge {
            align-items: flex-start;
          }

          .messageText {
            font-size: 16px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .statusDot {
            animation: none;
          }
        }
      `}</style>
    </aside>
  );
}