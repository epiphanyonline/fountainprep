"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getAcademy,
  selectAcademyPath,
} from "@/features/academy-content";

import {
  registerMvpAcademies,
} from "@/app/data/academies";

import {
  getAcademyGuestKey,
} from "@/app/lib/academyGuest";

export default function GuestFinancePreviewPage() {
  const [activityIndex, setActivityIndex] =
    useState(0);

const [
  accessStatus,
  setAccessStatus,
] = useState<
  "checking" |
  "allowed" |
  "locked" |
  "error"
>("checking");

const [
  completing,
  setCompleting,
] = useState(false);

const [
  completionRecorded,
  setCompletionRecorded,
] = useState(false);

const [
  accessError,
  setAccessError,
] = useState("");    

    const selection = useMemo(() => {
    registerMvpAcademies();

    return selectAcademyPath(
      getAcademy(
        "personal-finance",
      ),
      "money-foundation",
      "money-foundation-course",
      "finance-foundation-unit-1-lesson-1",
    );
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function checkAccess() {
      try {
        const guestKey =
          getAcademyGuestKey();

        if (!guestKey) {
          throw new Error(
            "Unable to identify this complimentary learning session.",
          );
        }

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
                  "wealth",

                action:
                  "check",

                guestKey,

                experienceId:
                  "finance-foundation-unit-1-lesson-1-preview",
              }),
            },
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ??
              "Unable to confirm complimentary access.",
          );
        }

        if (cancelled) {
          return;
        }

        if (
          result.foundationLocked ||
          result.requiresSubscription ||
          !result.allowed
        ) {
          setAccessStatus(
            "locked",
          );

          return;
        }

        setAccessStatus(
          "allowed",
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        setAccessError(
          error instanceof Error
            ? error.message
            : "Unable to confirm access.",
        );

        setAccessStatus(
          "error",
        );
      }
    }

    void checkAccess();

    return () => {
      cancelled = true;
    };
  }, []);
  
      const lesson =
    selection.lesson;

  /*
   * Complimentary preview:
   *
   * 01 Every Game Has Rules
   * 02 Create Value
   * 03 Keep, Protect, Own and Grow
   *
   * Then stop before the interactive
   * premium activities begin.
   */
  const previewActivities =
    lesson.activities.slice(
      0,
      3,
    );

  const activity =
    previewActivities[
      activityIndex
    ] ??
    previewActivities[0];

  const isLastPreviewActivity =
    activityIndex ===
    previewActivities.length - 1;

 async function completePreview() {
  if (
    completing ||
    completionRecorded
  ) {
    return;
  }

  try {
    setCompleting(
      true,
    );

    setAccessError(
      "",
    );

    const guestKey =
      getAcademyGuestKey();

    if (!guestKey) {
      throw new Error(
        "Unable to identify this complimentary learning session.",
      );
    }

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
              "wealth",

            action:
              "complete",

            guestKey,

            experienceId:
              "finance-foundation-unit-1-lesson-1-preview",
          }),
        },
      );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.error ??
          "Unable to record completion.",
      );
    }

    if (!result.allowed) {
      setAccessStatus(
        "locked",
      );

      return;
    }

    setCompletionRecorded(
      true,
    );
  } catch (error) {
    setAccessError(
      error instanceof Error
        ? error.message
        : "Unable to record completion.",
    );
  } finally {
    setCompleting(
      false,
    );
  }
}   

  async function continuePreview() {
  if (
    isLastPreviewActivity
  ) {
    await completePreview();
    return;
  }

  setActivityIndex(
    (current) =>
      current + 1,
  );
}

if (
  accessStatus ===
  "checking"
) {
  return (
    <main className="previewPage">
      <section className="errorCard">
        <h1>
          Preparing your complimentary experience...
        </h1>
      </section>

      <PageStyles />
    </main>
  );
}

if (
  accessStatus ===
  "locked"
) {
  return (
    <main className="previewPage">
      <section className="conversionCard">
        <p className="eyebrow">
          Complimentary access complete
        </p>

        <h1>
          Continue your
          <span>
            Financial Literacy journey.
          </span>
        </h1>

        <p className="lead">
          You have completed the complimentary
          Fountain Prep experiences. Create an
          account or sign in to continue through
          the full Financial Literacy pathway.
        </p>

        <div className="actions">
          <Link
            href={
              "/signup?next=" +
              encodeURIComponent(
                "/academies/financial-literacy/start",
              )
            }
            className="primary"
          >
            Create account & continue →
          </Link>

          <Link
            href={
              "/login?next=" +
              encodeURIComponent(
                "/academies/financial-literacy/start",
              )
            }
            className="secondary"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </section>

      <PageStyles />
    </main>
  );
}

