import type { LearnerProfile } from "./types";

export interface LearnerProfileStore {
  load(learnerId: string): Promise<LearnerProfile | null>;
  save(profile: LearnerProfile): Promise<void>;
}

export class BrowserLearnerProfileStore implements LearnerProfileStore {
  constructor(private readonly prefix = "fountainprep:learner") {}

  async load(learnerId: string): Promise<LearnerProfile | null> {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(`${this.prefix}:${learnerId}`);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as LearnerProfile;
    } catch {
      return null;
    }
  }

  async save(profile: LearnerProfile): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      `${this.prefix}:${profile.identity.learnerId}`,
      JSON.stringify(profile),
    );
  }
}
