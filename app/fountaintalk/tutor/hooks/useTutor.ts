"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import type {
  LearnerProfile,
  LearnerProgress,
  TutorAction,
  TutorReply,
  TutorStatus,
} from "@/app/types/fountaintalk";

import { getLanguageCurriculum } from "@/app/data/fountaintalk";

import {
  learningService,
  progressRepository,
  type LanguageLearningPath,
} from "@/features/learning";

import { adaptLearningPathToFountainTalkCourse } from "@/features/learning/adapters/fountaintalk.adapter";

import { getFirstCurriculumSelection } from "../services/curriculumEngine";

import {
  completeCurrentLesson,
  completeCurrentStep,
  createInitialProgress,
  getActiveLessonState,
  getStepOpeningMessage,
  moveToPreviousStep,
  repeatCurrentStep,
} from "@/app/fountaintalk/tutor/services/lessonEngine";

import { supabase } from "@/app/lib/supabase";

type UseTutorOptions = {
  learner: LearnerProfile;
};

type TutorApiResponse = Partial<TutorReply> & {
  error?: string;
};

const MAX_PRONUNCIATION_ATTEMPTS = 3;

type FoundationAccessResponse = {
  allowed: boolean;
  accessType:
    | "FREE_FOUNDATION"
    | "PREMIUM_BUNDLE"
    | "ACADEMY_SUBSCRIPTION";
  unlimited: boolean;
  completedRuns: number | null;
  freeRunsRemaining: number | null;
  foundationLocked: boolean;
  alreadyRecorded?: boolean;
  error?: string;
};

