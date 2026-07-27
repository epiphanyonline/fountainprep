"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import type { LearnerProfile } from "@/app/types/fountaintalk";

import TutorAvatar from "@/app/components/fountaintalk/TutorAvatar";
import TutorSpeechBubble from "@/app/components/fountaintalk/TutorSpeechBubble";

import { useTutor } from "@/app/fountaintalk/tutor/hooks/useTutor";
import { supabase } from "@/app/lib/supabase";

type StudentProfileRow = {
  id: string;
  full_name: string;
  child_age: number | null;
  age_group: string | null;
};

export default function FountainTalkTutorPage() {
  return (
    <Suspense fallback={<TutorPageLoading />}>
      <FountainTalkLearnerLoader />
    </Suspense>
  );
}

function TutorPageLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4 py-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-purple-100 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-purple-600">
          FountainTalk
        </p>

        <h1 className="mt-3 text-3xl font-black text-slate-900">
          Loading learner...
        </h1>

        <p className="mt-3 text-slate-600">
          Preparing the personalised language lesson.
        </p>
      </div>
    </main>
  );
}

function FountainTalkLearnerLoader() {
  const searchParams = useSearchParams();

  const studentId = searchParams.get("studentId");

  const requestedLanguage =
    searchParams.get("language")?.trim().toLowerCase() ??
    "yoruba";

  const [learner, setLearner] =
    useState<LearnerProfile | null>(null);

  const [learnerLoading, setLearnerLoading] =
    useState(true);

  const [learnerError, setLearnerError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadLearner() {
      try {
        setLearnerLoading(true);
        setLearnerError(null);

        if (!studentId) {
          throw new Error(
            "No learner was selected. Return to Subjects and choose a child.",
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

        const {
          data: parentProfile,
          error: parentError,
        } = await supabase
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

        const {
          data: student,
          error: studentError,
        } = await supabase
          .from("student_profiles")
          .select(
            "id, full_name, child_age, age_group",
          )
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

        const studentRow =
          student as StudentProfileRow;

        const resolvedAgeGroup =
          resolveLearnerAgeGroup(
            studentRow.age_group,
            studentRow.child_age,
          );

        if (!cancelled) {
          setLearner({
            id: studentRow.id,
            name: studentRow.full_name,
            ageGroup: resolvedAgeGroup,
            language:
              requestedLanguage as LearnerProfile["language"],
            level: "foundation",
            goal: "conversation",
            bibleStoriesEnabled: true,
          });
        }
      } catch (error) {
        console.error(
          "Unable to load FountainTalk learner:",
          error,
        );

        if (!cancelled) {
          setLearnerError(
            error instanceof Error
              ? error.message
              : "Unable to load the selected learner.",
          );
        }
      } finally {
        if (!cancelled) {
          setLearnerLoading(false);
        }
      }
    }

    void loadLearner();

    return () => {
      cancelled = true;
    };
  }, [requestedLanguage, studentId]);

  if (learnerLoading) {
    return <TutorPageLoading />;
  }

  if (learnerError || !learner) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4 py-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-purple-600">
            FountainTalk
          </p>

          <h1 className="mt-3 text-3xl font-black text-slate-900">
            Unable to start the lesson
          </h1>

          <p
            role="alert"
            className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 font-semibold text-red-700"
          >
            {learnerError ??
              "The learner could not be loaded."}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/parent/students?mode=booking"
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

  return <FountainTalkTutor learner={learner} />;
}

function resolveLearnerAgeGroup(
  storedAgeGroup: string | null,
  childAge: number | null,
): LearnerProfile["ageGroup"] {
  switch (storedAgeGroup) {
    case "3-5":
    case "6-9":
    case "10-13":
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

  return "10-13";
}

function FountainTalkTutor({
  learner,
}: {
  learner: LearnerProfile;
}) {
  const tutor = useTutor({
    learner,
  });

  const {
    activeLesson,
    progress,

    microphoneGranted,
    audioWorking,
    lessonStarted,
    tutorStatus,
    tutorMessage,
    learnerTranscript,
    errorMessage,
    correctedPhrase,
    encouragement,
    conversationMode,
    isRequestPending,

    testAudio,
    requestMicrophone,
    startLesson,
    beginListening,
    stopListening,
    stopSpeech,
    repeatTutorMessage,
    goToPreviousStep,
    continueToNextStep,
    switchToFreeConversation,
    returnToCurriculum,
  } = tutor;

  const {
    unit,
    lesson,
    step,
    lessonIndex,
    stepIndex,
    lessonProgressPercentage,
    unitProgressPercentage,
    isFirstStep,
    isLastStep,
  } = activeLesson;

  const isBusy =
    tutorStatus === "speaking" ||
    tutorStatus === "thinking" ||
    isRequestPending;

  const languageLabel =
    learner.language.charAt(0).toUpperCase() +
    learner.language.slice(1);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-purple-600">
                FountainTalk
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                {languageLabel} AI Tutor
              </h1>

              <p className="mt-2 max-w-2xl text-slate-600">
                Follow your curriculum, practise speaking and ask Ayo
                questions at any time.
              </p>

              <p className="mt-2 text-sm font-bold text-purple-700">
                Learning as {learner.name}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-bold text-purple-700">
                {learner.level}
              </span>

              <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
                Ages {learner.ageGroup}
              </span>

              <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-700">
                ⭐ {progress.points} points
              </span>
            </div>
          </div>
        </header>

        {errorMessage && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 font-semibold text-red-700"
          >
            {errorMessage}
          </div>
        )}

        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-purple-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
              Current unit
            </p>

            <p className="mt-2 text-lg font-bold text-slate-900">
              Unit {unit.unitNumber}: {unit.title}
            </p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-purple-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-600 to-blue-500 transition-all duration-500"
                style={{
                  width: `${unitProgressPercentage}%`,
                }}
              />
            </div>

            <p className="mt-2 text-sm font-semibold text-slate-500">
              {unitProgressPercentage}% unit progress
            </p>
          </div>

          <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Current lesson
            </p>

            <p className="mt-2 text-lg font-bold text-slate-900">
              Lesson {lessonIndex + 1}: {lesson.title}
            </p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-blue-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                style={{
                  width: `${lessonProgressPercentage}%`,
                }}
              />
            </div>

            <p className="mt-2 text-sm font-semibold text-slate-500">
              {lessonProgressPercentage}% lesson progress
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Current activity
            </p>

            <p className="mt-2 text-lg font-bold text-slate-900">
              Step {stepIndex + 1} of {lesson.steps.length}
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-600">
              {step.title}
            </p>
          </div>
        </section>

        <section className="grid overflow-hidden rounded-[2rem] border border-purple-100 bg-white shadow-xl lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="flex min-h-[620px] flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-white to-blue-100 p-8">
            <TutorAvatar
              name="Ayo"
              status={tutorStatus}
              academyLabel="Language Academy"
              tutorDescription={`Your personal ${languageLabel} tutor`}
            />

            <div className="mt-8 w-full max-w-sm rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur">
              <p className="text-sm font-bold text-purple-700">
                Today’s objective
              </p>

              <p className="mt-2 leading-7 text-slate-700">
                {lesson.objective}
              </p>
            </div>

            <div className="mt-4 grid w-full max-w-sm grid-cols-2 gap-3">
              <button
                type="button"
                onClick={testAudio}
                disabled={isBusy}
                className="rounded-2xl border-2 border-blue-200 bg-white px-4 py-3 font-bold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {audioWorking
                  ? "✓ Speaker ready"
                  : "🔊 Test speaker"}
              </button>

              <button
                type="button"
                onClick={requestMicrophone}
                disabled={isBusy}
                className="rounded-2xl border-2 border-purple-200 bg-white px-4 py-3 font-bold text-purple-700 transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {microphoneGranted
                  ? "✓ Mic ready"
                  : "🎤 Allow mic"}
              </button>
            </div>
          </aside>

          <div className="flex flex-col p-6 sm:p-10">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-purple-600">
                  {conversationMode === "curriculum"
                    ? "Curriculum lesson"
                    : "Free conversation"}
                </p>

                <h2 className="mt-1 text-2xl font-black text-slate-900">
                  {conversationMode === "curriculum"
                    ? step.title
                    : "Ask Ayo anything"}
                </h2>
              </div>

              <button
                type="button"
                onClick={
                  conversationMode === "curriculum"
                    ? switchToFreeConversation
                    : returnToCurriculum
                }
                disabled={isBusy}
                className="w-fit rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-bold text-purple-700 transition hover:bg-purple-100 disabled:opacity-50"
              >
                {conversationMode === "curriculum"
                  ? "Explore freely"
                  : "Return to lesson"}
              </button>
            </div>

            <TutorSpeechBubble text={tutorMessage} />

            {tutorStatus === "thinking" && (
              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-amber-50 px-5 py-4 font-semibold text-amber-700">
                <span className="animate-pulse text-xl">
                  ✨
                </span>
                Ayo is thinking...
              </div>
            )}

            {learnerTranscript && (
              <div className="mt-5 rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-xs font-black uppercase tracking-wider text-emerald-700">
                  You said
                </p>

                <p className="mt-2 text-lg font-bold text-slate-900">
                  “{learnerTranscript}”
                </p>
              </div>
            )}

            {correctedPhrase && (
              <div className="mt-4 rounded-3xl border border-blue-200 bg-blue-50 p-5">
                <p className="text-xs font-black uppercase tracking-wider text-blue-700">
                  Correct phrase
                </p>

                <p className="mt-2 text-xl font-black text-slate-900">
                  {correctedPhrase}
                </p>
              </div>
            )}

            {encouragement && (
              <div className="mt-4 rounded-3xl border border-yellow-200 bg-yellow-50 p-5 font-bold text-yellow-800">
                ⭐ {encouragement}
              </div>
            )}

            {!lessonStarted ? (
              <button
                type="button"
                onClick={startLesson}
                disabled={isBusy}
                className="mt-7 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-5 text-lg font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                Start my curriculum lesson
              </button>
            ) : (
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {tutorStatus === "listening" ? (
                  <button
                    type="button"
                    onClick={stopListening}
                    className="rounded-2xl bg-red-600 px-6 py-5 text-lg font-black text-white shadow-lg transition hover:bg-red-700"
                  >
                    ⏹ Stop listening
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={beginListening}
                    disabled={isBusy}
                    className="rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-5 text-lg font-black text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    🎤 Speak now
                  </button>
                )}

                <button
                  type="button"
                  onClick={repeatTutorMessage}
                  disabled={isBusy}
                  className="rounded-2xl border-2 border-blue-200 bg-blue-50 px-6 py-5 text-lg font-black text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  🔊 Hear Ayo again
                </button>
              </div>
            )}

            {tutorStatus === "speaking" && (
              <button
                type="button"
                onClick={stopSpeech}
                className="mt-3 rounded-xl border border-slate-300 bg-white px-4 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Stop audio
              </button>
            )}

            {lessonStarted &&
              conversationMode === "curriculum" && (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    disabled={isFirstStep || isBusy}
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-4 font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ← Previous step
                  </button>

                  <button
                    type="button"
                    onClick={continueToNextStep}
                    disabled={isBusy}
                    className="rounded-2xl bg-slate-900 px-5 py-4 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLastStep
                      ? "Complete lesson"
                      : "Continue to next step →"}
                  </button>
                </div>
              )}

            <div className="mt-8 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-purple-50 p-4">
                <p className="text-2xl">⭐</p>
                <p className="mt-1 text-sm font-black text-slate-800">
                  {progress.points}
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  Points
                </p>
              </div>

              <div className="rounded-2xl bg-blue-50 p-4">
                <p className="text-2xl">🔥</p>
                <p className="mt-1 text-sm font-black text-slate-800">
                  {progress.streak}
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  Day streak
                </p>
              </div>

              <div className="rounded-2xl bg-yellow-50 p-4">
                <p className="text-2xl">🏆</p>
                <p className="mt-1 text-sm font-black text-slate-800">
                  {progress.completedLessonIds.length}
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  Lessons
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}