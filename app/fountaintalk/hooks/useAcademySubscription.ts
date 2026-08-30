"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getAcademySubscriptionAccess,
  type AcademySubscriptionAccess,
} from "../services/subscriptionAccess";

type UseAcademySubscriptionOptions = {
  skip?: boolean;
};

type UseAcademySubscriptionResult = {
  access: AcademySubscriptionAccess | null;
  loading: boolean;
  error: string | null;
};

export function useAcademySubscription(
  studentId: string | null,
  options?: UseAcademySubscriptionOptions,
): UseAcademySubscriptionResult {
  const skip = options?.skip === true;

  const [access, setAccess] =
    useState<AcademySubscriptionAccess | null>(null);

  const [loading, setLoading] =
    useState(!skip);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (skip) {
      setAccess(null);
      setLoading(false);
      setError(null);

      return () => {
        cancelled = true;
      };
    }

    async function loadAccess() {
      try {
        setLoading(true);
        setError(null);

        const result =
          await getAcademySubscriptionAccess(
            studentId,
          );

        if (!cancelled) {
          setAccess(result);
        }
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        setAccess(null);

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load academy subscription access.",
        );

        console.warn(
          "Unable to load academy subscription access:",
          loadError,
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadAccess();

    return () => {
      cancelled = true;
    };
  }, [
    skip,
    studentId,
  ]);

  return {
    access,
    loading,
    error,
  };
}
