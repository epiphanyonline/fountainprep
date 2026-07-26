import { describe, expect, it } from "vitest";
import { davidBeforeTheGiant } from "../../content/david-before-the-giant/journey";
import { publishStory } from "../core/publisher";
import { createStoryRecord, MemoryStudioRepository, transitionStory } from "../core/store";

const actor = { id: "reviewer", displayName: "Reviewer" };

describe("publisher", () => {
  it("publishes an approved, valid story as a versioned snapshot", async () => {
    const repository = new MemoryStudioRepository([createStoryRecord(davidBeforeTheGiant, actor)]);
    await transitionStory(repository, davidBeforeTheGiant.id, "review", actor);
    await transitionStory(repository, davidBeforeTheGiant.id, "approved", actor);
    const result = await publishStory(repository, davidBeforeTheGiant.id, { actor, expectedVersion: "0.1.0", nextVersion: "1.0.0" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.record.status).toBe("published");
      expect(result.record.versions).toHaveLength(1);
    }
  });

  it("rejects direct publication from draft", async () => {
    const repository = new MemoryStudioRepository([createStoryRecord(davidBeforeTheGiant, actor)]);
    const result = await publishStory(repository, davidBeforeTheGiant.id, { actor, expectedVersion: "0.1.0", nextVersion: "1.0.0" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("workflow");
  });
});
