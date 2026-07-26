import type { StoryJourney } from "../../story/types";
import { deepClone } from "./clone";
import type { StudioActor, StudioStoryRecord, StudioStatus } from "./types";
import { assertTransition } from "./workflow";

export interface StudioRepository {
  list(): Promise<StudioStoryRecord[]>;
  get(id: string): Promise<StudioStoryRecord | null>;
  save(record: StudioStoryRecord): Promise<StudioStoryRecord>;
}

export class MemoryStudioRepository implements StudioRepository {
  private readonly records = new Map<string, StudioStoryRecord>();

  constructor(seed: StudioStoryRecord[] = []) {
    seed.forEach((record) => this.records.set(record.id, deepClone(record)));
  }

  async list(): Promise<StudioStoryRecord[]> {
    return [...this.records.values()].map(deepClone).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async get(id: string): Promise<StudioStoryRecord | null> {
    const record = this.records.get(id);
    return record ? deepClone(record) : null;
  }

  async save(record: StudioStoryRecord): Promise<StudioStoryRecord> {
    this.records.set(record.id, deepClone(record));
    return deepClone(record);
  }
}

export function createStoryRecord(story: StoryJourney, actor: StudioActor): StudioStoryRecord {
  return {
    id: story.id,
    status: "draft",
    currentVersion: "0.1.0",
    updatedAt: new Date().toISOString(),
    updatedBy: actor,
    assignedAuthor: actor,
    draft: deepClone(story),
    versions: [],
  };
}

export async function saveDraft(repository: StudioRepository, id: string, draft: StoryJourney, actor: StudioActor): Promise<StudioStoryRecord> {
  const record = await repository.get(id);
  if (!record) throw new Error(`Story ${id} was not found.`);
  const next = { ...record, draft: deepClone(draft), updatedAt: new Date().toISOString(), updatedBy: actor };
  return repository.save(next);
}

export async function transitionStory(repository: StudioRepository, id: string, to: StudioStatus, actor: StudioActor): Promise<StudioStoryRecord> {
  const record = await repository.get(id);
  if (!record) throw new Error(`Story ${id} was not found.`);
  assertTransition(record.status, to);
  return repository.save({ ...record, status: to, updatedAt: new Date().toISOString(), updatedBy: actor });
}
