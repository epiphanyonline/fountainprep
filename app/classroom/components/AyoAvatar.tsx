"use client";

import Image from "next/image";
import type { LessonStatus, TeachingPersonality } from "../types/classroom";

type AyoAvatarProps = {
  status: LessonStatus;
  personality: TeachingPersonality;
  message?: string;
  imageSrc?: string;
  teacherName?: string;
};

const statusLabels: Record<LessonStatus, string> = {
  idle: "Ready",
  loading: "Preparing lesson",
  ready: "Ready to teach",
  listening: "Listening",
  thinking: "Thinking",
  speaking: "Speaking",
  paused: "Lesson paused",
  completed: "Lesson complete",
};

const personalityLabels: Record<TeachingPersonality, string> = {
  explorer: "Explorer Teacher",
  coach: "Learning Coach",
  mentor: "Learning Mentor",
  professional: "Professional Tutor",
};

export default function AyoAvatar({
  status,
  personality,
  message,
  imageSrc = "/images/ayo/ayo-teacher.png",
  teacherName = "Ayo",
}: AyoAvatarProps) {
  const isActive =
    status === "speaking" ||
    status === "listening" ||
    status === "thinking";

  return (
    <section
      className={`avatarCard ${isActive ? "active" : ""}`}
      aria-label={`${teacherName}, ${statusLabels[status]}`}
    >
      <div className="avatarGlow" aria-hidden="true" />

      <div className="teacherMeta">
        <div>
          <p className="teacherRole">{personalityLabels[personality]}</p>
          <h2>{teacherName}</h2>
        </div>

        <div className={`statusPill status-${status}`}>
          <span className="statusDot" aria-hidden="true" />
          <span>{statusLabels[status]}</span>
        </div>
      </div>

      <div className="avatarStage">
        <div className="decorativeCircle circleOne" aria-hidden="true" />
        <div className="decorativeCircle circleTwo" aria-hidden="true" />

        <div className="imageWrap">
          <Image
            src={imageSrc}
            alt={`${teacherName}, your FountainPrep teacher`}
            fill
            priority
            sizes="(max-width: 700px) 260px, 420px"
            className="avatarImage"
          />
        </div>

        {status === "speaking" ? (
          <div className="soundWave" aria-label={`${teacherName} is speaking`}>
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        ) : null}

        {status === "listening" ? (
          <div className="listeningRing" aria-hidden="true" />
        ) : null}
      </div>

      <div className="speechCard" aria-live="polite">
        <div className="speechIcon" aria-hidden="true">
          {status === "listening"
            ? "🎤"
            : status === "thinking"
              ? "✨"
              : status === "completed"
                ? "🏆"
                : "💬"}
        </div>

        <div>
          <p className="speechLabel">
            {status === "listening" ? "Your turn" : `${teacherName} says`}
          </p>

          <p className="speechMessage">
            {message ||
              "Welcome to your lesson. We are going to learn something wonderful today."}
          </p>
        </div>
      </div>

      <style jsx>{`
        .avatarCard {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 0;
height: 100%;
          padding: 24px;
          border-radius: 34px;
          border: 1px solid rgba(111, 66, 193, 0.13);
          background:
            radial-gradient(
              circle at 50% 30%,
              rgba(179, 145, 255, 0.2),
              transparent 38%
            ),
            linear-gradient(180deg, #ffffff, #f8f3ff);
          box-shadow: 0 24px 70px rgba(48, 29, 82, 0.1);
          transition:
            transform 220ms ease,
            box-shadow 220ms ease;
        }

        .avatarCard.active {
          box-shadow: 0 28px 80px rgba(111, 66, 193, 0.16);
        }

        .avatarGlow {
          position: absolute;
          top: 120px;
          left: 50%;
          width: 310px;
          height: 310px;
          transform: translateX(-50%);
          border-radius: 50%;
          background: rgba(138, 92, 246, 0.12);
          filter: blur(26px);
          pointer-events: none;
        }

        .teacherMeta {
          position: relative;
          z-index: 3;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .teacherRole {
          margin: 0 0 4px;
          color: #6f42c1;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        h2 {
          margin: 0;
          color: #241438;
          font-size: 30px;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .statusPill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 38px;
          padding: 0 13px;
          border-radius: 999px;
          background: #ffffff;
          border: 1px solid rgba(111, 66, 193, 0.11);
          color: #6e627c;
          font-size: 12px;
          font-weight: 850;
          white-space: nowrap;
          box-shadow: 0 9px 24px rgba(49, 30, 83, 0.07);
        }

        .statusDot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #a89eb4;
        }

        .status-speaking .statusDot {
          background: #6f42c1;
          animation: pulse 1.2s infinite;
        }

        .status-listening .statusDot {
          background: #16a34a;
          animation: pulse 1.2s infinite;
        }

        .status-thinking .statusDot {
          background: #d89a00;
          animation: pulse 1.2s infinite;
        }

        .status-completed .statusDot {
          background: #16a34a;
        }

        .avatarStage {
  position: relative;
  flex: 1;
  min-height: 300px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          margin-top: 10px;
        }

        .imageWrap {
  position: relative;
  z-index: 2;
  width: min(100%, 340px);
  height: min(43vh, 360px);
}

        :global(.avatarImage) {
          object-fit: contain;
          object-position: center bottom;
          filter: drop-shadow(0 22px 28px rgba(48, 29, 82, 0.18));
        }

        .decorativeCircle {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(111, 66, 193, 0.11);
          pointer-events: none;
        }

        .circleOne {
          width: 320px;
          height: 320px;
          top: 55px;
          left: 50%;
          transform: translateX(-50%);
        }

        .circleTwo {
          width: 260px;
          height: 260px;
          top: 85px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.25);
        }

        .soundWave {
          position: absolute;
          z-index: 4;
          right: 12px;
          bottom: 80px;
          height: 42px;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 10px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(111, 66, 193, 0.12);
          box-shadow: 0 12px 30px rgba(48, 29, 82, 0.1);
        }

        .soundWave span {
          width: 4px;
          border-radius: 999px;
          background: #6f42c1;
          animation: wave 900ms infinite ease-in-out;
        }

        .soundWave span:nth-child(1) {
          height: 12px;
        }

        .soundWave span:nth-child(2) {
          height: 23px;
          animation-delay: 100ms;
        }

        .soundWave span:nth-child(3) {
          height: 30px;
          animation-delay: 200ms;
        }

        .soundWave span:nth-child(4) {
          height: 20px;
          animation-delay: 300ms;
        }

        .soundWave span:nth-child(5) {
          height: 11px;
          animation-delay: 400ms;
        }

        .listeningRing {
          position: absolute;
          z-index: 1;
          top: 50%;
          left: 50%;
          width: 285px;
          height: 285px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 3px solid rgba(22, 163, 74, 0.35);
          animation: expandRing 1.8s infinite ease-out;
        }

        .speechCard {
          position: relative;
          z-index: 5;
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 13px;
          align-items: flex-start;
          padding: 17px;
          border-radius: 23px;
          background: rgba(255, 255, 255, 0.94);
          border: 1px solid rgba(111, 66, 193, 0.11);
          box-shadow: 0 16px 42px rgba(48, 29, 82, 0.09);
          backdrop-filter: blur(14px);
        }

        .speechIcon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: #f2ebff;
          font-size: 20px;
        }

        .speechLabel {
          margin: 0 0 5px;
          color: #6f42c1;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .speechMessage {
          margin: 0;
          color: #33233f;
          font-size: 16px;
          font-weight: 720;
          line-height: 1.55;
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

        @keyframes wave {
          0%,
          100% {
            transform: scaleY(0.55);
          }

          50% {
            transform: scaleY(1);
          }
        }

        @keyframes expandRing {
          0% {
            transform: translate(-50%, -50%) scale(0.78);
            opacity: 0.75;
          }

          100% {
            transform: translate(-50%, -50%) scale(1.18);
            opacity: 0;
          }
        }

        @media (max-width: 700px) {
          .avatarCard {
            min-height: 530px;
            padding: 20px;
            border-radius: 28px;
          }

          .teacherMeta {
            align-items: center;
          }

          .avatarStage {
            min-height: 330px;
          }

          .imageWrap {
            height: 350px;
          }

          .circleOne {
            width: 270px;
            height: 270px;
          }

          .circleTwo {
            width: 215px;
            height: 215px;
          }
        }

        @media (max-width: 460px) {
          .teacherMeta {
            align-items: flex-start;
            flex-direction: column;
          }

          .statusPill {
            align-self: flex-start;
          }

          .avatarCard {
            min-height: 500px;
          }

          .imageWrap {
            width: 290px;
            height: 320px;
          }

          .speechMessage {
            font-size: 15px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .statusDot,
          .soundWave span,
          .listeningRing {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}