"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { supabase } from "@/app/lib/supabase";
import {
  getAcademySubscriptionAccess,
} from "@/app/fountaintalk/services/subscriptionAccess";

import {
  personalFinanceAcademy,
} from "@/app/data/academies/personal-finance";

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
  const searchParams =
    useSearchParams();

  const checkoutSessionId =
    searchParams.get("session_id");

  const returningFromCheckout =
    searchParams.get("subscription") ===
      "success" &&
    Boolean(checkoutSessionId);

  const engine = useAcademyClassroomEngine({
    studentId,
    academyCode,
    programmeId,
    courseId,
    requestedLessonId: lessonId,
  });

  const [
    accessState,
    setAccessState,
  ] = useState<
    | "checking"
    | "allowed"
    | "blocked"
    | "error"
  >(
    academyCode === "personal-finance"
      ? "checking"
      : "allowed",
  );

  const [
    accessMessage,
    setAccessMessage,
  ] = useState<string | null>(null);

  useEffect(() => {
    if (
      academyCode !==
      "personal-finance"
    ) {
      setAccessState("allowed");
      setAccessMessage(null);
      return;
    }

    let cancelled = false;

    async function reconcileCheckoutIfNeeded() {
      if (
        !returningFromCheckout ||
        !checkoutSessionId
      ) {
        return;
      }

      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error(
          "Please sign in again so we can confirm your payment.",
        );
      }

      /*
       * Stripe webhooks remain the long-term source of truth,
       * but the browser return also reconciles the completed
       * Checkout session. This removes webhook timing races
       * and makes localhost/test-mode checkout reliable.
       */
      for (
        let attempt = 0;
        attempt < 6;
        attempt += 1
      ) {
        const response =
          await fetch(
            "/api/stripe/academy-subscription-confirm",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization:
                  `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({
                sessionId:
                  checkoutSessionId,
              }),
            },
          );

        const result =
          (await response.json()) as {
            confirmed?: boolean;
            pending?: boolean;
            error?: string;
          };

        if (
          response.ok &&
          result.confirmed
        ) {
          return;
        }

        if (
          response.status === 202 ||
          result.pending
        ) {
          await new Promise(
            (resolve) =>
              window.setTimeout(
                resolve,
                900,
              ),
          );
          continue;
        }

        throw new Error(
          result.error ??
            "We could not confirm the completed Stripe checkout.",
        );
      }

      throw new Error(
        "Your payment was received, but access is still being activated. Please refresh in a moment.",
      );
    }

    async function checkPaidAccess() {
      try {
        setAccessState("checking");
        setAccessMessage(null);

        await reconcileCheckoutIfNeeded();

        if (cancelled) {
          return;
        }

        const access =
          await getAcademySubscriptionAccess(
            studentId,
          );

        if (cancelled) {
          return;
        }

        const activePaidAccess =
          access.learnerCovered &&
          ["active", "trialing"].includes(
            access.status,
          ) &&
          access.plan.accessTier !==
            "free";

        if (activePaidAccess) {
          setAccessState("allowed");

          /*
           * Remove Stripe return parameters once access has
           * been confirmed so refreshes do not re-run the
           * reconciliation unnecessarily.
           */
          if (
            returningFromCheckout
          ) {
            const clean =
              new URL(
                window.location.href,
              );

            clean.searchParams.delete(
              "subscription",
            );
            clean.searchParams.delete(
              "session_id",
            );

            window.history.replaceState(
              {},
              "",
              clean.pathname +
                clean.search,
            );
          }

          return;
        }

        setAccessState("blocked");

        const params =
          new URLSearchParams({
            product: "academies",
            studentId,
            academy:
              "personal-finance",
            programme:
              programmeId ||
              "money-foundation",
          });

        window.location.replace(
          `/pricing?${params.toString()}`,
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Unable to verify Financial Literacy access:",
          error,
        );

        setAccessState("error");
        setAccessMessage(
          error instanceof Error
            ? error.message
            : "Unable to verify your Academy access.",
        );
      }
    }

    void checkPaidAccess();

    return () => {
      cancelled = true;
    };
  }, [
    academyCode,
    studentId,
    programmeId,
    returningFromCheckout,
    checkoutSessionId,
  ]);

  const financialProgramme =
  academyCode === "personal-finance"
    ? personalFinanceAcademy.programmes.find(
        (item) => item.id === "money-foundation",
      ) ?? null
    : null;

const currentFinancialCourseIndex =
  financialProgramme
    ? financialProgramme.courses.findIndex(
        (course) => course.id === engine.course.id,
      )
    : -1;

const nextFinancialCourse =
  financialProgramme &&
  currentFinancialCourseIndex >= 0
    ? financialProgramme.courses[
        currentFinancialCourseIndex + 1
      ] ?? null
    : null;

const isFinalFinancialCourseComplete =
  academyCode === "personal-finance" &&
  engine.status === "completed" &&
  Boolean(financialProgramme) &&
  currentFinancialCourseIndex >= 0 &&
  !nextFinancialCourse;

useEffect(() => {
  if (!isFinalFinancialCourseComplete) {
    return;
  }

  let cancelled = false;

  async function checkGraduation() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token || cancelled) {
        return;
      }

      const response = await fetch(
        "/api/academy/financial-literacy/graduation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            studentId,
          }),
        },
      );

      const result = (await response.json()) as {
        graduated?: boolean;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Unable to evaluate graduation.",
        );
      }

      if (
        result.graduated &&
        !cancelled
      ) {
        window.location.href =
          `/academies/financial-literacy/graduation?learner=${encodeURIComponent(
            studentId,
          )}`;
      }
    } catch (error) {
      console.error(
        "Graduation check failed:",
        error,
      );
    }
  }

  void checkGraduation();

  return () => {
    cancelled = true;
  };
}, [
  isFinalFinancialCourseComplete,
  studentId,
]);

  if (
    academyCode ===
      "personal-finance" &&
    accessState === "checking"
  ) {
    return (
      <main className="loadingPage">
        <div
          style={{
            textAlign: "center",
            maxWidth: "620px",
          }}
        >
          <strong>
            Confirming your Financial
            Literacy access...
          </strong>
          <p>
            We’re checking that this learner
            has an active Academy subscription.
          </p>
        </div>
      </main>
    );
  }

  if (
    academyCode ===
      "personal-finance" &&
    accessState === "blocked"
  ) {
    return (
      <main className="loadingPage">
        <div
          style={{
            textAlign: "center",
            maxWidth: "620px",
          }}
        >
          <strong>
            Subscription required
          </strong>
          <p>
            Redirecting you to the Financial
            Education plans...
          </p>
        </div>
      </main>
    );
  }

  if (
    academyCode ===
      "personal-finance" &&
    accessState === "error"
  ) {
    return (
      <main className="loadingPage">
        <div
          style={{
            textAlign: "center",
            maxWidth: "620px",
          }}
        >
          <h1>
            Unable to verify access
          </h1>
          <p>
            {accessMessage ??
              "Please return to Financial Education and try again."}
          </p>

          <Link
            href="/financial-education"
            style={{
              marginTop: "18px",
              minHeight: "48px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 20px",
              borderRadius: "16px",
              background: "#7c3aed",
              color: "#ffffff",
              textDecoration: "none",
              fontWeight: 900,
            }}
          >
            Financial Education
          </Link>
        </div>
      </main>
    );
  }

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

  if (
    academyCode === "personal-finance" &&
    engine.status === "completed" &&
    nextFinancialCourse
  ) {
    const nextCourseHref =
      "/classroom/academy?" +
      new URLSearchParams({
        studentId,
        academy: "personal-finance",
        programme:
          financialProgramme?.id ??
          engine.programme.id,
        course: nextFinancialCourse.id,
      }).toString();

    return (
      <main className="loadingPage">
        <div
          style={{
            width: "min(780px, calc(100% - 32px))",
            padding: "clamp(32px, 6vw, 56px)",
            borderRadius: "34px",
            background: "#ffffff",
            border: "1px solid #eee5f8",
            boxShadow:
              "0 28px 90px rgba(48, 29, 82, 0.12)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: "0 0 12px",
              color: "#6f42c1",
              fontSize: "11px",
              fontWeight: 950,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Stage complete
          </p>

          <h1
            style={{
              margin: "0 0 16px",
              fontSize: "clamp(34px, 6vw, 56px)",
              lineHeight: 1,
              letterSpacing: "-0.05em",
            }}
          >
            Excellent progress, {learnerName}.
          </h1>

          <p
            style={{
              maxWidth: "620px",
              margin: "0 auto",
              color: "#756985",
              fontSize: "17px",
              lineHeight: 1.7,
            }}
          >
            You have completed{" "}
            <strong>{engine.course.title}</strong>.
            Your Financial Literacy journey continues
            into the next stage.
          </p>

          <div
            style={{
              marginTop: "28px",
              padding: "24px",
              borderRadius: "24px",
              background: "#faf7ff",
              border: "1px solid #e9def5",
              textAlign: "left",
            }}
          >
            <span
              style={{
                color: "#6f42c1",
                fontSize: "11px",
                fontWeight: 950,
                letterSpacing: "0.1em",
              }}
            >
              UP NEXT
            </span>

            <h2
              style={{
                margin: "8px 0",
                fontSize: "clamp(26px, 4vw, 38px)",
              }}
            >
              {nextFinancialCourse.title}
            </h2>

            <p
              style={{
                margin: 0,
                color: "#756985",
                lineHeight: 1.6,
              }}
            >
              {nextFinancialCourse.description}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "26px",
            }}
          >
            <Link
              href={nextCourseHref}
              style={{
                minHeight: "52px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 24px",
                borderRadius: "16px",
                color: "#ffffff",
                background:
                  "linear-gradient(135deg, #6f42c1, #8a5cf6)",
                textDecoration: "none",
                fontWeight: 900,
              }}
            >
              Continue learning →
            </Link>

            <Link
              href="/academies/financial-literacy"
              style={{
                minHeight: "52px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 24px",
                borderRadius: "16px",
                color: "#5f4378",
                background: "#faf7ff",
                border: "1px solid #e7def2",
                textDecoration: "none",
                fontWeight: 900,
              }}
            >
              Return to Academy
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (isFinalFinancialCourseComplete) {
    return (
      <main className="loadingPage">
        <div style={{ textAlign: "center" }}>
          <strong>
            Checking your graduation record...
          </strong>

          <p>
            FountainPrep is confirming completion
            of the full Financial Literacy pathway.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="academyPage">
      <div className="shell">
        <header className="topbar">
          <Link
            href={
              academyCode ===
              "personal-finance"
                ? "/financial-education"
                : "/subjects"
            }
            className="exit"
          >
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
            academyCode={academyCode}
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
