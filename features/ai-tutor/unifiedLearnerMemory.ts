import { contextKey, parseLearningContext, parseLearningMode, type LearningContext, type LearningMode } from "./learningContext";

export type MemoryEntry = { context: LearningContext; sessions: number; practice: number; help: number; lastMode: LearningMode; lastAt: string };
export type LearnerMemory = { version: 1; entries: MemoryEntry[] };
export const emptyMemory = (): LearnerMemory => ({version:1,entries:[]});
const validDate = (v:unknown): v is string => typeof v === "string" && Number.isFinite(Date.parse(v)) && new Date(v).toISOString() === v;
const count = (v:unknown): v is number => typeof v === "number" && Number.isSafeInteger(v) && v >= 0 && v <= 10000;
export function parseMemory(raw:unknown): LearnerMemory | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string,unknown>;
  if (data.version !== 1 || !Array.isArray(data.entries) || data.entries.length > 32) return null;
  const entries:MemoryEntry[] = [], keys = new Set<string>();
  for (const row of data.entries) {
    if (!row || typeof row !== "object") return null;
    const context = parseLearningContext(row.context), lastMode = parseLearningMode(row.lastMode);
    if (!context || !lastMode || !count(row.sessions) || row.sessions < 1 || !count(row.practice) || !count(row.help) || row.practice + row.help > row.sessions || !validDate(row.lastAt)) return null;
    const key = contextKey(context);
    if (keys.has(key)) return null;
    keys.add(key);
    entries.push({context,lastMode,sessions:row.sessions,practice:row.practice,help:row.help,lastAt:row.lastAt});
  }
  return {version:1,entries};
}
/** Record only successful AI exchanges, never infer correctness or mastery. */
export function recordMemory(memory:LearnerMemory, context:LearningContext, mode:LearningMode, at:string):LearnerMemory {
  const base = parseMemory(memory), clean = parseLearningContext(context);
  if (!base || !clean || !parseLearningMode(mode) || !validDate(at)) throw new Error("Invalid memory event");
  const key = contextKey(clean), old = base.entries.find(e=>contextKey(e.context)===key);
  if (old && (old.lastAt >= at || old.sessions >= 10000)) return base;
  const entry:MemoryEntry = {context:clean,sessions:(old?.sessions??0)+1,practice:(old?.practice??0)+(mode==="practise"?1:0),help:(old?.help??0)+(mode==="simplify"?1:0),lastMode:mode,lastAt:at};
  return {version:1,entries:[entry,...base.entries.filter(e=>contextKey(e.context)!==key)].slice(0,32)};
}
export function reviewSuggestions(memory:LearnerMemory, now:string):MemoryEntry[] {
  if (!validDate(now)) return [];
  return memory.entries.filter(e=>Date.parse(now)-Date.parse(e.lastAt)>=86400000).sort((a,b)=>b.help-a.help || a.lastAt.localeCompare(b.lastAt)).slice(0,3);
}
