import type { MemoryHook } from "../types";

export interface LearnerMemoryRecord {
  id: string;
  topic: string;
  insight?: string;
  sourceTitle?: string;
  occurredAt?: string;
  importance?: MemoryHook["importance"];
  conceptIds?: string[];
}

export interface MemoryRecallContext {
  currentTopics?: string[];
  memories?: LearnerMemoryRecord[];
  maxAgeDays?: number;
}

export interface MemoryRecall {
  memory: LearnerMemoryRecord;
  relevance: number;
  line: string;
}

const importanceScore: Record<MemoryHook["importance"], number> = {
  low: 1,
  medium: 2,
  high: 3,
};

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function scoreMemory(memory: LearnerMemoryRecord, topics: string[] = []): number {
  const topicSet = new Set(topics.map(normalize));
  const memoryTerms = [memory.topic, ...(memory.conceptIds ?? [])].map(normalize);
  const overlap = memoryTerms.filter((term) => topicSet.has(term)).length;
  return overlap * 10 + importanceScore[memory.importance ?? "medium"];
}

export function recallMemory(context: MemoryRecallContext): MemoryRecall | undefined {
  const ranked = [...(context.memories ?? [])]
    .map((memory) => ({ memory, relevance: scoreMemory(memory, context.currentTopics) }))
    .sort((a, b) => b.relevance - a.relevance);

  const winner = ranked[0];
  if (!winner || winner.relevance < 2) return undefined;

  const source = winner.memory.sourceTitle ? ` during ${winner.memory.sourceTitle}` : "";
  const insight = winner.memory.insight ? `: “${winner.memory.insight}”` : ".";
  return {
    ...winner,
    line: `This connects with something you noticed${source}${insight}`,
  };
}

export function memoryRecordFromHook(hook: MemoryHook, insight?: string): LearnerMemoryRecord {
  return {
    id: hook.id,
    topic: hook.topic,
    insight,
    importance: hook.importance,
    conceptIds: hook.conceptIds,
  };
}
