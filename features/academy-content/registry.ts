import type {
  AcademyCode,
  AcademyDefinition,
} from "./types";

const academies = new Map<
  AcademyCode,
  AcademyDefinition
>();

export function registerAcademy(
  academy: AcademyDefinition,
): void {
  if (academies.has(academy.code)) {
    throw new Error(
      `Academy "${academy.code}" has already been registered.`,
    );
  }

  academies.set(academy.code, academy);
}

export function getAcademy(
  code: AcademyCode,
): AcademyDefinition {
  const academy = academies.get(code);

  if (!academy) {
    throw new Error(
      `Academy "${code}" has not been registered.`,
    );
  }

  return academy;
}

export function hasAcademy(
  code: AcademyCode,
): boolean {
  return academies.has(code);
}

export function listAcademies(): AcademyDefinition[] {
  return Array.from(academies.values());
}
