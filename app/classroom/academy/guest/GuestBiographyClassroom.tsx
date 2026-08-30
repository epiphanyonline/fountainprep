"use client";

import {
  useEffect,
  useState,
} from "react";
import Link from "next/link";

import type {
  AcademyCode,
} from "@/features/academy-content";

import AyoAvatar from "../../components/AyoAvatar";
import ActivityRenderer from "../ActivityRenderer";

import {
  useGuestAcademyClassroomEngine,
} from "../useGuestAcademyClassroomEngine";

type Props = {
  academyCode: AcademyCode;
  programmeId: string;
  lessonId: string;
  experienceId: string;
  biographyTitle: string;
};

type AccessState =
  | "checking"
  | "allowed"
  | "locked"
  | "error";

export default function GuestBiographyClassroom({
  academyCode,
  programmeId,
  lessonId,
  experienceId,
  biographyTitle,
}: Props) {
  const [
    accessState,
    setAccessState,
  ] = useState<AccessState>(
    "checking",
  );

  const [
    accessError,
    setAccessError,
  ] = useState("");

  const [
    completedResult,
    setCompletedResult,
  ] = useState<{
    foundationLocked?: boolean;
    remaining?: number;
  } | null>(null);

  const engine =
    useGuestAcademyClassroomEngine({
      academyCode,
      programmeId,
      lessonId,
      experienceId,
    });

  useEffect(() => {
    let cancelled = false;

    async function checkAccess() {
      try {
        const {
          getAcademyGuestKey,
        } = await import(
          "@/app/lib/academyGuest"
        );

        const guestKey =
          getAcademyGuestKey();

        const response =
          await fetch(
            "/api/academy/foundation-access",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                academy:
                  academyCode,

                action:
                  "check",

                guestKey,

                experienceId,
              }),
            },
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ??
              "Unable to check complimentary access.",
          );
        }

        if (cancelled) {
          return;
        }

        if (!result.allowed) {
          setAccessState(
            "locked",
          );

          return;
        }

        setAccessState(
          "allowed",
        );
      } catch (error) {
        if (!cancelled) {
          setAccessError(
            error instanceof Error
              ? error.message
              : "Unable to open this experience.",
          );

          setAccessState(
            "error",
          );
        }
      }
    }

    void checkAccess();

    return () => {
      cancelled = true;
    };
  }, [
    academyCode,
    experienceId,
  ]);

  async function continueActivity() {
    const result =
      await engine.goNext();

    if (
      result.lessonCompleted &&
      result.accessResult
    ) {
      setCompletedResult(
        result.accessResult,
      );
    }
  }

  if (
    accessState ===
    "checking"
  ) {
    return (
      <main className="guestStatePage">
        <div>
          Preparing your complimentary
          AYO masterclass...
        </div>

        <StateStyles />
      </main>
    );
  }

  if (
    accessState === "error"
  ) {
    return (
      <main className="guestStatePage">
        <section className="stateCard">
          <span>
            BIOGRAPHY OF GREATNESS
          </span>

          <h1>
            Unable to open the
            classroom
          </h1>

          <p>
            {accessError}
          </p>

          <Link
            href="/academies/biography"
          >
            Return to Biography
          </Link>
        </section>

        <StateStyles />
      </main>
    );
  }

  if (
    accessState === "locked"
  ) {
    return (
      <SubscriptionGate
        biographyTitle={
          biographyTitle
        }
      />
    );
  }

  /*
   * The second complimentary biography
   * has just finished.
   *
   * Do NOT let the guest restart it.
   * Conversion happens immediately.
   */
  if (
    completedResult
      ?.foundationLocked
  ) {
    return (
      <SubscriptionGate
        biographyTitle={
          biographyTitle
        }
        completedTrial
      />
    );
  }

  /*
   * First complimentary biography
   * completed.
   *
   * We deliberately direct them to
   * Buffett rather than forcing signup.
   */
  if (
    completedResult &&
    !completedResult
      .foundationLocked
  ) {
    return (
      <main className="guestStatePage">
        <section className="stateCard completed">
          <span>
            COMPLIMENTARY EXPERIENCE
          </span>

          <h1>
            First journey complete.
          </h1>

          <p>
            You have one complimentary
            Foundation experience remaining.
            Continue with Warren Buffett to
            explore a completely different
            route to ownership and capital.
          </p>

          <div className="stateActions">
            <Link
              href={
                "/classroom/academy/guest" +
                "?academy=biography" +
                "&programme=greatness-foundation" +
                "&biographyId=warren-buffett"
              }
              className="primary"
            >
              Continue to Warren Buffett
              →
            </Link>

            <Link
              href="/academies/biography"
              className="secondary"
            >
              Exit for now
            </Link>
          </div>
        </section>

        <StateStyles />
      </main>
    );
  }

  if (
    engine.status === "error"
  ) {
    return (
      <main className="guestStatePage">
        <section className="stateCard">
          <h1>
            Unable to continue
          </h1>

          <p>
            {engine.errorMessage}
          </p>
        </section>

        <StateStyles />
      </main>
    );
  }

  const { state } = engine;

  const busy =
    engine.status ===
    "checking";

  const isDangote =
    experienceId ===
    "aliko-dangote";

  const isBuffett =
    experienceId ===
    "warren-buffett";

  const nearEndOfBuffett =
    isBuffett &&
    state.activityIndex >=
      Math.max(
        state.totalActivities -
          2,
        0,
      );

  return (
    <main className="academyPage">
      <div className="shell">
        <header className="topbar">
          <Link
            href="/academies/biography"
            className="exit"
          >
            ← Exit lesson
          </Link>

          <div className="brand">
            <strong>
              FountainPrep
            </strong>

            <span>
              {state.academy.title}
            </span>
          </div>

          <div className="complimentary">
            {isDangote
              ? "COMPLIMENTARY · 1 OF 2"
              : isBuffett
                ? "COMPLIMENTARY · 2 OF 2"
                : "COMPLIMENTARY"}
          </div>
        </header>

        <section className="lessonHeader">
          <div>
            <p>
              {state.programme.title}
            </p>

            <h1>
              {state.lesson.title}
            </h1>

            <span>
              Learning with AYO ·
              No account required
            </span>
          </div>

          <div className="stats">
            <b>
              {isDangote
                ? "Foundation Experience 1 of 2"
                : isBuffett
                  ? "Foundation Experience 2 of 2"
                  : "Foundation Experience"}
            </b>

            <b>
              {state.progressPercent}%
            </b>
          </div>
        </section>

        <div className="progressTrack">
          <div
            style={{
              width:
                `${state.progressPercent}%`,
            }}
          />
        </div>

        <section className="classroomGrid">
          <AyoAvatar
            status={
              busy
                ? "thinking"
                : "ready"
            }
            personality="mentor"
            message={
              engine.feedback ||
              state.activity
                .teacherPrompt
            }
            teacherName="Ayo"
            imageSrc="/images/ayo/ayo-teacher.png"
          />

          <ActivityRenderer
            key={
              state.activity.id
            }
            academyCode={
              academyCode
            }
            activity={
              state.activity
            }
            feedback={
              engine.feedback
            }
            busy={busy}
            onSubmit={
              engine.checkAnswer
            }
          />

          <aside className="progressCard">
            <p className="eyebrow">
              Your experience
            </p>

            <h2>
              Activity{" "}
              {state.activityIndex +
                1}{" "}
              of{" "}
              {state.totalActivities}
            </h2>

            <div className="metric">
              <span>
                Lesson
              </span>

              <strong>
                {
                  state.progressPercent
                }
                %
              </strong>
            </div>

            <div className="metric">
              <span>
                Access
              </span>

              <strong>
                Complimentary
              </strong>
            </div>

            <div className="objective">
              <span>
                Objective
              </span>

              <p>
                {
                  state.lesson
                    .objective
                }
              </p>
            </div>
          </aside>
        </section>

        {nearEndOfBuffett ? (
          <div className="guestJourneyNotice">
            <span>
              YOUR COMPLIMENTARY JOURNEY
            </span>

            <strong>
              You&apos;re completing your second
              complimentary experience.
            </strong>

            <p>
              After this lesson, create your
              FountainPrep account to continue
              exploring Biography of Greatness.
            </p>
          </div>
        ) : null}

        <nav className="controls">
          <button
            type="button"
            onClick={
              engine.goPrevious
            }
            disabled={
              engine.isFirstActivity ||
              busy
            }
          >
            ← Back
          </button>

          <div>
            {engine.feedback
              ? "Feedback received"
              : isDangote
                ? "Complimentary experience 1 of 2 · No account required"
                : isBuffett
                  ? "Complimentary experience 2 of 2 · Account required afterwards"
                  : "Experience FountainPrep before creating an account"}
          </div>

          <button
            type="button"
            className="continue"
            onClick={() =>
              void continueActivity()
            }
            disabled={busy}
          >
            {engine.isLastActivity
              ? "Complete experience"
              : "Continue"}{" "}
            →
          </button>
        </nav>
      </div>

      <ClassroomStyles />
    </main>
  );
}

