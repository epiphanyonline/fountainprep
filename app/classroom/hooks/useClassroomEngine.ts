"use client";

import { useMemo } from "react";

import { useTutor } from "@/app/fountaintalk/tutor/hooks/useTutor";

import type {
  LearnerProfile as FountainTalkLearner,
  TutorStatus,
} from "@/app/types/fountaintalk";

import type {
  ClassroomState,
  LearnerProfile,
  Lesson,
  LessonAction,
  LessonSlide,
  LessonStage,
  LessonStatus,
} from "../types/classroom";

type UseClassroomEngineOptions = {
  learner: FountainTalkLearner;
};

function mapStatus(status: TutorStatus): LessonStatus {
  switch (status) {
    case "listening":
      return "listening";

    case "thinking":
      return "thinking";

    case "speaking":
      return "speaking";

    case "completed":
      return "completed";

    case "ready":
    default:
      return "ready";
  }
}

function getAgeFromGroup(ageGroup: FountainTalkLearner["ageGroup"]) {
  switch (ageGroup) {
    case "3-5":
      return 5;

    case "6-9":
      return 8;

    case "10-13":
      return 12;

    case "14-17":
      return 16;

    case "adult":
      return 25;

    default:
      return 8;
  }
}

function getPersonality(
  ageGroup: FountainTalkLearner["ageGroup"],
): LearnerProfile["personality"] {
  switch (ageGroup) {
    case "3-5":
    case "6-9":
      return "explorer";

    case "10-13":
      return "coach";

    case "14-17":
      return "mentor";

    case "adult":
      return "professional";

    default:
      return "coach";
  }
}

function readString(
  source: Record<string, unknown>,
  keys: string[],
  fallback = "",
) {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return fallback;
}

function mapStepAction(
  step: Record<string, unknown>,
  isLastStep: boolean,
): LessonAction {
  if (isLastStep) {
    return "complete";
  }

  const expectedPhrase = readString(step, [
    "expectedPhrase",
    "expectedAnswer",
  ]);

  if (expectedPhrase) {
    return "speak";
  }

  const nativeAudioUrl = readString(step, [
    "nativeAudioUrl",
    "audioUrl",
    "audio",
  ]);

  if (nativeAudioUrl) {
    return "listen";
  }

  return "continue";
}

function mapLessonStage(
  action: LessonAction,
  stepIndex: number,
): LessonStage {
  if (action === "complete") {
    return "celebration";
  }

  if (stepIndex === 0) {
    return "welcome";
  }

  if (action === "speak" || action === "repeat") {
    return "practice";
  }

  if (action === "listen") {
    return "teach";
  }

  return "review";
}