export function useTutor({
  learner,
}: UseTutorOptions) {
  const router = useRouter();

  const foundationRunIdRef =
  useRef<string | null>(null);

  const recognitionRef =
    useRef<SpeechRecognition | null>(null);

  const currentSpeechRef =
    useRef<SpeechSynthesisUtterance | null>(null);

  const currentAudioRef =
    useRef<HTMLAudioElement | null>(null);

    const mediaRecorderRef =
  useRef<MediaRecorder | null>(
    null,
  );

const microphoneStreamRef =
  useRef<MediaStream | null>(
    null,
  );

const recordedChunksRef =
  useRef<Blob[]>([]);

  const hasSentFinalTranscriptRef =
    useRef(false);

    const latestTranscriptRef =
  useRef("");

  const languageCurriculum =
  getLanguageCurriculum(learner.language);

const [databaseLearningPath, setDatabaseLearningPath] =
  useState<LanguageLearningPath | null>(null);

const [isLearningPathLoading, setIsLearningPathLoading] =
  useState(true);

const [learningPathError, setLearningPathError] =
  useState<string | null>(null);

const [studentLearningPathLoaded, setStudentLearningPathLoaded] =
  useState(false);

const fallbackSelection = useMemo(
  () =>
    getFirstCurriculumSelection(
      languageCurriculum,
      learner.level,
    ),
  [languageCurriculum, learner.level],
);

const course = useMemo(() => {
  if (!databaseLearningPath) {
    return fallbackSelection.course;
  }

  return adaptLearningPathToFountainTalkCourse(
    databaseLearningPath,
    languageCurriculum,
  );
}, [
  databaseLearningPath,
  fallbackSelection.course,
  languageCurriculum,
]);

  useEffect(() => {
  let isCancelled = false;

  async function loadLearningPath() {
    try {
      setIsLearningPathLoading(true);
      setLearningPathError(null);

      const proficiencyCode =
        learner.level === "foundation"
          ? "A0"
          : learner.level.toUpperCase();

      const path =
  await learningService.getLanguageLearningPath(
    learner.language,
    proficiencyCode,
  );

if (!path) {
  throw new Error(
    "No curriculum is available for the selected language and level.",
  );
}

if (!isCancelled) {
  setDatabaseLearningPath(path);
}
    } catch (error) {
      console.error(
        "Unable to load FountainTalk learning path:",
        error,
      );

      if (!isCancelled) {
        setLearningPathError(
          error instanceof Error
            ? error.message
            : "Unable to load the learning path.",
        );
      }
    } finally {
      if (!isCancelled) {
        setIsLearningPathLoading(false);
      }
    }
  }

  void loadLearningPath();

  return () => {
    isCancelled = true;
  };
}, [learner.language, learner.level]);

  const [progress, setProgress] =
  useState<LearnerProgress>(() =>
    createInitialProgress(
  learner.id,
  course
)
  );

  const curriculum = useMemo(
  () =>
    course.units.find(
      (unit) =>
        unit.id === progress.currentUnitId,
    ) ??
    course.units[0] ??
    fallbackSelection.unit,
  [
    course.units,
    fallbackSelection.unit,
    progress.currentUnitId,
  ],
);

  useEffect(() => {
  setProgress(
    createInitialProgress(
      learner.id,
      course,
    ),
  );
}, [course.id, learner.id]);

useEffect(() => {
  let isCancelled = false;

  async function loadStudentProgress() {
    if (!databaseLearningPath) {
      return;
    }

    try {
      setStudentLearningPathLoaded(false);

      const proficiencyCode =
        learner.level === "foundation"
          ? "A0"
          : learner.level.toUpperCase();

      const studentPath =
        await learningService.getStudentLanguageLearningPath(
          learner.id,
          learner.language,
          proficiencyCode,
        );

      if (!studentPath || isCancelled) {
        return;
      }

      const completedLessonIds = studentPath.progress
        .filter((item) => item.status === "completed")
        .map((item) => item.episodeId)
        .filter(
          (episodeId): episodeId is string =>
            episodeId !== null,
        );

        const activeEpisodeProgress =
  studentPath.progress.find(
    (item) =>
      item.status === "in_progress" &&
      item.episodeId,
  );

      const completedDates = studentPath.progress
  .filter(
    (item) =>
      item.status === "completed" &&
      item.completedAt,
  )
  .map((item) =>
    new Date(item.completedAt as string)
      .toISOString()
      .slice(0, 10),
  );

const uniqueStudyDates = Array.from(
  new Set(completedDates),
).sort((a, b) => b.localeCompare(a));

let streak = 0;
const cursor = new Date();

for (const studyDate of uniqueStudyDates) {
  const expectedDate = cursor
    .toISOString()
    .slice(0, 10);

  if (studyDate !== expectedDate) {
    break;
  }

  streak += 1;
  cursor.setUTCDate(cursor.getUTCDate() - 1);
}  

      let nextUnitIndex = 0;
let nextLessonIndex = 0;
let foundIncompleteLesson = false;

for (
  let unitIndex = 0;
  unitIndex < course.units.length;
  unitIndex += 1
) {
  const unit = course.units[unitIndex];

  const lessonIndex =
    unit.lessons.findIndex(
      (lesson) =>
        !completedLessonIds.includes(
          lesson.id,
        ),
    );

  if (lessonIndex >= 0) {
    nextUnitIndex = unitIndex;
    nextLessonIndex = lessonIndex;
    foundIncompleteLesson = true;
    break;
  }
}

if (!foundIncompleteLesson) {
  nextUnitIndex = Math.max(
    course.units.length - 1,
    0,
  );

  const finalUnit =
    course.units[nextUnitIndex];

  nextLessonIndex = Math.max(
    (finalUnit?.lessons.length ?? 1) - 1,
    0,
  );
}  

let restoredProgress =
  createInitialProgress(
    learner.id,
    course,
  );

for (
  let unitIndex = 0;
  unitIndex < course.units.length;
  unitIndex += 1
) {
  const unit = course.units[unitIndex];

  const lessonsToComplete =
    unitIndex < nextUnitIndex
      ? unit.lessons.length
      : unitIndex === nextUnitIndex
        ? nextLessonIndex
        : 0;

  for (
    let lessonIndex = 0;
    lessonIndex < lessonsToComplete;
    lessonIndex += 1
  ) {
    restoredProgress =
      completeCurrentLesson(
        course,
        restoredProgress,
      );
  }

  if (unitIndex >= nextUnitIndex) {
    break;
  }
}

const restoredStepIndex =
  activeEpisodeProgress?.currentStepIndex ?? 0;

const activeUnit =
  course.units[nextUnitIndex];

const activeLesson =
  activeUnit?.lessons[nextLessonIndex];

const completedActiveStepIds =
  activeLesson?.steps
    .slice(0, restoredStepIndex)
    .map((step) => step.id) ?? [];

const restoredCompletedStepIds = Array.from(
  new Set([
    ...restoredProgress.completedStepIds,
    ...completedActiveStepIds,
  ]),
);

setProgress({
  ...restoredProgress,
  currentStepIndex: restoredStepIndex,
  completedStepIds: restoredCompletedStepIds,
  completedLessonIds,
  streak,
});
    } catch (error) {
      console.error(
        "Unable to restore FountainTalk progress:",
        error,
      );
    } finally {
      if (!isCancelled) {
        setStudentLearningPathLoaded(true);
      }
    }
  }

  void loadStudentProgress();

  return () => {
    isCancelled = true;
  };
}, [
  course,
  databaseLearningPath,
  learner.id,
  learner.language,
  learner.level,
]);
  
  const activeLesson = useMemo(
  () =>
    getActiveLessonState(
      course,
      progress,
    ),
  [course, progress],
);

  const initialTutorMessage = useMemo(
    () =>
      getStepOpeningMessage(
        learner.name,
        activeLesson.lesson,
        activeLesson.step
      ),
    [
      activeLesson.lesson,
      activeLesson.step,
      learner.name,
    ]
  );

  const [microphoneGranted, setMicrophoneGranted] =
    useState(false);

  const [audioWorking, setAudioWorking] =
    useState(false);

  const [lessonStarted, setLessonStarted] =
    useState(false);

  const [tutorStatus, setTutorStatus] =
    useState<TutorStatus>("ready");

  const [tutorMessage, setTutorMessage] =
    useState(initialTutorMessage);

    useEffect(() => {
  if (!lessonStarted) {
    setTutorMessage(initialTutorMessage);
  }
}, [
  initialTutorMessage,
  lessonStarted,
]);

  const [
    learnerTranscript,
    setLearnerTranscript,
  ] = useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [lastTutorAction, setLastTutorAction] =
    useState<TutorAction>("continue_step");

  const [correctedPhrase, setCorrectedPhrase] =
    useState<string | null>(null);

  const [encouragement, setEncouragement] =
    useState<string | null>(null);

  const [conversationMode, setConversationMode] =
    useState<
      "curriculum" | "free-conversation"
    >("curriculum");

  const [isRequestPending, setIsRequestPending] =
    useState(false);

    const [isProgressSaving, setIsProgressSaving] =
  useState(false);

  const [pronunciationAttempts, setPronunciationAttempts] =
    useState(0);

  const [canProceedAfterAttempts, setCanProceedAfterAttempts] =
    useState(false);

  useEffect(() => {
    setPronunciationAttempts(0);
    setCanProceedAfterAttempts(false);
  }, [activeLesson.step.id]);

  const stopAllAudio = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }

    currentSpeechRef.current = null;
  }, []);

  const speakText = useCallback(
  async (
    text: string,
    statusAfterSpeaking: TutorStatus = "ready"
  ) => {
    if (typeof window === "undefined") {
      return;
    }

    const cleanText = text
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/#{1,6}\s?/g, "")
      .replace(/`/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .trim();

    if (!cleanText) {
      setErrorMessage(
        "The tutor did not return anything to speak."
      );
      setTutorStatus("ready");
      return;
    }

    try {
      setErrorMessage("");
      stopAllAudio();
      setTutorStatus("thinking");

      const response = await fetch(
        "/api/academy/speech",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: cleanText,
          }),
        }
      );

      if (!response.ok) {
        const responseText = await response.text();

        let message =
          "The tutor voice could not be generated.";

        try {
          const parsed = responseText
            ? JSON.parse(responseText)
            : {};

          if (parsed.error) {
            message = parsed.error;
          }
        } catch {
          // keep fallback
        }

        throw new Error(message);
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);

      await new Promise<void>((resolve) => {
        const audio = new Audio(audioUrl);

        currentAudioRef.current = audio;

        audio.onplay = () => {
          setTutorStatus("speaking");
        };

        audio.onended = () => {
          currentAudioRef.current = null;
          URL.revokeObjectURL(audioUrl);

          setTutorStatus(statusAfterSpeaking);
          setAudioWorking(true);

          resolve();
        };

        audio.onerror = () => {
          currentAudioRef.current = null;
          URL.revokeObjectURL(audioUrl);

          setTutorStatus("ready");

          setErrorMessage(
            "The tutor audio could not be played."
          );

          resolve();
        };

        void audio.play().catch((error) => {
          currentAudioRef.current = null;
          URL.revokeObjectURL(audioUrl);

          console.error(
            "FountainTalk tutor audio playback error:",
            error
          );

          setTutorStatus("ready");

          resolve();
        });
      });
    } catch (error) {
      console.error(
        "FountainTalk tutor speech error:",
        error
      );

      setTutorStatus("ready");

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The tutor voice could not be played."
      );
    }
  },
  [stopAllAudio]
);

  const playNativeAudio = useCallback(
    async (
      audioUrl: string,
      fallbackText: string,
      statusAfterSpeaking: TutorStatus = "ready"
    ) => {
      if (typeof window === "undefined") {
        return;
      }

      try {
        setErrorMessage("");
        stopAllAudio();

        const audio = new Audio(audioUrl);

        currentAudioRef.current = audio;

        audio.onplay = () => {
          setTutorStatus("speaking");
        };

        audio.onended = () => {
          currentAudioRef.current = null;
          setTutorStatus(
            statusAfterSpeaking
          );
          setAudioWorking(true);
        };

        audio.onerror = () => {
          currentAudioRef.current = null;

          console.warn(
            `Native audio could not be loaded: ${audioUrl}`
          );

          speakText(
            fallbackText,
            statusAfterSpeaking
          );
        };

        await audio.play();
      } catch (error) {
        currentAudioRef.current = null;

        console.error(
          "FountainTalk native audio error:",
          error
        );

        speakText(
          fallbackText,
          statusAfterSpeaking
        );
      }
    },
    [speakText, stopAllAudio]
  );

  const speakCorrectionSequence = useCallback(
    async ({
      speechText,
      phrase,
      audioUrl,
      allowContinue,
    }: {
      speechText: string;
      phrase: string;
      audioUrl: string;
      allowContinue: boolean;
    }) => {
      if (typeof window === "undefined") {
        return;
      }

      stopAllAudio();
      setErrorMessage("");
      setTutorStatus("speaking");

      const clean = speechText
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/#{1,6}\s?/g, "")
        .replace(/`/g, "")
        .trim();

      const lowerClean = clean.toLocaleLowerCase();
      const lowerPhrase = phrase.toLocaleLowerCase();
      const phraseIndex = lowerClean.indexOf(lowerPhrase);

      let beforeText = "Listen carefully.";
      let afterText = allowContinue
        ? "Good effort. You can continue now and practise this phrase again later."
        : "Now try it once more.";

      if (phraseIndex >= 0) {
        beforeText = clean.slice(0, phraseIndex).trim() || beforeText;
        afterText =
          clean.slice(phraseIndex + phrase.length).trim() || afterText;
      } else if (clean) {
        beforeText = clean;
      }

      const speakSegment = (text: string) =>
        new Promise<void>((resolve) => {
          if (!("speechSynthesis" in window) || !text.trim()) {
            resolve();
            return;
          }

          const synthesis = window.speechSynthesis;
          const utterance = new SpeechSynthesisUtterance(text.trim());
          const voices = synthesis.getVoices();
          const preferredVoice =
            voices.find((voice) =>
              voice.lang.toLowerCase().startsWith("en-gb")
            ) ??
            voices.find((voice) =>
              voice.lang.toLowerCase().startsWith("en")
            ) ??
            voices[0];

          if (preferredVoice) {
            utterance.voice = preferredVoice;
            utterance.lang = preferredVoice.lang;
          } else {
            utterance.lang = "en-GB";
          }

          utterance.rate =
            learner.ageGroup === "3-5"
              ? 0.72
              : learner.ageGroup === "6-9"
                ? 0.8
                : 0.88;
          utterance.pitch = learner.ageGroup === "3-5" ? 1.08 : 1;
          utterance.volume = 1;
          utterance.onend = () => resolve();
          utterance.onerror = () => resolve();
          currentSpeechRef.current = utterance;
          synthesis.speak(utterance);
        });

      const playPhrase = () =>
        new Promise<void>((resolve) => {
          const audio = new Audio(audioUrl);
          currentAudioRef.current = audio;
          audio.onended = () => {
            currentAudioRef.current = null;
            resolve();
          };
          audio.onerror = () => {
            currentAudioRef.current = null;
            resolve();
          };
          void audio.play().catch(() => resolve());
        });

      await speakSegment(beforeText);
      await playPhrase();
      await speakSegment(afterText);

      currentSpeechRef.current = null;
      currentAudioRef.current = null;
      setTutorStatus("ready");
      setAudioWorking(true);
    },
    [learner.ageGroup, stopAllAudio]
  );

  const playStepAudio = useCallback(
  async (
    text: string,
    statusAfterSpeaking: TutorStatus = "ready"
  ) => {
    const nativeAudio =
      activeLesson.step.nativeAudioUrl;

    const expectedPhrase =
      activeLesson.step.expectedPhrase;

    const cleanText = text
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/#{1,6}\s?/g, "")
      .replace(/`/g, "")
      .trim();

    /*
     * If there is no native Yoruba recording,
     * Ayo simply teaches the whole step naturally.
     */
    if (!nativeAudio) {
      await speakText(
        cleanText,
        statusAfterSpeaking
      );
      return;
    }

    /*
     * Break the tutor narration around the
     * Yoruba phrase so Ayo explains first,
     * the native recording models pronunciation,
     * then Ayo continues naturally.
     */
    let beforeText = cleanText;
    let afterText = "";

    if (
      expectedPhrase &&
      cleanText.includes(expectedPhrase)
    ) {
      const phraseIndex =
        cleanText.indexOf(expectedPhrase);

      beforeText = cleanText
        .slice(0, phraseIndex)
        .trim();

      afterText = cleanText
        .slice(
          phraseIndex +
            expectedPhrase.length
        )
        .trim();
    }

    /*
     * Step 1:
     * Ayo introduces/explains the idea.
     */
    if (beforeText) {
      await speakText(
        beforeText,
        "speaking"
      );
    }

    /*
     * Step 2:
     * Authentic Yoruba pronunciation.
     */
    await playNativeAudio(
      nativeAudio,
      expectedPhrase ?? "",
      "speaking"
    );

    /*
     * Step 3:
     * Ayo continues the lesson naturally.
     */
    if (afterText) {
      await speakText(
        afterText,
        statusAfterSpeaking
      );
    } else {
      setTutorStatus(
        statusAfterSpeaking
      );
    }
  },
  [
    activeLesson.step.nativeAudioUrl,
    activeLesson.step.expectedPhrase,
    playNativeAudio,
    speakText,
  ]
);

  const stopSpeech = useCallback(() => {
    stopAllAudio();
    setTutorStatus("ready");
  }, [stopAllAudio]);

  const testAudio = useCallback(async () => {
  try {
    setErrorMessage("");
    setTutorStatus("thinking");

    const response = await fetch(
      "/api/academy/speech",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text:
            "Welcome to FountainTalk. Your speaker is working correctly. Let's begin your lesson.",
        }),
      }
    );

    if (!response.ok) {
      const responseText =
        await response.text();

      let message =
        "The speaker test could not be played.";

      try {
        const parsed =
          responseText
            ? JSON.parse(responseText)
            : {};

        if (parsed.error) {
          message =
            parsed.error;
        }
      } catch {
        // Keep fallback message.
      }

      throw new Error(message);
    }

    const blob =
      await response.blob();

    const audioUrl =
      URL.createObjectURL(blob);

    const audio =
      new Audio(audioUrl);

    currentAudioRef.current =
      audio;

    audio.onplay = () => {
      setTutorStatus(
        "speaking"
      );
    };

    audio.onended = () => {
      currentAudioRef.current =
        null;

      URL.revokeObjectURL(
        audioUrl
      );

      setTutorStatus(
        "ready"
      );

      setAudioWorking(
        true
      );
    };

    audio.onerror = () => {
      currentAudioRef.current =
        null;

      URL.revokeObjectURL(
        audioUrl
      );

      setTutorStatus(
        "ready"
      );

      setErrorMessage(
        "The speaker test audio could not be played."
      );
    };

    await audio.play();
  } catch (error) {
    console.error(
      "FountainTalk speaker test error:",
      error
    );

    setTutorStatus(
      "ready"
    );

    setErrorMessage(
      error instanceof Error
        ? error.message
        : "The speaker test could not be played."
    );
  }
}, []);

  const requestMicrophone =
    useCallback(async () => {
      if (
        typeof navigator === "undefined" ||
        !navigator.mediaDevices
          ?.getUserMedia
      ) {
        setErrorMessage(
          "Microphone access is not supported in this browser."
        );
        return;
      }

      try {
        setErrorMessage("");
        setTutorStatus("thinking");

        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              audio: true,
            }
          );

        stream
          .getTracks()
          .forEach((track) =>
            track.stop()
          );

        setMicrophoneGranted(true);
        setTutorStatus("ready");
      } catch (error) {
        console.error(
          "FountainTalk microphone error:",
          error
        );

        setMicrophoneGranted(false);
        setTutorStatus("ready");

        setErrorMessage(
          "Microphone permission was not granted. Allow microphone access in your browser settings."
        );
      }
    }, []);

    const getFoundationRunStorageKey =
  useCallback(
    () =>
      `fountaintalk:foundation-run:${learner.id}:${learner.language.toLowerCase()}`,
    [learner.id, learner.language],
  );

const getOrCreateFoundationRunId =
  useCallback(() => {
    if (typeof window === "undefined") {
      return crypto.randomUUID();
    }

    if (foundationRunIdRef.current) {
      return foundationRunIdRef.current;
    }

    const storageKey =
      getFoundationRunStorageKey();

    const existing =
      window.sessionStorage.getItem(
        storageKey,
      );

    if (existing) {
      foundationRunIdRef.current =
        existing;

      return existing;
    }

    const runId =
      crypto.randomUUID();

    window.sessionStorage.setItem(
      storageKey,
      runId,
    );

    foundationRunIdRef.current =
      runId;

    return runId;
  }, [getFoundationRunStorageKey]);

const clearFoundationRunId =
  useCallback(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(
        getFoundationRunStorageKey(),
      );
    }

    foundationRunIdRef.current = null;
  }, [getFoundationRunStorageKey]);

  const startLesson =
  useCallback(async () => {
    setErrorMessage("");

    if (!audioWorking) {
      setErrorMessage(
        "Please test your speaker first.",
      );
      return;
    }

    if (!microphoneGranted) {
      setErrorMessage(
        "Please allow microphone access first.",
      );
      return;
    }

    try {
      setIsRequestPending(true);

      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      const accessToken =
        session?.access_token;

      if (!accessToken) {
        router.push("/login");
        return;
      }

      const response =
        await fetch(
          "/api/fountaintalk/foundation-access",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${accessToken}`,
            },

            body: JSON.stringify({
              studentId:
                learner.id,

              language:
                learner.language,

              action: "check",
            }),
          },
        );

      const data =
        (await response.json()) as
          FoundationAccessResponse;

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Unable to check lesson access.",
        );
      }

      if (!data.allowed) {
        clearFoundationRunId();

        const params =
          new URLSearchParams({
            studentId:
              learner.id,

            language:
              learner.language,

            reason:
              "foundation_complete",
          });

        router.push(
          `/academy/subscription?${params.toString()}`,
        );

        return;
      }

      /*
       * We only need a run ID for free Foundation.
       *
       * Paid learners have unlimited access and
       * do not consume Foundation runs.
       */
      if (
        data.accessType ===
        "FREE_FOUNDATION"
      ) {
        getOrCreateFoundationRunId();
      } else {
        clearFoundationRunId();
      }

      const openingMessage =
        getStepOpeningMessage(
          learner.name,
          activeLesson.lesson,
          activeLesson.step,
        );

      setLessonStarted(true);
      setConversationMode(
        "curriculum",
      );

      setLearnerTranscript("");
      setTutorMessage(
        openingMessage,
      );

      setCorrectedPhrase(null);
      setEncouragement(null);

      playStepAudio(
        openingMessage,
        "ready",
      );
    } catch (error) {
      console.error(
        "Unable to start FountainTalk lesson:",
        error,
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to start the lesson.",
      );
    } finally {
      setIsRequestPending(false);
    }
  }, [
    activeLesson.lesson,
    activeLesson.step,
    audioWorking,
    clearFoundationRunId,
    getOrCreateFoundationRunId,
    learner.id,
    learner.language,
    learner.name,
    microphoneGranted,
    playStepAudio,
    router,
  ]);

  const applyTutorAction =
    useCallback(
      (action: TutorAction) => {
        setLastTutorAction(action);

        switch (action) {
          case "complete_step":
            setProgress((current) =>
              completeCurrentStep(
    course,
                current
              )
            );
            break;

          case "complete_lesson":
            setProgress((current) =>
              completeCurrentLesson(
    course,
                current
              )
            );
            break;

          case "repeat_step":
            setProgress((current) =>
              repeatCurrentStep(current)
            );
            break;

          case "answer_detour":
          case "continue_step":
          default:
            break;
        }
      },
      [course]
    );

  const askTutor = useCallback(
    async (message: string) => {
      const cleanedMessage =
        message.trim();

      if (
        !cleanedMessage ||
        isRequestPending
      ) {
        return;
      }

      try {
        setIsRequestPending(true);
        setTutorStatus("thinking");
        setErrorMessage("");

        const response = await fetch(
          "/api/fountaintalk/chat",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              message: cleanedMessage,

              learner: {
                name: learner.name,
                ageGroup:
                  learner.ageGroup,
                language:
                  learner.language,
                level: learner.level,
              },

              lesson: {
                id: activeLesson.lesson.id,
                title:
                  activeLesson.lesson.title,
                objective:
                  activeLesson.lesson
                    .objective,
                currentStep:
                  activeLesson.step,
              },

              progress: {
                currentStepIndex:
                  activeLesson.stepIndex,
                totalSteps:
                  activeLesson.lesson.steps
                    .length,
              },

              mode: conversationMode,
            }),
          }
        );

        const data =
          (await response.json()) as TutorApiResponse;

        if (!response.ok) {
          throw new Error(
            data.error ??
              "The tutor could not answer."
          );
        }

        if (
          !data.displayText ||
          !data.speechText
        ) {
          throw new Error(
            "The tutor returned an incomplete response."
          );
        }

        const returnedAction =
          data.action ??
          "continue_step";

        const isPronunciationStep =
          conversationMode === "curriculum" &&
          Boolean(activeLesson.step.expectedPhrase);

        let effectiveAction = returnedAction;
        let nextAttemptCount = pronunciationAttempts;
        let allowContinue = canProceedAfterAttempts;

        if (
          isPronunciationStep &&
          returnedAction === "repeat_step"
        ) {
          nextAttemptCount = Math.min(
            pronunciationAttempts + 1,
            MAX_PRONUNCIATION_ATTEMPTS
          );

          allowContinue =
            nextAttemptCount >= MAX_PRONUNCIATION_ATTEMPTS;

          setPronunciationAttempts(nextAttemptCount);
          setCanProceedAfterAttempts(allowContinue);

          if (allowContinue) {
            effectiveAction = "continue_step";
          }
        } else if (
          returnedAction === "complete_step" ||
          returnedAction === "complete_lesson"
        ) {
          setPronunciationAttempts(0);
          setCanProceedAfterAttempts(false);
        }

        const displayText = allowContinue
          ? "Good effort. Listen once more, then continue. You can practise this phrase again later."
          : data.displayText;

        setTutorMessage(displayText);

        setCorrectedPhrase(
          data.correctedPhrase ?? null
        );

        setEncouragement(
          allowContinue
            ? "Three good attempts completed. You may continue and return to practise later."
            : data.encouragement ?? null
        );

        applyTutorAction(effectiveAction);

        const nativeAudioUrl =
  activeLesson.step.nativeAudioUrl;

