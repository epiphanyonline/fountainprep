"use client";

import type {
  LearnerProfile,
  Lesson,
  LessonProgress,
} from "../types/classroom";

type LessonHeaderProps = {
  learner: LearnerProfile;
  lesson: Lesson;
  progress: LessonProgress;
};

export default function LessonHeader({
  learner,
  lesson,
  progress,
}: LessonHeaderProps) {
  const safePercent = Math.min(100, Math.max(0, progress.percent));

  return (
    <header className="lessonHeader">
      <div className="lessonIdentity">
        <div className="brandMark" aria-hidden="true">
          F
        </div>

        <div>
          <p className="eyebrow">Ayo Classroom</p>
          <h1>{lesson.title}</h1>

          <div className="lessonMeta" aria-label="Lesson details">
            <span>{lesson.programme}</span>
            <span aria-hidden="true">•</span>
            <span>{lesson.stage}</span>
            <span aria-hidden="true">•</span>
            <span>Lesson {lesson.lessonNumber}</span>
            <span aria-hidden="true">•</span>
            <span>{lesson.estimatedMinutes} minutes</span>
          </div>
        </div>
      </div>

      <div className="headerSummary">
        <div className="learnerSummary">
          <span className="learnerLabel">Learning with</span>
          <strong>{learner.firstName}</strong>
        </div>

        <div className="xpBadge" aria-label={`${lesson.reward.xp} experience points`}>
          <span aria-hidden="true">⭐</span>
          <strong>+{lesson.reward.xp} XP</strong>
        </div>
      </div>

      <div className="progressArea">
        <div className="progressLabels">
          <span>
            Step {Math.min(progress.currentSlide + 1, progress.totalSlides)} of{" "}
            {progress.totalSlides}
          </span>

          <strong>{Math.round(safePercent)}%</strong>
        </div>

        <div
          className="progressTrack"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(safePercent)}
          aria-label="Lesson progress"
        >
          <div
            className="progressFill"
            style={{ width: `${safePercent}%` }}
          />
        </div>
      </div>

      <style jsx>{`
        .lessonHeader {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 22px 30px;
          padding: 24px 26px;
          border: 1px solid rgba(111, 66, 193, 0.12);
          border-radius: 28px;
          background:
            radial-gradient(
              circle at top right,
              rgba(138, 92, 246, 0.13),
              transparent 34%
            ),
            rgba(255, 255, 255, 0.94);
          box-shadow: 0 20px 60px rgba(45, 28, 77, 0.08);
          backdrop-filter: blur(16px);
        }

        .lessonIdentity {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          min-width: 0;
        }

        .brandMark {
          flex: 0 0 auto;
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border-radius: 18px;
          color: #ffffff;
          background: linear-gradient(135deg, #6f42c1, #8a5cf6);
          box-shadow: 0 14px 32px rgba(111, 66, 193, 0.22);
          font-size: 22px;
          font-weight: 950;
        }

        .eyebrow {
          margin: 0 0 6px;
          color: #6f42c1;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        h1 {
          margin: 0;
          color: #241438;
          font-size: clamp(24px, 3vw, 38px);
          line-height: 1.04;
          letter-spacing: -0.04em;
        }

        .lessonMeta {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 10px;
          color: #756985;
          font-size: 14px;
          font-weight: 750;
        }

        .headerSummary {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          flex-wrap: wrap;
        }

        .learnerSummary {
          min-width: 130px;
          padding: 12px 15px;
          border-radius: 18px;
          background: #faf7ff;
          border: 1px solid rgba(111, 66, 193, 0.1);
        }

        .learnerLabel {
          display: block;
          margin-bottom: 3px;
          color: #80748e;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .learnerSummary strong {
          color: #241438;
          font-size: 15px;
        }

        .xpBadge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 46px;
          padding: 0 15px;
          border-radius: 999px;
          color: #5a3b00;
          background: linear-gradient(135deg, #fff6cf, #ffe89a);
          border: 1px solid rgba(191, 139, 0, 0.16);
          box-shadow: 0 12px 28px rgba(191, 139, 0, 0.1);
        }

        .xpBadge strong {
          font-size: 14px;
          font-weight: 950;
        }

        .progressArea {
          grid-column: 1 / -1;
        }

        .progressLabels {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 9px;
          color: #756985;
          font-size: 13px;
          font-weight: 800;
        }

        .progressLabels strong {
          color: #6f42c1;
        }

        .progressTrack {
          height: 10px;
          overflow: hidden;
          border-radius: 999px;
          background: #eee7f8;
        }

        .progressFill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #6f42c1, #9a6df5);
          box-shadow: 0 0 18px rgba(111, 66, 193, 0.2);
          transition: width 300ms ease;
        }

        @media (max-width: 780px) {
          .lessonHeader {
            grid-template-columns: 1fr;
            padding: 20px;
            border-radius: 24px;
          }

          .headerSummary {
            justify-content: flex-start;
          }

          .lessonMeta {
            line-height: 1.5;
          }
        }

        @media (max-width: 520px) {
          .lessonIdentity {
            align-items: center;
          }

          .brandMark {
            width: 46px;
            height: 46px;
            border-radius: 15px;
          }

          .learnerSummary {
            flex: 1 1 150px;
          }

          .xpBadge {
            flex: 1 1 auto;
            justify-content: center;
          }
        }
      `}</style>
    </header>
  );
}