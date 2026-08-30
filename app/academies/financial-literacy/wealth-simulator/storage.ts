import type {
  WealthSimulationState,
} from "./types";

const STORAGE_KEY =
  "fountainprep:wealth-simulator:v1";

export function saveWealthGame(
  state: WealthSimulationState,
) {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state),
    );
  } catch {
    // Simulation should continue even
    // if browser storage is unavailable.
  }
}

export function loadWealthGame():
  | WealthSimulationState
  | null {
  if (
    typeof window === "undefined"
  ) {
    return null;
  }

  try {
    const raw =
      window.localStorage.getItem(
        STORAGE_KEY,
      );

    if (!raw) {
      return null;
    }

    const parsed =
      JSON.parse(raw) as
        WealthSimulationState;

    if (
      parsed.version !== 1
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function clearWealthGame() {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  try {
    window.localStorage.removeItem(
      STORAGE_KEY,
    );
  } catch {
    // Ignore storage errors.
  }
}