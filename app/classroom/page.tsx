"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { supabase } from "@/app/lib/supabase";
import type { LearnerProfile as FountainTalkLearner } from "@/app/types/fountaintalk";

import AyoAvatar from "./components/AyoAvatar";
import ConversationPanel from "./components/ConversationPanel";
import LessonHeader from "./components/LessonHeader";
import LessonSlide from "./components/LessonSlide";
import ProgressCard from "./components/ProgressCard";
import VoiceControls from "./components/VoiceControls";
import { useClassroomEngine } from "./hooks/useClassroomEngine";

type StudentProfileRow = {
  id: string;
  full_name: string;
  child_age: number | null;
  age_group: string | null;
};

export default function ClassroomPage() {
  return (
    <Suspense fallback={<ClassroomLoading />}>
      <ClassroomLearnerLoader />
    </Suspense>
  );
}

function ClassroomLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4 py-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-purple-100 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-purple-600">
          Ayo Classroom
        </p>

        <h1 className="mt-3 text-3xl font-black text-slate-900">
          Preparing your lesson...
        </h1>

        <p className="mt-3 text-slate-600">
          Loading the learner, curriculum and saved progress.
        </p>
      </div>
    </main>
  );
}

function ClassroomLearnerLoader() {
  const searchParams = useSearchParams();

  const studentId = searchParams.get("studentId");

  const requestedLanguage =
    searchParams.get("language")?.trim().toLowerCase() ?? "yoruba";

  const requestedLevel =
    searchParams.get("level")?.trim().toLowerCase() ?? "foundation";

  const [learner, setLearner] =
    useState<FountainTalkLearner | null>(null);

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadLearner() {
      try {
        setLoading(true);
        setErrorMessage(null);

        if (!studentId) {
          throw new Error(
            "No learner was selected. Return to the learner page and choose who is learning.",
          );
        }

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          throw authError;
        }

        if (!user) {
          throw new Error(
            "Please log in before starting this lesson.",
          );
        }

        const { data: parentProfile, error: parentError } =
          await supabase
            .from("parent_profiles")
            .select("id")
            .eq("user_id", user.id)
            .maybeSingle();

        if (parentError) {
          throw parentError;
        }

        if (!parentProfile) {
          throw new Error(
            "A parent profile could not be found for this account.",
          );
        }

        const { data: student, error: studentError } =
          await supabase
            .from("student_profiles")
            .select("id, full_name, child_age, age_group")
            .eq("id", studentId)
            .eq("parent_id", parentProfile.id)
            .maybeSingle();

        if (studentError) {
          throw studentError;
        }

        if (!student) {
          throw new Error(
            "The selected learner could not be found or does not belong to this account.",
          );
        }

        const studentRow = student as StudentProfileRow;

        const resolvedAgeGroup = resolveLearnerAgeGroup(
          studentRow.age_group,
          studentRow.child_age,
        );

        if (!cancelled) {
          setLearner({
            id: studentRow.id,
            name: studentRow.full_name,
            ageGroup: resolvedAgeGroup,
            language:
              requestedLanguage as FountainTalkLearner["language"],
            level:
              requestedLevel as FountainTalkLearner["level"],
            goal: "conversation",
            bibleStoriesEnabled: true,
          });
        }
      } catch (error) {
        console.error(
          "Unable to load classroom learner:",
          error,
        );

        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to load the selected learner.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadLearner();

    return () => {
      cancelled = true;
    };
  }, [requestedLanguage, requestedLevel, studentId]);

  if (loading) {
    return <ClassroomLoading />;
  }

  if (errorMessage || !learner) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4 py-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-purple-600">
            Ayo Classroom
          </p>

          <h1 className="mt-3 text-3xl font-black text-slate-900">
            Unable to start the lesson
          </h1>

          <p
            role="alert"
            className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 font-semibold text-red-700"
          >
            {errorMessage ??
              "The learner could not be loaded."}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/parent/students"
              className="rounded-full bg-purple-600 px-5 py-3 font-bold text-white transition hover:bg-purple-700"
            >
              Choose a learner
            </Link>

            <Link
              href="/subjects"
              className="rounded-full border border-purple-200 bg-white px-5 py-3 font-bold text-purple-700 transition hover:bg-purple-50"
            >
              Back to Subjects
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return <ConnectedClassroom learner={learner} />;
}

