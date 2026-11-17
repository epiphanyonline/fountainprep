"use client";

/**
 * Preview environment only; all content is fictional and public.
 * Browser-only drafts are not authenticated or durable examination attempts.
 * This component MUST NEVER accept real learner questions or payment data.
 */
import { useEffect, useState } from "react";
import {
  DEMO_STORAGE_KEY, demoRemainingSeconds, newDemoDraft, validateDemoDraft,
  type DemoDraft, type DemoExam,
} from "./demoDraft";

type DemoQuestion = {
  id: string;
  subject: string;
  prompt: string;
  options: { id: string; label: string }[];
};
const exams: Record<DemoExam, { label: string; subtitle: string; questions: DemoQuestion[] }> = {
  JAMB: {
    label: "JAMB UTME", subtitle: "CBT question navigation",
    questions: [
      { id: "demo_jamb_1", subject: "Use of English",
        prompt: "Which sentence is correctly punctuated?",
        options: [{id:"a",label:"After the lesson we revised, the topic."},
          {id:"b",label:"After the lesson, we revised the topic."},
          {id:"c",label:"After, the lesson we revised the topic."},
          {id:"d",label:"After the lesson we revised the topic,"}] },
      { id: "demo_jamb_2", subject: "Mathematics",
        prompt: "What is the value of 3 × (4 + 2)?",
        options: [{id:"a",label:"14"},{id:"b",label:"18"},
          {id:"c",label:"20"},{id:"d",label:"24"}] },
    ],
  },
  WAEC: {
    label: "WAEC WASSCE", subtitle: "Objective question demo",
    questions: [
      { id:"demo_waec_1",subject:"English Language",
        prompt:"Choose the word closest in meaning to 'brief'.",
        options:[{id:"a",label:"Lengthy"},{id:"b",label:"Short"},
          {id:"c",label:"Unusual"},{id:"d",label:"Complex"}]},
      { id:"demo_waec_2",subject:"Mathematics",
        prompt:"Simplify 2x + 3x.",
        options:[{id:"a",label:"5x"},{id:"b",label:"6x"},
          {id:"c",label:"5x²"},{id:"d",label:"x⁵"}]},
    ],
  },
  NECO: {
    label: "NECO SSCE",subtitle:"Subject practice demo",
    questions: [
      {id:"demo_neco_1",subject:"Biology",
        prompt:"Which part of a plant commonly absorbs water from the soil?",
        options:[{id:"a",label:"Flower"},{id:"b",label:"Leaf"},
          {id:"c",label:"Root"},{id:"d",label:"Fruit"}]},
      {id:"demo_neco_2",subject:"Mathematics",
        prompt:"What is 25% of 80?",
        options:[{id:"a",label:"10"},{id:"b",label:"20"},
          {id:"c",label:"25"},{id:"d",label:"40"}]},
    ],
  },
  IELTS: {
    label:"IELTS",subtitle:"Reading-style sample",
    questions: [
      {id:"demo_ielts_1",subject:"Reading",
        prompt:"A notice states: 'The library closes at 6 pm on Fridays.' When does it close on Fridays?",
        options:[{id:"a",label:"4 pm"},{id:"b",label:"5 pm"},
          {id:"c",label:"6 pm"},{id:"d",label:"7 pm"}]},
      {id:"demo_ielts_2",subject:"Listening (text-only concept)",
        prompt:"A speaker says: 'The workshop has been moved from Monday to Wednesday.' Which day is the workshop?",
        options:[{id:"a",label:"Monday"},{id:"b",label:"Tuesday"},
          {id:"c",label:"Wednesday"},{id:"d",label:"Thursday"}]},
    ],
  },
};

