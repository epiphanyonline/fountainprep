import type { JourneyCheckpoint, JourneyStatePersistence } from "./JourneyState";

export function createLocalStorageJourneyPersistence(
  storage: Pick<Storage, "getItem" | "setItem" | "removeItem">,
  namespace = "fountaintalk:journey:v1",
): JourneyStatePersistence {
  const key = (learnerId: string, lessonId: string) => `${namespace}:${learnerId}:${lessonId}`;
  return {
    async load(learnerId, lessonId) {
      const raw = storage.getItem(key(learnerId, lessonId));
      if (!raw) return null;
      try {
        return JSON.parse(raw) as JourneyCheckpoint;
      } catch {
        return null;
      }
    },
    async save(checkpoint) {
      storage.setItem(key(checkpoint.learnerId, checkpoint.lessonId), JSON.stringify(checkpoint));
    },
    async clear(learnerId, lessonId) {
      storage.removeItem(key(learnerId, lessonId));
    },
  };
}

/**
 * Adapter helper for Supabase or another remote store. Keeps the runtime free
 * from a hard dependency on a particular database client.
 */
export function createJourneyPersistenceAdapter(adapter: JourneyStatePersistence): JourneyStatePersistence {
  return adapter;
}