const phraseToPlay =
  data.correctedPhrase ??
  activeLesson.step.expectedPhrase ??
  "";

const isPronunciationCorrection =
  conversationMode === "curriculum" &&
  Boolean(nativeAudioUrl) &&
  Boolean(phraseToPlay) &&
  (
    effectiveAction === "repeat_step" ||
    Boolean(data.correctedPhrase)
  );

if (isPronunciationCorrection) {
  await speakCorrectionSequence({
    speechText: data.speechText,
    phrase: phraseToPlay,
    audioUrl: nativeAudioUrl!,
    allowContinue,
  });
} else {
  speakText(data.speechText, "ready");
}
      } catch (error) {
        console.error(
          "FountainTalk tutor request error:",
          error
        );

        setTutorStatus("ready");

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "The tutor could not answer."
        );
      } finally {
        setIsRequestPending(false);
      }
    },
    [
      activeLesson.lesson,
      activeLesson.step,
      activeLesson.stepIndex,
      applyTutorAction,
      conversationMode,
      isRequestPending,
      learner,
      pronunciationAttempts,
      canProceedAfterAttempts,
      speakCorrectionSequence,
      speakText,
    ]
  );

  const beginListening =
  useCallback(async () => {
    if (!lessonStarted) {
      setErrorMessage(
        "Please start the lesson first.",
      );
      return;
    }

    if (!microphoneGranted) {
      setErrorMessage(
        "Please allow microphone access first.",
      );
      return;
    }

    if (isRequestPending) {
      return;
    }

    if (
      typeof navigator ===
        "undefined" ||
      !navigator.mediaDevices
        ?.getUserMedia
    ) {
      setErrorMessage(
        "Microphone recording is not supported in this browser.",
      );
      return;
    }

    if (
      typeof MediaRecorder ===
      "undefined"
    ) {
      setErrorMessage(
        "Audio recording is not supported in this browser.",
      );
      return;
    }

    try {
      setErrorMessage("");
      setLearnerTranscript("");

      hasSentFinalTranscriptRef.current =
        false;

      latestTranscriptRef.current =
        "";

      recordedChunksRef.current =
        [];

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: {
              echoCancellation:
                true,
              noiseSuppression:
                true,
              autoGainControl:
                true,
            },
          },
        );

      microphoneStreamRef.current =
        stream;

      let mimeType = "";

      const preferredTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
      ];

      for (const type of preferredTypes) {
        if (
          MediaRecorder.isTypeSupported(
            type,
          )
        ) {
          mimeType = type;
          break;
        }
      }

      const recorder =
        mimeType
          ? new MediaRecorder(
              stream,
              {
                mimeType,
              },
            )
          : new MediaRecorder(
              stream,
            );

      mediaRecorderRef.current =
        recorder;

      recorder.ondataavailable =
        (event) => {
          if (
            event.data &&
            event.data.size > 0
          ) {
            recordedChunksRef.current.push(
              event.data,
            );
          }
        };

      recorder.onerror = (
        event,
      ) => {
        console.error(
          "FountainTalk recorder error:",
          event,
        );

        setTutorStatus(
          "ready",
        );

        setErrorMessage(
          "There was a problem recording your voice. Please try again.",
        );
      };

      recorder.onstart = () => {
        setTutorStatus(
          "listening",
        );
      };

      recorder.start(250);
    } catch (error) {
      console.error(
        "FountainTalk recording start error:",
        error,
      );

      mediaRecorderRef.current =
        null;

      microphoneStreamRef.current
        ?.getTracks()
        .forEach((track) =>
          track.stop(),
        );

      microphoneStreamRef.current =
        null;

      setTutorStatus("ready");

      setErrorMessage(
        "I could not start the microphone. Please check your browser microphone settings.",
      );
    }
  }, [
    isRequestPending,
    lessonStarted,
    microphoneGranted,
  ]);

  const stopListening =
  useCallback(async () => {
    const recorder =
      mediaRecorderRef.current;

    if (!recorder) {
      setTutorStatus("ready");

      setErrorMessage(
        "No recording is currently active. Please press Start speaking and try again.",
      );

      return;
    }

    if (
      recorder.state ===
      "inactive"
    ) {
      return;
    }

    try {
      setErrorMessage("");
      setTutorStatus(
        "thinking",
      );

      const finishedRecording =
        new Promise<Blob>(
          (resolve) => {
            recorder.onstop =
              () => {
                const blob =
                  new Blob(
                    recordedChunksRef.current,
                    {
                      type:
                        recorder.mimeType ||
                        "audio/webm",
                    },
                  );

                resolve(blob);
              };
          },
        );

      recorder.stop();

      const audioBlob =
        await finishedRecording;

      microphoneStreamRef.current
        ?.getTracks()
        .forEach((track) =>
          track.stop(),
        );

      microphoneStreamRef.current =
        null;

      mediaRecorderRef.current =
        null;

      recordedChunksRef.current =
        [];

      if (
        !audioBlob ||
        audioBlob.size < 500
      ) {
        setTutorStatus(
          "ready",
        );

        setErrorMessage(
          "I did not hear enough audio. Please try again and speak clearly.",
        );

        return;
      }

      const extension =
        audioBlob.type.includes(
          "mp4",
        )
          ? "m4a"
          : "webm";

      const audioFile =
        new File(
          [audioBlob],
          `learner-recording.${extension}`,
          {
            type:
              audioBlob.type ||
              "audio/webm",
          },
        );

      const formData =
        new FormData();

      formData.append(
        "audio",
        audioFile,
      );

      formData.append(
        "language",
        learner.language,
      );

      if (
        activeLesson.step
          .expectedPhrase
      ) {
        formData.append(
          "expectedPhrase",
          activeLesson.step
            .expectedPhrase,
        );
      }

      const response =
        await fetch(
          "/api/fountaintalk/transcribe",
          {
            method: "POST",
            body: formData,
          },
        );

      const responseText =
        await response.text();

      let result: {
        transcript?: string;
        error?: string;
      } = {};

      try {
        result =
          responseText
            ? JSON.parse(
                responseText,
              )
            : {};
      } catch {
        result = {};
      }

      if (!response.ok) {
        throw new Error(
          result.error ||
            "I could not understand the recording.",
        );
      }

      const transcript =
        result.transcript?.trim() ||
        "";

      if (!transcript) {
        setTutorStatus(
          "ready",
        );

        setErrorMessage(
          "I did not hear enough speech to understand you. Please try again.",
        );

        return;
      }

      latestTranscriptRef.current =
        transcript;

      hasSentFinalTranscriptRef.current =
        true;

      setLearnerTranscript(
        transcript,
      );

      await askTutor(
        transcript,
      );
    } catch (error) {
      console.error(
        "FountainTalk recording submission error:",
        error,
      );

      setTutorStatus("ready");

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "I could not process your recording. Please try again.",
      );
    } finally {
      microphoneStreamRef.current
        ?.getTracks()
        .forEach((track) =>
          track.stop(),
        );

      microphoneStreamRef.current =
        null;
    }
  }, [
    activeLesson.step
      .expectedPhrase,
    askTutor,
    learner.language,
  ]);
  
  const goToPreviousStep =
    useCallback(() => {
      setProgress((current) =>
        moveToPreviousStep(
    course,
          current
        )
      );

      setLearnerTranscript("");
      setCorrectedPhrase(null);
      setEncouragement(null);
      setPronunciationAttempts(0);
      setCanProceedAfterAttempts(false);
      setTutorStatus("ready");
    }, [course]);

  const continueToNextStep =
  useCallback(async () => {
    if (isProgressSaving) {
      return;
    }

    setIsProgressSaving(true);

    try {
      const isFinalLessonInUnit =
        activeLesson.isLastLesson;

      const isFinalUnit =
        activeLesson.isLastUnit;

      const isFinalCourseLesson =
        isFinalLessonInUnit &&
        isFinalUnit;

      const isFinalStep =
        activeLesson.isLastStep;

      if (isFinalStep) {
  try {
    await progressRepository.saveEpisodeProgress({
      studentId: learner.id,
      episodeId: activeLesson.lesson.id,
      status: "completed",
    });
  } catch (error) {
    console.error(
      "Unable to save FountainTalk lesson progress:",
      error,
    );

    setErrorMessage(
      error instanceof Error
        ? error.message
        : "Your lesson was completed, but progress could not be saved.",
    );

    return;
  }
}

    if (isFinalCourseLesson && isFinalStep) {
      try {
  const {
    data: { session },
  } =
    await supabase.auth.getSession();

  const accessToken =
    session?.access_token;

  if (!accessToken) {
    throw new Error(
      "Your session has expired. Please sign in again.",
    );
  }

  const runId =
    getOrCreateFoundationRunId();

  const accessResponse =
    await fetch(
      "/api/fountaintalk/foundation-access",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${accessToken}`,
        },

        body: JSON.stringify({
          studentId:
            learner.id,

          language:
            learner.language,

          action:
            "complete",

          runId,
        }),
      },
    );

  const accessData =
    (await accessResponse.json()) as
      FoundationAccessResponse;

  if (!accessResponse.ok) {
    throw new Error(
      accessData.error ??
        "Foundation completion could not be recorded.",
    );
  }

  /*
   * Completion succeeded.
   *
   * Remove this run ID so another deliberate
   * Foundation attempt receives a new ID.
   */
  clearFoundationRunId();
} catch (error) {
  console.error(
    "Unable to record Foundation completion:",
    error,
  );

  setErrorMessage(
    error instanceof Error
      ? error.message
      : "Your lesson was completed, but Foundation access could not be updated.",
  );

  return;
}
      const completedProgress =
        completeCurrentLesson(
    course,
          progress
        );

      setProgress(completedProgress);
      setTutorStatus("completed");
      setLearnerTranscript("");
      setCorrectedPhrase(null);

      try {
  await progressRepository.saveLessonAchievement({
    studentId: learner.id,
    episodeId: activeLesson.lesson.id,
    title: `${activeLesson.lesson.title} completed`,
    description: `Completed ${activeLesson.lesson.title} in ${activeLesson.unit.title}.`,
    pointsAwarded:
      activeLesson.lesson.completionPoints,
  });
} catch (error) {
  console.error(
    "Unable to save FountainTalk achievement:",
    error,
  );

  setErrorMessage(
    error instanceof Error
      ? error.message
      : "Your lesson was completed, but the achievement could not be saved.",
  );

  return;
}

      const completionMessage =
        `Amazing work, ${learner.name}! You have completed ${activeLesson.unit.title}.`;

      setTutorMessage(completionMessage);

      setEncouragement(
        "Unit completed! You earned your first Yoruba badge."
      );

      speakText(
        completionMessage,
        "completed"
      );

      window.setTimeout(() => {
  const reportParams =
    new URLSearchParams({
      studentId: learner.id,
      language: learner.language,
      unitTitle:
        activeLesson.unit.title,
      lessonTitle:
        activeLesson.lesson.title,
      points: String(
        activeLesson.lesson
          .completionPoints,
      ),
    });

  router.push(
    `/fountaintalk/lesson-report?${reportParams.toString()}`,
  );
}, 2500);

      return;
    }

    if (!isFinalStep) {
  try {
        await progressRepository.saveEpisodeProgress({
      studentId: learner.id,
      episodeId: activeLesson.lesson.id,
      status: "in_progress",
      currentStepIndex:
        activeLesson.stepIndex + 1,
    });
  } catch (error) {
    console.error(
      "Unable to save FountainTalk step progress:",
      error,
    );

    setErrorMessage(
      error instanceof Error
        ? error.message
        : "Your lesson step could not be saved.",
    );

    return;
  }
}

    const nextProgress =
      completeCurrentStep(
    course,
        progress
      );

    setProgress(nextProgress);

    const nextActive =
      getActiveLessonState(
    course,
        nextProgress
      );

    const nextMessage =
      getStepOpeningMessage(
        learner.name,
        nextActive.lesson,
        nextActive.step
      );

    setTutorMessage(nextMessage);
    setLearnerTranscript("");
    setCorrectedPhrase(null);
    setEncouragement(null);
    setPronunciationAttempts(0);
    setCanProceedAfterAttempts(false);

    if (nextActive.step.nativeAudioUrl) {
      void playNativeAudio(
        nextActive.step.nativeAudioUrl,
        nextActive.step.expectedPhrase ??
          nextMessage,
        "ready"
      );

      return;
    }

          speakText(
        nextMessage,
        "ready"
      );
    } finally {
      setIsProgressSaving(false);
    }
    }, [
    activeLesson.lesson.id,
    activeLesson.lesson.title,
    activeLesson.lesson.completionPoints,
    activeLesson.unit.title,
    activeLesson.isLastStep,
    activeLesson.stepIndex,
    activeLesson.isLastLesson,
    activeLesson.isLastUnit,
    learner.id,
    learner.language,
    learner.name,
    course,
    isProgressSaving,
    playNativeAudio,
    progress,
    router,
    speakText,
  ]);

  const repeatTutorMessage =
    useCallback(() => {
      const nativeAudioUrl =
        activeLesson.step.nativeAudioUrl;

      const expectedPhrase =
        activeLesson.step.expectedPhrase ??
        correctedPhrase ??
        tutorMessage;

      if (nativeAudioUrl) {
        void playNativeAudio(
          nativeAudioUrl,
          expectedPhrase,
          "ready"
        );
        return;
      }

      speakText(expectedPhrase, "ready");
    }, [
      activeLesson.step.expectedPhrase,
      activeLesson.step.nativeAudioUrl,
      correctedPhrase,
      playNativeAudio,
      speakText,
      tutorMessage,
    ]);

  const playSlowNativeAudio =
    useCallback(() => {
      const selectedAudioUrl =
        activeLesson.step
          .slowAudioUrl ??
        activeLesson.step
          .nativeAudioUrl;

      const fallbackText =
        activeLesson.step
          .expectedPhrase ??
        tutorMessage;

      if (!selectedAudioUrl) {
        speakText(
          fallbackText,
          "ready"
        );
        return;
      }

      void playNativeAudio(
        selectedAudioUrl,
        fallbackText,
        "ready"
      );
    }, [
      activeLesson.step
        .expectedPhrase,
      activeLesson.step
        .nativeAudioUrl,
      activeLesson.step
        .slowAudioUrl,
      playNativeAudio,
      speakText,
      tutorMessage,
    ]);

  const switchToFreeConversation =
    useCallback(() => {
      setConversationMode(
        "free-conversation"
      );

      const message =
        "You can now ask Ayo any language question. Your curriculum progress will remain saved.";

      setTutorMessage(message);
      speakText(message, "ready");
    }, [speakText]);

  const returnToCurriculum =
    useCallback(() => {
      setConversationMode("curriculum");

      const message =
        getStepOpeningMessage(
          learner.name,
          activeLesson.lesson,
          activeLesson.step
        );

      setTutorMessage(message);

      playStepAudio(
        message,
        "ready"
      );
    }, [
      activeLesson.lesson,
      activeLesson.step,
      learner.name,
      playStepAudio,
    ]);

  return {
    learner,
    curriculum,
    progress,
    activeLesson,

    databaseLearningPath,
isLearningPathLoading,
learningPathError,
studentLearningPathLoaded,

    microphoneGranted,
    audioWorking,
    lessonStarted,
    tutorStatus,
    tutorMessage,
    learnerTranscript,
    errorMessage,
    lastTutorAction,
    correctedPhrase,
    encouragement,
    conversationMode,
    isRequestPending,
isProgressSaving,
pronunciationAttempts,
    maxPronunciationAttempts: MAX_PRONUNCIATION_ATTEMPTS,
    canProceedAfterAttempts,

    testAudio,
    requestMicrophone,
    startLesson,
    askTutor,
    beginListening,
    stopListening,
    stopSpeech,
    repeatTutorMessage,
    playSlowNativeAudio,
    goToPreviousStep,
    continueToNextStep,
    switchToFreeConversation,
    returnToCurriculum,
  };
}