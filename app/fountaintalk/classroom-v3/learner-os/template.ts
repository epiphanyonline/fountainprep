import type { LearnerProfile } from "./types";
import { learnerDisplayName } from "./profile";

export function renderLearnerTemplate(
  template: string,
  profile?: LearnerProfile | null,
  variables: Record<string, string | number> = {},
): string {
  const values: Record<string, string | number> = {
    preferredName: learnerDisplayName(profile),
    ...variables,
  };

  return template.replace(/{{\s*([\w.-]+)\s*}}/g, (_, key: string) => {
    const value = values[key];
    return value === undefined ? "" : String(value);
  });
}
