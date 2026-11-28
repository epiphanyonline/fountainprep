import { contextKey, type LearningContext } from "./learningContext";
import { TUTOR_TRACKS, type TutorQuestion } from "./pilotEngine";

/** Original, low-stakes preview questions. Not secure exams or validated proficiency tests. */
const finance: TutorQuestion[] = [
  {id:"fl-1",prompt:"A fictional learner saves £20 each month for six months. Ignoring interest, how much have they saved?",options:[{id:"a",text:"£100"},{id:"b",text:"£120"},{id:"c",text:"£140"}],correctId:"b",explanation:"Multiply £20 by six months to get £120."},
  {id:"fl-2",prompt:"What does diversification mean?",options:[{id:"a",text:"Putting all money in one investment"},{id:"b",text:"Guaranteeing a profit"},{id:"c",text:"Spreading exposure across different investments"}],correctId:"c",explanation:"Diversification spreads exposure and may reduce concentration risk, but cannot guarantee profits."},
  {id:"fl-3",prompt:"If prices rise while your income stays the same, what generally happens to your purchasing power?",options:[{id:"a",text:"It falls"},{id:"b",text:"It rises"},{id:"c",text:"It always stays the same"}],correctId:"a",explanation:"The same income buys fewer goods and services when their prices rise."},
];
const spanish: TutorQuestion[] = [
  {id:"es-1",prompt:"Which expression means hello in Spanish?",options:[{id:"a",text:"Gracias"},{id:"b",text:"Hola"},{id:"c",text:"Adiós"}],correctId:"b",explanation:"Hola is a common greeting meaning hello."},
  {id:"es-2",prompt:"What does gracias mean?",options:[{id:"a",text:"Thank you"},{id:"b",text:"Good night"},{id:"c",text:"Please"}],correctId:"a",explanation:"Gracias means thank you."},
  {id:"es-3",prompt:"Which expression means good morning?",options:[{id:"a",text:"Buenas noches"},{id:"b",text:"Hasta luego"},{id:"c",text:"Buenos días"}],correctId:"c",explanation:"Buenos días is a common morning greeting."},
];
export function assessmentQuestions(context:LearningContext): readonly TutorQuestion[] {
  if(context.kind==="exam"){
    const track=TUTOR_TRACKS[context.track];
    return [track.diagnostic,track.practice,track.retry];
  }
  if(context.kind==="language" && context.language==="spanish") return spanish;
  if((context.kind==="general" || context.kind==="homework") && context.subject==="financial-literacy") return finance;
  return [];
}
export type AssessmentEvidence = { context:string; questionId:string; correct:boolean };
export function gradePractice(context:LearningContext, questionId:string, choiceId:string): { evidence:AssessmentEvidence; explanation:string } | null {
  const question=assessmentQuestions(context).find(q=>q.id===questionId);
  if(!question || !question.options.some(o=>o.id===choiceId)) return null;
  return {evidence:{context:contextKey(context),questionId,correct:choiceId===question.correctId},explanation:question.explanation};
}
/** Keep first attempts only; retries cannot inflate the evidence count. */
export function addEvidence(entries:readonly AssessmentEvidence[], evidence:AssessmentEvidence):AssessmentEvidence[] {
  if(entries.some(e=>e.context===evidence.context && e.questionId===evidence.questionId)) return [...entries];
  return [...entries,evidence];
}
export function assessmentSummary(context:LearningContext, entries:readonly AssessmentEvidence[]) {
  const questions=assessmentQuestions(context), key=contextKey(context);
  const attempts=questions.flatMap(q=>entries.find(e=>e.context===key && e.questionId===q.id)??[]);
  const correct=attempts.filter(e=>e.correct).length;
  return {available:questions.length,attempted:attempts.length,correct,needsReview:attempts.length-correct};
}
