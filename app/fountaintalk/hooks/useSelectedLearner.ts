"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  supabase,
} from "@/app/lib/supabase";

import type {
  LearnerAgeGroup,
} from "../types/academy";

export type SelectedAcademyLearner = {
  id: string;
  name: string;
  ageGroup: LearnerAgeGroup;
};

type UseSelectedLearnerResult = {
  learner: SelectedAcademyLearner | null;
  loading: boolean;
  error: string | null;
};

type StudentProfileRow = {
  id: string;
  full_name: string | null;
  child_age: number | null;
  age_group: string | null;
};

export function useSelectedLearner(
  studentId: string | null,
  options?: {
    skip?: boolean;
  },
): UseSelectedLearnerResult {
  const skip = options?.skip === true;

  const [learner, setLearner] =
    useState<SelectedAcademyLearner | null>(null);

  const [loading, setLoading] =
    useState(!skip);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (skip) {
      setLearner(null);
      setError(null);
      setLoading(false);

      return () => {
        cancelled = true;
      };
    }

    async function loadLearner() {
      try {
        setLoading(true);
        setError(null);

        if (!studentId) {
          throw new Error(
            "No learner was selected. Return to Subjects and choose a learner.",
          );
        }

        const {
          data: { user },
          error: authError,
        } =
          await supabase.auth.getUser();

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
        } =
          await supabase
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
        } =
          await supabase
            .from("student_profiles")
            .select(
              "id, full_name, child_age, age_group",
            )
            .eq("id", studentId)
            .eq(
              "parent_id",
              parentProfile.id,
            )
            .maybeSingle();

        if (studentError) {
          throw studentError;
        }

        if (!student) {
          throw new Error(
            "The selected learner could not be found or does not belong to this account.",
          );
        }

        const row =
          student as StudentProfileRow;

        if (!cancelled) {
          setLearner({
            id: row.id,
            name:
              row.full_name?.trim() ||
              "Learner",
            ageGroup:
              resolveLearnerAgeGroup(
                row.age_group,
                row.child_age,
              ),
          });
        }
      } catch (loadError) {
        if (!cancelled) {
          console.error(
            "Unable to load academy learner:",
            loadError,
          );

          setLearner(null);

          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load the selected learner.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadLearner();

    return () => {
      cancelled = true;
    };
  }, [
    skip,
    studentId,
  ]);

  return {
    learner,
    loading,
    error,
  };
}

function resolveLearnerAgeGroup(
  storedAgeGroup: string | null,
  childAge: number | null,
): LearnerAgeGroup {
  const normalised =
    storedAgeGroup
      ?.trim()
      .toLowerCase()
      .replace(/[–—]/g, "-")
      .replace(/\s+/g, "") ??
    "";

  if (
    normalised === "3-5" ||
    normalised === "3to5"
  ) {
    return "3-5";
  }

  if (
    normalised === "6-9" ||
    normalised === "6to9"
  ) {
    return "6-9";
  }

  if (
    normalised === "10-13" ||
    normalised === "10to13"
  ) {
    return "10-13";
  }

  if (
    normalised === "14-17" ||
    normalised === "14to17"
  ) {
    return "14-17";
  }

  if (
    normalised === "adult" ||
    normalised === "18+" ||
    normalised === "18plus"
  ) {
    return "adult";
  }

  if (
    typeof childAge === "number" &&
    Number.isFinite(childAge)
  ) {
    if (childAge <= 5) return "3-5";
    if (childAge <= 9) return "6-9";
    if (childAge <= 13) return "10-13";
    if (childAge <= 17) return "14-17";
  }

  return "adult";
}