function SubscriptionGate({
  biographyTitle,
  completedTrial = false,
}: {
  biographyTitle: string;
  completedTrial?: boolean;
}) {
  const next =
    encodeURIComponent(
      "/academies/biography/start",
    );

  return (
    <main className="gatePage">
      <section className="gateCard">
        <span className="gateEyebrow">
          BIOGRAPHY OF GREATNESS
        </span>

        <h1>
          {completedTrial
            ? "Your complimentary Foundation journey is complete."
            : "Continue the global journey."}
        </h1>

        <p>
          {completedTrial
            ? `You've now completed ${biographyTitle} and your two complimentary Foundation experiences are exhausted.`
            : "This experience is part of the full Biography of Greatness library."}
        </p>

        <div className="journeySummary">
          <div>
            <small>
              EXPERIENCE 01
            </small>

            <strong>
              Aliko Dangote
            </strong>

            <span>
              Trading → manufacturing
              → industrial ownership
            </span>
          </div>

          <i />

          <div>
            <small>
              EXPERIENCE 02
            </small>

            <strong>
              Warren Buffett
            </strong>

            <span>
              Investing → ownership →
              compounding
            </span>
          </div>

          <i />

          <div className="lockedJourney">
            <small>
              NEXT
            </small>

            <strong>
              Jeff Bezos
            </strong>

            <span>
              Founder equity →
              reinvestment → scale
            </span>
          </div>
        </div>

        <div className="gateActions">
          <Link
            href={
              `/signup?next=${next}`
            }
            className="primaryGate"
          >
            Create account & continue
            →
          </Link>

          <Link
            href={
              `/login?next=${next}`
            }
            className="secondaryGate"
          >
            Already have an account?
            Sign in
          </Link>
        </div>

        <small className="gateNote">
          Full Academy access requires
          an active subscription after
          the complimentary Foundation
          experiences.
        </small>
      </section>

      <StateStyles />
    </main>
  );
}

