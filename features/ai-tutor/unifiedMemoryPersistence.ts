import { EXAM_TRACKS, LANGUAGES, SUBJECTS, contextKey, parseLearningContext, parseLearningMode, type LearningContext } from "./learningContext";
import { assessmentQuestions, gradePractice, type AssessmentEvidence } from "./unifiedAssessment";
import { emptyMemory, recordMemory, type LearnerMemory } from "./unifiedLearnerMemory";

export const PILOT_LIMIT = 1000;
export type AttemptRow = {context_key:string;question_id:string;correct:boolean};
export type ExchangeRow = {context_key:string;mode:string;completed_at:string;event_id:string};
export type MemorySnapshot = {memory:LearnerMemory;evidence:AssessmentEvidence[];activityWindowLimited:boolean};
export const contexts: LearningContext[] = [
  ...EXAM_TRACKS.map(track=>({kind:"exam" as const,track})),
  ...LANGUAGES.map(language=>({kind:"language" as const,language,level:"foundation" as const})),
  ...SUBJECTS.flatMap(subject=>[{kind:"general" as const,subject},{kind:"homework" as const,subject}]),
];
const byKey = new Map(contexts.map(c=>[contextKey(c),c]));
export function buildSnapshot(attempts:readonly AttemptRow[], exchanges:readonly ExchangeRow[]):MemorySnapshot {
  const seen = new Set<string>(), evidence:AssessmentEvidence[]=[];
  for(const row of attempts){
    const context=byKey.get(row.context_key);
    const key=row.context_key+":"+row.question_id;
    if(!context || typeof row.correct!=="boolean" || seen.has(key) || !assessmentQuestions(context).some(q=>q.id===row.question_id)) continue;
    seen.add(key);
    evidence.push({context:row.context_key,questionId:row.question_id,correct:row.correct});
  }
  // Store reports of activity, not transcripts or claims of mastery.
  // Recent activity only; explicitly disclose the window when it is capped.
  let memory=emptyMemory();
  const events=new Set<string>();
  for(const row of [...exchanges.slice(0,PILOT_LIMIT)].sort((a,b)=>Date.parse(a.completed_at)-Date.parse(b.completed_at)||a.event_id.localeCompare(b.event_id))){
    const context=byKey.get(row.context_key),mode=parseLearningMode(row.mode);
    const timestamp=Date.parse(row.completed_at);
    if(!context || !mode || !Number.isFinite(timestamp)||events.has(row.event_id))continue;
    events.add(row.event_id);
    // Count distinct events even if database timestamps have the same millisecond.
    const key=contextKey(context), old=memory.entries.find(e=>contextKey(e.context)===key);
    const at=new Date(timestamp).toISOString();
    if(old?.lastAt===at){
      memory={version:1,entries:memory.entries.map(e=>contextKey(e.context)===key?{...e,sessions:e.sessions+1,practice:e.practice+(mode==="practise"?1:0),help:e.help+(mode==="simplify"?1:0),lastMode:mode}:e)};
    }else memory=recordMemory(memory,context,mode,at);
  }
  return {memory,evidence,activityWindowLimited:exchanges.length>PILOT_LIMIT};
}
export function parseAttempt(input:unknown){
  if(!input||typeof input!=="object"||Array.isArray(input)) return null;
  const raw=input as Record<string,unknown>;
  const context=parseLearningContext(raw.context);
  if(!context||typeof raw.questionId!=="string"||typeof raw.choiceId!=="string")return null;
  // Ignore client-supplied scores, account IDs, timestamps and flags.
  return gradePractice(context,raw.questionId,raw.choiceId);
}
export function localMemoryAllowed(settings:{nodeEnv?:string;vercel?:string;enabled?:string;url?:string}):boolean {
  if(settings.nodeEnv!=="development"||settings.vercel||settings.enabled!=="true")return false;
  // Deliberately never accept a hosted Supabase URL or production config fallback.
  return settings.url==="http://127.0.0.1:54321"||settings.url==="http://localhost:54321";
}