function ConnectedClassroom({
  learner,
}: {
  learner: FountainTalkLearner;
}) {
  const engine = useClassroomEngine({ learner });

  const {
    classroomState,
    controls,

    isLearningPathLoading,
    learningPathError,
    studentLearningPathLoaded,

    microphoneGranted,
    audioWorking,
    lessonStarted,
    errorMessage,
    isRequestPending,
    isProgressSaving,

    requestMicrophone,
    testAudio,
    startLesson,
  } = engine;

  if (learningPathError) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4 py-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-black text-slate-900">
            Unable to load the curriculum
          </h1>

          <p
            role="alert"
            className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 font-semibold text-red-700"
          >
            {learningPathError}
          </p>
        </div>
      </main>
    );
  }

  if (
    isLearningPathLoading ||
    !studentLearningPathLoaded
  ) {
    return <ClassroomLoading />;
  }

  const isBusy =
    classroomState.status === "speaking" ||
    classroomState.status === "thinking" ||
    isRequestPending ||
    isProgressSaving;

  const microphoneRequired =
    classroomState.currentSlide.action === "speak" ||
    classroomState.currentSlide.action === "repeat";

  const streak = classroomState.lesson.reward.streak ?? 0;

  return (
    <main className="classroomPage">
      <div className="classroomShell">
        <div className="classroomTopbar">
          <Link
            href={`/fountaintalk?studentId=${encodeURIComponent(
              learner.id,
            )}`}
            className="exitLesson"
          >
            <span aria-hidden="true">←</span>
            <span>Exit lesson</span>
          </Link>

          <div className="classroomBrand">
            <strong>FountainPrep</strong>
            <span>Ayo Classroom</span>
          </div>

          <div className="streakBadge">
            <span aria-hidden="true">🔥</span>
            <strong>
              {streak} day{streak === 1 ? "" : "s"} streak
            </strong>
          </div>
        </div>

        <LessonHeader
          learner={classroomState.learner}
          lesson={classroomState.lesson}
          progress={classroomState.progress}
        />

        {!lessonStarted ? (
          <section className="startPanel">
            <p className="startEyebrow">
              Welcome, {classroomState.learner.firstName}
            </p>

            <h2>
              Ready for today&apos;s{" "}
              {classroomState.lesson.programme} lesson?
            </h2>

            <p>
              Your saved progress has been restored. You will
              continue from the exact lesson and activity where
              you stopped.
            </p>

            <div className="setupActions">
              <button
                type="button"
                onClick={testAudio}
                disabled={isBusy}
              >
                {audioWorking
                  ? "✓ Speaker ready"
                  : "🔊 Test speaker"}
              </button>

              <button
                type="button"
                onClick={requestMicrophone}
                disabled={isBusy}
              >
                {microphoneGranted
                  ? "✓ Microphone ready"
                  : "🎤 Allow microphone"}
              </button>
            </div>

            <button
              type="button"
              className="startButton"
              onClick={startLesson}
              disabled={
                isBusy ||
                !microphoneGranted ||
                !audioWorking
              }
            >
              Start lesson
            </button>
          </section>
        ) : (
          <>
            {errorMessage ? (
              <div className="errorNotice" role="alert">
                {errorMessage}
              </div>
            ) : null}

            {microphoneRequired && !microphoneGranted ? (
              <div className="microphoneNotice">
                <div>
                  <strong>Microphone access is needed</strong>
                  <span>
                    Allow your microphone before starting this
                    speaking activity.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={requestMicrophone}
                  disabled={isBusy}
                >
                  Allow microphone
                </button>
              </div>
            ) : null}

            <section className="classroomGrid">
              <AyoAvatar
                status={classroomState.status}
                personality={
                  classroomState.learner.personality
                }
                message={
                  classroomState.conversation.at(-1)
                    ?.message ??
                  classroomState.currentSlide.explanation
                }
                teacherName="Ayo"
                imageSrc="/images/ayo/ayo-teacher.png"
              />

              <LessonSlide
                slide={classroomState.currentSlide}
                programme={
                  classroomState.lesson.programme
                }
                stage={classroomState.lesson.stage}
              />

              <div className="rightRail">
                <ConversationPanel
                  messages={classroomState.conversation}
                  status={classroomState.status}
                  teacherName="Ayo"
                />

                <ProgressCard
                  learner={classroomState.learner}
                  lesson={classroomState.lesson}
                  progress={classroomState.progress}
                />
              </div>
            </section>

            <VoiceControls
              status={classroomState.status}
              action={classroomState.currentSlide.action}
              canGoBack={controls.canGoBack}
              canContinue={controls.canContinue}
              onSpeak={
                microphoneGranted
                  ? controls.onSpeak
                  : requestMicrophone
              }
              onReplay={controls.onReplay}
              onContinue={controls.onContinue}
              onBack={controls.onBack}
            />
          </>
        )}
      </div>

      <style jsx>{`
        .classroomPage {
          min-height: 100vh;
          padding: 18px 18px 118px;
          overflow-x: hidden;
          color: #241438;
          background:
            radial-gradient(
              circle at top right,
              rgba(138, 92, 246, 0.13),
              transparent 28%
            ),
            radial-gradient(
              circle at bottom left,
              rgba(255, 224, 138, 0.16),
              transparent 30%
            ),
            linear-gradient(
              180deg,
              #ffffff,
              #fbf8ff 52%,
              #f4edff
            );
        }

        .classroomShell {
          width: min(1600px, 100%);
          margin: 0 auto;
        }

        .classroomTopbar {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 18px;
          margin-bottom: 16px;
        }

        .exitLesson {
          justify-self: start;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          min-height: 44px;
          padding: 0 16px;
          border: 1px solid rgba(111, 66, 193, 0.14);
          border-radius: 999px;
          color: #5f4378;
          background: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          font-weight: 900;
          text-decoration: none;
          box-shadow: 0 10px 28px rgba(48, 29, 82, 0.07);
        }

        .classroomBrand {
          text-align: center;
        }

        .classroomBrand strong {
          display: block;
          color: #241438;
          font-size: 18px;
          font-weight: 950;
          letter-spacing: -0.03em;
        }

        .classroomBrand span {
          display: block;
          margin-top: 2px;
          color: #6f42c1;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .streakBadge {
          justify-self: end;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 44px;
          padding: 0 15px;
          border-radius: 999px;
          color: #724600;
          background: #fff5cf;
          border: 1px solid rgba(177, 119, 0, 0.14);
          font-size: 13px;
        }

        .classroomGrid {
          display: grid;
          grid-template-columns:
            minmax(250px, 0.72fr)
            minmax(440px, 1.35fr)
            minmax(300px, 0.83fr);
          gap: 18px;
          align-items: stretch;
          margin-top: 18px;
          min-height: calc(100vh - 285px);
          max-height: calc(100vh - 285px);
        }

        .classroomGrid > :global(*) {
          min-width: 0;
        }

        .rightRail {
          display: grid;
          grid-template-rows: minmax(0, 1fr) auto;
          gap: 18px;
          min-height: 0;
          overflow: auto;
          padding-right: 2px;
        }

        .startPanel {
          width: min(760px, 100%);
          margin: 28px auto 0;
          padding: 42px;
          text-align: center;
          border-radius: 34px;
          border: 1px solid rgba(111, 66, 193, 0.12);
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 24px 70px rgba(48, 29, 82, 0.1);
        }

        .startEyebrow {
          margin: 0;
          color: #6f42c1;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .startPanel h2 {
          margin: 14px 0 0;
          font-size: clamp(32px, 5vw, 54px);
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .startPanel > p:not(.startEyebrow) {
          max-width: 600px;
          margin: 18px auto 0;
          color: #746a80;
          font-size: 17px;
          line-height: 1.7;
        }

        .setupActions {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 28px;
        }

        .setupActions button,
        .startButton {
          min-height: 54px;
          border-radius: 18px;
          font: inherit;
          font-weight: 900;
          cursor: pointer;
        }

        .setupActions button {
          border: 1px solid rgba(111, 66, 193, 0.14);
          background: #faf7ff;
          color: #5f4378;
        }

        .startButton {
          width: 100%;
          margin-top: 16px;
          border: 0;
          color: white;
          background: linear-gradient(
            135deg,
            #6f42c1,
            #8a5cf6
          );
          box-shadow: 0 16px 38px rgba(111, 66, 193, 0.24);
        }

        .errorNotice {
          margin-top: 18px;
          padding: 15px 18px;
          border-radius: 18px;
          border: 1px solid #fecaca;
          background: #fef2f2;
          color: #b91c1c;
          font-weight: 800;
        }

        .microphoneNotice {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-top: 18px;
          padding: 15px 18px;
          border: 1px solid rgba(111, 66, 193, 0.14);
          border-radius: 20px;
          background: #faf7ff;
        }

        .microphoneNotice div {
          display: grid;
          gap: 3px;
        }

        .microphoneNotice strong {
          color: #241438;
          font-size: 14px;
        }

        .microphoneNotice span {
          color: #756985;
          font-size: 13px;
          font-weight: 650;
        }

        .microphoneNotice button {
          min-height: 42px;
          padding: 0 16px;
          border: 0;
          border-radius: 999px;
          color: white;
          background: #6f42c1;
          font: inherit;
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 1380px) {
          .classroomGrid {
            grid-template-columns:
              minmax(280px, 0.8fr)
              minmax(430px, 1.2fr);
            min-height: auto;
            max-height: none;
          }

          .rightRail {
            grid-column: 1 / -1;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            grid-template-rows: auto;
            overflow: visible;
          }
        }

        @media (max-width: 960px) {
          .classroomPage {
            padding: 16px 12px 110px;
          }

          .classroomGrid,
          .rightRail {
            grid-template-columns: 1fr;
          }

          .rightRail {
            grid-column: auto;
          }
        }

        @media (max-width: 700px) {
          .classroomTopbar {
            grid-template-columns: 1fr auto;
          }

          .classroomBrand {
            display: none;
          }
        }

        @media (max-width: 620px) {
          .microphoneNotice {
            align-items: stretch;
            flex-direction: column;
          }

          .microphoneNotice button {
            width: 100%;
          }
        }

        @media (max-width: 600px) {
          .startPanel {
            padding: 28px 20px;
          }

          .setupActions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

function resolveLearnerAgeGroup(
  storedAgeGroup: string | null,
  childAge: number | null,
): FountainTalkLearner["ageGroup"] {
  switch (storedAgeGroup) {
    case "3-5":
    case "6-9":
    case "10-13":
    case "14-17":
    case "adult":
      return storedAgeGroup;

    default:
      break;
  }

  if (childAge === null) {
    return "6-9";
  }

  if (childAge <= 5) {
    return "3-5";
  }

  if (childAge <= 9) {
    return "6-9";
  }

  if (childAge <= 13) {
    return "10-13";
  }

  if (childAge <= 17) {
    return "14-17";
  }

  return "adult";
}