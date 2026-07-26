import { describe, expect, it } from "vitest";
import { recallMemory } from "../engine/memory/MemoryDirector";

describe("MemoryDirector", () => {
  it("prefers memories connected to the current lesson", () => {
    const result = recallMemory({
      currentTopics: ["courage", "leadership"],
      memories: [
        { id: "1", topic: "patience", importance: "high" },
        { id: "2", topic: "courage", insight: "Courage can begin quietly", sourceTitle: "Joseph", importance: "medium" },
      ],
    });
    expect(result?.memory.id).toBe("2");
    expect(result?.line).toContain("Joseph");
  });
});
