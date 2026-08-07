"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "@/app/lib/supabase";
import {
  getAcademy,
  selectAcademyPath,
  type AcademyCode,
  type LessonActivity,
} from "@/features/academy-content";

import {
  registerMvpAcademies,
} from "@/app/data/academies";

import type {
  AcademyProgressRow,
  UniversalClassroomState,
} from "./types";

type Options = {
  studentId: string;
  academyCode: AcademyCode;
  programmeId?: string | null;
  courseId?: string | null;
  requestedLessonId?: string | null;
};

function calculateStreak(
  completedDates: Array<string | null>,
): number {
  const uniqueDates = Array.from(
    new Set(
      completedDates
        .filter((value): value is string => Boolean(value))
        .map((value) =>
          new Date(value).toISOString().slice(0, 10),
        ),
    ),
  ).sort((a, b) => b.localeCompare(a));

  let streak = 0;
  const cursor = new Date();

  for (const completedDate of uniqueDates) {
    const expected = cursor.toISOString().slice(0, 10);

    if (completedDate !== expected) {
      break;
    }

    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
}

function answerMatches(
  activity: LessonActivity,
  answer: string,
): boolean {
  const normalised = answer.trim().toLowerCase();

  if (!normalised) {
    return false;
  }

  if (activity.expectedAnswer?.trim().toLowerCase() === normalised) {
    return true;
  }

  return Boolean(
    activity.acceptedAnswers?.some(
      (candidate) =>
        candidate.trim().toLowerCase() === normalised ||
        normalised.includes(candidate.trim().toLowerCase()),
    ),
  );
}

export function useAcademyClassroomEngine({
  studentId,
  academyCode,
  programmeId,
  courseId,
  requestedLessonId,
}: Options) {
  const [rows, setRows] = useState<AcademyProgressRow[]>([]);
  const [activeLessonId, setActiveLessonId] =
    useState<string | null>(requestedLessonId ?? null);
  const [activityIndex, setActivityIndex] = useState(0);
  const [status, setStatus] = useState<
    "loading" | "ready" | "checking" | "completed" | "error"
  >("loading");
  const [feedback, setFeedback] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const baseSelection = useMemo(() => {
    registerMvpAcademies();

    return selectAcademyPath(
      getAcademy(academyCode),
      programmeId,
      courseId,
      activeLessonId,
    );
  }, [
    academyCode,
    programmeId,
    courseId,
    activeLessonId,
  ]);

  const loadProgress = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");

    const { data, error } = await supabase
      .from("student_academy_progress")
      .select(
        "id, student_id, academy_code, programme_id, course_id, unit_id, lesson_id, status, current_activity_index, points_earned, score, started_at, completed_at, last_studied_at",
      )
      .eq("student_id", studentId)
      .eq("academy_code", academyCode)
      .eq("programme_id", baseSelection.programme.id)
      .eq("course_id", baseSelection.course.id);

    if (error) {
      setErrorMessage(error.message);
      setStatus("error");
      return;
    }

    const progressRows =
      (data as AcademyProgressRow[] | null) ?? [];

    setRows(progressRows);

    const explicitRow = requestedLessonId
      ? progressRows.find(
          (row) => row.lesson_id === requestedLessonId,
        )
      : null;

    const inProgressRow = progressRows.find(
      (row) => row.status === "in_progress",
    );

    const completedIds = new Set(
      progressRows
        .filter((row) => row.status === "completed")
        .map((row) => row.lesson_id),
    );

    const nextIncomplete = baseSelection.allLessons.find(
      (lesson) => !completedIds.has(lesson.id),
    );

    const resolvedLessonId =
      explicitRow?.lesson_id ??
      requestedLessonId ??
      inProgressRow?.lesson_id ??
      nextIncomplete?.id ??
      baseSelection.allLessons.at(-1)?.id ??
      baseSelection.lesson.id;

    const restoredRow = progressRows.find(
      (row) => row.lesson_id === resolvedLessonId,
    );

    setActiveLessonId(resolvedLessonId);
    setActivityIndex(
      Math.max(restoredRow?.current_activity_index ?? 0, 0),
    );
    setStatus(
      restoredRow?.status === "completed"
        ? "completed"
        : "ready",
    );
  }, [
    academyCode,
    baseSelection,
    requestedLessonId,
    studentId,
  ]);

  useEffect(() => {
    void loadProgress();
  }, [loadProgress]);

  const selection = useMemo(
    () =>
      selectAcademyPath(
        baseSelection.academy,
        baseSelection.programme.id,
        baseSelection.course.id,
        activeLessonId,
      ),
    [baseSelection, activeLessonId],
  );

  const safeActivityIndex = Math.min(
    Math.max(activityIndex, 0),
    selection.lesson.activities.length - 1,
  );

  const activity =
    selection.lesson.activities[safeActivityIndex] ??
    selection.lesson.activities[0];

  const saveProgress = useCallback(
    async (
      nextIndex: number,
      nextStatus: "in_progress" | "completed",
      pointsEarned: number,
    ) => {
      const now = new Date().toISOString();

      const { error } = await supabase
        .from("student_academy_progress")
        .upsert(
          {
            student_id: studentId,
            academy_code: academyCode,
            programme_id: selection.programme.id,
            course_id: selection.course.id,
            unit_id: selection.unit.id,
            lesson_id: selection.lesson.id,
            status: nextStatus,
            current_activity_index: nextIndex,
            points_earned: pointsEarned,
            started_at: now,
            completed_at:
              nextStatus === "completed" ? now : null,
            last_studied_at: now,
          },
          {
            onConflict: "student_id,lesson_id",
          },
        );

      if (error) {
        throw error;
      }
    },
    [
      academyCode,
      selection,
      studentId,
    ],
  );

  const continueActivity = useCallback(async () => {
    setFeedback("");

    const isLastActivity =
      safeActivityIndex >=
      selection.lesson.activities.length - 1;

    try {
      if (!isLastActivity) {
        const nextIndex = safeActivityIndex + 1;

        await saveProgress(
          nextIndex,
          "in_progress",
          0,
        );

        setActivityIndex(nextIndex);
        setStatus("ready");
        return;
      }

      const alreadyCompleted = rows.some(
        (row) =>
          row.lesson_id === selection.lesson.id &&
          row.status === "completed",
      );

      const awardedPoints = alreadyCompleted
        ? 0
        : selection.lesson.completionPoints;

      await saveProgress(
        safeActivityIndex,
        "completed",
        awardedPoints,
      );

      if (!alreadyCompleted) {
        const { error: achievementError } = await supabase
          .from("student_academy_achievements")
          .upsert(
            {
              student_id: studentId,
              academy_code: academyCode,
              lesson_id: selection.lesson.id,
              achievement_type: "lesson_completion",
              title: `${selection.lesson.title} completed`,
              description: selection.lesson.objective,
              points_awarded:
                selection.lesson.completionPoints,
            },
            {
              onConflict:
                "student_id,lesson_id,achievement_type",
            },
          );

        if (achievementError) {
          throw achievementError;
        }
      }

      const nextLesson =
        selection.allLessons[selection.lessonIndex + 1];

      await loadProgress();

      if (nextLesson) {
        setActiveLessonId(nextLesson.id);
        setActivityIndex(0);
        setStatus("ready");
      } else {
        setStatus("completed");
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to save progress.",
      );
      setStatus("error");
    }
  }, [
    academyCode,
    loadProgress,
    rows,
    safeActivityIndex,
    saveProgress,
    selection,
    studentId,
  ]);

  const submitAnswer = useCallback(
    async (answer: string, selectedOptionId?: string) => {
      setStatus("checking");

      const isCorrect = activity.correctOptionId
        ? selectedOptionId === activity.correctOptionId
        : activity.acceptedAnswers || activity.expectedAnswer
          ? answerMatches(activity, answer)
          : true;

      if (!isCorrect) {
        setFeedback(
          activity.retryReply ??
            activity.hints?.[0] ??
            "Have another try.",
        );
        setStatus("ready");
        return false;
      }

      setFeedback(
        activity.successReply ??
          "Well done. You can continue.",
      );
      setStatus("ready");
      return true;
    },
    [activity],
  );

  const goBack = useCallback(() => {
    if (safeActivityIndex <= 0) {
      return;
    }

    setFeedback("");
    setActivityIndex((current) =>
      Math.max(current - 1, 0),
    );
  }, [safeActivityIndex]);

  const completedLessonIds = rows
    .filter((row) => row.status === "completed")
    .map((row) => row.lesson_id);

  const points = rows.reduce(
    (total, row) => total + row.points_earned,
    0,
  );

  const lessonPercent = Math.round(
    ((safeActivityIndex + 1) /
      selection.lesson.activities.length) *
      100,
  );

  const coursePercent = Math.round(
    (completedLessonIds.length /
      selection.allLessons.length) *
      100,
  );

  const state: UniversalClassroomState = {
    lesson: selection.lesson,
    activity,
    activityIndex: safeActivityIndex,
    totalActivities:
      selection.lesson.activities.length,
    lessonIndex: selection.lessonIndex,
    totalLessons: selection.allLessons.length,
    lessonPercent,
    coursePercent,
    points,
    streak: calculateStreak(
      rows.map((row) => row.completed_at),
    ),
    completedLessonIds,
  };

  return {
    academy: selection.academy,
    programme: selection.programme,
    course: selection.course,
    unit: selection.unit,
    state,
    status,
    feedback,
    errorMessage,
    canGoBack: safeActivityIndex > 0,
    continueActivity,
    submitAnswer,
    goBack,
    reload: loadProgress,
  };
}