if (
  accessStatus ===
  "error"
) {
  return (
    <main className="previewPage">
      <section className="errorCard">
        <h1>
          Unable to open preview
        </h1>

        <p>
          {accessError}
        </p>

        <Link href="/academies/financial-literacy">
          Return to Financial Literacy
        </Link>
      </section>

      <PageStyles />
    </main>
  );
}

  if (
    !activity
  ) {
    return (
      <main className="previewPage">
        <section className="errorCard">
          <h1>
            Preview unavailable
          </h1>

          <Link href="/academies/financial-literacy">
            Return to Financial Literacy
          </Link>
        </section>

        <PageStyles />
      </main>
    );
  }

  if (
  isLastPreviewActivity &&
  completionRecorded
) {
    return (
      <main className="previewPage">
        <section className="conversionCard">
          <p className="eyebrow">
            Complimentary experience 2 of 2
          </p>

          <h1>
            You know the rules.
            <span>
              Now apply them.
            </span>
          </h1>

          <p className="lead">
            You have now experienced
            Fountain Prep’s Financial
            Literacy teaching in both
            interactive and structured
            classroom formats.
          </p>

          <div className="journey">
            <article>
              <small>
                EXPERIENCE 01
              </small>

              <strong>
                Needs and Wants
              </strong>

              <span>
                Completed
              </span>
            </article>

            <article>
              <small>
                EXPERIENCE 02
              </small>

              <strong>
                Money Is a Game
              </strong>

              <span>
                Preview complete
              </span>
            </article>

            <article className="locked">
              <small>
                NEXT
              </small>

              <strong>
                Which Rule Is Missing?
              </strong>

              <span>
                Interactive application
              </span>
            </article>
          </div>

          <div className="conversionCopy">
            <strong>
              Continue your full
              Financial Literacy journey.
            </strong>

            <p>
              Create an account to save
              progress, complete the
              interactive activities,
              earn achievements and
              continue through the full
              pathway.
            </p>
          </div>

          <div className="actions">
            <Link
              href={
                "/signup?next=" +
                encodeURIComponent(
                  "/academies/financial-literacy/start",
                )
              }
              className="primary"
            >
              Create account & continue →
            </Link>

            <Link
              href={
                "/login?next=" +
                encodeURIComponent(
                  "/academies/financial-literacy/start",
                )
              }
              className="secondary"
            >
              Already have an account?
              Sign in
            </Link>
          </div>

          <Link
            href="/academies/financial-literacy"
            className="back"
          >
            ← Back to Financial Literacy
          </Link>
        </section>

        <PageStyles />
      </main>
    );
  }

  return (
    <main className="previewPage">
      <div className="previewShell">
        <header className="topbar">
          <Link href="/academies/financial-literacy">
            ← Exit preview
          </Link>

          <div>
            <strong>
              FountainPrep
            </strong>

            <span>
              FINANCIAL LITERACY ACADEMY
            </span>
          </div>

          <b>
            COMPLIMENTARY 2 OF 2
          </b>
        </header>

        <section className="lessonHeader">
          <div>
            <p>
              MONEY FOUNDATION
            </p>

            <h1>
              {lesson.title}
            </h1>

            <span>
              No account required
            </span>
          </div>

          <aside>
            <small>
              PREVIEW
            </small>

            <strong>
              {activityIndex + 1}
              {" / "}
              {previewActivities.length}
            </strong>
          </aside>
        </section>

        <div className="progressTrack">
          <span
            style={{
              width:
                `${
                  (
                    (
                      activityIndex +
                      1
                    ) /
                    previewActivities.length
                  ) *
                  100
                }%`,
            }}
          />
        </div>

        <section className="classroomGrid">
          <aside className="mentorPanel">
            <p>
              LEARNING MENTOR
            </p>

            <h2>
              Ayo
            </h2>

            <div className="mentorCircle">
  <img
    src="/images/fountaintalk/ayo-presenter.png"
    alt="Ayo learning mentor"
    className="mentorImage"
  />
</div>

            <div className="ayoSays">
              <small>
                AYO SAYS
              </small>

              <p>
                {
                  activity.teacherPrompt
                }
              </p>
            </div>
          </aside>

          <article className="learningPanel">
            <div className="panelTop">
              <span>
                {
                  activity.type
                    .replaceAll(
                      "-",
                      " ",
                    )
                    .toUpperCase()
                }
              </span>

              <b>
                LEARNING ACTIVITY
              </b>
            </div>

            <h2>
              {activity.title}
            </h2>

            <p className="teacherPrompt">
              {
                activity.teacherPrompt
              }
            </p>

            {activity.explanation ? (
              <div className="explanation">
                {
                  activity.explanation
                }
              </div>
            ) : null}

            {activity.visualTitle ? (
              <div className="visualCard">
                <small>
                  VISUAL LEARNING
                </small>

                <strong>
                  {
                    activity.visualTitle
                  }
                </strong>

                {activity.visualDescription ? (
                  <p>
                    {
                      activity.visualDescription
                    }
                  </p>
                ) : null}
              </div>
            ) : null}
          </article>

          <aside className="progressPanel">
            <p>
              YOUR EXPERIENCE
            </p>

            <h3>
              Preview activity{" "}
              {activityIndex + 1}
              {" of "}
              {previewActivities.length}
            </h3>

            <div className="metric">
              <span>
                Lesson
              </span>

              <strong>
                {Math.round(
                  (
                    (
                      activityIndex +
                      1
                    ) /
                    previewActivities.length
                  ) *
                    100,
                )}
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
              <small>
                OBJECTIVE
              </small>

              <p>
                {
                  lesson.objective
                }
              </p>
            </div>
          </aside>
        </section>

        <footer className="controls">
          <button
            type="button"
            onClick={() =>
              setActivityIndex(
                (current) =>
                  Math.max(
                    current - 1,
                    0,
                  ),
              )
            }
            disabled={
              activityIndex === 0
            }
          >
            ← Back
          </button>

          <span>
            Experience Fountain Prep
            before creating an account
          </span>

          <button
  type="button"
  className="continue"
  onClick={() =>
    void continuePreview()
  }
  disabled={
    completing
  }
>
  {completing
    ? "Completing..."
    : isLastPreviewActivity
      ? "Complete preview →"
      : "Continue →"}
</button>
        </footer>
      </div>

      <PageStyles />
    </main>
  );
}

