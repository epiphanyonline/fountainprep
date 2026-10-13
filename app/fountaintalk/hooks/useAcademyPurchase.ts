"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  hasAcademyPurchaseAccess,
} from "../services/purchaseAccess";

type UseAcademyPurchaseOptions = {
  skip?: boolean;
};

type UseAcademyPurchaseResult = {
  hasPurchasedAccess: boolean;
  loading: boolean;
  error: string | null;
};

export function useAcademyPurchase(
  academyId: string,
  studentId: string | null,
  options?: UseAcademyPurchaseOptions,
): UseAcademyPurchaseResult {
  const skip = options?.skip === true;

  const [
    hasPurchasedAccess,
    setHasPurchasedAccess,
  ] = useState(false);

  const [loading, setLoading] =
    useState(!skip);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (skip) {
      setHasPurchasedAccess(false);
      setLoading(false);
      setError(null);

      return () => {
        cancelled = true;
      };
    }

    async function loadPurchaseAccess() {
      try {
        setLoading(true);
        setError(null);

        const purchased =
          await hasAcademyPurchaseAccess(
            academyId,
            studentId,
          );

        if (!cancelled) {
          setHasPurchasedAccess(
            purchased,
          );
        }
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        setHasPurchasedAccess(false);

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load academy purchase access.",
        );

        console.warn(
          "Unable to load academy purchase access:",
          loadError,
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadPurchaseAccess();

    return () => {
      cancelled = true;
    };
  }, [
    academyId,
    skip,
    studentId,
  ]);

  return {
    hasPurchasedAccess,
    loading,
    error,
  };
}