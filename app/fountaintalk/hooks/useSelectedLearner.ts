"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/app/lib/supabase";

import type {
  LearnerAgeGroup,
} from "../types/academy";

type StudentProfileRow = {
  id: string;
  full_name: string;
  child_age: number | null;
  age_group: string | null;
};

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

export function useSelectedLearner(
  studentId: string | null,
): UseSelectedLearnerResult {
  const [learner, setLearner] =
    useState<SelectedAcademyLearner | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadLearner() {
      try {
        setLoading(true);
        setError(null);
        setLearner(null);

        if (!studentId) {
          throw new Error(
            "No learner was selected. Return to Subjects and choose a learner.",
          );
        }

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          throw authError;
        }

        if (!user) {
          throw new Error(
            "Please log in before starting this academy.",
          );
        }

        const {
          data: parentProfile,
          error: parentError,
        } = await supabase
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
        } = await supabase
          .from("student_profiles")
          .select(
            "id, full_name, child_age, age_group",
          )
          .eq("id", studentId)
          .eq("parent_id", parentProfile.id)
          .maybeSingle();

        if (studentError) {
          throw studentError;
        }

        if (!student) {
          throw new Error(
            "The selected learner could not be found or does not belong to this account.",
          );
        }

        const studentRow =
          student as StudentProfileRow;

        if (!cancelled) {
          setLearner({
            id: studentRow.id,
            name: studentRow.full_name,
            ageGroup: resolveLearnerAgeGroup(
              studentRow.age_group,
              studentRow.child_age,
            ),
          });
        }
      } catch (loadError) {
        console.error(
          "Unable to load academy learner:",
          loadError,
        );

        if (!cancelled) {
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
  }, [studentId]);

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
  switch (storedAgeGroup) {
    case "3-5":
    case "6-9":
    case "10-13":
    case "14-17":
    case "adult":
      return storedAgeGroup;

    default:
      break;
  }

  if (childAge === null) {
    return "adult";
  }

  if (childAge <= 5) {
    return "3-5";
  }

  if (childAge <= 9) {
    return "6-9";
  }

  if (childAge <= 13) {
    return "10-13";
  }

  if (childAge <= 17) {
    return "14-17";
  }

  return "adult";
}