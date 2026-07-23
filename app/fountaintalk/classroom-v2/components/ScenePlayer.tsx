"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  AcademyDefinition,
  AcademyLesson,
} from "../../types/academy";

import {
  lessonToScenes,
} from "../sceneAdapter";
import {
  useScenePlayer,
} from "../hooks/useScenePlayer";

import AnimatedSceneVisual from "./AnimatedSceneVisual";
import AyoStage from "./AyoStage";
import StoryBanner from "./StoryBanner";

import {
  getStoryArtwork,
} from "../storyArtworkRegistry";

type Props = {
  academy: AcademyDefinition;
  lesson: AcademyLesson;
  courseTitle: string;
  unitNumber: number;
};

type FeedbackState = {
  correct: boolean;
  message: string;
};

const DEFAULT_LEARNER_NAME = "Learner";
const LEARNER_STORAGE_KEY =
  "learn-with-ayo:learner:demo-learner";

function normalise(value: string): string {
  return value
    .toLowerCase()
    .replace(/[£$.,!?()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function replaceLearnerName(
  text: string,
  learnerName: string
): string {
  return text
    .replaceAll("{learnerName}", learnerName)
    .replaceAll("Learner,", `${learnerName},`);
}

function replaceAcademyReferences(
  text: string,
  academyTitle: string,
  academyShortTitle: string
): string {
  return text
    .replaceAll("Welcome to Wealth Academy", `Welcome to ${academyTitle}`)
    .replaceAll("Wealth Academy", academyTitle)
    .replaceAll("Wealth class", `${academyShortTitle} class`)
    .replaceAll("wealth class", `${academyShortTitle} class`);
}

export default function ScenePlayer({
  academy,
  lesson,
  courseTitle,
  unitNumber,
}: Props) {
  const [learnerName, setLearnerName] = useState(
    DEFAULT_LEARNER_NAME
  );
  const [question, setQuestion] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [typedAnswer, setTypedAnswer] = useState("");
  const [feedback, setFeedback] =
    useState<FeedbackState | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const recognitionRef = useRef<{
    start: () => void;
    abort?: () => void;
  } | null>(null);

  useEffect(() => {
    try {
      const savedLearner =
        window.localStorage.getItem(
          LEARNER_STORAGE_KEY
        );

      if (savedLearner) {
        const parsed = JSON.parse(savedLearner) as {
          learnerName?: string;
          name?: string;
        };

        const storedName =
          parsed.learnerName ?? parsed.name;

        if (storedName?.trim()) {
          setLearnerName(storedName.trim());
          return;
        }
      }

      const fallbackName =
        window.localStorage.getItem("learnerName");

      if (fallbackName?.trim()) {
        setLearnerName(fallbackName.trim());
      }
    } catch (error) {
      console.warn(
        "Unable to read learner name for Classroom V2",
        error
      );
    }
  }, []);

  const scenes = useMemo(
    () =>
      lessonToScenes(lesson).map((scene) => ({
        ...scene,
        narration: replaceAcademyReferences(
          replaceLearnerName(
            scene.narration,
            learnerName
          ),
          academy.title,
          academy.shortTitle
        ),
        displayText: replaceAcademyReferences(
          replaceLearnerName(
            scene.displayText,
            learnerName
          ),
          academy.title,
          academy.shortTitle
        ),
        question: scene.question
          ? replaceAcademyReferences(
              replaceLearnerName(
                scene.question,
                learnerName
              ),
              academy.title,
              academy.shortTitle
            )
          : undefined,
      })),
    [academy.shortTitle, academy.title, learnerName, lesson]
  );

  const player = useScenePlayer({ scenes });

  const resetInteraction = () => {
    recognitionRef.current?.abort?.();
    recognitionRef.current = null;
    setSelectedAnswer("");
    setTypedAnswer("");
    setFeedback(null);
    setAttempts(0);
    setShowChoices(false);
    setListening(false);
    setVoiceError("");
  };

  const goNext = () => {
    resetInteraction();
    player.next();
  };

  const goPrevious = () => {
    resetInteraction();
    player.previous();
  };

  if (!player.started) {
    return (
      <main
        className="v2-classroom"
        style={{
          "--v2-accent": academy.accent,
          "--v2-dark": academy.accentDark,
          "--v2-soft": academy.soft,
        } as React.CSSProperties}
      >
        <section className="v2-opening">
          <div>
            <span>{academy.title}</span>
            <h1>{lesson.title}</h1>
            <p>
              {replaceLearnerName(
                lesson.classPromise ??
                  lesson.objective,
                learnerName
              )}
            </p>

            <div className="v2-opening-facts">
              <span>
                Welcome, {learnerName}
              </span>
              <span>
                {lesson.estimatedMinutes} minutes
              </span>
              <span>{scenes.length} scenes</span>
              <span>Raise Hand enabled</span>
            </div>

            <button type="button" onClick={player.start}>
              Begin cinematic class
              <b>→</b>
            </button>
          </div>

          <AyoStage pose="welcome" speaking={false} />
        </section>

        <style jsx global>{styles}</style>
      </main>
    );
  }

  const scene = player.scene;
  const storyArtwork = getStoryArtwork(scene.id);

  const hasChoices = Boolean(scene.choices?.length);
  const isChoiceScene =
    scene.interactionMode === "choice" ||
    hasChoices;
  const isTextScene =
    scene.interactionMode === "text" ||
    scene.interactionMode === "reflection";
  const requiresResponse =
    isChoiceScene || isTextScene;
  const choicesVisible =
    hasChoices &&
    (isChoiceScene ||
      showChoices ||
      attempts >= 2);

  const checkAnswer = () => {
    const answer =
      selectedAnswer || typedAnswer.trim();

    if (!answer) return;

    const accepted = scene.acceptedAnswers ?? [];
    const normalisedAnswer = normalise(answer);

    const correct =
      accepted.length === 0 ||
      accepted.some((candidate) => {
        const normalisedCandidate =
          normalise(candidate);

        return (
          normalisedAnswer ===
            normalisedCandidate ||
          normalisedAnswer.includes(
            normalisedCandidate
          ) ||
          normalisedCandidate.includes(
            normalisedAnswer
          )
        );
      });

    if (correct) {
      setFeedback({
        correct: true,
        message:
          scene.explanation ??
          "Correct. You have understood the idea.",
      });
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    if (nextAttempts >= 2 && hasChoices) {
      setShowChoices(true);
    }

    setFeedback({
      correct: false,
      message:
        nextAttempts === 1
          ? scene.hint ??
            "Not quite. Think again and try once more."
          : hasChoices
            ? "Let us make this easier. Choose from the options now shown."
            : scene.hint ??
              "Try again. Focus on the main idea Ayo explained.",
    });
  };

  const beginVoiceAnswer = () => {
    setVoiceError("");

    const Recognition =
      window.SpeechRecognition ??
      window.webkitSpeechRecognition;

    if (!Recognition) {
      setVoiceError(
        "Voice input is unavailable in this browser. Please type your answer."
      );
      return;
    }

    recognitionRef.current?.abort?.();

    const recognition = new Recognition();
    recognition.lang = "en-GB";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;

    let transcript = "";

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      let combined = "";

      for (
        let index = 0;
        index < event.results.length;
        index += 1
      ) {
        combined +=
          event.results[index]?.[0]?.transcript ??
          "";
      }

      transcript = combined.trim();
      setTypedAnswer(transcript);
      setSelectedAnswer("");
      setFeedback(null);
    };

    recognition.onerror = (event) => {
      setListening(false);

      if (event.error !== "aborted") {
        setVoiceError(
          "Ayo could not hear that clearly. Try speaking again or type your answer."
        );
      }
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      setListening(false);

      if (!transcript.trim()) {
        setVoiceError(
          "No answer was captured. Try again or type your answer."
        );
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const beginVoiceQuestion = () => {
    setVoiceError("");

    const Recognition =
      window.SpeechRecognition ??
      window.webkitSpeechRecognition;

    if (!Recognition) {
      setVoiceError(
        "Voice input is unavailable in this browser. Please type your question."
      );
      return;
    }

    recognitionRef.current?.abort?.();

    const recognition = new Recognition();
    recognition.lang = "en-GB";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;

    let transcript = "";

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      let combined = "";

      for (
        let index = 0;
        index < event.results.length;
        index += 1
      ) {
        combined +=
          event.results[index]?.[0]?.transcript ??
          "";
      }

      transcript = combined.trim();
      setQuestion(transcript);
    };

    recognition.onerror = (event) => {
      setListening(false);

      if (event.error !== "aborted") {
        setVoiceError(
          "Ayo could not hear that clearly. Try speaking again or type your question."
        );
      }
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      setListening(false);

      if (!transcript.trim()) {
        setVoiceError(
          "No question was captured. Try again or type your question."
        );
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleRaiseHand = () => {
    setQuestion("");
    setVoiceError("");
    player.raiseHand();
    beginVoiceQuestion();
  };

  return (
    <main
      className={`v2-classroom camera-${scene.camera} transition-${scene.transition} ${
        storyArtwork ? "has-story-art" : ""
      }`}
      style={{
        "--v2-accent": academy.accent,
        "--v2-dark": academy.accentDark,
        "--v2-soft": academy.soft,
      } as React.CSSProperties}
    >
      <header className="v2-topbar">
        <div>
          <small>{academy.title}</small>
          <strong>{courseTitle}</strong>
        </div>

        <div className="v2-progress">
          <span>
            Unit {unitNumber} · Scene{" "}
            {player.sceneIndex + 1} /{" "}
            {player.totalScenes}
          </span>
          <div>
            <i
              style={{
                width: `${player.progress}%`,
              }}
            />
          </div>
        </div>

        <div className="v2-status">
          <span>
            {player.paused
              ? "Paused"
              : "Lecture running"}
          </span>
          <strong>{player.progress}%</strong>
        </div>
      </header>

      <section className="v2-stage">
        {storyArtwork && (
          <StoryBanner artwork={storyArtwork} />
        )}

        <article
          className="v2-slide"
          key={scene.id}
        >
          <div className="v2-slide-label">
            <span>
              {scene.kind.replaceAll("-", " ")}
            </span>
            <small>{scene.eyebrow}</small>
          </div>

          <div className="v2-slide-copy">
            <h1>{scene.title}</h1>
            <p>{scene.displayText}</p>
          </div>

          {!requiresResponse && !storyArtwork && (
            <AnimatedSceneVisual scene={scene} />
          )}

          {requiresResponse && (
            <section className="v2-interaction">
              <div className="v2-question-heading">
                <span>Your turn</span>
                <h2>
                  {scene.question ??
                    scene.displayText}
                </h2>
                <p>
                  Speak your answer or type it below.
                </p>
              </div>

              <div className="v2-answer-mode">
                <button
                  type="button"
                  className={
                    listening
                      ? "is-listening"
                      : ""
                  }
                  onClick={beginVoiceAnswer}
                  disabled={listening}
                >
                  {listening
                    ? "🎙 Listening…"
                    : "🎙 Speak answer"}
                </button>

                <span>or</span>

                <label>
                  <span>Type answer</span>
                  <input
                    value={typedAnswer}
                    onChange={(event) => {
                      setTypedAnswer(
                        event.target.value
                      );
                      setSelectedAnswer("");
                      setFeedback(null);
                    }}
                    placeholder="Type your answer here…"
                  />
                </label>
              </div>

              {voiceError && (
                <p className="v2-voice-error">
                  {voiceError}
                </p>
              )}

              {choicesVisible && (
                <div className="v2-choice-grid">
                  {scene.choices?.map((choice) => (
                    <button
                      type="button"
                      key={choice.id}
                      className={
                        selectedAnswer ===
                        choice.label
                          ? "is-selected"
                          : ""
                      }
                      onClick={() => {
                        setSelectedAnswer(
                          choice.label
                        );
                        setTypedAnswer("");
                        setFeedback(null);
                      }}
                    >
                      <b>
                        {choice.id.toUpperCase()}
                      </b>
                      <span>{choice.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {feedback && (
                <div
                  className={`v2-feedback ${
                    feedback.correct
                      ? "is-correct"
                      : "is-wrong"
                  }`}
                >
                  <strong>
                    {feedback.correct
                      ? "Correct"
                      : "Let us try again"}
                  </strong>
                  <p>{feedback.message}</p>
                </div>
              )}

              <div className="v2-answer-actions">
                {!feedback?.correct ? (
                  <>
                    {hasChoices &&
                      !choicesVisible && (
                        <button
                          type="button"
                          className="secondary"
                          onClick={() =>
                            setShowChoices(true)
                          }
                        >
                          Show choices
                        </button>
                      )}

                    <button
                      type="button"
                      onClick={checkAnswer}
                      disabled={
                        !selectedAnswer &&
                        !typedAnswer.trim()
                      }
                    >
                      Check answer
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={goNext}
                  >
                    Continue lesson →
                  </button>
                )}
              </div>
            </section>
          )}
        </article>

        <AyoStage
          pose={
            player.handRaised
              ? "listen"
              : scene.ayoPose
          }
          speaking={player.speaking}
        />

        <div className="v2-caption">
          <strong>Ayo</strong>
          <p>{scene.narration}</p>
        </div>
      </section>

      <footer className="v2-controls">
        <button
          type="button"
          onClick={goPrevious}
          disabled={player.sceneIndex === 0}
        >
          ← Previous
        </button>

        <div>
          <button
            type="button"
            onClick={player.togglePause}
          >
            {player.paused
              ? "Resume lecture"
              : "Pause"}
          </button>

          <button
            type="button"
            className="v2-raise-hand"
            onClick={handleRaiseHand}
          >
            ✋ Raise hand
          </button>
        </div>

        <button
          type="button"
          onClick={goNext}
          disabled={
            player.isLastScene ||
            (requiresResponse &&
              !feedback?.correct)
          }
        >
          Next scene →
        </button>
      </footer>

      {player.handRaised && (
        <aside className="v2-question-panel">
          <div>
            <span>Lecture paused</span>
            <h2>Ask Ayo</h2>
            <p>
              Speak naturally or type your question. The current
              scene remains paused until you continue.
            </p>
          </div>

          <button
            type="button"
            className={listening ? "question-mic is-listening" : "question-mic"}
            onClick={beginVoiceQuestion}
            disabled={listening}
          >
            {listening ? "🎙 Listening…" : "🎙 Speak your question"}
          </button>

          {voiceError && (
            <p className="v2-voice-error">{voiceError}</p>
          )}

          <textarea
            value={question}
            onChange={(event) =>
              setQuestion(event.target.value)
            }
            rows={4}
            placeholder="Speak or type what you would like Ayo to explain…"
          />

          <button
            type="button"
            onClick={() => {
              setQuestion("");
              player.resumeAfterQuestion();
            }}
          >
            Continue lecture
          </button>
        </aside>
      )}

      <style jsx global>{styles}</style>
    </main>
  );
}

const styles = `
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }

  .v2-classroom {
    min-height: 100vh;
    color: white;
    background:
      radial-gradient(circle at 8% 0%, color-mix(in srgb, var(--v2-accent) 25%, transparent), transparent 32%),
      radial-gradient(circle at 96% 8%, rgba(124,58,237,.18), transparent 30%),
      #060911;
    overflow: hidden;
  }

  .v2-opening {
    min-height: 100vh;
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(340px, .9fr);
    align-items: center;
    gap: 40px;
    padding: clamp(34px, 6vw, 90px);
  }

  .v2-opening > div:first-child {
    max-width: 780px;
    position: relative;
    z-index: 2;
  }

  .v2-opening > div:first-child > span {
    color: var(--v2-soft);
    font-size: 14px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: .13em;
  }

  .v2-opening h1 {
    margin: 14px 0 0;
    font-size: clamp(58px, 7.2vw, 108px);
    line-height: .92;
    letter-spacing: -.065em;
  }

  .v2-opening p {
    max-width: 700px;
    margin: 24px 0 0;
    color: #c8ced8;
    font-size: clamp(20px, 1.8vw, 27px);
    line-height: 1.5;
  }

  .v2-opening-facts {
    margin-top: 25px;
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
  }

  .v2-opening-facts span {
    padding: 10px 14px;
    color: #e0e4eb;
    background: rgba(255,255,255,.07);
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 999px;
    font-size: 12px;
  }

  .v2-opening button {
    min-height: 60px;
    margin-top: 30px;
    padding: 0 24px;
    display: inline-flex;
    align-items: center;
    gap: 34px;
    color: white;
    background: linear-gradient(135deg, var(--v2-accent), var(--v2-dark));
    border: 0;
    border-radius: 16px;
    font-size: 16px;
    font-weight: 900;
    cursor: pointer;
  }

  .v2-topbar {
    min-height: 78px;
    display: grid;
    grid-template-columns: 1fr minmax(300px, 1.2fr) 1fr;
    align-items: center;
    gap: 22px;
    padding: 13px 24px;
    background: rgba(5,8,14,.9);
    border-bottom: 1px solid rgba(255,255,255,.08);
  }

  .v2-topbar small,
  .v2-topbar strong {
    display: block;
  }

  .v2-topbar small {
    color: #aab1bd;
    font-size: 11px;
    text-transform: uppercase;
  }

  .v2-topbar strong {
    margin-top: 4px;
    font-size: 15px;
  }

  .v2-progress span {
    display: block;
    color: #ced2da;
    text-align: center;
    font-size: 12px;
  }

  .v2-progress > div {
    height: 5px;
    margin-top: 8px;
    overflow: hidden;
    background: #262c38;
    border-radius: 999px;
  }

  .v2-progress i {
    display: block;
    height: 100%;
    background: var(--v2-accent);
  }

  .v2-status {
    justify-self: end;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .v2-status span {
    color: #c8cdd5;
    font-size: 12px;
  }

  .v2-stage {
    min-height: calc(100vh - 148px);
    position: relative;
    isolation: isolate;
  }

  .v2-stage::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(115deg, color-mix(in srgb, var(--v2-dark) 78%, #0b1018) 0 61%, #080c13 61% 100%);
    z-index: -2;
  }

  .v2-slide {
    position: absolute;
    inset: 24px 37% 116px 24px;
    padding: clamp(30px, 3vw, 52px);
    color: #211924;
    background:
      radial-gradient(circle at 92% 8%, var(--v2-soft), transparent 31%),
      linear-gradient(145deg, #fff, #f7f7fb);
    border-radius: 28px;
    box-shadow: 0 34px 90px rgba(0,0,0,.38);
    overflow-y: auto;
    animation: v2-scene-enter .65s cubic-bezier(.2,.8,.2,1) both;
  }

  .v2-slide-label {
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }

  .v2-slide-label span {
    padding: 8px 12px;
    color: var(--v2-dark);
    background: var(--v2-soft);
    border-radius: 999px;
    font-size: 11px;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: .1em;
  }

  .v2-slide-label small {
    color: #8b8390;
    font-size: 11px;
  }

  .v2-slide-copy {
    max-width: 780px;
    margin-top: clamp(26px, 4vh, 48px);
  }

  .v2-slide-copy h1 {
    margin: 0;
    font-size: clamp(50px, 5vw, 80px);
    line-height: .96;
    letter-spacing: -.055em;
  }

  .v2-slide-copy p {
    max-width: 720px;
    margin: 18px 0 0;
    color: #554d59;
    font-size: clamp(20px, 1.65vw, 26px);
    line-height: 1.5;
  }

  .v2-interaction {
    margin-top: 26px;
    padding: 22px;
    background: rgba(255,255,255,.92);
    border: 1px solid #e0dae4;
    border-radius: 20px;
    box-shadow: 0 18px 40px rgba(40,30,47,.08);
  }

  .v2-question-heading > span {
    color: var(--v2-accent);
    font-size: 12px;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: .1em;
  }

  .v2-question-heading h2 {
    margin: 7px 0 0;
    font-size: clamp(25px, 2.2vw, 35px);
    line-height: 1.28;
  }

  .v2-question-heading p {
    margin: 7px 0 0;
    color: #716978;
    font-size: 16px;
  }

  .v2-answer-mode {
    margin-top: 18px;
    display: grid;
    grid-template-columns: auto auto minmax(0, 1fr);
    align-items: end;
    gap: 12px;
  }

  .v2-answer-mode > button {
    min-height: 52px;
    padding: 0 17px;
    color: white;
    background: var(--v2-dark);
    border: 0;
    border-radius: 13px;
    font-size: 15px;
    font-weight: 900;
    cursor: pointer;
  }

  .v2-answer-mode > button.is-listening {
    background: #166534;
    animation: pulse-listening 1s ease-in-out infinite alternate;
  }

  .v2-answer-mode > span {
    padding-bottom: 16px;
    color: #918895;
    font-size: 14px;
    font-weight: 800;
  }

  .v2-answer-mode label > span {
    display: block;
    margin-bottom: 6px;
    color: #625968;
    font-size: 12px;
    font-weight: 900;
  }

  .v2-answer-mode input {
    width: 100%;
    min-height: 52px;
    padding: 0 15px;
    color: #2e2633;
    background: white;
    border: 2px solid #ded8e2;
    border-radius: 13px;
    font: inherit;
    font-size: 17px;
  }

  .v2-voice-error {
    margin: 10px 0 0;
    color: #9a3412;
    font-size: 14px;
  }

  .v2-choice-grid {
    margin-top: 18px;
    display: grid;
    gap: 12px;
  }

  .v2-choice-grid button {
    min-height: 76px;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 15px;
    padding: 14px 16px;
    color: #302735;
    text-align: left;
    background: white;
    border: 2px solid #ded8e2;
    border-radius: 15px;
    cursor: pointer;
  }

  .v2-choice-grid button.is-selected {
    border-color: var(--v2-accent);
    box-shadow: 0 0 0 4px var(--v2-soft);
  }

  .v2-choice-grid b {
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
    color: var(--v2-dark);
    background: var(--v2-soft);
    border-radius: 11px;
    font-size: 16px;
  }

  .v2-choice-grid span {
    font-size: clamp(17px, 1.3vw, 21px);
    font-weight: 800;
    line-height: 1.4;
  }

  .v2-feedback {
    margin-top: 15px;
    padding: 15px 17px;
    border-radius: 14px;
  }

  .v2-feedback.is-correct {
    color: #14532d;
    background: #ecfdf5;
    border: 1px solid #86efac;
  }

  .v2-feedback.is-wrong {
    color: #7c2d12;
    background: #fff7ed;
    border: 1px solid #fdba74;
  }

  .v2-feedback strong {
    font-size: 17px;
  }

  .v2-feedback p {
    margin: 5px 0 0;
    font-size: 15px;
    line-height: 1.5;
  }

  .v2-answer-actions {
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .v2-answer-actions button {
    min-height: 48px;
    padding: 0 19px;
    color: white;
    background: linear-gradient(135deg, var(--v2-accent), var(--v2-dark));
    border: 0;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 900;
    cursor: pointer;
  }

  .v2-answer-actions button.secondary {
    color: var(--v2-dark);
    background: var(--v2-soft);
    border: 1px solid color-mix(in srgb, var(--v2-accent) 30%, transparent);
  }

  .v2-answer-actions button:disabled {
    opacity: .4;
    cursor: not-allowed;
  }

  .v2-ayo-stage {
    width: 43%;
    height: 88%;
    position: absolute;
    right: -1%;
    bottom: 72px;
  }

  .v2-caption {
    min-height: 88px;
    position: absolute;
    left: 3%;
    right: 3%;
    bottom: 16px;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 16px;
    padding: 16px 18px;
    color: #342b39;
    background: rgba(255,255,255,.96);
    border-radius: 19px;
    box-shadow: 0 24px 60px rgba(0,0,0,.34);
  }

  .v2-caption strong {
    padding-right: 14px;
    border-right: 1px solid #e0dbe3;
    font-size: 14px;
  }

  .v2-caption p {
    margin: 0;
    font-size: clamp(14px, 1.05vw, 17px);
    line-height: 1.52;
  }

  .v2-controls {
    min-height: 70px;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 14px;
    padding: 12px 22px;
    background: #090d15;
    border-top: 1px solid rgba(255,255,255,.08);
  }

  .v2-controls > div {
    display: flex;
    gap: 9px;
  }

  .v2-controls button {
    min-height: 43px;
    padding: 0 15px;
    color: #e4e7ed;
    background: rgba(255,255,255,.07);
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 11px;
    font-size: 13px;
    font-weight: 900;
    cursor: pointer;
  }

  .v2-controls > button:last-child {
    justify-self: end;
  }

  .v2-controls .v2-raise-hand {
    color: white;
    background: var(--v2-dark);
    border-color: var(--v2-accent);
  }

  .v2-controls button:disabled {
    opacity: .35;
    cursor: not-allowed;
  }

  .v2-question-panel {
    width: min(440px, calc(100% - 32px));
    position: fixed;
    right: 18px;
    top: 94px;
    z-index: 20;
    padding: 21px;
    color: #302736;
    background: rgba(255,255,255,.98);
    border-radius: 20px;
    box-shadow: 0 30px 90px rgba(0,0,0,.48);
  }

  .v2-question-panel span {
    color: var(--v2-accent);
    font-size: 11px;
    font-weight: 950;
    text-transform: uppercase;
  }

  .v2-question-panel h2 {
    margin: 6px 0 0;
    font-size: 28px;
  }

  .v2-question-panel p {
    color: #746b79;
    font-size: 14px;
    line-height: 1.5;
  }

  .v2-question-panel textarea {
    width: 100%;
    margin-top: 10px;
    padding: 13px;
    color: #2f2734;
    background: #faf9fb;
    border: 1px solid #ddd8e1;
    border-radius: 12px;
    resize: vertical;
    font: inherit;
    font-size: 16px;
  }

  .v2-question-panel button {
    width: 100%;
    min-height: 45px;
    margin-top: 9px;
    color: white;
    background: var(--v2-dark);
    border: 0;
    border-radius: 11px;
    font-size: 14px;
    font-weight: 900;
    cursor: pointer;
  }

  .v2-card-grid,
  .v2-comparison {
    margin-top: 25px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0,1fr));
    gap: 12px;
  }

  .v2-card-grid article,
  .v2-comparison article {
    min-height: 82px;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 13px;
    padding: 15px;
    background: rgba(255,255,255,.88);
    border: 1px solid #e1dce4;
    border-radius: 15px;
  }

  .v2-card-grid small,
  .v2-comparison small {
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    color: var(--v2-accent);
    background: var(--v2-soft);
    border-radius: 10px;
    font-size: 11px;
    font-weight: 950;
  }

  .v2-card-grid strong,
  .v2-comparison strong {
    font-size: clamp(15px, 1.1vw, 18px);
    line-height: 1.4;
  }

  .v2-process {
    margin-top: 25px;
    display: flex;
    align-items: stretch;
    gap: 10px;
    overflow-x: auto;
  }

  .v2-process > div {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .v2-process span {
    min-width: 132px;
    min-height: 82px;
    display: grid;
    place-items: center;
    padding: 13px;
    text-align: center;
    background: white;
    border: 1px solid #dfd9e2;
    border-radius: 15px;
    font-size: clamp(14px, 1.05vw, 17px);
    font-weight: 850;
  }

  .v2-process b {
    color: var(--v2-accent);
    font-size: 25px;
  }

  .v2-orbit {
    width: min(510px, 100%);
    height: 290px;
    position: relative;
    margin: 15px auto 0;
  }

  .v2-orbit-core {
    width: 98px;
    height: 98px;
    position: absolute;
    left: 50%;
    top: 50%;
    display: grid;
    place-items: center;
    transform: translate(-50%,-50%);
    background: var(--v2-soft);
    border: 2px solid var(--v2-accent);
    border-radius: 50%;
    font-size: 40px;
  }

  .orbit-node {
    max-width: 155px;
    position: absolute;
    padding: 12px 14px;
    text-align: center;
    background: white;
    border: 1px solid #ddd7e0;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 850;
  }

  .orbit-node-1 { left: 2%; top: 12%; }
  .orbit-node-2 { right: 2%; top: 12%; }
  .orbit-node-3 { left: 0; bottom: 12%; }
  .orbit-node-4 { right: 0; bottom: 12%; }
  .orbit-node-5 { left: 50%; top: 0; transform: translateX(-50%); }
  .orbit-node-6 { left: 50%; bottom: 0; transform: translateX(-50%); }

  .v2-chart small {
    font-size: 11px;
  }

  .v2-abstract-visual {
    min-height: 220px;
    position: relative;
    margin-top: 25px;
    display: grid;
    place-items: center;
    overflow: hidden;
    background: linear-gradient(135deg, var(--v2-soft), white);
    border-radius: 20px;
  }

  .v2-abstract-visual strong {
    max-width: 590px;
    position: relative;
    padding: 26px;
    text-align: center;
    font-size: clamp(24px, 2.2vw, 35px);
  }


  .v2-story-banner {
    position: absolute;
    inset: 0 0 0 48%;
    z-index: -1;
    overflow: hidden;
    background: #080c13;
  }

  .v2-story-banner-image {
    object-fit: cover !important;
    object-position: var(--story-focus, center) !important;
    filter: saturate(1.04) contrast(1.04);
    animation: story-image-enter .8s cubic-bezier(.2,.8,.2,1) both;
  }

  .v2-story-banner::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(
        90deg,
        color-mix(in srgb, var(--v2-dark) 92%, transparent) 0%,
        color-mix(in srgb, var(--v2-dark) 50%, transparent) 18%,
        transparent 48%
      ),
      linear-gradient(
        0deg,
        rgba(3,7,13,.6) 0%,
        transparent 42%
      );
    pointer-events: none;
  }

  .v2-story-banner-caption {
    position: absolute;
    left: 18%;
    right: 8%;
    bottom: 108px;
    z-index: 2;
    padding: 12px 14px;
    color: rgba(255,255,255,.94);
    background: rgba(5,8,14,.55);
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 13px;
    font-size: 12px;
    line-height: 1.45;
    backdrop-filter: blur(10px);
  }

  .has-story-art .v2-stage::before {
    background:
      linear-gradient(
        115deg,
        color-mix(in srgb, var(--v2-dark) 88%, #0b1018) 0 58%,
        rgba(8,12,19,.16) 58% 100%
      );
  }

  .has-story-art .v2-slide {
    inset: 24px 52% 116px 24px;
    z-index: 2;
    background:
      radial-gradient(circle at 92% 8%, var(--v2-soft), transparent 31%),
      linear-gradient(145deg, rgba(255,255,255,.98), rgba(247,247,251,.96));
  }

  .has-story-art .v2-ayo-stage {
    width: 24%;
    height: 64%;
    right: 1%;
    bottom: 86px;
    z-index: 3;
    filter: drop-shadow(-15px 20px 24px rgba(0,0,0,.42));
  }

  .has-story-art .v2-ayo-badge {
    right: 3%;
    top: 5%;
  }

  .has-story-art .v2-caption {
    z-index: 5;
  }

  @keyframes story-image-enter {
    from {
      opacity: 0;
      transform: scale(1.045);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes v2-scene-enter {
    from {
      opacity: 0;
      transform: translateY(18px) scale(.985);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes pulse-listening {
    to {
      transform: scale(1.03);
      box-shadow: 0 0 0 6px rgba(34,197,94,.15);
    }
  }

  @media (max-width: 900px) {

    .v2-story-banner {
      inset: 42% 0 0 0;
    }

    .has-story-art .v2-slide {
      inset: 14px 14px 48% 14px;
    }

    .has-story-art .v2-ayo-stage {
      width: 38%;
      height: 35%;
      right: -4%;
      bottom: 82px;
    }

    .v2-story-banner-caption {
      display: none;
    }

    .v2-opening {
      grid-template-columns: 1fr;
    }

    .v2-opening .v2-ayo-stage {
      display: none;
    }

    .v2-topbar {
      grid-template-columns: 1fr 1fr;
    }

    .v2-status {
      display: none;
    }

    .v2-slide {
      inset: 14px 14px 310px 14px;
    }

    .v2-ayo-stage {
      width: 70%;
      height: 47%;
      right: -15%;
      bottom: 82px;
    }

    .v2-caption {
      left: 10px;
      right: 10px;
      bottom: 10px;
    }

    .v2-card-grid,
    .v2-comparison {
      grid-template-columns: 1fr;
    }

    .v2-answer-mode {
      grid-template-columns: 1fr;
      align-items: stretch;
    }

    .v2-answer-mode > span {
      padding: 0;
      text-align: center;
    }
  }


  /* Mobile classroom repair */
  @media (max-width: 900px) {
    .v2-classroom {
      overflow-x: hidden;
      overflow-y: auto;
    }

    .v2-topbar {
      position: relative;
      z-index: 12;
      grid-template-columns: 1fr;
      min-height: auto;
      padding: 10px 14px;
    }

    .v2-topbar > div:first-child,
    .v2-status {
      display: none;
    }

    .v2-progress span {
      font-size: 11px;
    }

    .v2-stage {
      min-height: 0;
      display: flex;
      flex-direction: column;
      padding: 12px 12px 18px;
      overflow: visible;
    }

    .v2-stage::before {
      position: fixed;
      z-index: -3;
    }

    .v2-slide,
    .has-story-art .v2-slide {
      position: relative;
      inset: auto;
      order: 1;
      width: 100%;
      min-height: 0;
      max-height: none;
      margin: 0;
      padding: 24px 20px;
      overflow: visible;
      border-radius: 22px;
    }

    .v2-slide-copy {
      margin-top: 24px;
    }

    .v2-slide-copy h1 {
      font-size: clamp(42px, 12vw, 64px);
      line-height: .98;
    }

    .v2-slide-copy p {
      font-size: 19px;
      line-height: 1.5;
    }

    .v2-story-banner,
    .has-story-art .v2-story-banner {
      position: relative;
      inset: auto;
      order: 2;
      width: 100%;
      height: min(62vw, 360px);
      min-height: 250px;
      margin-top: 12px;
      z-index: 1;
      border-radius: 22px;
      overflow: hidden;
      background: #080c13;
    }

    .v2-story-banner::after {
      background:
        linear-gradient(0deg, rgba(3,7,13,.45), transparent 50%);
    }

    .v2-story-banner-caption {
      display: block;
      left: 12px;
      right: 12px;
      bottom: 12px;
      font-size: 12px;
    }

    .v2-ayo-stage,
    .has-story-art .v2-ayo-stage {
      position: relative;
      inset: auto;
      order: 3;
      width: min(76vw, 390px);
      height: 390px;
      margin: -72px auto 0;
      right: auto;
      bottom: auto;
      z-index: 4;
      overflow: visible;
      filter: drop-shadow(0 18px 28px rgba(0,0,0,.35));
    }

    .has-story-art .v2-ayo-stage {
      width: min(58vw, 300px);
      height: 315px;
      margin-top: -95px;
      margin-right: 4px;
      align-self: flex-end;
    }

    .v2-ayo-badge,
    .has-story-art .v2-ayo-badge {
      left: 8px;
      right: auto;
      top: auto;
      bottom: 16px;
      max-width: 145px;
      padding: 8px 10px;
    }

    .v2-caption {
      position: relative;
      inset: auto;
      order: 4;
      width: 100%;
      min-height: 0;
      margin-top: -8px;
      padding: 16px;
      grid-template-columns: auto 1fr;
      border-radius: 18px;
    }

    .v2-caption p {
      max-height: none;
      overflow: visible;
      font-size: 16px;
    }

    .v2-controls {
      position: sticky;
      bottom: 0;
      z-index: 20;
      grid-template-columns: 1fr auto;
      padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
    }

    .v2-controls > button:first-child,
    .v2-controls > button:last-child {
      display: none;
    }

    .v2-controls > div {
      grid-column: 1 / -1;
      width: 100%;
      justify-content: center;
    }

    .v2-controls button {
      min-height: 48px;
      font-size: 14px;
    }

    .v2-process {
      width: 100%;
      overflow-x: auto;
      scroll-snap-type: x proximity;
      padding-bottom: 8px;
    }

    .v2-process > div {
      flex: 0 0 auto;
      scroll-snap-align: start;
    }

    .v2-card-grid,
    .v2-comparison {
      grid-template-columns: 1fr;
    }

    .v2-orbit {
      height: 340px;
      transform: scale(.88);
      transform-origin: top center;
      margin-bottom: -34px;
    }

    .v2-question-panel {
      inset: auto 10px calc(10px + env(safe-area-inset-bottom)) 10px;
      width: auto;
      max-height: 82vh;
      overflow-y: auto;
      border-radius: 22px;
    }

    .v2-question-panel .question-mic {
      width: 100%;
      min-height: 50px;
      margin-top: 12px;
      color: white;
      background: var(--v2-dark);
      border: 0;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 900;
    }

    .v2-question-panel .question-mic.is-listening {
      background: #166534;
      animation: pulse-listening 1s ease-in-out infinite alternate;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: .01ms !important;
      animation-iteration-count: 1 !important;
    }
  }
`;
