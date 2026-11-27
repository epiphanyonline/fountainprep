import { assessmentQuestions, type AssessmentEvidence } from "./unifiedAssessment";
import { contextKey, type LearningContext, type LearningMode } from "./learningContext";
import { parseMemory, type LearnerMemory } from "./unifiedLearnerMemory";

/** Curated preview topic map; not a comprehensive curriculum or proficiency model. */
const TOPICS: Readonly<Record<string,string>> = {
  "jm-d1":"Percentage increases","jm-p1":"Successive percentage changes","jm-r1":"Changing percentage bases",
  "je-d1":"First conditional sentences","je-p1":"Third conditional sentences","je-r1":"Unreal past conditions",
  "ir-d1":"Evidence and supported claims","ir-p1":"Identifying missing information","ir-r1":"Comparing facts in a passage",
  "fl-1":"Saving regularly","fl-2":"Diversification and concentration risk","fl-3":"Inflation and purchasing power",
  "es-1":"Basic Spanish greetings","es-2":"Expressing thanks in Spanish","es-3":"Spanish greetings by time of day",
};
export type PlanAction = { kind:"review"|"check"|"extend"|"explore"; topic:string; reason:string; mode:LearningMode; prompt:string; minutes:number };
export function buildLearningPlan(context:LearningContext, evidence:readonly AssessmentEvidence[], memory:LearnerMemory, now:string):PlanAction[] {
  const key=contextKey(context), questions=assessmentQuestions(context);
  const actions:PlanAction[]=[];
  const entries=questions.map(question=>({question,topic:TOPICS[question.id],attempt:evidence.find(e=>e.context===key&&e.questionId===question.id)})).filter(e=>Boolean(e.topic));
  for(const entry of entries.filter(e=>e.attempt?.correct===false)){
    actions.push({kind:"review",topic:entry.topic,reason:"A first attempt on this sample question was incorrect. Recheck the concept; one answer is not a diagnosis.",mode:"simplify",prompt:"Explain "+entry.topic+" in simple steps, then give me a fresh example and check my understanding.",minutes:5});
  }
  for(const entry of entries.filter(e=>!e.attempt)){
    actions.push({kind:"check",topic:entry.topic,reason:"No sample answer recorded for this topic yet.",mode:"practise",prompt:"Help me practise "+entry.topic+" with a new question, one step at a time.",minutes:3});
  }
  const activity=parseMemory(memory)?.entries.find(e=>contextKey(e.context)===key);
  const elapsed=activity?Date.parse(now)-Date.parse(activity.lastAt):NaN;
  if(actions.length===0 && entries.length>0){
    actions.push({kind:"extend",topic:"Fresh practice",reason:"All available sample questions were answered correctly on the first attempt. Broader understanding still needs checking.",mode:"challenge",prompt:"Give me a fresh question on this subject that tests the same concepts in a different way.",minutes:5});
  }
  if(actions.length===0){
    const revisit=Number.isFinite(elapsed)&&elapsed>=86400000;
    actions.push({kind:revisit?"review":"explore",topic:revisit?"Revisit your learning":"Explore a topic",reason:revisit?"At least one day has passed since the last recorded exchange. This is an activity-based reminder, not evidence of a weakness.":"No curated assessment is available here yet. Start by identifying what you want to learn.",mode:revisit?"practise":"teach",prompt:revisit?"Help me revisit a concept I studied previously. Ask me which topic first.":"Ask me what I want to learn in this subject, then explain it step by step.",minutes:5});
  }
  return actions.slice(0,3);
}