function ClassroomStyles() {
  return (
    <style jsx global>{`
      .academyPage {
        min-height: 100vh;
        padding: 18px 18px 118px;
        color: #241438;

        background:
          radial-gradient(
            circle at top right,
            rgba(138, 92, 246, 0.13),
            transparent 28%
          ),
          linear-gradient(
            180deg,
            #fff,
            #f6f0ff
          );
      }

      .shell {
        width: min(
          1600px,
          100%
        );

        margin: 0 auto;
      }

      .topbar {
        display: grid;

        grid-template-columns:
          1fr auto 1fr;

        align-items: center;

        gap: 18px;
      }

      .exit,
      .complimentary {
        width: fit-content;

        min-height: 44px;

        display: inline-flex;

        align-items: center;

        padding: 0 16px;

        border-radius: 999px;

        font-weight: 900;
      }

      .exit {
        color: #5f4378;

        background: white;

        border:
          1px solid #eadff7;

        text-decoration: none;
      }

      .complimentary {
        justify-self: end;

        color: #775322;

        background: #fff5cf;

        font-size: 10px;

        letter-spacing: 0.08em;

        white-space: nowrap;
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

        text-transform:
          uppercase;
      }

      .lessonHeader {
        display: flex;

        justify-content:
          space-between;

        gap: 24px;

        margin-top: 16px;

        padding: 22px 26px;

        border-radius: 28px;

        background: white;

        border:
          1px solid #eee5f8;
      }

      .lessonHeader p {
        margin: 0;

        color: #6f42c1;

        font-weight: 900;
      }

      .lessonHeader h1 {
        margin: 7px 0;

        font-size:
          clamp(
            28px,
            4vw,
            42px
          );

        letter-spacing:
          -0.04em;
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

        white-space: nowrap;
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

        background:
          linear-gradient(
            90deg,
            #6f42c1,
            #9a6df5
          );
      }

      .classroomGrid {
        display: grid;

        grid-template-columns:
          minmax(
            260px,
            0.72fr
          )
          minmax(
            440px,
            1.35fr
          )
          minmax(
            270px,
            0.75fr
          );

        gap: 18px;

        margin-top: 18px;
      }

      .progressCard {
        padding: 24px;

        border-radius: 30px;

        background: white;

        border:
          1px solid #eee5f8;

        box-shadow:
          0 24px 70px
          rgba(
            48,
            29,
            82,
            0.08
          );
      }

      .eyebrow {
        color: #6f42c1;

        font-size: 11px;

        font-weight: 900;

        text-transform:
          uppercase;
      }

      .progressCard h2 {
        margin:
          8px 0 24px;
      }

      .metric {
        display: flex;

        justify-content:
          space-between;

        padding: 14px 0;

        border-bottom:
          1px solid #eee8f5;
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

        text-transform:
          uppercase;
      }

      .objective p {
        margin-bottom: 0;

        line-height: 1.55;
      }

      .guestJourneyNotice {
        width:
          min(
            760px,
            calc(
              100% - 36px
            )
          );

        margin:
          18px auto 94px;

        padding:
          18px 20px;

        border:
          1px solid
          rgba(
            173,
            121,
            46,
            0.22
          );

        border-radius:
          18px;

        background:
          linear-gradient(
            135deg,
            #fffaf0,
            #ffffff
          );

        box-shadow:
          0 18px 45px
          rgba(
            78,
            52,
            25,
            0.07
          );
      }

      .guestJourneyNotice span {
        display: block;

        margin-bottom: 7px;

        color: #9a6a27;

        font-size: 9px;

        font-weight: 950;

        letter-spacing:
          0.13em;
      }

      .guestJourneyNotice strong {
        display: block;

        color: #281a35;

        font-size: 15px;
      }

      .guestJourneyNotice p {
        margin:
          6px 0 0;

        color: #766b7e;

        font-size: 13px;

        line-height: 1.55;
      }

      .controls {
        position: fixed;

        left: 50%;
        bottom: 16px;

        transform:
          translateX(-50%);

        z-index: 40;

        width:
          min(
            1180px,
            calc(
              100% - 24px
            )
          );

        display: grid;

        grid-template-columns:
          1fr auto 1fr;

        align-items: center;

        gap: 16px;

        padding: 13px;

        border-radius: 24px;

        background:
          rgba(
            255,
            255,
            255,
            0.96
          );

        border:
          1px solid #e9def5;

        box-shadow:
          0 22px 60px
          rgba(
            48,
            29,
            82,
            0.16
          );
      }

      .controls button {
        min-height: 50px;

        padding: 0 18px;

        border-radius: 16px;

        border:
          1px solid #e7def2;

        color: #5f4378;

        background: #faf7ff;

        font: inherit;

        font-weight: 900;

        cursor: pointer;
      }

      .controls .continue {
        justify-self: end;

        color: white;

        background:
          linear-gradient(
            135deg,
            #6f42c1,
            #8a5cf6
          );

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

      @media (
        max-width:
          1180px
      ) {
        .classroomGrid {
          grid-template-columns:
            1fr 1.35fr;
        }

        .progressCard {
          grid-column:
            1 / -1;
        }
      }

      @media (
        max-width:
          800px
      ) {
        .classroomGrid {
          grid-template-columns:
            1fr;
        }

        .brand {
          display: none;
        }

        .topbar {
          grid-template-columns:
            1fr auto;
        }

        .lessonHeader {
          flex-direction:
            column;
        }

        .controls {
          grid-template-columns:
            1fr 1fr;
        }

        .controls div {
          display: none;
        }
      }
    `}</style>
  );
}

