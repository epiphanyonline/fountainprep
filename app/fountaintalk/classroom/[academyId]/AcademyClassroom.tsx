"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useMemo,
  useState,
  type CSSProperties,
} from "react";

import { useAcademyClassroom } from "../../hooks/useAcademyClassroom";

import SceneVisual from "../../components/SceneVisual";

import type {
  AyoPose,
  NonLanguageAcademyId,
  StepKind,
} from "../../types/academy";

type AcademyClassroomProps = {
  academyId: NonLanguageAcademyId;
};

const statusLabels = {
  ready: "Ready for you",
  listening: "Listening",
  thinking: "Thinking with you",
  speaking: "Teaching now",
  completed: "Class complete",
} as const;

const stepLabels: Record<StepKind, string> = {
  welcome: "Opening idea",
  teach: "Core concept",
  story: "Story",
  concept: "Key concept",
  illustration: "Illustration",
  diagram: "Visual explanation",
  example: "Worked example",
  "worked-example": "Worked example",
  "case-study": "Case study",
  "decision-framework": "Decision framework",
  question: "Case question",
  practice: "Guided practice",
  reflection: "Your perspective",
  challenge: "Live challenge",
  summary: "Lesson summary",
  quiz: "Knowledge check",
  assessment: "Assessment",
  transition: "Next idea",
};

const poseImages: Record<AyoPose, string> = {
  neutral: "/images/fountaintalk/ayo-presenter.png",
  welcome: "/images/fountaintalk/ayo-welcome.png",
  "open-hands": "/images/fountaintalk/ayo-open-hands.png",
  explain: "/images/fountaintalk/ayo-explain.png",
  "point-slide": "/images/fountaintalk/ayo-point-slide.png",
  listen: "/images/fountaintalk/ayo-listening.png",
  think: "/images/fountaintalk/ayo-thinking.png",
  encourage: "/images/fountaintalk/ayo-encouraging.png",
  celebrate: "/images/fountaintalk/ayo-celebrating.png",
  "walk-left": "/images/fountaintalk/ayo-walk-left.png",
  "walk-right": "/images/fountaintalk/ayo-walk-right.png",
};

