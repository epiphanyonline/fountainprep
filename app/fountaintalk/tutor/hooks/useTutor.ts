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

type UseTutorOptions = {
  learner: LearnerProfile;
};

type TutorApiResponse = Partial<TutorReply> & {
  error?: string;
};

const MAX_PRONUNCIATION_ATTEMPTS = 3;

export function useTutor({
  learner,
}: UseTutorOptions) {
  const router = useRouter();

  const recognitionRef =
    useRef<SpeechRecognition | null>(null);

  const currentSpeechRef =
    useRef<SpeechSynthesisUtterance | null>(null);

  const currentAudioRef =
    useRef<HTMLAudioElement | null>(null);

  const hasSentFinalTranscriptRef =
    useRef(false);

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

const curriculum =
  course.units[0] ?? fallbackSelection.unit;

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

      const firstIncompleteLessonIndex =
  course.units[0]?.lessons.findIndex(
    (lesson) =>
      !completedLessonIds.includes(lesson.id),
  ) ?? 0;

const nextLessonIndex =
  firstIncompleteLessonIndex === -1
    ? Math.max(
        (course.units[0]?.lessons.length ?? 1) - 1,
        0,
      )
    : firstIncompleteLessonIndex;  

let restoredProgress =
  createInitialProgress(
    learner.id,
    course,
  );

for (
  let lessonIndex = 0;
  lessonIndex < nextLessonIndex;
  lessonIndex += 1
) {
  restoredProgress =
    completeCurrentLesson(
      course,
      restoredProgress,
    );
}

setProgress({
  ...restoredProgress,
  completedLessonIds,
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
    (
      text: string,
      statusAfterSpeaking: TutorStatus = "ready"
    ) => {
      if (
        typeof window === "undefined" ||
        !("speechSynthesis" in window)
      ) {
        setErrorMessage(
          "Speech playback is not supported in this browser."
        );
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

      setErrorMessage("");
      stopAllAudio();

      const synthesis =
        window.speechSynthesis;

      const playSpeech = () => {
        const speech =
          new SpeechSynthesisUtterance(
            cleanText
          );

        const voices =
          synthesis.getVoices();

        const preferredVoice =
          voices.find((voice) =>
            voice.lang
              .toLowerCase()
              .startsWith("en-gb")
          ) ??
          voices.find((voice) =>
            voice.lang
              .toLowerCase()
              .startsWith("en")
          ) ??
          voices[0];

        if (preferredVoice) {
          speech.voice = preferredVoice;
          speech.lang = preferredVoice.lang;
        } else {
          speech.lang = "en-GB";
        }

        speech.rate =
          learner.ageGroup === "3-5"
            ? 0.72
            : learner.ageGroup === "6-9"
              ? 0.8
              : 0.88;

        speech.pitch =
          learner.ageGroup === "3-5"
            ? 1.08
            : 1;

        speech.volume = 1;

        speech.onstart = () => {
          setTutorStatus("speaking");
        };

        speech.onend = () => {
          currentSpeechRef.current = null;
          setTutorStatus(
            statusAfterSpeaking
          );
          setAudioWorking(true);
        };

        speech.onerror = (event) => {
          currentSpeechRef.current = null;

          if (
            event.error === "canceled" ||
            event.error === "interrupted"
          ) {
            return;
          }

          console.error(
            "FountainTalk speech error:",
            event.error
          );

          setTutorStatus("ready");

          setErrorMessage(
            `The audio could not be played: ${event.error}`
          );
        };

        currentSpeechRef.current = speech;
        synthesis.speak(speech);
      };

      window.setTimeout(() => {
        if (
          synthesis.getVoices().length > 0
        ) {
          playSpeech();
          return;
        }

        const handleVoicesChanged = () => {
          synthesis.removeEventListener(
            "voiceschanged",
            handleVoicesChanged
          );

          playSpeech();
        };

        synthesis.addEventListener(
          "voiceschanged",
          handleVoicesChanged
        );

        window.setTimeout(() => {
          synthesis.removeEventListener(
            "voiceschanged",
            handleVoicesChanged
          );

          if (!synthesis.speaking) {
            playSpeech();
          }
        }, 800);
      }, 150);
    },
    [
      learner.ageGroup,
      stopAllAudio,
    ]
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

    // No Yoruba recording
    if (!nativeAudio) {
      speakText(text, statusAfterSpeaking);
      return;
    }

    // Remove the Yoruba phrase from the English narration
    const englishOnly =
      expectedPhrase
        ? text.replace(expectedPhrase, "").trim()
        : text;

    // Speak English instruction
    await new Promise<void>((resolve) => {
      if (
        typeof window === "undefined" ||
        !("speechSynthesis" in window)
      ) {
        resolve();
        return;
      }

      const utterance =
        new SpeechSynthesisUtterance(
          englishOnly
        );

      utterance.lang = "en-GB";
      utterance.rate = 0.9;

      utterance.onend = () => resolve();

      window.speechSynthesis.speak(
        utterance
      );
    });

    // Then play native Yoruba
    await playNativeAudio(
      nativeAudio,
      expectedPhrase ?? "",
      statusAfterSpeaking
    );
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

  const testAudio = useCallback(() => {
    speakText(
      "Welcome to FountainTalk. Your speaker is working correctly.",
      "ready"
    );
  }, [speakText]);

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

  const startLesson =
    useCallback(() => {
      setErrorMessage("");

      if (!audioWorking) {
        setErrorMessage(
          "Please test your speaker first."
        );
        return;
      }

      if (!microphoneGranted) {
        setErrorMessage(
          "Please allow microphone access first."
        );
        return;
      }

      const openingMessage =
        getStepOpeningMessage(
          learner.name,
          activeLesson.lesson,
          activeLesson.step
        );

      setLessonStarted(true);
      setConversationMode("curriculum");
      setLearnerTranscript("");
      setTutorMessage(openingMessage);
      setCorrectedPhrase(null);
      setEncouragement(null);

      playStepAudio(
        openingMessage,
        "ready"
      );
    }, [
      activeLesson.lesson,
      activeLesson.step,
      audioWorking,
      learner.name,
      microphoneGranted,
      playStepAudio,
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
    useCallback(() => {
      if (!lessonStarted) {
        setErrorMessage(
          "Please start the lesson first."
        );
        return;
      }

      if (!microphoneGranted) {
        setErrorMessage(
          "Please allow microphone access first."
        );
        return;
      }

      if (isRequestPending) {
        return;
      }

      const Recognition =
        window.SpeechRecognition ??
        window.webkitSpeechRecognition;

      if (!Recognition) {
        setErrorMessage(
          "Speech recognition is not available in this browser. Please use Google Chrome."
        );
        return;
      }

      setErrorMessage("");
      setLearnerTranscript("");

      hasSentFinalTranscriptRef.current =
        false;

      const recognition =
        new Recognition();

      const expectsTargetPhrase =
        Boolean(
          activeLesson.step
            .expectedPhrase
        );

      recognition.lang =
        conversationMode ===
          "curriculum" &&
        expectsTargetPhrase &&
        learner.language === "yoruba"
          ? "yo-NG"
          : "en-GB";

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        setTutorStatus("listening");
      };

      recognition.onresult = (event) => {
        let combinedTranscript = "";
        let finalTranscript = "";

        for (
          let index = 0;
          index < event.results.length;
          index += 1
        ) {
          const result =
            event.results[index];

          const text =
            result[0]?.transcript ?? "";

          combinedTranscript += text;

          if (result.isFinal) {
            finalTranscript += text;
          }
        }

        const cleanedCombined =
          combinedTranscript.trim();

        if (cleanedCombined) {
          setLearnerTranscript(
            cleanedCombined
          );
        }

        const cleanedFinal =
          finalTranscript.trim();

        if (
          cleanedFinal &&
          !hasSentFinalTranscriptRef.current
        ) {
          hasSentFinalTranscriptRef.current =
            true;

          recognition.stop();

          void askTutor(cleanedFinal);
        }
      };

      recognition.onerror = (event) => {
        recognitionRef.current = null;
        setTutorStatus("ready");

        if (
          event.error === "no-speech"
        ) {
          setErrorMessage(
            "I did not hear anything. Please try again."
          );
          return;
        }

        if (
          event.error === "not-allowed"
        ) {
          setErrorMessage(
            "Microphone access was blocked by the browser."
          );
          return;
        }

        if (
          event.error === "aborted"
        ) {
          return;
        }

        setErrorMessage(
          `Speech recognition error: ${event.error}`
        );
      };

      recognition.onend = () => {
        recognitionRef.current = null;

        setTutorStatus((current) =>
          current === "thinking" ||
          current === "speaking"
            ? current
            : "ready"
        );
      };

      recognitionRef.current =
        recognition;

      recognition.start();
    }, [
      activeLesson.step
        .expectedPhrase,
      askTutor,
      conversationMode,
      isRequestPending,
      learner.language,
      lessonStarted,
      microphoneGranted,
    ]);

  const stopListening =
    useCallback(() => {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      setTutorStatus("ready");
    }, []);

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
    const isFinalLesson =
      activeLesson.lessonIndex ===
      activeLesson.unit.lessons.length - 1;
      
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

    if (isFinalLesson && isFinalStep) {
      const completedProgress =
        completeCurrentLesson(
    course,
          progress
        );

      setProgress(completedProgress);
      setTutorStatus("completed");
      setLearnerTranscript("");
      setCorrectedPhrase(null);

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
        router.push(
          "/tutor/lesson-report"
        );
      }, 2500);

      return;
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
  }, [
    activeLesson.lesson.id,
learner.id,
activeLesson.isLastStep,
    activeLesson.lessonIndex,
    course,
    learner.name,
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