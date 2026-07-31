"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getAcademySubscriptionAccess,
  type AcademySubscriptionAccess,
} from "../services/subscriptionAccess";

type UseAcademySubscriptionResult = {
  access: AcademySubscriptionAccess | null;
  loading: boolean;
  error: string | null;
};

export function useAcademySubscription(
  studentId: string | null,
): UseAcademySubscriptionResult {
  const [access, setAccess] =
    useState<AcademySubscriptionAccess | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAccess() {
      try {
        setLoading(true);
        setError(null);

        const result =
          await getAcademySubscriptionAccess(studentId);

        if (!cancelled) {
          setAccess(result);
        }
      } catch (loadError) {
        console.error(
          "Unable to load academy subscription access:",
          loadError,
        );

        if (!cancelled) {
          setAccess(null);
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load academy access.",
          );
        }
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
  }, [studentId]);

  return {
    access,
    loading,
    error,
  };
}