export default function AcademyClassroom({
  academyId,
}: AcademyClassroomProps) {
  const [raiseHandOpen, setRaiseHandOpen] = useState(false);
  const [imageFallback, setImageFallback] = useState(false);

  const classroom = useAcademyClassroom(academyId);

  const {
    academy,
    course,
    unit,
    lesson,
    step,
    progress,
    session,
    classPromise,
    learningOutcomes,
    hydrated,
    lessonStarted,
    tutorStatus,
    tutorMessage,
    ayoPose,
    microphoneMuted,
    microphoneMode,
    selectedAnswer,
    typedAnswer,
    feedback,
    errorMessage,
    isSubmitting,
    askAyoText,
    askAyoReply,
    courseProgressPercentage,
    lessonProgressPercentage,
    canGoBack,
    canContinue,
    setSelectedAnswer,
    setTypedAnswer,
    setAskAyoText,
    startLesson,
    toggleMicrophone,
    repeatTutorMessage,
    stopSpeech,
    submitAnswer,
    askAyo,
    goToPreviousStep,
    continueToNextStep,
  } = classroom;

  const busy =
    tutorStatus === "thinking" ||
    tutorStatus === "speaking" ||
    isSubmitting;

  const theme = {
    "--academy-accent": academy.accent,
    "--academy-dark": academy.accentDark,
    "--academy-soft": academy.soft,
  } as CSSProperties;

  const stepPosition = progress.currentStepIndex + 1;
  const lessonPosition = progress.currentLessonIndex + 1;
  const isLastStep =
    progress.currentStepIndex === lesson.steps.length - 1;
  const isLastLesson =
    progress.currentLessonIndex === unit.lessons.length - 1;

  const presenterImage = imageFallback
    ? "/images/fountaintalk/ayo-presenter.png"
    : poseImages[ayoPose];

  const scene = useMemo(() => {
    if (!lessonStarted || session.phase === "arrival") {
      return {
        label: "Private class",
        eyebrow: lesson.title,
        title: "Your class is ready",
        body: classPromise,
        outcomes: learningOutcomes,
      };
    }

    if (session.phase === "ask-name") {
      return {
        label: "Welcome",
        eyebrow: `${academy.shortTitle} Academy`,
        title: "Let’s get acquainted",
        body: "Ayo is listening. Tell him what you would like to be called.",
        outcomes: [],
      };
    }

    if (session.phase === "desired-outcome") {
      return {
        label: "Your goals",
        eyebrow: lesson.title,
        title: "What would make this class valuable?",
        body: "Your answer helps Ayo shape the examples, pace and emphasis of the lesson.",
        outcomes: [],
      };
    }

    if (
      session.phase === "lesson-promise" ||
      session.phase === "prior-knowledge"
    ) {
      return {
        label: "Today’s promise",
        eyebrow: lesson.title,
        title: classPromise,
        body:
          session.phase === "prior-knowledge"
            ? "Before teaching begins, Ayo wants to understand what you already know."
            : "Here is what this lesson will help you do.",
        outcomes: learningOutcomes,
      };
    }

    return {
      label: stepLabels[step.kind],
      eyebrow: lesson.title,
      title: step.title,
      body: step.question ?? lesson.objective,
      outcomes: [],
    };
  }, [
    academy.shortTitle,
    classPromise,
    learningOutcomes,
    lesson.objective,
    lesson.title,
    lessonStarted,
    session.phase,
    step.kind,
    step.question,
    step.title,
  ]);

  if (!hydrated) {
    return (
      <main className="classroom-loading" style={theme}>
        <div className="loading-mark">
          <span />
          <span />
          <span />
        </div>
        <strong>Preparing your private class</strong>
        <p>Setting the room, slides and voice session…</p>
      </main>
    );
  }

  return (
    <main className="academy-classroom" style={theme}>
      <div className="classroom-shell">
        <header className="classroom-topbar">
          <Link href="/fountaintalk" className="topbar-link">
            <span>←</span>
            Leave classroom
          </Link>

          <div className="classroom-brand">
            <strong>{academy.title}</strong>
            <span>Fountain Prep</span>
          </div>

          <div className="topbar-tools">
            <button
              type="button"
              className={`mic-control ${
                microphoneMuted ? "is-muted" : ""
              }`}
              onClick={toggleMicrophone}
              disabled={!lessonStarted}
            >
              <span>{microphoneMuted ? "🔇" : "🎙"}</span>
              <div>
                <strong>
                  {microphoneMuted ? "Mic muted" : "Mic live"}
                </strong>
                <small>
                  {microphoneMuted
                    ? "Tap to rejoin"
                    : microphoneMode === "listening"
                      ? "Ayo is listening"
                      : "Voice-ready class"}
                </small>
              </div>
            </button>

            <Link
              href="/fountaintalk/progress"
              className="progress-chip"
            >
              Progress
              <strong>{courseProgressPercentage}%</strong>
            </Link>
          </div>
        </header>

        {errorMessage && (
          <div className="classroom-alert" role="alert">
            <b>!</b>
            <span>{errorMessage}</span>
          </div>
        )}

        <section className="learning-room">
          <header className="room-header">
            <div className="session-identity">
              <span className="academy-icon">{academy.icon}</span>
              <div>
                <small>
                  {academy.title} · {course.level}
                </small>
                <strong>{course.title}</strong>
              </div>
            </div>

            <div className="session-location">
              <small>
                Unit {unit.unitNumber} · Lesson {lessonPosition}
              </small>
              <strong>{lesson.title}</strong>
            </div>

            <div className="lesson-progress">
              <div>
                <span>Lesson progress</span>
                <strong>{lessonProgressPercentage}%</strong>
              </div>
              <div className="progress-track">
                <span
                  style={{
                    width: `${lessonProgressPercentage}%`,
                  }}
                />
              </div>
            </div>
          </header>

          <div className="teaching-stage">
            <div className="stage-glow stage-glow-one" />
            <div className="stage-glow stage-glow-two" />

            <article className="premium-slide">
              <div className="slide-topline">
                <span>{scene.label}</span>
                <small>
                  {session.phase === "teaching"
                    ? `Slide ${stepPosition} / ${lesson.steps.length}`
                    : "Class opening"}
                </small>
              </div>

              <div className="slide-content">
                <span className="slide-eyebrow">
                  {scene.eyebrow}
                </span>

                <h1>{scene.title}</h1>
                <p>{scene.body}</p>

                {scene.outcomes.length > 0 && (
                  <div className="outcome-grid">
                    {scene.outcomes.map((outcome, index) => (
                      <div key={outcome}>
                        <span>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <strong>{outcome}</strong>
                      </div>
                    ))}
                  </div>
                )}

                {session.phase === "teaching" && step.visual && (
                  <SceneVisual step={step} />
                )}

                {session.phase === "teaching" && step.code && (
                  <div className="code-card">
                    <div className="code-bar">
                      <span />
                      <span />
                      <span />
                      <small>AYO LAB</small>
                    </div>
                    <pre>{step.code}</pre>
                  </div>
                )}
              </div>

              <footer>
                <span>FOUNTAIN PREP</span>
                <i />
                <small>
                  {academy.shortTitle.toUpperCase()} ACADEMY
                </small>
              </footer>
            </article>

            <aside
              className={`presenter presenter-${tutorStatus} pose-${ayoPose}`}
            >
              <div className="presenter-aura" />

              <div className="presenter-frame">
                <Image
                  key={presenterImage}
                  src={presenterImage}
                  alt="Ayo teaching this class"
                  fill
                  priority
                  sizes="(max-width: 760px) 84vw, 42vw"
                  className="presenter-image"
                  onError={() => setImageFallback(true)}
                />
              </div>

              <div className="presenter-status">
                <span className="status-dot" />
                <div>
                  <strong>AYO</strong>
                  <small>{statusLabels[tutorStatus]}</small>
                </div>

                {tutorStatus === "speaking" && (
                  <div className="voice-wave">
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                )}
              </div>
            </aside>

            {lessonStarted && !progress.completedAt && (
              <div className="conversation-bar" aria-live="polite">
                <div className="conversation-person">
                  <span>A</span>
                  <div>
                    <strong>Ayo</strong>
                    <small>
                      {microphoneMode === "listening"
                        ? "Listening to you"
                        : "Your private tutor"}
                    </small>
                  </div>
                </div>

                <p>{tutorMessage}</p>

                <div className="conversation-actions">
                  {tutorStatus === "speaking" ? (
                    <button type="button" onClick={stopSpeech}>
                      Pause
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={repeatTutorMessage}
                      disabled={busy}
                    >
                      Hear again
                    </button>
                  )}

                  <button
                    type="button"
                    className={raiseHandOpen ? "is-active" : ""}
                    onClick={() =>
                      setRaiseHandOpen((current) => !current)
                    }
                  >
                    ✋ Raise hand
                  </button>
                </div>
              </div>
            )}

            {!lessonStarted && !progress.completedAt && (
              <div className="start-panel">
                <span>Private, voice-led learning</span>
                <h2>Enter your classroom</h2>
                <p>
                  Ayo will begin teaching immediately. Slides and visual
                  models will move with the lecture. Raise your
                  hand whenever you want him to pause.
                </p>

                <div className="session-facts">
                  <span>
                    <b>{lesson.estimatedMinutes}</b> minutes
                  </span>
                  <span>
                    <b>{learningOutcomes.length}</b> outcomes
                  </span>
                  <span>
                    <b>{lesson.completionPoints}</b> points
                  </span>
                </div>

                <button type="button" onClick={startLesson}>
                  Begin cinematic class
                  <span>→</span>
                </button>

                <small>
                  Your microphone stays closed during the lecture until
                  you choose to raise your hand.
                </small>
              </div>
            )}

            {raiseHandOpen &&
              lessonStarted &&
              !progress.completedAt && (
                <aside className="raise-hand-panel">
                  <div className="raise-hand-heading">
                    <div>
                      <span>Ask during class</span>
                      <strong>
                        What would you like Ayo to explain?
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => setRaiseHandOpen(false)}
                    >
                      ×
                    </button>
                  </div>

                  <textarea
                    value={askAyoText}
                    onChange={(event) =>
                      setAskAyoText(event.target.value)
                    }
                    placeholder="Ask about the idea, example or case…"
                    rows={3}
                    disabled={busy}
                  />

                  <button
                    type="button"
                    onClick={askAyo}
                    disabled={busy || !askAyoText.trim()}
                  >
                    Ask Ayo
                  </button>

                  {askAyoReply && (
                    <div className="raise-hand-reply">
                      <span>AYO</span>
                      <p>{askAyoReply}</p>
                    </div>
                  )}
                </aside>
              )}
          </div>

          {progress.completedAt ? (
            <section className="completion-deck">
              <span className="completion-seal">✓</span>
              <div>
                <small>Course complete</small>
                <h2>You completed {course.title}.</h2>
                <p>
                  Your work has been saved. You earned{" "}
                  {progress.points} points.
                </p>
              </div>

              <div className="completion-actions">
                <Link href="/fountaintalk">
                  Explore academies
                </Link>
                <Link href="/fountaintalk/progress">
                  View progress
                </Link>
              </div>
            </section>
          ) : lessonStarted &&
            session.phase === "teaching" ? (
            <section className="interaction-deck">
              <div className="interaction-heading">
                <span>
                  {step.responseType === "none"
                    ? "Teaching moment"
                    : "Your turn"}
                </span>
                <h2>
                  {step.responseType === "none"
                    ? "Ayo is leading the class."
                    : step.question}
                </h2>
                <p>
                  {step.responseType === "none"
                    ? "The lesson will continue automatically after the explanation."
                    : microphoneMuted
                      ? "Your microphone is muted. Choose or type your answer."
                      : "Speak naturally. Ayo is ready to respond."}
                </p>
              </div>

              {step.responseType === "choice" && (
                <div className="choice-row">
                  {step.choices?.map((choice) => (
                    <button
                      type="button"
                      key={choice.id}
                      className={
                        selectedAnswer === choice.label
                          ? "is-selected"
                          : ""
                      }
                      onClick={() =>
                        setSelectedAnswer(choice.label)
                      }
                      disabled={busy}
                    >
                      <b>{choice.id.toUpperCase()}</b>
                      <span>{choice.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {step.responseType === "text" && (
                <div className="response-fallback">
                  <textarea
                    value={typedAnswer}
                    onChange={(event) =>
                      setTypedAnswer(event.target.value)
                    }
                    placeholder="Type here only if you prefer not to speak…"
                    rows={2}
                    disabled={busy}
                  />
                </div>
              )}

              {feedback && (
                <div
                  className={`tutor-feedback ${
                    feedback.isCorrect ? "correct" : "retry"
                  }`}
                >
                  <span>{feedback.isCorrect ? "✓" : "↻"}</span>
                  <div>
                    <strong>
                      {feedback.isCorrect
                        ? feedback.encouragement
                        : "Let us think about that together."}
                    </strong>
                    <p>{feedback.displayText}</p>
                    {!feedback.isCorrect && feedback.hint && (
                      <small>Clue: {feedback.hint}</small>
                    )}
                  </div>
                </div>
              )}

              <div className="deck-actions">
                <button
                  type="button"
                  className="secondary-action"
                  onClick={goToPreviousStep}
                  disabled={!canGoBack || busy}
                >
                  ← Previous
                </button>

                <div className="step-dots">
                  {lesson.steps.map((lessonStep, index) => (
                    <span
                      key={lessonStep.id}
                      className={`${
                        progress.completedStepIds.includes(
                          lessonStep.id
                        )
                          ? "is-complete"
                          : ""
                      } ${
                        index === progress.currentStepIndex
                          ? "is-current"
                          : ""
                      }`}
                    >
                      {index + 1}
                    </span>
                  ))}
                </div>

                {step.responseType !== "none" &&
                !feedback?.isCorrect ? (
                  <button
                    type="button"
                    className="primary-action"
                    onClick={submitAnswer}
                    disabled={
                      busy ||
                      (step.responseType === "choice"
                        ? !selectedAnswer
                        : !typedAnswer.trim())
                    }
                  >
                    {isSubmitting
                      ? "Ayo is considering…"
                      : microphoneMuted
                        ? "Send typed answer"
                        : "Send answer"}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="primary-action quiet"
                    onClick={continueToNextStep}
                    disabled={!canContinue || busy}
                  >
                    {isLastStep
                      ? isLastLesson
                        ? "Complete course"
                        : "Complete lesson"
                      : "Continue now"}
                    <span>→</span>
                  </button>
                )}
              </div>
            </section>
          ) : null}
        </section>
      </div>

      <style jsx global>{`
        :root { color-scheme: dark; }
        * { box-sizing: border-box; }

        .classroom-loading {
          min-height: 82vh;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 12px;
          color: white;
          text-align: center;
          background: #070a11;
        }

        .classroom-loading p {
          margin: 0;
          color: #939aa8;
        }

        .loading-mark {
          height: 42px;
          display: flex;
          align-items: end;
          gap: 6px;
        }

        .loading-mark span {
          width: 7px;
          height: 20px;
          border-radius: 999px;
          background: var(--academy-accent);
          animation: loading-wave 0.7s ease-in-out infinite alternate;
        }

        .loading-mark span:nth-child(2) {
          height: 38px;
          animation-delay: 0.15s;
        }

        .loading-mark span:nth-child(3) {
          height: 27px;
          animation-delay: 0.3s;
        }

        @keyframes loading-wave {
          to { transform: scaleY(0.45); opacity: 0.45; }
        }

        .academy-classroom {
          min-height: 100vh;
          color: #f8f7fb;
          background:
            radial-gradient(circle at 8% -6%, color-mix(in srgb, var(--academy-accent) 23%, transparent), transparent 30%),
            radial-gradient(circle at 92% 4%, rgba(124, 58, 237, 0.18), transparent 25%),
            #070a11;
        }

        .classroom-shell {
          width: min(1500px, 100%);
          margin: 0 auto;
          padding: 0 22px 48px;
        }

        .classroom-topbar {
          min-height: 72px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 18px;
        }

        .topbar-link,
        .progress-chip {
          color: #c9ced7;
          text-decoration: none;
          font-size: 12px;
          font-weight: 850;
        }

        .topbar-link {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 9px;
        }

        .topbar-link span { font-size: 18px; }

        .classroom-brand { text-align: center; }
        .classroom-brand strong,
        .classroom-brand span { display: block; }
        .classroom-brand strong { font-size: 14px; }
        .classroom-brand span {
          margin-top: 3px;
          color: #747b88;
          font-size: 9px;
        }

        .topbar-tools {
          justify-self: end;
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .mic-control {
          min-height: 43px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 7px 11px;
          color: white;
          background: rgba(34, 197, 94, 0.12);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 13px;
          cursor: pointer;
        }

        .mic-control.is-muted {
          background: rgba(244, 63, 94, 0.12);
          border-color: rgba(244, 63, 94, 0.28);
        }

        .mic-control > span { font-size: 17px; }
        .mic-control strong,
        .mic-control small {
          display: block;
          text-align: left;
        }
        .mic-control strong { font-size: 10px; }
        .mic-control small {
          margin-top: 2px;
          color: #98a0ad;
          font-size: 8px;
        }

        .progress-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 11px;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
        }

        .progress-chip strong { color: white; }

        .classroom-alert {
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          color: #fecdd3;
          background: rgba(159, 18, 57, 0.17);
          border: 1px solid rgba(251, 113, 133, 0.28);
          border-radius: 14px;
          font-size: 12px;
        }

        .classroom-alert b {
          width: 24px;
          height: 24px;
          display: grid;
          place-items: center;
          color: white;
          background: #e11d48;
          border-radius: 50%;
        }

        .learning-room {
          overflow: hidden;
          background: #0d111a;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 28px;
          box-shadow: 0 38px 110px rgba(0, 0, 0, 0.46);
        }

        .room-header {
          min-height: 72px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 20px;
          padding: 13px 18px;
          background: rgba(6, 9, 15, 0.88);
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .session-identity {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .academy-icon {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          background: color-mix(in srgb, var(--academy-accent) 15%, transparent);
          border: 1px solid color-mix(in srgb, var(--academy-accent) 28%, transparent);
          border-radius: 12px;
          font-size: 20px;
        }

        .session-identity small,
        .session-location small {
          display: block;
          color: #7d8592;
          font-size: 8px;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: 0.09em;
        }

        .session-identity strong,
        .session-location strong {
          display: block;
          margin-top: 4px;
          color: white;
          font-size: 12px;
        }

        .session-location { text-align: center; }

        .lesson-progress {
          width: min(240px, 100%);
          justify-self: end;
        }

        .lesson-progress > div:first-child {
          display: flex;
          justify-content: space-between;
          font-size: 9px;
        }

        .lesson-progress span { color: #808896; }

        .progress-track {
          height: 4px;
          margin-top: 8px;
          overflow: hidden;
          background: #252b35;
          border-radius: 999px;
        }

        .progress-track span {
          display: block;
          height: 100%;
          background: var(--academy-accent);
          border-radius: inherit;
          transition: width 0.5s ease;
        }

        .teaching-stage {
          min-height: clamp(650px, 72vh, 820px);
          position: relative;
          isolation: isolate;
          overflow: hidden;
          background:
            linear-gradient(115deg, color-mix(in srgb, var(--academy-dark) 80%, #0b1018) 0 58%, #0a0e16 58% 100%);
        }

        .stage-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.58;
          z-index: -1;
        }

        .stage-glow-one {
          width: 560px;
          height: 560px;
          left: -180px;
          top: -260px;
          background: color-mix(in srgb, var(--academy-accent) 34%, transparent);
        }

        .stage-glow-two {
          width: 420px;
          height: 420px;
          right: -80px;
          bottom: -220px;
          background: color-mix(in srgb, var(--academy-accent) 22%, transparent);
        }

        .premium-slide {
          position: absolute;
          inset: 28px 39% 132px 28px;
          z-index: 1;
          padding: clamp(28px, 3vw, 48px);
          color: #211826;
          background:
            radial-gradient(circle at 92% 8%, color-mix(in srgb, var(--academy-soft) 88%, white), transparent 30%),
            linear-gradient(145deg, #ffffff, #f7f7fb);
          border: 1px solid rgba(255, 255, 255, 0.72);
          border-radius: 26px;
          box-shadow: 0 34px 90px rgba(0, 0, 0, 0.34);
          overflow: hidden;
        }

        .premium-slide::after {
          content: "";
          width: 230px;
          height: 230px;
          position: absolute;
          right: -115px;
          top: -115px;
          border: 32px solid color-mix(in srgb, var(--academy-accent) 11%, transparent);
          border-radius: 50%;
        }

        .slide-topline {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          gap: 16px;
        }

        .slide-topline span {
          padding: 7px 10px;
          color: var(--academy-dark);
          background: var(--academy-soft);
          border-radius: 999px;
          font-size: 8px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .slide-topline small {
          color: #9992a0;
          font-size: 8px;
          font-weight: 800;
        }

        .slide-content {
          width: min(780px, 95%);
          margin-top: clamp(34px, 5vh, 64px);
          position: relative;
          z-index: 1;
        }

        .slide-eyebrow {
          color: var(--academy-accent);
          font-size: 9px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.13em;
        }

        .slide-content h1 {
          max-width: 760px;
          margin: 11px 0 0;
          color: #1b1421;
          font-size: clamp(38px, 4vw, 66px);
          line-height: 0.98;
          letter-spacing: -0.058em;
        }

        .slide-content > p {
          max-width: 700px;
          margin: 18px 0 0;
          color: #68606d;
          font-size: clamp(14px, 1.2vw, 18px);
          line-height: 1.58;
        }

        .outcome-grid {
          margin-top: 25px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .outcome-grid > div {
          min-height: 72px;
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: center;
          gap: 11px;
          padding: 13px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid #e7e3e9;
          border-radius: 15px;
          box-shadow: 0 12px 28px rgba(41, 31, 48, 0.06);
        }

        .outcome-grid span {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          color: var(--academy-accent);
          background: var(--academy-soft);
          border-radius: 10px;
          font-size: 8px;
          font-weight: 950;
        }

        .outcome-grid strong {
          color: #4b424f;
          font-size: 11px;
          line-height: 1.45;
        }

        .visual-card {
          max-width: 700px;
          margin-top: 25px;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 17px;
          padding: 18px;
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid #e5e0e8;
          border-radius: 18px;
        }

        .visual-symbol {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          background: var(--academy-soft);
          border-radius: 15px;
          font-size: 26px;
        }

        .visual-card strong { font-size: 14px; }

        .visual-points {
          margin-top: 11px;
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .visual-points span {
          padding: 7px 9px;
          color: #57505b;
          background: #f2eff4;
          border-radius: 9px;
          font-size: 9px;
          font-weight: 800;
        }

        .code-card {
          margin-top: 22px;
          overflow: hidden;
          color: #dffab8;
          background: #111622;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
        }

        .code-bar {
          height: 36px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 13px;
          background: #1b2230;
        }

        .code-bar span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #fb7185;
        }

        .code-bar span:nth-child(2) { background: #fbbf24; }
        .code-bar span:nth-child(3) { background: #4ade80; }

        .code-bar small {
          margin-left: auto;
          color: #778092;
          font-size: 7px;
          font-weight: 900;
        }

        .code-card pre {
          margin: 0;
          padding: 18px;
          white-space: pre-wrap;
          font-size: 12px;
          line-height: 1.7;
        }

        .premium-slide footer {
          position: absolute;
          left: clamp(28px, 3vw, 48px);
          right: clamp(28px, 3vw, 48px);
          bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #9b95a0;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .premium-slide footer i {
          flex: 1;
          height: 1px;
          background: #e5e1e8;
        }

        .presenter {
          width: 46%;
          height: 96%;
          position: absolute;
          right: -1%;
          bottom: 0;
          z-index: 3;
          transition: transform 0.55s ease, opacity 0.35s ease;
          filter: drop-shadow(-26px 26px 34px rgba(0, 0, 0, 0.38));
        }

        .presenter-aura {
          width: 75%;
          height: 65%;
          position: absolute;
          right: 0;
          top: 3%;
          background: color-mix(in srgb, var(--academy-accent) 25%, transparent);
          border-radius: 50%;
          filter: blur(72px);
        }

        .presenter-frame { position: absolute; inset: 0; }

        .presenter-image {
          object-fit: contain;
          object-position: center bottom;
          animation: pose-enter 0.45s ease both;
        }

        @keyframes pose-enter {
          from {
            opacity: 0;
            transform: translateX(16px) scale(0.99);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        .presenter-speaking {
          animation: presenter-breathe 1.4s ease-in-out infinite alternate;
        }

        .presenter-listening {
          transform: translateX(-10px) scale(1.015);
        }

        .pose-walk-left { transform: translateX(-50px); }
        .pose-walk-right { transform: translateX(25px); }

        @keyframes presenter-breathe {
          to { transform: translateY(-4px) scale(1.004); }
        }

        .presenter-status {
          position: absolute;
          right: 7%;
          top: 10%;
          z-index: 5;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 10px 12px;
          color: #292230;
          background: rgba(255, 255, 255, 0.93);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 14px;
          box-shadow: 0 16px 38px rgba(0, 0, 0, 0.22);
          backdrop-filter: blur(16px);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.13);
        }

        .presenter-status strong,
        .presenter-status small { display: block; }
        .presenter-status strong { font-size: 9px; }
        .presenter-status small {
          margin-top: 2px;
          color: #73717a;
          font-size: 7px;
        }

        .voice-wave {
          height: 16px;
          display: flex;
          align-items: center;
          gap: 2px;
          margin-left: 3px;
        }

        .voice-wave i {
          width: 2px;
          height: 6px;
          background: var(--academy-accent);
          border-radius: 999px;
          animation: bars 0.65s ease-in-out infinite alternate;
        }

        .voice-wave i:nth-child(2) {
          height: 14px;
          animation-delay: 0.12s;
        }

        .voice-wave i:nth-child(3) {
          height: 10px;
          animation-delay: 0.24s;
        }

        .voice-wave i:nth-child(4) {
          height: 5px;
          animation-delay: 0.36s;
        }

        @keyframes bars {
          to { transform: scaleY(0.45); opacity: 0.45; }
        }

        .conversation-bar {
          min-height: 92px;
          position: absolute;
          left: 2.8%;
          right: 2.8%;
          bottom: 20px;
          z-index: 8;
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 17px;
          padding: 13px 15px;
          color: #29222f;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.82);
          border-radius: 19px;
          box-shadow: 0 24px 58px rgba(0, 0, 0, 0.34);
          backdrop-filter: blur(18px);
        }

        .conversation-person {
          display: flex;
          align-items: center;
          gap: 9px;
          padding-right: 15px;
          border-right: 1px solid #e3dfe6;
        }

        .conversation-person > span {
          width: 35px;
          height: 35px;
          display: grid;
          place-items: center;
          color: white;
          background: var(--academy-dark);
          border-radius: 11px;
          font-size: 12px;
          font-weight: 950;
        }

        .conversation-person strong,
        .conversation-person small {
          display: block;
          white-space: nowrap;
        }

        .conversation-person strong { font-size: 10px; }
        .conversation-person small {
          margin-top: 2px;
          color: #8b8490;
          font-size: 7px;
        }

        .conversation-bar > p {
          margin: 0;
          color: #443b49;
          font-size: clamp(11.5px, 1vw, 13.5px);
          line-height: 1.56;
        }

        .conversation-actions {
          display: flex;
          gap: 7px;
        }

        .conversation-actions button {
          padding: 9px 10px;
          color: #554d5a;
          background: #f4f1f6;
          border: 1px solid #e4dfe7;
          border-radius: 10px;
          font-size: 8px;
          font-weight: 850;
          cursor: pointer;
        }

        .conversation-actions button.is-active {
          color: white;
          background: var(--academy-dark);
        }

        .start-panel {
          width: min(530px, 45%);
          position: absolute;
          left: 5.5%;
          bottom: 7%;
          z-index: 9;
          padding: 27px;
          color: #292031;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(255, 255, 255, 0.82);
          border-radius: 23px;
          box-shadow: 0 30px 75px rgba(0, 0, 0, 0.36);
          backdrop-filter: blur(18px);
        }

        .start-panel > span {
          color: var(--academy-accent);
          font-size: 8px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .start-panel h2 {
          margin: 8px 0 0;
          font-size: clamp(29px, 3vw, 43px);
          letter-spacing: -0.05em;
        }

        .start-panel p {
          margin: 12px 0 0;
          color: #6a6270;
          font-size: 12.5px;
          line-height: 1.62;
        }

        .session-facts {
          margin-top: 17px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .session-facts span {
          padding: 8px 10px;
          color: #6b6372;
          background: #f2eff4;
          border-radius: 9px;
          font-size: 8px;
          font-weight: 800;
        }

        .session-facts b { color: #27202d; }

        .start-panel > button {
          width: 100%;
          min-height: 52px;
          margin-top: 17px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 28px;
          color: white;
          background: linear-gradient(135deg, var(--academy-accent), var(--academy-dark));
          border: 0;
          border-radius: 14px;
          font-size: 11px;
          font-weight: 950;
          cursor: pointer;
          box-shadow: 0 17px 34px color-mix(in srgb, var(--academy-accent) 24%, transparent);
        }

        .start-panel > small {
          display: block;
          margin-top: 9px;
          color: #99919f;
          text-align: center;
          font-size: 7px;
        }

        .raise-hand-panel {
          width: min(400px, calc(100% - 36px));
          position: absolute;
          right: 20px;
          top: 20px;
          z-index: 14;
          padding: 17px;
          color: #302737;
          background: rgba(255, 255, 255, 0.97);
          border-radius: 19px;
          box-shadow: 0 28px 74px rgba(0, 0, 0, 0.4);
        }

        .raise-hand-heading {
          display: flex;
          justify-content: space-between;
          gap: 14px;
        }

        .raise-hand-heading span,
        .raise-hand-heading strong { display: block; }

        .raise-hand-heading span {
          color: var(--academy-accent);
          font-size: 8px;
          font-weight: 950;
          text-transform: uppercase;
        }

        .raise-hand-heading strong {
          margin-top: 5px;
          font-size: 12px;
        }

        .raise-hand-heading button {
          width: 28px;
          height: 28px;
          color: #756e7a;
          background: #f1eef3;
          border: 0;
          border-radius: 9px;
          font-size: 17px;
          cursor: pointer;
        }

        .raise-hand-panel textarea,
        .response-fallback textarea {
          width: 100%;
          margin-top: 12px;
          padding: 12px;
          color: #332a39;
          background: #faf9fb;
          border: 1px solid #ddd8e1;
          border-radius: 11px;
          outline: none;
          resize: vertical;
          font: inherit;
          font-size: 10px;
          line-height: 1.5;
        }

        .raise-hand-panel > button {
          width: 100%;
          min-height: 40px;
          margin-top: 8px;
          color: white;
          background: var(--academy-dark);
          border: 0;
          border-radius: 11px;
          font-size: 9px;
          font-weight: 900;
          cursor: pointer;
        }

        .raise-hand-reply {
          margin-top: 10px;
          padding: 11px;
          background: var(--academy-soft);
          border-radius: 11px;
        }

        .raise-hand-reply span {
          color: var(--academy-accent);
          font-size: 7px;
          font-weight: 950;
        }

        .raise-hand-reply p {
          margin: 4px 0 0;
          color: #514856;
          font-size: 10px;
          line-height: 1.5;
        }

        .interaction-deck,
        .completion-deck {
          padding: 20px;
          color: #2d2632;
          background: #f7f7fa;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .interaction-heading span {
          color: var(--academy-accent);
          font-size: 8px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .interaction-heading h2 {
          margin: 5px 0 0;
          color: #29212f;
          font-size: clamp(17px, 1.8vw, 23px);
          letter-spacing: -0.035em;
        }

        .interaction-heading p {
          margin: 6px 0 0;
          color: #7e7684;
          font-size: 10px;
        }

        .choice-row {
          margin-top: 15px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 9px;
        }

        .choice-row button {
          min-height: 63px;
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: center;
          gap: 10px;
          padding: 10px;
          color: #48404d;
          text-align: left;
          background: white;
          border: 1px solid #dfdbe3;
          border-radius: 13px;
          cursor: pointer;
        }

        .choice-row button.is-selected {
          border-color: var(--academy-accent);
          box-shadow: 0 0 0 3px var(--academy-soft);
        }

        .choice-row b {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          color: var(--academy-accent);
          background: var(--academy-soft);
          border-radius: 9px;
          font-size: 9px;
        }

        .choice-row span {
          font-size: 10px;
          font-weight: 800;
          line-height: 1.4;
        }

        .response-fallback { margin-top: 12px; }

        .tutor-feedback {
          margin-top: 13px;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 10px;
          padding: 12px;
          border-radius: 12px;
        }

        .tutor-feedback > span {
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          color: white;
          border-radius: 50%;
          font-weight: 950;
        }

        .tutor-feedback.correct {
          color: #14532d;
          background: #ecfdf5;
          border: 1px solid #bbf7d0;
        }

        .tutor-feedback.correct > span { background: #16a34a; }

        .tutor-feedback.retry {
          color: #7c2d12;
          background: #fff7ed;
          border: 1px solid #fed7aa;
        }

        .tutor-feedback.retry > span { background: #ea580c; }

        .tutor-feedback strong { font-size: 10px; }

        .tutor-feedback p {
          margin: 4px 0 0;
          font-size: 10px;
          line-height: 1.48;
        }

        .tutor-feedback small {
          display: block;
          margin-top: 4px;
          font-weight: 800;
        }

        .deck-actions {
          margin-top: 16px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 14px;
          padding-top: 15px;
          border-top: 1px solid #e2dfe5;
        }

        .secondary-action,
        .primary-action {
          min-height: 42px;
          padding: 0 14px;
          border-radius: 11px;
          font-size: 9px;
          font-weight: 900;
          cursor: pointer;
        }

        .secondary-action {
          justify-self: start;
          color: #68616d;
          background: white;
          border: 1px solid #dcd8df;
        }

        .primary-action {
          min-width: 160px;
          justify-self: end;
          color: white;
          background: linear-gradient(135deg, var(--academy-accent), var(--academy-dark));
          border: 0;
          box-shadow: 0 13px 27px color-mix(in srgb, var(--academy-accent) 22%, transparent);
        }

        .primary-action.quiet { opacity: 0.72; }

        button:disabled {
          cursor: not-allowed !important;
          opacity: 0.44;
          box-shadow: none;
        }

        .step-dots {
          display: flex;
          gap: 7px;
        }

        .step-dots span {
          width: 26px;
          height: 26px;
          display: grid;
          place-items: center;
          color: #89818f;
          background: #ece9ee;
          border: 1px solid #dfdbe2;
          border-radius: 50%;
          font-size: 8px;
          font-weight: 900;
        }

        .step-dots span.is-complete {
          color: white;
          background: var(--academy-accent);
          border-color: var(--academy-accent);
        }

        .step-dots span.is-current {
          border-color: var(--academy-accent);
          box-shadow: 0 0 0 3px var(--academy-soft);
        }

        .completion-deck {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 17px;
        }

        .completion-seal {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          color: white;
          background: #16a34a;
          border-radius: 50%;
          font-size: 23px;
          font-weight: 950;
        }

        .completion-deck small {
          color: #16a34a;
          font-size: 8px;
          font-weight: 950;
          text-transform: uppercase;
        }

        .completion-deck h2 {
          margin: 4px 0 0;
          font-size: 21px;
        }

        .completion-deck p {
          margin: 5px 0 0;
          color: #766f7a;
          font-size: 10px;
        }

        .completion-actions {
          display: flex;
          gap: 8px;
        }

        .completion-actions a {
          padding: 10px 11px;
          color: var(--academy-dark);
          background: white;
          border: 1px solid #dcd8e0;
          border-radius: 10px;
          font-size: 8px;
          font-weight: 900;
          text-decoration: none;
        }

        @media (max-width: 1080px) {
          .premium-slide { right: 36%; }
          .presenter { width: 49%; right: -7%; }
          .choice-row { grid-template-columns: 1fr; }
        }

        @media (max-width: 760px) {
          .classroom-shell { padding: 0 0 28px; }

          .classroom-topbar {
            min-height: 62px;
            grid-template-columns: 1fr auto;
            padding: 0 12px;
          }

          .classroom-brand,
          .progress-chip { display: none; }

          .learning-room {
            border-left: 0;
            border-right: 0;
            border-radius: 0;
          }

          .room-header {
            min-height: 66px;
            grid-template-columns: 1fr auto;
            padding: 10px 12px;
          }

          .session-location { display: none; }
          .lesson-progress { width: 105px; }
          .teaching-stage { min-height: 760px; }

          .premium-slide {
            inset: 14px 14px 310px 14px;
            padding: 23px;
            border-radius: 20px;
          }

          .slide-content {
            width: 100%;
            margin-top: 28px;
          }

          .slide-content h1 {
            font-size: clamp(33px, 10vw, 48px);
          }

          .outcome-grid { grid-template-columns: 1fr; }
          .premium-slide footer { display: none; }

          .presenter {
            width: 76%;
            height: 52%;
            right: -15%;
            bottom: 112px;
          }

          .presenter-status {
            right: 12%;
            top: 6%;
          }

          .conversation-bar {
            left: 10px;
            right: 10px;
            bottom: 10px;
            min-height: 145px;
            grid-template-columns: 1fr;
            gap: 8px;
            padding: 11px;
          }

          .conversation-person {
            padding-right: 0;
            border-right: 0;
          }

          .conversation-bar > p {
            max-height: 63px;
            overflow-y: auto;
            font-size: 11px;
          }

          .start-panel {
            width: calc(100% - 24px);
            left: 12px;
            bottom: 12px;
            padding: 20px;
          }

          .interaction-deck { padding: 17px 12px; }

          .deck-actions {
            grid-template-columns: 1fr 1fr;
          }

          .step-dots {
            grid-column: 1 / -1;
            grid-row: 1;
            justify-content: center;
          }

          .secondary-action {
            grid-column: 1;
            grid-row: 2;
          }

          .primary-action {
            grid-column: 2;
            grid-row: 2;
            width: 100%;
            min-width: 0;
          }

          .completion-deck {
            grid-template-columns: auto 1fr;
          }

          .completion-actions {
            grid-column: 1 / -1;
          }
        }


        .scene-visual {
          max-width: 720px;
          margin-top: 24px;
          padding: 18px;
          color: #352c3a;
          background:
            radial-gradient(circle at 100% 0%, var(--academy-soft), transparent 38%),
            rgba(255, 255, 255, 0.84);
          border: 1px solid #e2dde6;
          border-radius: 20px;
          box-shadow: 0 18px 38px rgba(47, 35, 55, 0.08);
          overflow: hidden;
          animation: scene-rise 0.65s cubic-bezier(.2,.8,.2,1) both;
        }

        .scene-visual header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .scene-visual header small,
        .scene-visual header strong {
          display: block;
        }

        .scene-visual header small {
          color: var(--academy-accent);
          font-size: 7px;
          font-weight: 950;
          letter-spacing: 0.13em;
        }

        .scene-visual header strong {
          margin-top: 4px;
          font-size: 14px;
        }

        .scene-symbol {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          background: var(--academy-soft);
          border-radius: 15px;
          font-size: 25px;
          animation: symbol-float 2.4s ease-in-out infinite alternate;
        }

        .animated-card-grid,
        .comparison-grid {
          margin-top: 16px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 9px;
        }

        .animated-card-grid > div,
        .comparison-grid > div {
          min-height: 58px;
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: center;
          gap: 10px;
          padding: 11px;
          background: rgba(255,255,255,.84);
          border: 1px solid #e5e0e8;
          border-radius: 13px;
          animation: card-arrive .55s cubic-bezier(.2,.8,.2,1) both;
        }

        .animated-card-grid span,
        .comparison-grid span {
          width: 29px;
          height: 29px;
          display: grid;
          place-items: center;
          color: var(--academy-accent);
          background: var(--academy-soft);
          border-radius: 9px;
          font-size: 8px;
          font-weight: 950;
        }

        .animated-card-grid strong,
        .comparison-grid strong {
          font-size: 10px;
          line-height: 1.35;
        }

        .scene-flow {
          margin-top: 19px;
          display: flex;
          align-items: stretch;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .scene-flow-item {
          display: flex;
          align-items: center;
          gap: 8px;
          animation: flow-enter .6s ease both;
        }

        .scene-flow-item span {
          min-width: 105px;
          min-height: 64px;
          display: grid;
          place-items: center;
          padding: 10px;
          text-align: center;
          background: white;
          border: 1px solid #e4dfe7;
          border-radius: 14px;
          font-size: 10px;
          font-weight: 850;
        }

        .scene-flow-item b {
          color: var(--academy-accent);
          font-size: 20px;
          animation: arrow-pulse 1s ease-in-out infinite alternate;
        }

        .diagram-orbit {
          width: min(460px, 100%);
          height: 250px;
          position: relative;
          margin: 10px auto 0;
        }

        .diagram-core {
          width: 84px;
          height: 84px;
          position: absolute;
          left: 50%;
          top: 50%;
          display: grid;
          place-items: center;
          transform: translate(-50%, -50%);
          background: var(--academy-soft);
          border: 2px solid color-mix(in srgb, var(--academy-accent) 35%, transparent);
          border-radius: 50%;
          font-size: 34px;
          box-shadow: 0 0 0 18px color-mix(in srgb, var(--academy-accent) 7%, transparent);
          animation: core-breathe 1.8s ease-in-out infinite alternate;
        }

        .diagram-node {
          max-width: 130px;
          position: absolute;
          padding: 9px 11px;
          text-align: center;
          background: white;
          border: 1px solid #ded8e2;
          border-radius: 12px;
          font-size: 9px;
          font-weight: 850;
          box-shadow: 0 10px 20px rgba(35,25,41,.08);
          animation: node-arrive .7s ease both;
        }

        .node-1 { left: 2%; top: 12%; }
        .node-2 { right: 2%; top: 12%; animation-delay: .1s; }
        .node-3 { left: 0; bottom: 12%; animation-delay: .2s; }
        .node-4 { right: 0; bottom: 12%; animation-delay: .3s; }
        .node-5 { left: 50%; top: 0; transform: translateX(-50%); animation-delay: .4s; }
        .node-6 { left: 50%; bottom: 0; transform: translateX(-50%); animation-delay: .5s; }

        .chart-bars {
          height: 190px;
          margin-top: 15px;
          display: flex;
          align-items: end;
          gap: 10px;
          padding: 14px 14px 0;
          border-bottom: 1px solid #dcd6df;
        }

        .chart-bars > div {
          min-width: 52px;
          flex: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: end;
          align-items: center;
          gap: 7px;
        }

        .chart-bars span {
          width: min(42px, 70%);
          display: block;
          background: linear-gradient(to top, var(--academy-dark), var(--academy-accent));
          border-radius: 10px 10px 3px 3px;
          transform-origin: bottom;
          animation: bar-grow .85s cubic-bezier(.2,.8,.2,1) both;
        }

        .chart-bars small {
          min-height: 28px;
          color: #6e6574;
          text-align: center;
          font-size: 7px;
          font-weight: 800;
        }

        @keyframes scene-rise {
          from { opacity: 0; transform: translateY(18px) scale(.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes card-arrive {
          from { opacity: 0; transform: translateX(-14px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes flow-enter {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes node-arrive {
          from { opacity: 0; scale: .8; }
          to { opacity: 1; scale: 1; }
        }

        @keyframes bar-grow {
          from { transform: scaleY(0); opacity: .3; }
          to { transform: scaleY(1); opacity: 1; }
        }

        @keyframes symbol-float {
          to { transform: translateY(-5px) rotate(2deg); }
        }

        @keyframes core-breathe {
          to { transform: translate(-50%, -50%) scale(1.06); }
        }

        @keyframes arrow-pulse {
          to { transform: translateX(4px); opacity: .55; }
        }

        @media (max-width: 760px) {
          .animated-card-grid,
          .comparison-grid {
            grid-template-columns: 1fr;
          }

          .diagram-orbit {
            height: 220px;
          }

          .scene-flow-item span {
            min-width: 92px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </main>
  );
}