function StateStyles() {
  return (
    <style jsx global>{`
      .guestStatePage,
      .gatePage {
        min-height:
          100vh;

        display: grid;

        place-items:
          center;

        padding: 30px;

        color: #21170f;

        background:
          radial-gradient(
            circle at
              80% 12%,
            rgba(
              188,
              143,
              70,
              0.15
            ),
            transparent
              29%
          ),
          linear-gradient(
            145deg,
            #f9f6f0,
            #eee6d9
          );
      }

      .guestStatePage
        > div {
        font-weight:
          900;
      }

      .stateCard,
      .gateCard {
        width:
          min(
            860px,
            100%
          );

        padding:
          clamp(
            32px,
            6vw,
            70px
          );

        border-radius:
          34px;

        background:
          white;

        box-shadow:
          0 30px 90px
          rgba(
            54,
            37,
            21,
            0.14
          );
      }

      .gateCard {
        color: white;

        background:
          radial-gradient(
            circle at
              85% 10%,
            rgba(
              195,
              152,
              80,
              0.2
            ),
            transparent
              30%
          ),
          linear-gradient(
            145deg,
            #281e16,
            #110e0b
          );
      }

      .stateCard
        > span,
      .gateEyebrow {
        color: #9e793e;

        font-size: 9px;

        font-weight:
          950;

        letter-spacing:
          0.15em;
      }

      .stateCard h1,
      .gateCard h1 {
        margin:
          14px 0;

        font-family:
          Georgia,
          serif;

        font-size:
          clamp(
            42px,
            6vw,
            70px
          );

        line-height: 1;

        letter-spacing:
          -0.045em;

        font-weight:
          500;
      }

      .stateCard p {
        color: #706358;

        line-height:
          1.7;
      }

      .gateCard
        > p {
        color: #b9aa9b;

        line-height:
          1.7;
      }

      .stateActions,
      .gateActions {
        display: flex;

        flex-wrap: wrap;

        gap: 10px;

        margin-top:
          28px;
      }

      .stateActions a,
      .gateActions a {
        min-height:
          52px;

        display:
          inline-flex;

        align-items:
          center;

        justify-content:
          center;

        padding:
          0 20px;

        border-radius:
          999px;

        text-decoration:
          none;

        font-weight:
          900;
      }

      .stateActions
        .primary,
      .primaryGate {
        color: white;

        background:
          linear-gradient(
            135deg,
            #4a3420,
            #8a6635
          );
      }

      .stateActions
        .secondary {
        color: #6b5133;

        background:
          #f6efe5;
      }

      .secondaryGate {
        color: #d7c5b0;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            0.12
          );
      }

      .journeySummary {
        margin-top:
          35px;

        display: grid;

        grid-template-columns:
          1fr auto 1fr
          auto 1fr;

        align-items:
          center;

        gap: 14px;
      }

      .journeySummary
        > div {
        min-height:
          120px;

        padding:
          17px;

        border-radius:
          18px;

        background:
          rgba(
            255,
            255,
            255,
            0.04
          );

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            0.08
          );
      }

      .journeySummary i {
        width: 25px;

        height: 1px;

        background:
          rgba(
            219,
            180,
            110,
            0.35
          );
      }

      .journeySummary
        small,
      .journeySummary
        strong,
      .journeySummary
        span {
        display: block;
      }

      .journeySummary
        small {
        color: #b18b50;

        font-size: 6px;

        font-weight:
          900;

        letter-spacing:
          0.12em;
      }

      .journeySummary
        strong {
        margin-top:
          7px;

        color: #eadfce;

        font-family:
          Georgia,
          serif;

        font-size:
          20px;

        font-weight:
          500;
      }

      .journeySummary
        span {
        margin-top:
          5px;

        color: #95877a;

        font-size: 8px;

        line-height:
          1.5;
      }

      .lockedJourney {
        opacity: 0.55;
      }

      .gateNote {
        display: block;

        margin-top:
          18px;

        color: #807366;

        font-size: 9px;
      }

      @media (
        max-width:
          700px
      ) {
        .journeySummary {
          grid-template-columns:
            1fr;
        }

        .journeySummary i {
          width: 1px;

          height: 18px;

          margin: auto;
        }

        .stateActions a,
        .gateActions a {
          width: 100%;
        }
      }
    `}</style>
  );
}