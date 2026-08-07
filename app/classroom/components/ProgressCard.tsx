"use client";

import type {
  LearnerProfile,
  Lesson,
  LessonProgress,
} from "../types/classroom";

type ProgressMetric = {
  label: string;
  value: number;
  description: string;
};

type ProgressCardProps = {
  learner: LearnerProfile;
  lesson: Lesson;
  progress: LessonProgress;
  metrics?: ProgressMetric[];
};

const defaultMetrics: ProgressMetric[] = [
  {
    label: "Confidence",
    value: 58,
    description: "Growing steadily",
  },
  {
    label: "Listening",
    value: 72,
    description: "Strong understanding",
  },
  {
    label: "Pronunciation",
    value: 64,
    description: "Improving with practice",
  },
];

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, value));
}

function getProgressMessage(percent: number) {
  if (percent >= 100) return "Lesson completed";
  if (percent >= 75) return "Almost there";
  if (percent >= 45) return "Great progress";
  if (percent > 0) return "A strong start";
  return "Ready to begin";
}

export default function ProgressCard({
  learner,
  lesson,
  progress,
  metrics = defaultMetrics,
}: ProgressCardProps) {
  const safePercent = clampPercent(progress.percent);
  const safeConfidence = clampPercent(learner.confidence);

  return (
    <aside className="progressCard" aria-label="Learning progress">
      <div className="cardHeader">
        <div>
          <p className="eyebrow">Your progress</p>
          <h2>Learning journey</h2>
        </div>

        <div className="xpPill">
          <span aria-hidden="true">⭐</span>
          <strong>{lesson.reward.xp} XP</strong>
        </div>
      </div>

      <section className="lessonProgress">
        <div className="progressTopline">
          <div>
            <span className="sectionLabel">Current lesson</span>
            <strong>{getProgressMessage(safePercent)}</strong>
          </div>

          <span className="percentValue">{Math.round(safePercent)}%</span>
        </div>

        <div
          className="largeProgressTrack"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(safePercent)}
          aria-label="Current lesson progress"
        >
          <div
            className="largeProgressFill"
            style={{ width: `${safePercent}%` }}
          />
        </div>

        <div className="stepSummary">
          <span>
            Step {Math.min(progress.currentSlide + 1, progress.totalSlides)}
          </span>
          <span>{progress.totalSlides} total steps</span>
        </div>
      </section>

      <section className="confidencePanel">
        <div className="confidenceIcon" aria-hidden="true">
          🌱
        </div>

        <div className="confidenceCopy">
          <span className="sectionLabel">Learning confidence</span>
          <strong>{Math.round(safeConfidence)}%</strong>
          <p>
            {safeConfidence >= 75
              ? `${learner.firstName} is learning with strong confidence.`
              : safeConfidence >= 50
                ? `${learner.firstName} is becoming more confident with each activity.`
                : `${learner.firstName} is building confidence one step at a time.`}
          </p>
        </div>
      </section>

      <section className="metricSection">
        <div className="sectionHeading">
          <div>
            <span className="sectionLabel">Skills snapshot</span>
            <h3>Today’s learning signals</h3>
          </div>
        </div>

        <div className="metricList">
          {metrics.map((metric) => {
            const safeValue = clampPercent(metric.value);

            return (
              <div className="metricItem" key={metric.label}>
                <div className="metricTopline">
                  <div>
                    <strong>{metric.label}</strong>
                    <span>{metric.description}</span>
                  </div>

                  <b>{Math.round(safeValue)}%</b>
                </div>

                <div
                  className="metricTrack"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(safeValue)}
                  aria-label={`${metric.label} progress`}
                >
                  <div
                    className="metricFill"
                    style={{ width: `${safeValue}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rewardPanel">
        <div className="rewardIcon" aria-hidden="true">
          🏆
        </div>

        <div>
          <span className="sectionLabel">Lesson reward</span>
          <strong>
            {lesson.reward.badge || `${lesson.reward.xp} XP reward`}
          </strong>

          <p>
            Complete this lesson to add the reward to your learning profile.
          </p>
        </div>
      </section>

      <style jsx>{`
        .progressCard {
          display: flex;
          flex-direction: column;
          gap: 18px;
          min-height: 620px;
          padding: 24px;
          border-radius: 34px;
          border: 1px solid rgba(111, 66, 193, 0.13);
          background:
            radial-gradient(
              circle at top right,
              rgba(255, 224, 138, 0.18),
              transparent 30%
            ),
            linear-gradient(180deg, #ffffff, #fbf8ff);
          box-shadow: 0 24px 70px rgba(48, 29, 82, 0.1);
        }

        .cardHeader,
        .progressTopline,
        .metricTopline {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
        }

        .eyebrow,
        .sectionLabel {
          display: block;
          margin: 0 0 5px;
          color: #6f42c1;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        h2,
        h3 {
          margin: 0;
          color: #241438;
          letter-spacing: -0.04em;
        }

        h2 {
          font-size: 28px;
          line-height: 1;
        }

        h3 {
          font-size: 20px;
        }

        .xpPill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 40px;
          padding: 0 13px;
          border-radius: 999px;
          color: #654800;
          background: #fff4c3;
          border: 1px solid rgba(155, 111, 0, 0.13);
          font-size: 13px;
          font-weight: 900;
        }

        .lessonProgress,
        .metricSection {
          padding: 19px;
          border-radius: 25px;
          background: rgba(255, 255, 255, 0.88);
          border: 1px solid rgba(111, 66, 193, 0.1);
        }

        .progressTopline strong {
          display: block;
          color: #241438;
          font-size: 17px;
        }

        .percentValue {
          color: #6f42c1;
          font-size: 26px;
          font-weight: 950;
          letter-spacing: -0.04em;
        }

        .largeProgressTrack,
        .metricTrack {
          overflow: hidden;
          border-radius: 999px;
          background: #eee7f8;
        }

        .largeProgressTrack {
          height: 12px;
          margin-top: 17px;
        }

        .largeProgressFill,
        .metricFill {
          height: 100%;
          border-radius: inherit;
          transition: width 300ms ease;
        }

        .largeProgressFill {
          background: linear-gradient(90deg, #6f42c1, #9a6df5);
          box-shadow: 0 0 18px rgba(111, 66, 193, 0.2);
        }

        .stepSummary {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-top: 9px;
          color: #786c84;
          font-size: 12px;
          font-weight: 750;
        }

        .confidencePanel,
        .rewardPanel {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 14px;
          align-items: flex-start;
          padding: 18px;
          border-radius: 25px;
        }

        .confidencePanel {
          background:
            radial-gradient(
              circle at top right,
              rgba(255, 255, 255, 0.2),
              transparent 34%
            ),
            linear-gradient(135deg, #6f42c1, #8a5cf6);
          color: #ffffff;
          box-shadow: 0 17px 40px rgba(111, 66, 193, 0.19);
        }

        .rewardPanel {
          margin-top: auto;
          background: #fffaf0;
          border: 1px solid rgba(174, 124, 0, 0.13);
        }

        .confidenceIcon,
        .rewardIcon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          font-size: 23px;
        }

        .confidenceIcon {
          background: rgba(255, 255, 255, 0.17);
        }

        .rewardIcon {
          background: #ffffff;
        }

        .confidencePanel .sectionLabel {
          color: rgba(255, 255, 255, 0.74);
        }

        .confidenceCopy strong,
        .rewardPanel strong {
          display: block;
          font-size: 22px;
          line-height: 1.1;
        }

        .confidenceCopy p,
        .rewardPanel p {
          margin: 7px 0 0;
          font-size: 13px;
          font-weight: 700;
          line-height: 1.55;
        }

        .confidenceCopy p {
          color: rgba(255, 255, 255, 0.82);
        }

        .rewardPanel strong {
          color: #4f3900;
          font-size: 17px;
        }

        .rewardPanel p {
          color: #7b6a3d;
        }

        .sectionHeading {
          margin-bottom: 17px;
        }

        .metricList {
          display: grid;
          gap: 17px;
        }

        .metricTopline strong {
          display: block;
          color: #241438;
          font-size: 14px;
        }

        .metricTopline span {
          display: block;
          margin-top: 3px;
          color: #81758d;
          font-size: 11px;
          font-weight: 700;
        }

        .metricTopline b {
          color: #6f42c1;
          font-size: 14px;
          font-weight: 950;
        }

        .metricTrack {
          height: 7px;
          margin-top: 9px;
        }

        .metricFill {
          background: linear-gradient(90deg, #8a5cf6, #c2a7ff);
        }

        @media (max-width: 760px) {
          .progressCard {
            min-height: auto;
            padding: 20px;
            border-radius: 28px;
          }

          .rewardPanel {
            margin-top: 0;
          }
        }

        @media (max-width: 460px) {
          .cardHeader {
            flex-direction: column;
          }

          .xpPill {
            align-self: flex-start;
          }

          .confidencePanel,
          .rewardPanel {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .largeProgressFill,
          .metricFill {
            transition: none;
          }
        }
      `}</style>
    </aside>
  );
}