export function useClassroomEngine({
  learner,
}: UseClassroomEngineOptions) {
  const tutor = useTutor({ learner });

  const classroomState = useMemo<ClassroomState>(() => {
    const {
      activeLesson,
      progress,
      tutorStatus,
      tutorMessage,
      learnerTranscript,
    } = tutor;

    const step = activeLesson.step as unknown as Record<
      string,
      unknown
    >;

    const lessonRecord =
      activeLesson.lesson as unknown as Record<
        string,
        unknown
      >;

    const unitRecord =
      activeLesson.unit as unknown as Record<
        string,
        unknown
      >;

    const totalSteps = Math.max(
      activeLesson.lesson.steps.length,
      1,
    );

    const currentSlideNumber = Math.min(
      activeLesson.stepIndex,
      totalSteps - 1,
    );

    const percent = Math.round(
      ((currentSlideNumber + 1) / totalSteps) * 100,
    );

    const action = mapStepAction(
      step,
      activeLesson.isLastStep,
    );

    const slide: LessonSlide = {
      id:
        readString(step, ["id"]) ||
        `step-${activeLesson.stepIndex + 1}`,

      title: readString(
        step,
        ["title", "heading"],
        `Step ${activeLesson.stepIndex + 1}`,
      ),

      subtitle: readString(step, [
        "subtitle",
        "activityType",
      ]),

      explanation: readString(
        step,
        [
          "instruction",
          "explanation",
          "prompt",
          "content",
        ],
        tutorMessage,
      ),

      nativeText: readString(step, [
        "expectedPhrase",
        "nativeText",
        "phrase",
      ]),

      englishText: readString(step, [
        "translation",
        "englishText",
        "meaning",
      ]),

      image: readString(step, [
        "imageUrl",
        "illustrationUrl",
      ]),

      illustration: readString(step, [
        "illustration",
        "emoji",
      ]),

      audio: readString(step, [
        "nativeAudioUrl",
        "audioUrl",
      ]),

      expectedAnswer: readString(step, [
        "expectedPhrase",
        "expectedAnswer",
      ]),

      hint: readString(step, ["hint", "supportText"]),

      action,
    };

    const mappedLearner: LearnerProfile = {
      id: learner.id,
      firstName: learner.name.split(" ")[0] || learner.name,
      age: getAgeFromGroup(learner.ageGroup),
      academy: "language",
      programme:
        learner.language.charAt(0).toUpperCase() +
        learner.language.slice(1),
      stage:
        learner.level.charAt(0).toUpperCase() +
        learner.level.slice(1),
      confidence: 60,
      preferredSpeed: "normal",
      personality: getPersonality(learner.ageGroup),
      strengths: [],
      weaknesses: [],
    };

    const mappedLesson: Lesson = {
      id: readString(
        lessonRecord,
        ["id"],
        "current-lesson",
      ),

      academy: "language",

      programme:
        learner.language.charAt(0).toUpperCase() +
        learner.language.slice(1),

      stage:
        learner.level.charAt(0).toUpperCase() +
        learner.level.slice(1),

      lessonNumber: activeLesson.lessonIndex + 1,

      title: readString(
        lessonRecord,
        ["title"],
        "Language lesson",
      ),

      description: readString(
        lessonRecord,
        ["objective", "description"],
        slide.explanation,
      ),

      estimatedMinutes:
        typeof lessonRecord.estimatedMinutes === "number"
          ? lessonRecord.estimatedMinutes
          : 10,

      reward: {
        xp:
          typeof lessonRecord.completionPoints === "number"
            ? lessonRecord.completionPoints
            : 50,
        streak: progress.streak,
      },

      // The UI displays the active curriculum step.
      // Full sequencing remains controlled by useTutor.
      slides: [slide],
    };

    const conversation = [];

    if (tutorMessage) {
      conversation.push({
        id: `ayo-${slide.id}`,
        speaker: "ayo" as const,
        message: tutorMessage,
      });
    }

    if (learnerTranscript) {
      conversation.push({
        id: `learner-${slide.id}`,
        speaker: "learner" as const,
        message: learnerTranscript,
      });
    }

    return {
      learner: mappedLearner,
      lesson: mappedLesson,

      progress: {
        currentSlide: currentSlideNumber,
        totalSlides: totalSteps,
        percent,
      },

      lessonStage: mapLessonStage(
        action,
        activeLesson.stepIndex,
      ),

      status: mapStatus(tutorStatus),
      currentSlide: slide,
      conversation,
    };
  }, [learner, tutor]);

  return {
    ...tutor,
    classroomState,

    controls: {
      onSpeak:
        tutor.tutorStatus === "listening"
          ? tutor.stopListening
          : tutor.beginListening,

      onReplay: tutor.repeatTutorMessage,
      onBack: tutor.goToPreviousStep,
      onContinue: tutor.continueToNextStep,
      onStopSpeech: tutor.stopSpeech,

      canGoBack: !tutor.activeLesson.isFirstStep,

      canContinue:
        !tutor.isRequestPending &&
        !tutor.isProgressSaving &&
        tutor.tutorStatus !== "listening" &&
        tutor.tutorStatus !== "thinking",
    },
  };
}