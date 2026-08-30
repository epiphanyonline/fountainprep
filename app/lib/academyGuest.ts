const GUEST_KEY_STORAGE =
  "fp_academy_guest_key";

export function getAcademyGuestKey(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const existing =
    window.localStorage.getItem(
      GUEST_KEY_STORAGE,
    );

  if (existing) {
    return existing;
  }

  const guestKey =
    typeof crypto !== "undefined" &&
    "randomUUID" in crypto
      ? crypto.randomUUID()
      : `guest-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`;

  window.localStorage.setItem(
    GUEST_KEY_STORAGE,
    guestKey,
  );

  return guestKey;
}