"use client";

import {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  getAcademy,
  selectAcademyPath,
  type AcademyCode,
  type LessonActivity,
} from "@/features/academy-content";

import {
  registerMvpAcademies,
} from "@/app/data/academies";

import {
  getAcademyGuestKey,
} from "@/app/lib/academyGuest";

type Options = {
  academyCode: AcademyCode;
  programmeId?: string | null;
  courseId?: string | null;
  lessonId: string;
  experienceId: string;
};

function answerMatches(
  activity: LessonActivity,
  answer: string,
): boolean {
  const normalised =
    answer.trim().toLowerCase();

  if (!normalised) {
    return false;
  }

  if (
    activity.expectedAnswer
      ?.trim()
      .toLowerCase() ===
    normalised
  ) {
    return true;
  }

  return Boolean(
    activity.acceptedAnswers?.some(
      (candidate) =>
        candidate
          .trim()
          .toLowerCase() ===
          normalised ||
        normalised.includes(
          candidate
            .trim()
            .toLowerCase(),
        ),
    ),
  );
}

export function useGuestAcademyClassroomEngine({
  academyCode,
  programmeId,
  courseId,
  lessonId,
  experienceId,
}: Options) {
  const [
    activityIndex,
    setActivityIndex,
  ] = useState(0);

  const [
    status,
    setStatus,
  ] = useState<
    | "ready"
    | "checking"
    | "completed"
    | "error"
  >("ready");

  const [
    feedback,
    setFeedback,
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const selection =
    useMemo(() => {
      registerMvpAcademies();

      return selectAcademyPath(
        getAcademy(
          academyCode,
        ),
        programmeId,
        courseId,
        lessonId,
      );
    }, [
      academyCode,
      programmeId,
      courseId,
      lessonId,
    ]);

  const safeActivityIndex =
    Math.min(
      Math.max(
        activityIndex,
        0,
      ),
      selection.lesson
        .activities.length - 1,
    );

  const activity =
    selection.lesson.activities[
      safeActivityIndex
    ] ??
    selection.lesson.activities[0];

  const checkAnswer =
    useCallback(
      async (
        answer: string,
        selectedOptionId?: string,
      ) => {
        setStatus(
          "checking",
        );

        setFeedback("");

        try {
          let correct = true;

          if (
            activity.type ===
              "multiple-choice" &&
            activity.options?.length
          ) {
            correct =
              selectedOptionId ===
              activity.correctOptionId;
          } else if (
            activity.expectedAnswer ||
            activity
              .acceptedAnswers
              ?.length
          ) {
            correct =
              answerMatches(
                activity,
                answer,
              );
          }

          if (!correct) {
            setFeedback(
              activity.retryReply ??
                "Not quite. Try again.",
            );

            setStatus(
              "ready",
            );

            return false;
          }

          setFeedback(
            activity.successReply ??
              "Great work.",
          );

          setStatus(
            "ready",
          );

          return true;
        } catch (error) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to check your answer.",
          );

          setStatus(
            "error",
          );

          return false;
        }
      },
      [
        activity,
      ],
    );

  const completeExperience =
    useCallback(
      async () => {
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
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  academy:
                    academyCode,

                  action:
                    "complete",

                  guestKey,

                  experienceId,
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

        return result;
      },
      [
        academyCode,
        experienceId,
      ],
    );

  const goNext =
    useCallback(
      async () => {
        const lastIndex =
          selection.lesson
            .activities.length -
          1;

        if (
          activityIndex <
          lastIndex
        ) {
          setActivityIndex(
            (current) =>
              current + 1,
          );

          setFeedback("");

          return {
            lessonCompleted:
              false,
            accessResult:
              null,
          };
        }

        try {
          setStatus(
            "checking",
          );

          const accessResult =
            await completeExperience();

          setStatus(
            "completed",
          );

          return {
            lessonCompleted:
              true,
            accessResult,
          };
        } catch (error) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to complete this experience.",
          );

          setStatus(
            "error",
          );

          return {
            lessonCompleted:
              false,
            accessResult:
              null,
          };
        }
      },
      [
        activityIndex,
        completeExperience,
        selection.lesson
          .activities.length,
      ],
    );

  const goPrevious =
    useCallback(() => {
      setActivityIndex(
        (current) =>
          Math.max(
            current - 1,
            0,
          ),
      );

      setFeedback("");
    }, []);

  const progressPercent =
    Math.round(
      ((safeActivityIndex +
        1) /
        selection.lesson
          .activities.length) *
        100,
    );

  return {
    status,
    errorMessage,

    state: {
      academy:
        selection.academy,

      programme:
        selection.programme,

      course:
        selection.course,

      unit:
        selection.unit,

      lesson:
        selection.lesson,

      activity,

      activityIndex:
        safeActivityIndex,

      totalActivities:
        selection.lesson
          .activities.length,

      progressPercent,

      pointsEarned:
        0,

      streak:
        0,
    },

    feedback,

    checkAnswer,
    goNext,
    goPrevious,

    isFirstActivity:
      safeActivityIndex === 0,

    isLastActivity:
      safeActivityIndex ===
      selection.lesson
        .activities.length -
        1,
  };
}