export default function MockExamPrototype() {
  const [chosenExam, setChosenExam] = useState<DemoExam>("JAMB");
  const [draft, setDraft] = useState<DemoDraft | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [now, setNow] = useState(0);

  useEffect(() => {
    const current=Date.now();
    setNow(current);
    try {
      const stored=localStorage.getItem(DEMO_STORAGE_KEY);
      if(stored) {
        const restored=validateDemoDraft(JSON.parse(stored) as unknown,current);
        if(restored) {setDraft(restored);setChosenExam(restored.exam);}
        else localStorage.removeItem(DEMO_STORAGE_KEY);
      }
    } catch { /* Browser storage is optional for this public sample. */ }
    setHydrated(true);
  },[]);

  useEffect(()=>{
    if(!hydrated) return;
    try{
      if(draft) localStorage.setItem(DEMO_STORAGE_KEY,JSON.stringify(draft));
      else localStorage.removeItem(DEMO_STORAGE_KEY);
    }catch{/* Private browser mode may restrict storage. */}
  },[hydrated,draft]);

  useEffect(()=>{
    if(!draft || draft.completed || now===0) return;
    const interval=setInterval(()=>setNow(Date.now()),1000);
    return ()=>clearInterval(interval);
  },[draft,now===0]);

  const exam=draft?.exam ?? chosenExam;
  const questions=exams[exam].questions;
  const position=draft?Math.min(draft.activeIndex,questions.length-1):0;
  const current=questions[position];
  const seconds=draft?demoRemainingSeconds(draft,now):180;
  const expired=!!draft && seconds===0;
  const finished=!!draft&&(draft.completed||expired);
  const answered=questions.filter(q=>!!draft?.answers[q.id]).length;
  const flagged=questions.filter(q=>!!draft?.flagged[q.id]).length;
  const clock=`${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;

  function start(){
    const currentTime=Date.now();
    setNow(currentTime);
    setDraft(newDemoDraft(chosenExam,currentTime));
  }
  function reset(){
    setDraft(null);
    setNow(Date.now());
  }
  function changeAnswer(questionId:string,optionId:string){
    if(finished)return;
    setDraft(d=>d?{...d,answers:{...d.answers,[questionId]:optionId}}:d);
  }

  if(!hydrated) return (
    <section className="mx-auto max-w-4xl rounded-2xl bg-white p-8 text-slate-700"
      aria-live="polite">Loading the examination demonstration…</section>
  );

  return (
    <section aria-label="Mock Exam Centre demonstration"
      className="mx-auto max-w-4xl space-y-6 rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm sm:p-8">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-violet-700">Fountain Prep · UI Preview</p>
          <h1 className="mt-1 text-2xl font-bold">Mock Exam Centre</h1>
          <p className="mt-1 text-sm text-slate-600">{exams[exam].label} · {exams[exam].subtitle}</p>
        </div>
        <div className="rounded-xl bg-slate-100 px-5 py-3 text-center">
          <p className="text-xs text-slate-600">Sample countdown</p>
          <p className="text-xl font-bold tabular-nums">{clock}</p>
        </div>
      </header>
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        <strong>Design demonstration only.</strong> The questions are fictional samples, not official examination papers.
        Answers are saved only in this browser to show how resuming could work.
        No Supabase login, verified scoring or payments are involved.
      </div>
      {!draft ? (
        <div className="space-y-5">
          <h2 className="text-lg font-semibold">Choose an exam to explore</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(Object.keys(exams) as DemoExam[]).map(code=>(
              <button type="button" key={code} onClick={()=>setChosenExam(code)}
                aria-pressed={chosenExam===code}
                className={`rounded-xl border p-4 text-left transition ${chosenExam===code?"border-violet-600 bg-violet-50":"border-slate-200 hover:border-violet-300"}`}>
                <span className="font-semibold">{exams[code].label}</span>
                <span className="mt-1 block text-xs text-slate-600">{exams[code].subtitle}</span>
              </button>
            ))}
          </div>
          <p className="text-sm text-slate-600">This three-minute sample contains {questions.length} questions. Exam-specific timing and full paper formats are not yet implemented.</p>
          <button type="button" onClick={start} className="rounded-lg bg-violet-700 px-5 py-3 font-semibold text-white hover:bg-violet-800">
            Start sample examination
          </button>
        </div>
      ) : finished ? (
        <div className="space-y-4" role="status">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">Sample session summary</p>
          <h2 className="text-xl font-bold">{expired?"Time expired":"Sample submitted"}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-100 p-4"><p className="text-2xl font-bold">{answered}/{questions.length}</p><p className="text-xs text-slate-600">Answered</p></div>
            <div className="rounded-xl bg-slate-100 p-4"><p className="text-2xl font-bold">{questions.length-answered}</p><p className="text-xs text-slate-600">Unanswered</p></div>
            <div className="rounded-xl bg-slate-100 p-4"><p className="text-2xl font-bold">{flagged}</p><p className="text-xs text-slate-600">Flagged</p></div>
          </div>
          <p className="text-sm text-slate-600">These are completion statistics, not an examination score. Official-format marking will require the secure server-side assessment system.</p>
          <button type="button" onClick={reset} className="rounded-lg bg-violet-700 px-5 py-3 font-semibold text-white">Explore another exam</button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap justify-between gap-2 text-sm text-slate-600">
            <span>Question {position+1} of {questions.length} · {current.subject}</span>
            <span>{answered} answered · {flagged} flagged</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full bg-violet-600" style={{width:`${answered/questions.length*100}%`}}/>
          </div>
          <h2 className="text-lg font-bold">{current.prompt}</h2>
          <fieldset className="space-y-2">
            <legend className="mb-3 text-sm text-slate-600">Choose one answer</legend>
            {current.options.map(option=>(
              <label key={option.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 hover:border-violet-500">
                <input type="radio" name={current.id} value={option.id}
                  checked={draft.answers[current.id]===option.id}
                  onChange={()=>changeAnswer(current.id,option.id)} className="mt-1 accent-violet-700"/>
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="rounded-lg border border-amber-400 px-3 py-2 text-sm"
              onClick={()=>setDraft(d=>d?{...d,flagged:{...d.flagged,[current.id]:!d.flagged[current.id]}}:d)}>
              {draft.flagged[current.id]?"Remove review flag":"Flag for review"}
            </button>
            <button type="button" disabled={position===0} className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-40"
              onClick={()=>setDraft(d=>d?{...d,activeIndex:Math.max(0,d.activeIndex-1)}:d)}>Previous</button>
            <button type="button" disabled={position===questions.length-1} className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-40"
              onClick={()=>setDraft(d=>d?{...d,activeIndex:Math.min(questions.length-1,d.activeIndex+1)}:d)}>Next</button>
          </div>
          <nav aria-label="Question navigation" className="flex flex-wrap gap-2">
            {questions.map((q,i)=>(
              <button key={q.id} type="button" onClick={()=>setDraft(d=>d?{...d,activeIndex:i}:d)}
                aria-current={position===i?"step":undefined}
                aria-label={`Question ${i+1}${draft.answers[q.id]?", answered":""}${draft.flagged[q.id]?", flagged":""}`}
                className={`min-h-10 min-w-10 rounded-lg border text-sm font-bold ${position===i?"border-violet-700 bg-violet-100":draft.answers[q.id]?"border-emerald-600 bg-emerald-50":"border-slate-300"}`}>{i+1}{draft.flagged[q.id]?"*":""}</button>
            ))}
          </nav>
          <p className="text-xs text-slate-500">Your sample selections are stored in this browser. Refresh this page to test restoring the draft.</p>
          <button type="button" className="rounded-lg bg-violet-700 px-5 py-3 font-semibold text-white"
            onClick={()=>{
              if(window.confirm("Submit this sample? Answers cannot be changed afterwards.")){
                setDraft(d=>d?{...d,completed:true}:d);
              }
            }}>Submit sample</button>
        </div>
      )}
    </section>
  );
}