function PageStyles() {
  return (
    <style>{`
      * {
        box-sizing: border-box;
      }

      .previewPage {
        min-height: 100vh;
        padding: 24px;
        color: #28143d;
        background:
          radial-gradient(
            circle at top right,
            rgba(124, 58, 237, 0.12),
            transparent 28%
          ),
          linear-gradient(
            180deg,
            #ffffff,
            #f6f1fd
          );
      }

      .previewShell {
        width: min(1400px, 100%);
        margin: 0 auto;
      }

      .topbar {
        min-height: 60px;
        display: grid;
        grid-template-columns:
          1fr auto 1fr;
        align-items: center;
        gap: 20px;
      }

      .topbar a {
        color: #4b385e;
        text-decoration: none;
        font-weight: 800;
        font-size: 13px;
      }

      .topbar > div {
        text-align: center;
      }

      .topbar strong,
      .topbar span {
        display: block;
      }

      .topbar strong {
        color: #17101f;
        font-size: 14px;
      }

      .topbar span {
        margin-top: 2px;
        color: #7c3aed;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 0.06em;
      }

      .topbar > b {
        justify-self: end;
        padding: 10px 14px;
        color: #7a5300;
        background: #fff0bd;
        border-radius: 999px;
        font-size: 10px;
        letter-spacing: 0.08em;
      }

      .lessonHeader {
        margin-top: 14px;
        display: flex;
        justify-content: space-between;
        gap: 24px;
        padding: 28px;
        background: white;
        border: 1px solid #e8def2;
        border-radius: 28px;
        box-shadow:
          0 18px 50px
          rgba(55, 35, 85, 0.08);
      }

      .lessonHeader p {
        margin: 0;
        color: #7c3aed;
        font-size: 12px;
        font-weight: 900;
      }

      .lessonHeader h1 {
        margin: 8px 0 6px;
        font-size:
          clamp(34px, 4vw, 54px);
        line-height: 1;
        letter-spacing: -0.05em;
      }

      .lessonHeader span {
        color: #74687c;
        font-size: 14px;
      }

      .lessonHeader aside {
        min-width: 120px;
        align-self: center;
        padding: 16px;
        text-align: center;
        background: #f7f1ff;
        border-radius: 18px;
      }

      .lessonHeader aside small,
      .lessonHeader aside strong {
        display: block;
      }

      .lessonHeader aside small {
        color: #7c3aed;
        font-size: 9px;
        font-weight: 900;
      }

      .lessonHeader aside strong {
        margin-top: 5px;
        font-size: 18px;
      }

      .progressTrack {
        height: 6px;
        margin: 12px 0 18px;
        overflow: hidden;
        background: #eadff5;
        border-radius: 999px;
      }

      .progressTrack span {
        display: block;
        height: 100%;
        background: #7c3aed;
        border-radius: inherit;
      }

      .classroomGrid {
        display: grid;
        grid-template-columns:
          0.8fr 1.55fr 0.82fr;
        gap: 18px;
      }

      .mentorPanel,
      .learningPanel,
      .progressPanel {
        padding: 24px;
        background: white;
        border: 1px solid #e7ddf0;
        border-radius: 28px;
      }

      .mentorPanel > p,
      .progressPanel > p {
        margin: 0;
        color: #7c3aed;
        font-size: 10px;
        font-weight: 900;
      }

      .mentorPanel h2 {
        margin: 6px 0;
        font-size: 28px;
      }

      .mentorCircle {
  min-height: 360px;
  position: relative;
  display: grid;
  place-items: end center;
  margin-top: 16px;
  overflow: hidden;
  background:
    radial-gradient(
      circle at 50% 42%,
      #f0e4ff,
      transparent 68%
    );
  border-radius: 999px;
}

.mentorImage {
  width: 88%;
  max-height: 340px;
  object-fit: contain;
  object-position: center bottom;
}
      
      .ayoSays {
        margin-top: 20px;
        padding: 18px;
        background: #faf7ff;
        border-radius: 18px;
      }

      .ayoSays small {
        color: #7c3aed;
        font-size: 9px;
        font-weight: 900;
      }

      .ayoSays p {
        margin: 7px 0 0;
        line-height: 1.55;
        font-size: 14px;
      }

      .panelTop {
        display: flex;
        justify-content: space-between;
        gap: 20px;
        color: #7c3aed;
        font-size: 10px;
        font-weight: 900;
      }

      .learningPanel h2 {
        margin: 18px 0 14px;
        font-size:
          clamp(38px, 4vw, 58px);
        line-height: 1;
        letter-spacing: -0.055em;
      }

      .teacherPrompt {
        color: #33243f;
        font-size: 17px;
        font-weight: 700;
        line-height: 1.65;
      }

      .explanation {
        margin-top: 20px;
        padding: 18px;
        color: #604f70;
        background: #f7f3fb;
        border-radius: 17px;
        line-height: 1.6;
      }

      .visualCard {
        margin-top: 20px;
        padding: 24px;
        background:
          linear-gradient(
            135deg,
            #f9f5ff,
            #ffffff
          );
        border: 1px solid #eadff3;
        border-radius: 20px;
      }

      .visualCard small {
        color: #7c3aed;
        font-size: 9px;
        font-weight: 900;
      }

      .visualCard strong {
        display: block;
        margin-top: 8px;
        font-size: 22px;
      }

      .visualCard p {
        color: #665872;
        line-height: 1.6;
      }

      .progressPanel h3 {
        margin: 8px 0 24px;
        font-size: 18px;
      }

      .metric {
        display: flex;
        justify-content: space-between;
        gap: 15px;
        padding: 16px 0;
        border-top: 1px solid #eee7f3;
      }

      .metric span {
        color: #756a7d;
      }

      .objective {
        margin-top: 12px;
        padding: 18px;
        background: #faf6ff;
        border-radius: 18px;
      }

      .objective small {
        color: #7c3aed;
        font-size: 9px;
        font-weight: 900;
      }

      .objective p {
        margin: 7px 0 0;
        line-height: 1.55;
      }

      .controls {
        margin: 18px auto 0;
        width: min(1000px, 100%);
        display: grid;
        grid-template-columns:
          1fr auto 1fr;
        align-items: center;
        gap: 16px;
        padding: 12px;
        background:
          rgba(255, 255, 255, 0.96);
        border: 1px solid #e8def2;
        border-radius: 22px;
        box-shadow:
          0 18px 50px
          rgba(45, 28, 75, 0.12);
      }

      .controls button {
        min-height: 48px;
        padding: 0 18px;
        border: 1px solid #e2d6ee;
        border-radius: 14px;
        color: #6e5c7b;
        background: white;
        font-weight: 900;
        cursor: pointer;
      }

      .controls .continue {
        justify-self: end;
        color: white;
        background: #7c3aed;
        border-color: #7c3aed;
      }

      .controls span {
        color: #776b80;
        font-size: 12px;
        font-weight: 700;
        text-align: center;
      }

      button:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }

      .conversionCard {
        width: min(920px, 94vw);
        margin: 8vh auto 0;
        padding: 46px;
        color: white;
        background:
          radial-gradient(
            circle at top right,
            rgba(213, 167, 91, 0.16),
            transparent 30%
          ),
          linear-gradient(
            145deg,
            #17110c,
            #2b1c10
          );
        border-radius: 36px;
        box-shadow:
          0 40px 100px
          rgba(38, 22, 9, 0.24);
      }

      .conversionCard .eyebrow {
        margin: 0;
        color: #e5b85f;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .conversionCard h1 {
        margin: 14px 0;
        font-size:
          clamp(48px, 7vw, 78px);
        line-height: 0.95;
        letter-spacing: -0.055em;
      }

      .conversionCard h1 span {
        display: block;
        color: #ddb66f;
        font-style: italic;
      }

      .conversionCard .lead {
        max-width: 680px;
        color: #ddd4c9;
        font-size: 17px;
        line-height: 1.65;
      }

      .journey {
        display: grid;
        grid-template-columns:
          repeat(3, 1fr);
        gap: 12px;
        margin-top: 28px;
      }

      .journey article {
        padding: 18px;
        background:
          rgba(255,255,255,0.055);
        border:
          1px solid
          rgba(255,255,255,0.1);
        border-radius: 18px;
      }

      .journey article.locked {
        opacity: 0.55;
      }

      .journey small,
      .journey strong,
      .journey span {
        display: block;
      }

      .journey small {
        color: #d7a950;
        font-size: 8px;
        font-weight: 900;
      }

      .journey strong {
        margin-top: 7px;
        font-size: 17px;
      }

      .journey span {
        margin-top: 5px;
        color: #bfb4a8;
        font-size: 12px;
      }

      .conversionCopy {
        margin-top: 28px;
        padding: 22px;
        background:
          rgba(255,255,255,0.05);
        border-radius: 20px;
      }

      .conversionCopy strong {
        font-size: 19px;
      }

      .conversionCopy p {
        margin: 8px 0 0;
        color: #d4cabf;
        line-height: 1.6;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 26px;
      }

      .actions a {
        min-height: 52px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0 20px;
        border-radius: 999px;
        text-decoration: none;
        font-weight: 900;
      }

      .actions .primary {
        color: #28190c;
        background: #efd495;
      }

      .actions .secondary {
        color: white;
        border:
          1px solid
          rgba(255,255,255,0.2);
      }

      .conversionCard .back {
        display: inline-block;
        margin-top: 25px;
        color: #c9beb3;
        text-decoration: none;
        font-size: 13px;
      }

      .errorCard {
        width: min(600px, 94vw);
        margin: 12vh auto;
        padding: 36px;
        background: white;
        border-radius: 28px;
      }

      @media (max-width: 900px) {
        .classroomGrid {
          grid-template-columns:
            1fr;
        }

        .mentorCircle {
          min-height: 220px;
        }

        .journey {
          grid-template-columns:
            1fr;
        }
      }

      @media (max-width: 650px) {
        .previewPage {
          padding: 12px;
        }

        .topbar {
          grid-template-columns:
            1fr auto;
        }

        .topbar > div {
          display: none;
        }

        .lessonHeader {
          flex-direction: column;
        }

        .controls {
          grid-template-columns:
            1fr 1fr;
        }

        .controls span {
          display: none;
        }

        .conversionCard {
          padding: 28px 20px;
        }
      }
    `}</style>
  );
}