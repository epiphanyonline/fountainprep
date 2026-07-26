import { validateStory } from "../../story/validateStory";
import { deepClone } from "./clone";
import type { PublishRequest, PublishResult } from "./types";
import type { StudioRepository } from "./store";
import { isVersionGreater } from "./version";

export async function publishStory(repository: StudioRepository, storyId: string, request: PublishRequest): Promise<PublishResult> {
  const record = await repository.get(storyId);
  if (!record) throw new Error(`Story ${storyId} was not found.`);
  const validation = validateStory(record.draft);
  if (!validation.valid) return { ok: false, reason: "validation", record, validation };
  if (record.currentVersion !== request.expectedVersion || !isVersionGreater(request.nextVersion, record.currentVersion)) {
    return { ok: false, reason: "version-conflict", record, validation };
  }
  if (record.status !== "approved") return { ok: false, reason: "workflow", record, validation };

  const now = new Date().toISOString();
  const next = {
    ...record,
    status: "published" as const,
    currentVersion: request.nextVersion,
    updatedAt: now,
    updatedBy: request.actor,
    versions: [
      ...record.versions,
      {
        id: `${storyId}@${request.nextVersion}`,
        storyId,
        version: request.nextVersion,
        status: "published" as const,
        createdAt: now,
        createdBy: request.actor,
        notes: request.notes,
        snapshot: deepClone(record.draft),
      },
    ],
  };
  return { ok: true, record: await repository.save(next), validation };
}

export async function rollbackStory(repository: StudioRepository, storyId: string, version: string, actor: PublishRequest["actor"]): Promise<PublishResult> {
  const record = await repository.get(storyId);
  if (!record) throw new Error(`Story ${storyId} was not found.`);
  const target = record.versions.find((entry) => entry.version === version);
  if (!target) return { ok: false, reason: "version-conflict", record };
  const validation = validateStory(target.snapshot);
  const next = await repository.save({
    ...record,
    status: "draft",
    draft: deepClone(target.snapshot),
    updatedAt: new Date().toISOString(),
    updatedBy: actor,
  });
  return { ok: true, record: next, validation };
}
