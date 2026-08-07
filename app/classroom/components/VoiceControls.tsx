"use client";

import type { LessonAction, LessonStatus } from "../types/classroom";

type VoiceControlsProps = {
  status: LessonStatus;
  action: LessonAction;
  canGoBack?: boolean;
  canContinue?: boolean;
  onSpeak: () => void;
  onReplay: () => void;
  onContinue: () => void;
  onBack?: () => void;
};

function getSpeakLabel(status: LessonStatus) {
  if (status === "listening") return "Stop and submit";
  if (status === "thinking") return "Checking...";
  if (status === "speaking") return "Ayo is speaking";
  return "Start speaking";
}

function getContinueLabel(action: LessonAction) {
  if (action === "complete") return "Finish lesson";
  if (action === "speak") return "Continue";
  return "Next";
}

export default function VoiceControls({
  status,
  action,
  canGoBack = false,
  canContinue = true,
  onSpeak,
  onReplay,
  onContinue,
  onBack,
}: VoiceControlsProps) {
  const isBusy =
    status === "loading" ||
    status === "thinking" ||
    status === "speaking";

  const isListening = status === "listening";
  const showSpeakButton =
    action === "speak" || action === "repeat";

  return (
    <nav className="controlDock" aria-label="Lesson controls">
      <div className="secondaryControls">
        {canGoBack && onBack ? (
          <button
            type="button"
            className="controlButton secondaryButton"
            onClick={onBack}
            disabled={isBusy}
          >
            <span className="controlIcon" aria-hidden="true">
              ←
            </span>
            <span>Back</span>
          </button>
        ) : null}

        <button
          type="button"
          className="controlButton secondaryButton"
          onClick={onReplay}
          disabled={isBusy || action === "complete"}
        >
          <span className="controlIcon" aria-hidden="true">
            ↻
          </span>
          <span>Hear again</span>
        </button>
      </div>

      {showSpeakButton ? (
        <button
          type="button"
          className={`speakButton ${isListening ? "listening" : ""}`}
          onClick={onSpeak}
          disabled={isBusy && !isListening}
          aria-pressed={isListening}
        >
          <span className="micOuter" aria-hidden="true">
            <span className="micInner">🎤</span>
          </span>

          <span className="speakText">
            <strong>{getSpeakLabel(status)}</strong>
            <small>
  {isListening
    ? "Press again when you have finished"
    : "Press once, speak, then press again"}
</small>
          </span>
        </button>
      ) : (
        <div className="instructionPanel">
          <span className="instructionIcon" aria-hidden="true">
            {action === "listen"
              ? "👂"
              : action === "complete"
                ? "🏆"
                : "✨"}
          </span>

          <div>
            <strong>
              {action === "listen"
                ? "Listen carefully"
                : action === "complete"
                  ? "Excellent work"
                  : "Ready for the next step"}
            </strong>

            <small>
              {action === "listen"
                ? "Replay the audio whenever you need to."
                : action === "complete"
                  ? "You have reached the end of this lesson."
                  : "Continue when you are ready."}
            </small>
          </div>
        </div>
      )}

      <button
        type="button"
        className="controlButton continueButton"
        onClick={onContinue}
        disabled={!canContinue || isBusy || isListening}
      >
        <span>{getContinueLabel(action)}</span>
        <span className="controlIcon" aria-hidden="true">
          →
        </span>
      </button>

      <style jsx>{`
        .controlDock {
  position: fixed;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
          z-index: 30;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
          gap: 16px;
          align-items: center;
          width: min(1180px, calc(100% - 24px));
          margin: 24px auto 0;
          padding: 14px;
          border-radius: 28px;
          border: 1px solid rgba(111, 66, 193, 0.14);
          background: rgba(255, 255, 255, 0.94);
          box-shadow: 0 24px 70px rgba(48, 29, 82, 0.16);
          backdrop-filter: blur(20px);
        }

        .secondaryControls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        button {
          font: inherit;
        }

        .controlButton {
          min-height: 52px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 0 18px;
          border-radius: 18px;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            opacity 180ms ease;
        }

        .controlButton:hover:not(:disabled),
.speakButton:hover:not(:disabled) {
  transform: translateY(-2px);
}

        .secondaryButton {
          border: 1px solid rgba(111, 66, 193, 0.13);
          background: #faf7ff;
          color: #5e4774;
        }

        .continueButton {
          justify-self: end;
          min-width: 160px;
          border: 0;
          color: #ffffff;
          background: linear-gradient(135deg, #6f42c1, #8a5cf6);
          box-shadow: 0 14px 32px rgba(111, 66, 193, 0.22);
        }

        .controlIcon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          font-size: 19px;
          line-height: 1;
        }

        .speakButton {
          min-width: 250px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 13px;
          padding: 9px 18px 9px 10px;
          border: 0;
          border-radius: 22px;
          color: #ffffff;
          background:
            radial-gradient(
              circle at top right,
              rgba(255, 255, 255, 0.22),
              transparent 36%
            ),
            linear-gradient(135deg, #6f42c1, #8a5cf6);
          box-shadow: 0 16px 38px rgba(111, 66, 193, 0.25);
          cursor: pointer;
          transition:
            transform 180ms ease,
            box-shadow 180ms ease;
        }

        .speakButton.listening {
          background:
            radial-gradient(
              circle at top right,
              rgba(255, 255, 255, 0.18),
              transparent 36%
            ),
            linear-gradient(135deg, #15803d, #22c55e);
          box-shadow: 0 16px 38px rgba(21, 128, 61, 0.24);
        }

        .micOuter {
          position: relative;
          flex: 0 0 auto;
          width: 50px;
          height: 50px;
          display: grid;
          place-items: center;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.18);
        }

        .micInner {
          font-size: 23px;
        }

        .speakButton.listening .micOuter::before,
        .speakButton.listening .micOuter::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          border: 2px solid rgba(255, 255, 255, 0.55);
          animation: listeningPulse 1.7s infinite ease-out;
        }

        .speakButton.listening .micOuter::after {
          animation-delay: 700ms;
        }

        .speakText {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .speakText strong,
        .instructionPanel strong {
          font-size: 15px;
          font-weight: 950;
        }

        .speakText small {
          margin-top: 3px;
          color: rgba(255, 255, 255, 0.82);
          font-size: 11px;
          font-weight: 700;
        }

        .instructionPanel {
          min-width: 250px;
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          align-items: center;
          gap: 12px;
          padding: 10px 15px;
          border-radius: 21px;
          background: #faf7ff;
          border: 1px solid rgba(111, 66, 193, 0.11);
        }

        .instructionIcon {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: #efe6ff;
          font-size: 21px;
        }

        .instructionPanel strong {
          display: block;
          color: #241438;
        }

        .instructionPanel small {
          display: block;
          margin-top: 3px;
          color: #776a84;
          font-size: 11px;
          font-weight: 700;
          line-height: 1.35;
        }

        button:disabled {
          opacity: 0.46;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        @keyframes listeningPulse {
          0% {
            transform: scale(0.8);
            opacity: 0.9;
          }

          100% {
            transform: scale(1.55);
            opacity: 0;
          }
        }

        @media (max-width: 900px) {
          .controlDock {
            grid-template-columns: 1fr;
            width: calc(100% - 20px);
          }

          .secondaryControls {
            order: 2;
            justify-content: center;
          }

          .speakButton,
          .instructionPanel {
            order: 1;
            width: 100%;
            min-width: 0;
          }

          .continueButton {
            order: 3;
            justify-self: stretch;
            width: 100%;
          }
        }

        @media (max-width: 520px) {
          .controlDock {
            bottom: 8px;
            gap: 10px;
            padding: 10px;
            border-radius: 23px;
          }

          .secondaryControls {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .secondaryButton {
            width: 100%;
            padding: 0 12px;
          }

          .speakButton {
            padding-right: 13px;
          }

          .speakText strong {
            font-size: 14px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .speakButton.listening .micOuter::before,
          .speakButton.listening .micOuter::after {
            animation: none;
          }
        }
      `}</style>
    </nav>
  );
}