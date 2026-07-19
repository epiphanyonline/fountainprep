"use client";

import {
  useCallback,
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

const { course, unit: curriculum } =
  getFirstCurriculumSelection(
    languageCurriculum,
    learner.level
  );

  const [progress, setProgress] =
  useState<LearnerProgress>(() =>
    createInitialProgress(
  learner.id,
  course
)
  );

  const activeLesson = useMemo(
    () =>
      getActiveLessonState(
    course,
    progress
),
    [course, progress]
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

        const action =
          data.action ??
          "continue_step";

        setTutorMessage(
          data.displayText
        );

        setCorrectedPhrase(
          data.correctedPhrase ?? null
        );

        setEncouragement(
          data.encouragement ?? null
        );

        applyTutorAction(action);

        /*
         * Fixed curriculum phrases use native audio.
         * Free-form AI replies use browser speech until
         * production multilingual voice is connected.
         */
        if (
          conversationMode ===
            "curriculum" &&
          activeLesson.step.nativeAudioUrl &&
          (
            action === "repeat_step" ||
            action === "continue_step"
          )
        ) {
          void playNativeAudio(
            activeLesson.step.nativeAudioUrl,
            data.speechText,
            "ready"
          );
        } else {
          speakText(
            data.speechText,
            "ready"
          );
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
      playNativeAudio,
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
      setTutorStatus("ready");
    }, [course]);

  const continueToNextStep =
  useCallback(() => {
    const isFinalLesson =
      activeLesson.lessonIndex ===
      activeLesson.unit.lessons.length - 1;

    const isFinalStep =
      activeLesson.isLastStep;

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
    activeLesson.isLastStep,
    activeLesson.lessonIndex,
    curriculum,
    learner.name,
    playNativeAudio,
    progress,
    router,
    speakText,
  ]);

  const repeatTutorMessage =
  useCallback(() => {
    playStepAudio(
      tutorMessage,
      "ready"
    );
  }, [
    playStepAudio,
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