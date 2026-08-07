"use client";

import Link from "next/link";

import type {
  AcademyCode,
} from "@/features/academy-content";

import AyoAvatar from "../components/AyoAvatar";
import ActivityRenderer from "./ActivityRenderer";
import { useAcademyClassroomEngine } from "./useAcademyClassroomEngine";

type Props = {
  studentId: string;
  learnerName: string;
  academyCode: AcademyCode;
  programmeId?: string | null;
  courseId?: string | null;
  lessonId?: string | null;
};

export default function UniversalAcademyClassroom({
  studentId,
  learnerName,
  academyCode,
  programmeId,
  courseId,
  lessonId,
}: Props) {
  const engine = useAcademyClassroomEngine({
    studentId,
    academyCode,
    programmeId,
    courseId,
    requestedLessonId: lessonId,
  });

  if (engine.status === "loading") {
    return (
      <main className="loadingPage">
        <div>Preparing your academy lesson...</div>
      </main>
    );
  }

  if (engine.status === "error") {
    return (
      <main className="loadingPage">
        <div>
          <h1>Unable to load the classroom</h1>
          <p>{engine.errorMessage}</p>
        </div>
      </main>
    );
  }

  const { state } = engine;
  const busy = engine.status === "checking";

  return (
    <main className="academyPage">
      <div className="shell">
        <header className="topbar">
          <Link href="/subjects" className="exit">
            ← Exit lesson
          </Link>

          <div className="brand">
            <strong>FountainPrep</strong>
            <span>{engine.academy.title}</span>
          </div>

          <div className="streak">
            🔥 {state.streak} day
            {state.streak === 1 ? "" : "s"}
          </div>
        </header>

        <section className="lessonHeader">
          <div>
            <p>
              {engine.programme.title} · Lesson{" "}
              {state.lessonIndex + 1} of{" "}
              {state.totalLessons}
            </p>
            <h1>{state.lesson.title}</h1>
            <span>
              Learning as {learnerName}
            </span>
          </div>

          <div className="stats">
            <b>{state.points} XP</b>
            <b>{state.coursePercent}% course</b>
          </div>
        </section>

        <div className="progressTrack">
          <div
            style={{
              width: `${state.lessonPercent}%`,
            }}
          />
        </div>

        <section className="classroomGrid">
          <AyoAvatar
            status={
              busy ? "thinking" : "ready"
            }
            personality="mentor"
            message={
              engine.feedback ||
              state.activity.teacherPrompt
            }
            teacherName="Ayo"
            imageSrc="/images/ayo/ayo-teacher.png"
          />

          <ActivityRenderer
            key={state.activity.id}
            activity={state.activity}
            feedback={engine.feedback}
            busy={busy}
            onSubmit={engine.submitAnswer}
          />

          <aside className="progressCard">
            <p className="eyebrow">
              Your progress
            </p>
            <h2>
              Activity {state.activityIndex + 1} of{" "}
              {state.totalActivities}
            </h2>

            <div className="metric">
              <span>Lesson</span>
              <strong>
                {state.lessonPercent}%
              </strong>
            </div>

            <div className="metric">
              <span>Course</span>
              <strong>
                {state.coursePercent}%
              </strong>
            </div>

            <div className="metric">
              <span>Completed lessons</span>
              <strong>
                {state.completedLessonIds.length}
              </strong>
            </div>

            <div className="objective">
              <span>Objective</span>
              <p>{state.lesson.objective}</p>
            </div>
          </aside>
        </section>

        <nav className="controls">
          <button
            type="button"
            onClick={engine.goBack}
            disabled={!engine.canGoBack || busy}
          >
            ← Back
          </button>

          <div>
            {engine.feedback
              ? "Feedback received"
              : "Complete the activity when required"}
          </div>

          <button
            type="button"
            className="continue"
            onClick={engine.continueActivity}
            disabled={busy}
          >
            {state.activityIndex ===
            state.totalActivities - 1
              ? "Complete lesson"
              : "Continue"}{" "}
            →
          </button>
        </nav>
      </div>

      <style jsx>{`
        .academyPage,
        .loadingPage {
          min-height: 100vh;
          padding: 18px 18px 118px;
          color: #241438;
          background:
            radial-gradient(
              circle at top right,
              rgba(138, 92, 246, 0.13),
              transparent 28%
            ),
            linear-gradient(180deg, #fff, #f6f0ff);
        }

        .loadingPage {
          display: grid;
          place-items: center;
          font-size: 20px;
          font-weight: 800;
        }

        .shell {
          width: min(1600px, 100%);
          margin: 0 auto;
        }

        .topbar {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 18px;
        }

        .exit,
        .streak {
          width: fit-content;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          padding: 0 16px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 900;
        }

        .exit {
          color: #5f4378;
          background: white;
          border: 1px solid #eadff7;
        }

        .streak {
          justify-self: end;
          color: #724600;
          background: #fff5cf;
        }

        .brand {
          text-align: center;
        }

        .brand strong,
        .brand span {
          display: block;
        }

        .brand span {
          color: #6f42c1;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .lessonHeader {
          display: flex;
          justify-content: space-between;
          gap: 24px;
          margin-top: 16px;
          padding: 22px 26px;
          border-radius: 28px;
          background: white;
          border: 1px solid #eee5f8;
        }

        .lessonHeader p {
          margin: 0;
          color: #6f42c1;
          font-weight: 900;
        }

        .lessonHeader h1 {
          margin: 7px 0;
          font-size: clamp(28px, 4vw, 42px);
          letter-spacing: -0.04em;
        }

        .lessonHeader span {
          color: #756985;
          font-weight: 700;
        }

        .stats {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }

        .stats b {
          padding: 10px 13px;
          border-radius: 999px;
          color: #6f42c1;
          background: #f5efff;
        }

        .progressTrack {
          height: 8px;
          margin-top: 12px;
          overflow: hidden;
          border-radius: 999px;
          background: #e9e1f3;
        }

        .progressTrack div {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #6f42c1, #9a6df5);
        }

        .classroomGrid {
          display: grid;
          grid-template-columns:
            minmax(260px, 0.72fr)
            minmax(440px, 1.35fr)
            minmax(270px, 0.75fr);
          gap: 18px;
          margin-top: 18px;
        }

        .progressCard {
          padding: 24px;
          border-radius: 30px;
          background: white;
          border: 1px solid #eee5f8;
          box-shadow: 0 24px 70px rgba(48, 29, 82, 0.08);
        }

        .eyebrow {
          color: #6f42c1;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .progressCard h2 {
          margin: 8px 0 24px;
        }

        .metric {
          display: flex;
          justify-content: space-between;
          padding: 14px 0;
          border-bottom: 1px solid #eee8f5;
        }

        .metric span {
          color: #776b82;
          font-weight: 700;
        }

        .objective {
          margin-top: 24px;
          padding: 17px;
          border-radius: 18px;
          background: #faf7ff;
        }

        .objective span {
          color: #6f42c1;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .objective p {
          margin-bottom: 0;
          line-height: 1.55;
        }

        .controls {
          position: fixed;
          left: 50%;
          bottom: 16px;
          transform: translateX(-50%);
          z-index: 40;
          width: min(1180px, calc(100% - 24px));
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
          padding: 13px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid #e9def5;
          box-shadow: 0 22px 60px rgba(48, 29, 82, 0.16);
        }

        .controls button {
          min-height: 50px;
          padding: 0 18px;
          border-radius: 16px;
          border: 1px solid #e7def2;
          color: #5f4378;
          background: #faf7ff;
          font: inherit;
          font-weight: 900;
          cursor: pointer;
        }

        .controls .continue {
          justify-self: end;
          color: white;
          background: linear-gradient(135deg, #6f42c1, #8a5cf6);
          border: 0;
        }

        .controls div {
          color: #776b82;
          font-size: 13px;
          font-weight: 700;
          text-align: center;
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 1180px) {
          .classroomGrid {
            grid-template-columns: 1fr 1.35fr;
          }

          .progressCard {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 800px) {
          .classroomGrid {
            grid-template-columns: 1fr;
          }

          .progressCard {
            grid-column: auto;
          }

          .brand {
            display: none;
          }

          .topbar {
            grid-template-columns: 1fr auto;
          }

          .lessonHeader {
            flex-direction: column;
          }

          .controls {
            grid-template-columns: 1fr 1fr;
          }

          .controls div {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
