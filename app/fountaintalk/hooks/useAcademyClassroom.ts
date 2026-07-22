"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { getAcademy } from "../data/academyRegistry";
import { getStarterCourse } from "../data/starterCurricula";

import type {
  AcademyProgress,
  AcademyTutorReply,
  AyoPose,
  ClassroomPhase,
  ClassroomSession,
  MicrophoneMode,
  NonLanguageAcademyId,
  StepKind,
  TutorStatus,
} from "../types/academy";

type ListeningPurpose = "opening" | "step-answer";

const LEARNER_ID = "demo-learner";
const DEFAULT_LEARNER_NAME = "Learner";
const AGE_GROUP = "6-9";

function createInitialProgress(
  academyId: NonLanguageAcademyId
): AcademyProgress {
  return {
    academyId,
    learnerId: LEARNER_ID,
    currentUnitIndex: 0,
    currentLessonIndex: 0,
    currentStepIndex: 0,
    completedStepIds: [],
    completedLessonIds: [],
    points: 0,
    streak: 0,
    lastStudiedAt: null,
    completedAt: null,
  };
}

function createInitialSession(): ClassroomSession {
  return {
    phase: "arrival",
    learnerName: "",
    desiredOutcome: "",
    priorKnowledge: "",
    isReturningLearner: false,
    previousLessonTitle: null,
  };
}

function cleanForSpeech(text: string): string {
  return text
    .replace(/[*_#`]/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function normaliseAnswer(value: string): string {
  return value
    .toLowerCase()
    .replace(/[£$.,!?()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function includesAcceptedAnswer(
  answer: string,
  acceptedAnswers: string[]
): boolean {
  const normalisedAnswer = normaliseAnswer(answer);

  return acceptedAnswers.some((accepted) => {
    const normalisedAccepted = normaliseAnswer(accepted);

    return (
      normalisedAnswer === normalisedAccepted ||
      normalisedAnswer.includes(normalisedAccepted)
    );
  });
}

function extractLearnerName(transcript: string): string {
  const cleaned = transcript
    .replace(
      /^(hello[, ]*)?(my name is|i am|i'm|call me|you can call me)\s+/i,
      ""
    )
    .replace(/[.!?]+$/g, "")
    .trim();

  if (!cleaned) {
    return DEFAULT_LEARNER_NAME;
  }

  return cleaned
    .split(/\s+/)
    .slice(0, 3)
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1).toLowerCase()
    )
    .join(" ");
}

function joinNaturalList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;

  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function poseForStepKind(
  kind: StepKind
): AyoPose {
  switch (kind) {
    case "welcome":
      return "welcome";

    case "teach":
    case "concept":
    case "decision-framework":
    case "summary":
      return "explain";

    case "story":
    case "illustration":
    case "diagram":
    case "transition":
      return "point-slide";

    case "example":
    case "worked-example":
    case "case-study":
    case "practice":
      return "open-hands";

    case "question":
    case "reflection":
    case "quiz":
    case "assessment":
      return "listen";

    case "challenge":
      return "encourage";

    default:
      return "neutral";
  }
}

export function useAcademyClassroom(
  academyId: NonLanguageAcademyId
) {
  const academy = getAcademy(academyId);
  const course = getStarterCourse(academyId);

  const [progress, setProgress] = useState<AcademyProgress>(() =>
    createInitialProgress(academyId)
  );
  const [session, setSession] = useState<ClassroomSession>(() =>
    createInitialSession()
  );
  const [hydrated, setHydrated] = useState(false);
  const [lessonStarted, setLessonStarted] = useState(false);
  const [tutorStatus, setTutorStatus] =
    useState<TutorStatus>("ready");
  const [tutorMessage, setTutorMessage] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [typedAnswer, setTypedAnswer] = useState("");
  const [feedback, setFeedback] =
    useState<AcademyTutorReply | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [askAyoText, setAskAyoText] = useState("");
  const [askAyoReply, setAskAyoReply] = useState("");
  const [voiceSessionEnabled, setVoiceSessionEnabled] =
    useState(false);
  const [microphoneMuted, setMicrophoneMuted] = useState(false);
  const [microphoneMode, setMicrophoneMode] =
    useState<MicrophoneMode>("muted");
  const [ayoPose, setAyoPose] = useState<AyoPose>("neutral");

  const speechRef =
    useRef<SpeechSynthesisUtterance | null>(null);
  const speechCompletionRef = useRef<(() => void) | null>(null);
  const recognitionRef = useRef<{
    stop: () => void;
    abort?: () => void;
  } | null>(null);
  const beginListeningRef =
    useRef<(purpose?: ListeningPurpose) => void>(() => {});
  const continueRef = useRef<() => void>(() => {});
  const evaluateAnswerRef =
    useRef<(answer: string) => Promise<void>>(async () => {});
  const silenceRetryRef = useRef(0);
  const autoAdvanceTimerRef = useRef<number | null>(null);
  const poseTimerRef = useRef<number | null>(null);

  const unit =
    course.units[progress.currentUnitIndex] ?? course.units[0];
  const lesson =
    unit.lessons[progress.currentLessonIndex] ?? unit.lessons[0];
  const step =
    lesson.steps[progress.currentStepIndex] ?? lesson.steps[0];

  const learningOutcomes = useMemo(
    () =>
      lesson.learningOutcomes?.length
        ? lesson.learningOutcomes
        : [lesson.objective],
    [lesson.learningOutcomes, lesson.objective]
  );

  const classPromise = lesson.classPromise ?? lesson.objective;

  const priorKnowledgePrompt =
    lesson.priorKnowledgePrompt ??
    `Before I explain the lesson, what do you already know about ${lesson.title.toLowerCase()}?`;

  const currentLearnerName =
    session.learnerName || DEFAULT_LEARNER_NAME;

  const progressStorageKey =
    `learn-with-ayo:progress:${academyId}:${LEARNER_ID}`;
  const learnerStorageKey =
    `learn-with-ayo:learner:${LEARNER_ID}`;
  const sessionStorageKey =
    `learn-with-ayo:classroom-session:${academyId}:${LEARNER_ID}`;

  const previousCompletedLesson = useMemo(() => {
    const lessons = course.units.flatMap(
      (courseUnit) => courseUnit.lessons
    );

    return (
      lessons
        .filter((candidate) =>
          progress.completedLessonIds.includes(candidate.id)
        )
        .at(-1) ?? null
    );
  }, [course.units, progress.completedLessonIds]);

  const stepTeachingMessage = useMemo(
    () =>
      step.teacherPrompt
        .replaceAll("{learnerName}", currentLearnerName)
        .replaceAll("{lessonTitle}", lesson.title),
    [currentLearnerName, lesson.title, step.teacherPrompt]
  );

  const buildPromiseMessage = useCallback(
    (desiredOutcome: string) => {
      const outcomeText = joinNaturalList(
        learningOutcomes.map((outcome) =>
          outcome
            .replace(/[.!?]+$/g, "")
            .toLowerCase()
        )
      );

      return [
        `Today, we are studying ${lesson.title}.`,
        `Our class promise is: ${classPromise}`,
        outcomeText
          ? `By the end of this class, you should be able to ${outcomeText}.`
          : "",
        desiredOutcome
          ? `You told me that you would especially like help with ${desiredOutcome}. I will keep that in mind as we learn.`
          : "",
      ]
        .filter(Boolean)
        .join(" ");
    },
    [classPromise, learningOutcomes, lesson.title]
  );

  const totalCourseSteps = useMemo(
    () =>
      course.units.reduce(
        (unitTotal, currentUnit) =>
          unitTotal +
          currentUnit.lessons.reduce(
            (lessonTotal, currentLesson) =>
              lessonTotal + currentLesson.steps.length,
            0
          ),
        0
      ),
    [course.units]
  );

  const courseProgressPercentage = Math.min(
    100,
    Math.round(
      (progress.completedStepIds.length /
        Math.max(totalCourseSteps, 1)) *
        100
    )
  );

  const lessonProgressPercentage = Math.min(
    100,
    Math.round(
      (lesson.steps.filter((candidate) =>
        progress.completedStepIds.includes(candidate.id)
      ).length /
        Math.max(lesson.steps.length, 1)) *
        100
    )
  );

  useEffect(() => {
    try {
      const savedProgress = window.localStorage.getItem(
        progressStorageKey
      );

      if (savedProgress) {
        const parsed = JSON.parse(savedProgress) as AcademyProgress;

        if (parsed.academyId === academyId) {
          setProgress(parsed);
        }
      }

      const savedLearner = window.localStorage.getItem(
        learnerStorageKey
      );

      if (savedLearner) {
        const parsed = JSON.parse(savedLearner) as {
          learnerName?: string;
        };

        if (parsed.learnerName) {
          setSession((current) => ({
            ...current,
            learnerName: parsed.learnerName ?? "",
            isReturningLearner: true,
          }));
        }
      }

      const savedSession = window.localStorage.getItem(
        sessionStorageKey
      );

      if (savedSession) {
        const parsed = JSON.parse(
          savedSession
        ) as Partial<ClassroomSession>;

        setSession((current) => ({
          ...current,
          learnerName: parsed.learnerName ?? current.learnerName,
          desiredOutcome: parsed.desiredOutcome ?? "",
          priorKnowledge: parsed.priorKnowledge ?? "",
          isReturningLearner: Boolean(
            parsed.learnerName ?? current.learnerName
          ),
          previousLessonTitle:
            parsed.previousLessonTitle ?? null,
          phase: "arrival",
        }));
      }
    } catch (error) {
      console.warn(
        "Unable to load Learn with AYO classroom data",
        error
      );
    } finally {
      setHydrated(true);
    }
  }, [
    academyId,
    learnerStorageKey,
    progressStorageKey,
    sessionStorageKey,
  ]);

  useEffect(() => {
    if (!hydrated) return;

    window.localStorage.setItem(
      progressStorageKey,
      JSON.stringify(progress)
    );
  }, [hydrated, progress, progressStorageKey]);

  useEffect(() => {
    if (!hydrated) return;

    window.localStorage.setItem(
      sessionStorageKey,
      JSON.stringify({ ...session, phase: "arrival" })
    );

    if (session.learnerName) {
      window.localStorage.setItem(
        learnerStorageKey,
        JSON.stringify({ learnerName: session.learnerName })
      );
    }
  }, [
    hydrated,
    learnerStorageKey,
    session,
    sessionStorageKey,
  ]);

  useEffect(() => {
    if (
      previousCompletedLesson &&
      previousCompletedLesson.id !== lesson.id
    ) {
      setSession((current) => ({
        ...current,
        previousLessonTitle: previousCompletedLesson.title,
      }));
    }
  }, [lesson.id, previousCompletedLesson]);

  const clearAutoAdvance = useCallback(() => {
    if (autoAdvanceTimerRef.current !== null) {
      window.clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  }, []);

  const stopSpeech = useCallback(() => {
    clearAutoAdvance();

    if (
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }

    speechRef.current = null;
    speechCompletionRef.current = null;
    setTutorStatus("ready");
  }, [clearAutoAdvance]);

  const speak = useCallback(
    (
      text: string,
      finalStatus: TutorStatus = "ready",
      onComplete?: () => void
    ) => {
      clearAutoAdvance();

      if (
        typeof window === "undefined" ||
        !("speechSynthesis" in window)
      ) {
        setTutorStatus(finalStatus);
        onComplete?.();
        return;
      }

      window.speechSynthesis.cancel();
      speechCompletionRef.current = onComplete ?? null;

      const utterance = new SpeechSynthesisUtterance(
        cleanForSpeech(text)
      );
      const voices = window.speechSynthesis.getVoices();

      utterance.voice =
        voices.find((voice) =>
          voice.lang.toLowerCase().startsWith("en-gb")
        ) ??
        voices.find((voice) =>
          voice.lang.toLowerCase().startsWith("en")
        ) ??
        null;

      utterance.lang = utterance.voice?.lang ?? "en-GB";
      utterance.rate = AGE_GROUP === "6-9" ? 0.84 : 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setTutorStatus("speaking");

      utterance.onend = () => {
        speechRef.current = null;
        setTutorStatus(finalStatus);

        const completion = speechCompletionRef.current;
        speechCompletionRef.current = null;
        completion?.();
      };

      utterance.onerror = (event) => {
        speechRef.current = null;

        if (
          event.error === "canceled" ||
          event.error === "interrupted"
        ) {
          return;
        }

        speechCompletionRef.current = null;
        setTutorStatus("ready");
        setErrorMessage(
          "Ayo could not play the teaching voice. You can continue by reading the caption."
        );
      };

      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [clearAutoAdvance]
  );

  const askAgainAfterSilence = useCallback(
    (purpose: ListeningPurpose) => {
      if (microphoneMuted) {
        setMicrophoneMode("muted");
        return;
      }

      silenceRetryRef.current += 1;
      const attempt = silenceRetryRef.current;
      const question =
        purpose === "opening"
          ? tutorMessage
          : step.question ?? step.teacherPrompt;

      const message =
        attempt === 1
          ? "Take your time. I am listening."
          : attempt === 2
            ? `Let me ask that again in a simpler way. ${question}`
            : "That is all right. You can answer when you are ready, or mute the microphone and type your response.";

      setTutorMessage(message);

      speak(message, "ready", () => {
        if (attempt < 3 && !microphoneMuted) {
          window.setTimeout(() => {
            beginListeningRef.current(purpose);
          }, 500);
        } else {
          setMicrophoneMode(
            microphoneMuted ? "muted" : "ready"
          );
        }
      });
    },
    [microphoneMuted, speak, step.question, step.teacherPrompt, tutorMessage]
  );

  const handleOpeningResponse = useCallback(
    (responseText: string, phase: ClassroomPhase) => {
      if (phase === "ask-name") {
        const learnerName = extractLearnerName(responseText);

        setSession((current) => ({
          ...current,
          learnerName,
          phase: "desired-outcome",
        }));

        setTypedAnswer("");

        const message = `It is lovely to meet you, ${learnerName}. Before I introduce today's class, what would you most like to understand or improve today?`;

        setTutorMessage(message);
        speak(message, "ready", () => {
          window.setTimeout(() => {
            beginListeningRef.current("opening");
          }, 500);
        });

        return;
      }

      if (phase === "desired-outcome") {
        const promiseMessage = buildPromiseMessage(responseText);

        setSession((current) => ({
          ...current,
          desiredOutcome: responseText,
          phase: "lesson-promise",
        }));
        setTypedAnswer("");
        setTutorMessage(promiseMessage);

        speak(promiseMessage, "ready", () => {
          setSession((current) => ({
            ...current,
            phase: "prior-knowledge",
          }));
          setTutorMessage(priorKnowledgePrompt);

          speak(priorKnowledgePrompt, "ready", () => {
            window.setTimeout(() => {
              beginListeningRef.current("opening");
            }, 500);
          });
        });

        return;
      }

      if (phase === "prior-knowledge") {
        setSession((current) => ({
          ...current,
          priorKnowledge: responseText,
        }));
        setTypedAnswer("");

        const message = `Thank you, ${currentLearnerName}. That gives me a useful idea of what you already understand. Let us begin.`;

        setTutorMessage(message);
        speak(message, "ready", () => {
          setSession((current) => ({
            ...current,
            phase: "teaching",
          }));
        });
      }
    },
    [
      buildPromiseMessage,
      currentLearnerName,
      priorKnowledgePrompt,
      speak,
    ]
  );

  const requestTutorReply = useCallback(
    async (
      learnerMessage: string,
      mode: "answer" | "question",
      localCorrectness: boolean
    ): Promise<AcademyTutorReply> => {
      const response = await fetch(
        "/api/fountaintalk/academy-chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            academyId,
            learner: {
              name: currentLearnerName,
              ageGroup: AGE_GROUP,
              priorKnowledge: session.priorKnowledge,
              desiredOutcome: session.desiredOutcome,
            },
            course: { id: course.id, title: course.title },
            lesson: {
              id: lesson.id,
              title: lesson.title,
              objective: lesson.objective,
              classPromise,
              learningOutcomes,
            },
            step,
            learnerMessage,
            mode,
            localCorrectness,
            classroomPhase: session.phase,
          }),
        }
      );

      const data = (await response.json()) as
        | AcademyTutorReply
        | { error?: string };

      if (!response.ok || !("displayText" in data)) {
        throw new Error(
          "error" in data && data.error
            ? data.error
            : "Ayo could not respond right now."
        );
      }

      return data;
    },
    [
      academyId,
      classPromise,
      course.id,
      course.title,
      currentLearnerName,
      learningOutcomes,
      lesson.id,
      lesson.objective,
      lesson.title,
      session.desiredOutcome,
      session.phase,
      session.priorKnowledge,
      step,
    ]
  );

  const evaluateAnswer = useCallback(
    async (rawAnswer: string) => {
      const answer = rawAnswer.trim();

      if (!answer) {
        askAgainAfterSilence("step-answer");
        return;
      }

      let resolvedAnswer = answer;

      if (step.responseType === "choice" && step.choices?.length) {
        const normalised = normaliseAnswer(answer);
        const match = step.choices.find((choice) => {
          const choiceId = normaliseAnswer(choice.id);
          const choiceLabel = normaliseAnswer(choice.label);

          return (
            normalised === choiceId ||
            normalised.includes(choiceLabel) ||
            choiceLabel.includes(normalised)
          );
        });

        if (match) {
          resolvedAnswer = match.label;
          setSelectedAnswer(match.label);
        }
      } else {
        setTypedAnswer(answer);
      }

      const acceptedAnswers = step.acceptedAnswers ?? [];
      const localCorrectness =
        acceptedAnswers.length === 0 ||
        includesAcceptedAnswer(resolvedAnswer, acceptedAnswers);

      setIsSubmitting(true);
      setMicrophoneMode("processing");
      setTutorStatus("thinking");
      setErrorMessage("");

      try {
        const reply = await requestTutorReply(
          resolvedAnswer,
          "answer",
          localCorrectness
        );

        setFeedback(reply);
        setTutorMessage(reply.displayText);

        speak(reply.speechText, "ready", () => {
          setIsSubmitting(false);
          setMicrophoneMode(
            microphoneMuted ? "muted" : "ready"
          );

          if (reply.isCorrect) {
            autoAdvanceTimerRef.current = window.setTimeout(() => {
              continueRef.current();
            }, 1000);
          } else if (!microphoneMuted) {
            window.setTimeout(() => {
              beginListeningRef.current("step-answer");
            }, 700);
          }
        });
      } catch (error) {
        const fallback: AcademyTutorReply = localCorrectness
          ? {
              displayText:
                step.explanation ??
                "That is a thoughtful answer. You have understood the main idea.",
              speechText:
                step.explanation ??
                "That is a thoughtful answer. You have understood the main idea.",
              isCorrect: true,
              encouragement:
                "Strong thinking. Let us build on it.",
              hint: null,
            }
          : {
              displayText:
                "That is a useful attempt. Let us examine the situation from another point of view.",
              speechText:
                "That is a useful attempt. Let us examine the situation from another point of view.",
              isCorrect: false,
              encouragement:
                "Take another moment to think.",
              hint: step.hint ?? null,
            };

        console.warn("Using local classroom feedback", error);
        setFeedback(fallback);
        setTutorMessage(fallback.displayText);

        speak(fallback.speechText, "ready", () => {
          setIsSubmitting(false);
          setMicrophoneMode(
            microphoneMuted ? "muted" : "ready"
          );

          if (fallback.isCorrect) {
            autoAdvanceTimerRef.current = window.setTimeout(() => {
              continueRef.current();
            }, 1000);
          }
        });
      }
    },
    [
      askAgainAfterSilence,
      microphoneMuted,
      requestTutorReply,
      speak,
      step,
    ]
  );

  useEffect(() => {
    evaluateAnswerRef.current = evaluateAnswer;
  }, [evaluateAnswer]);

  const beginListening = useCallback(
    (purpose: ListeningPurpose = "step-answer") => {
      if (
        typeof window === "undefined" ||
        microphoneMuted ||
        !voiceSessionEnabled
      ) {
        setMicrophoneMode(
          microphoneMuted ? "muted" : "ready"
        );
        return;
      }

      const Recognition =
        window.SpeechRecognition ??
        window.webkitSpeechRecognition;

      if (!Recognition) {
        setErrorMessage(
          "Voice input is not available in this browser. You can type your answer instead."
        );
        setMicrophoneMode("ready");
        return;
      }

      recognitionRef.current?.abort?.();
      setErrorMessage("");
      setMicrophoneMode("listening");

      let latestTranscript = "";
      let receivedSpeech = false;

      const recognition = new Recognition();
      recognition.lang = "en-GB";
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        setTutorStatus("listening");
        setMicrophoneMode("listening");
      };

      recognition.onresult = (event) => {
        let combinedTranscript = "";

        for (
          let index = 0;
          index < event.results.length;
          index += 1
        ) {
          combinedTranscript +=
            event.results[index]?.[0]?.transcript ?? "";
        }

        latestTranscript = combinedTranscript.trim();

        if (latestTranscript) {
          receivedSpeech = true;
          setTypedAnswer(latestTranscript);
        }
      };

      recognition.onerror = (event) => {
        recognitionRef.current = null;
        setTutorStatus("ready");

        if (event.error === "aborted") return;

        if (event.error === "no-speech") {
          askAgainAfterSilence(purpose);
          return;
        }

        setMicrophoneMode("ready");
        setErrorMessage(
          "Ayo could not hear that clearly. Please try again or type your answer."
        );
      };

      recognition.onend = () => {
        recognitionRef.current = null;
        setTutorStatus("ready");

        const capturedResponse = latestTranscript.trim();

        if (!receivedSpeech || !capturedResponse) {
          askAgainAfterSilence(purpose);
          return;
        }

        silenceRetryRef.current = 0;

        if (purpose === "opening") {
          handleOpeningResponse(capturedResponse, session.phase);
          return;
        }

        void evaluateAnswerRef.current(capturedResponse);
      };

      recognitionRef.current = recognition;
      recognition.start();
    },
    [
      askAgainAfterSilence,
      handleOpeningResponse,
      microphoneMuted,
      session.phase,
      voiceSessionEnabled,
    ]
  );

  useEffect(() => {
    beginListeningRef.current = beginListening;
  }, [beginListening]);

  const startLesson = useCallback(() => {
    setLessonStarted(true);
    setVoiceSessionEnabled(false);
    setMicrophoneMuted(true);
    setMicrophoneMode("muted");
    setFeedback(null);
    setSelectedAnswer("");
    setTypedAnswer("");
    setAskAyoText("");
    setAskAyoReply("");
    setErrorMessage("");
    silenceRetryRef.current = 0;

    const message = [
      "Welcome to Wealth Academy.",
      "I am Ayo, and I will lead this class.",
      `Today we are studying ${lesson.title}.`,
      classPromise,
      "The lesson will move automatically with animated visual explanations.",
      "Your microphone will remain closed while I teach. Raise your hand whenever you want me to pause.",
    ].join(" ");

    setSession((current) => ({
      ...current,
      learnerName:
        current.learnerName || DEFAULT_LEARNER_NAME,
      desiredOutcome: "",
      priorKnowledge: "",
      phase: "lesson-promise",
    }));
    setTutorMessage(message);
    setAyoPose("welcome");

    speak(message, "ready", () => {
      setSession((current) => ({
        ...current,
        phase: "teaching",
      }));
    });
  }, [
    classPromise,
    lesson.title,
    speak,
  ]);

  const continueToNextStep = useCallback(() => {
    if (
      step.responseType !== "none" &&
      !feedback?.isCorrect
    ) {
      setErrorMessage(
        "Complete this activity before continuing."
      );
      return;
    }

    const isCompletingCourse =
      progress.currentStepIndex === lesson.steps.length - 1 &&
      progress.currentLessonIndex === unit.lessons.length - 1;

    if (isCompletingCourse) {
      const projectedPoints =
        progress.points +
        (progress.completedLessonIds.includes(lesson.id)
          ? 0
          : lesson.completionPoints);

      const completionMessage = [
        `Excellent work, ${currentLearnerName}.`,
        `You completed ${course.title}.`,
        `You earned ${projectedPoints} points.`,
        session.desiredOutcome
          ? `You wanted to improve ${session.desiredOutcome}, and today's work has moved you closer to that goal.`
          : "",
        "Before you leave, remember the main idea from today's class and look for one opportunity to apply it.",
      ]
        .filter(Boolean)
        .join(" ");

      setSession((current) => ({
        ...current,
        phase: "completed",
      }));
      setTutorMessage(completionMessage);
      setAyoPose("celebrate");
      speak(completionMessage, "completed");
    }

    setProgress((current) => {
      const completedStepIds =
        current.completedStepIds.includes(step.id)
          ? current.completedStepIds
          : [...current.completedStepIds, step.id];

      const studiedAt = new Date().toISOString();

      if (
        current.currentStepIndex <
        lesson.steps.length - 1
      ) {
        return {
          ...current,
          currentStepIndex: current.currentStepIndex + 1,
          completedStepIds,
          lastStudiedAt: studiedAt,
        };
      }

      const lessonAlreadyCompleted =
        current.completedLessonIds.includes(lesson.id);

      const completedLessonIds = lessonAlreadyCompleted
        ? current.completedLessonIds
        : [...current.completedLessonIds, lesson.id];

      const points =
        current.points +
        (lessonAlreadyCompleted
          ? 0
          : lesson.completionPoints);

      if (
        current.currentLessonIndex <
        unit.lessons.length - 1
      ) {
        return {
          ...current,
          currentLessonIndex: current.currentLessonIndex + 1,
          currentStepIndex: 0,
          completedStepIds,
          completedLessonIds,
          points,
          lastStudiedAt: studiedAt,
        };
      }

      return {
        ...current,
        completedStepIds,
        completedLessonIds,
        points,
        lastStudiedAt: studiedAt,
        completedAt: studiedAt,
      };
    });
  }, [
    course.title,
    currentLearnerName,
    feedback?.isCorrect,
    lesson,
    progress,
    session.desiredOutcome,
    speak,
    step,
    unit.lessons,
  ]);

  useEffect(() => {
    continueRef.current = continueToNextStep;
  }, [continueToNextStep]);

  useEffect(() => {
    if (
      !lessonStarted ||
      session.phase !== "teaching" ||
      progress.completedAt
    ) {
      return;
    }

    clearAutoAdvance();
    silenceRetryRef.current = 0;
    setSelectedAnswer("");
    setTypedAnswer("");
    setFeedback(null);
    setAskAyoText("");
    setAskAyoReply("");
    setErrorMessage("");

    const pose = step.ayoPose ?? poseForStepKind(step.kind);
    setAyoPose(pose);
    setTutorMessage(stepTeachingMessage);

    speak(stepTeachingMessage, "ready", () => {
      if (step.responseType === "none") {
        if (step.autoAdvance !== false) {
          const transitionDelay = Math.max(
            650,
            Math.min((step.durationSeconds ?? 2) * 120, 2200)
          );

          autoAdvanceTimerRef.current = window.setTimeout(() => {
            continueRef.current();
          }, transitionDelay);
        }
        return;
      }

      if (!microphoneMuted && voiceSessionEnabled) {
        window.setTimeout(() => {
          beginListeningRef.current("step-answer");
        }, 500);
      }
    });
  }, [
    clearAutoAdvance,
    lessonStarted,
    microphoneMuted,
    progress.completedAt,
    session.phase,
    speak,
    step.autoAdvance,
    step.durationSeconds,
    step.ayoPose,
    step.id,
    step.kind,
    step.responseType,
    stepTeachingMessage,
    voiceSessionEnabled,
  ]);

  useEffect(() => {
    if (poseTimerRef.current !== null) {
      window.clearInterval(poseTimerRef.current);
      poseTimerRef.current = null;
    }

    if (tutorStatus === "listening") {
      setAyoPose("listen");
      return;
    }

    if (tutorStatus === "thinking") {
      setAyoPose("think");
      return;
    }

    if (tutorStatus === "completed") {
      setAyoPose("celebrate");
      return;
    }

    if (tutorStatus !== "speaking") {
      return;
    }

    const basePose = step.ayoPose ?? poseForStepKind(step.kind);
    const sequence: AyoPose[] = [
      basePose,
      basePose === "point-slide" ? "explain" : "point-slide",
      "open-hands",
    ];

    let index = 0;
    setAyoPose(sequence[index]);

    poseTimerRef.current = window.setInterval(() => {
      index = (index + 1) % sequence.length;
      setAyoPose(sequence[index]);
    }, 1700);

    return () => {
      if (poseTimerRef.current !== null) {
        window.clearInterval(poseTimerRef.current);
        poseTimerRef.current = null;
      }
    };
  }, [step.ayoPose, step.kind, tutorStatus]);

  const toggleMicrophone = useCallback(() => {
    setMicrophoneMuted((current) => {
      const nextMuted = !current;

      if (nextMuted) {
        recognitionRef.current?.abort?.();
        recognitionRef.current = null;
        setMicrophoneMode("muted");
        setTutorStatus("ready");
      } else {
        setMicrophoneMode("ready");

        if (
          lessonStarted &&
          tutorStatus !== "speaking" &&
          tutorStatus !== "thinking"
        ) {
          window.setTimeout(() => {
            const purpose: ListeningPurpose =
              session.phase === "teaching"
                ? "step-answer"
                : "opening";
            beginListeningRef.current(purpose);
          }, 300);
        }
      }

      return nextMuted;
    });
  }, [
    lessonStarted,
    session.phase,
    tutorStatus,
  ]);

  const repeatTutorMessage = useCallback(() => {
    speak(tutorMessage);
  }, [speak, tutorMessage]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.abort?.();
    recognitionRef.current = null;
    setTutorStatus("ready");
    setMicrophoneMode(
      microphoneMuted ? "muted" : "ready"
    );
  }, [microphoneMuted]);

  const submitAnswer = useCallback(async () => {
    const answer =
      step.responseType === "choice"
        ? selectedAnswer
        : typedAnswer.trim();

    await evaluateAnswer(answer);
  }, [evaluateAnswer, selectedAnswer, step.responseType, typedAnswer]);

  const askAyo = useCallback(async () => {
    const question = askAyoText.trim();
    if (!question) return;

    setIsSubmitting(true);
    setTutorStatus("thinking");
    setErrorMessage("");

    try {
      const reply = await requestTutorReply(
        question,
        "question",
        true
      );

      setAskAyoReply(reply.displayText);
      speak(reply.speechText, "ready", () => {
        setIsSubmitting(false);
      });
    } catch (error) {
      setIsSubmitting(false);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Ayo could not answer right now."
      );
    }
  }, [askAyoText, requestTutorReply, speak]);

  const goToPreviousStep = useCallback(() => {
    clearAutoAdvance();

    setProgress((current) => {
      if (current.currentStepIndex > 0) {
        return {
          ...current,
          currentStepIndex: current.currentStepIndex - 1,
        };
      }

      if (current.currentLessonIndex > 0) {
        const previousLesson =
          unit.lessons[current.currentLessonIndex - 1];

        return {
          ...current,
          currentLessonIndex: current.currentLessonIndex - 1,
          currentStepIndex: Math.max(
            previousLesson.steps.length - 1,
            0
          ),
        };
      }

      return current;
    });
  }, [clearAutoAdvance, unit.lessons]);

  useEffect(() => {
    return () => {
      clearAutoAdvance();

      if (poseTimerRef.current !== null) {
        window.clearInterval(poseTimerRef.current);
      }

      recognitionRef.current?.abort?.();

      if (
        typeof window !== "undefined" &&
        "speechSynthesis" in window
      ) {
        window.speechSynthesis.cancel();
      }
    };
  }, [clearAutoAdvance]);

  const canGoBack =
    progress.currentStepIndex > 0 ||
    progress.currentLessonIndex > 0;

  const canContinue =
    step.responseType === "none" ||
    feedback?.isCorrect === true;

  return {
    academy,
    course,
    unit,
    lesson,
    step,
    progress,
    session,
    learnerName: currentLearnerName,
    classPromise,
    learningOutcomes,
    priorKnowledgePrompt,
    hydrated,
    lessonStarted,
    tutorStatus,
    tutorMessage,
    ayoPose,
    voiceSessionEnabled,
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
    setSession,
    startLesson,
    toggleMicrophone,
    repeatTutorMessage,
    stopSpeech,
    beginListening,
    stopListening,
    submitAnswer,
    askAyo,
    goToPreviousStep,
    continueToNextStep,
  };
}