"use client";

/** Synthetic, preview-only question administration; never writes to a database. */
import {useState} from "react";
import {
  stageQuestionImport,reviewQuestion,publishReviewedQuestion,
  type QuestionDraft,type ImportProblem,
} from "./questionBankAdmin";
import {buildNigeriaWeekendSchedule} from "./weekendSchedule";
const sampleQuestions:QuestionDraft[]=[
  {
    id:"sample_eng_01",canonicalGroupId:"sample_eng_01",
    board:"JAMB",variant:"utme",syllabusYear:2027,
    subjectCode:"ENG",topicCode:"GRAMMAR",difficulty:"easy",
    status:"draft",reviewedBy:null,licence:"Original synthetic demonstration",
    sourceReference:"Fountain Prep demonstration",authorId:"sample_author",
    provenance:{kind:"original_syllabus",syllabusReference:"Illustrative demo syllabus mapping",independentlyAuthored:true},
    revision:1,prompt:"Choose the sentence with correct punctuation.",
    options:[{id:"a",text:"We are learning, today."},{id:"b",text:"We are learning today."}],
    correctOptionId:"b",
    explanation:"A comma is not needed before today in this sentence.",
  },
  {
    id:"sample_math_01",canonicalGroupId:"sample_math_01",
    board:"JAMB",variant:"utme",syllabusYear:2027,
    subjectCode:"MATH",topicCode:"ALGEBRA",difficulty:"medium",
    status:"draft",reviewedBy:null,licence:"Original synthetic demonstration",
    sourceReference:"Fountain Prep demonstration",authorId:"sample_author",
    revision:1,prompt:"What is the value of 2 × (3 + 4)?",
    options:[{id:"a",text:"10"},{id:"b",text:"12"},{id:"c",text:"14"},{id:"d",text:"18"}],
    correctOptionId:"c",
    explanation:"Add 3 and 4 to get 7, then multiply by 2.",
  },
];

export default function QuestionBankAdminPreview() {
  const [questions,setQuestions]=useState<QuestionDraft[]>([]);
  const [issues,setIssues]=useState<ImportProblem[]>([]);
  const [message,setMessage]=useState("No sample records imported.");
  const [events,setEvents]=useState<ReturnType<typeof buildNigeriaWeekendSchedule>>([]);
  function importSamples() {
    const report=stageQuestionImport(sampleQuestions,questions);
    setQuestions(prev=>[...prev,...report.accepted]);
    setIssues(report.rejected);
    setMessage(`Imported ${report.accepted.length} sample drafts. ${report.rejected.length} rejected.`);
  }
  function review(id:string) {
    try {
      setQuestions(prev=>prev.map(q=>q.id===id?
        reviewQuestion(q,{reviewerId:"sample_reviewer",decision:"approve",
          notes:"Synthetic academic review demonstration"}):q));
      setMessage("Question marked reviewed (demo only).");
    } catch {setMessage("Review not permitted for this question.");}
  }
  function publish(id:string) {
    try{
      setQuestions(prev=>prev.map(q=>q.id===id?publishReviewedQuestion(q,"sample_admin"):q));
      setMessage("Question marked published (demo only).");
    } catch {setMessage("Question requires independent academic review before publication.");}
  }
  function schedule(){
    try{
      setEvents(buildNigeriaWeekendSchedule({
        firstSaturday:"2027-01-09",weeks:4,board:"JAMB",paperRevisionId:"sample-paper-revision",
        priceMinorUnits:100000,currency:"NGN",
      }));
      setMessage("Four proposed weekend events created. No bookings or payments opened.");
    }catch{setMessage("Could not create the demonstration schedule.");}
  }
  return <main className="mx-auto max-w-5xl space-y-6 px-4 py-9 text-slate-900">
    <header className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-widest text-violet-700">Fountain Prep · Development Preview</p>
      <h1 className="text-3xl font-bold">Question Bank Administration</h1>
      <p className="text-sm text-slate-600">A demonstration of the import, academic-review and publishing stages. No live student data, real exam content or payments.</p>
    </header>
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
      <strong>Sample-only workspace.</strong> Changes exist in this page's memory and disappear on refresh. Access control, real file uploads, database persistence and real academic review are not connected.
    </div>
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Question bank statistics">
      {[
        ["Total drafts",questions.filter(q=>q.status==="draft").length],
        ["Reviewed",questions.filter(q=>q.status==="reviewed").length],
        ["Published",questions.filter(q=>q.status==="published").length],
        ["Rejected imports",issues.length],
      ].map(([label,value])=><div key={label} className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-2xl font-bold">{value}</p><p className="text-xs text-slate-600">{label}</p>
      </div>)}
    </section>
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-semibold">Question intake and review</h2>
      <p className="text-sm text-slate-600">Import two fictional JAMB questions. Try importing twice to see the duplicate checks.</p>
      <button type="button" onClick={importSamples}
        className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-800">Import sample questions</button>
      <p role="status" className="text-sm text-slate-700">{message}</p>
      <div className="space-y-3">
        {questions.map(q=><div key={q.id} className="rounded-lg border border-slate-200 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{q.board} · {q.subjectCode} · {q.topicCode}</p>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{q.status}</span>
          </div>
          <p className="mt-2 font-medium">{q.prompt}</p>
          <p className="mt-1 text-xs text-slate-500">Revision {q.revision} · {q.difficulty} · {q.licence}</p>
          <div className="mt-3 flex gap-2">
            <button disabled={q.status!=="draft"} onClick={()=>review(q.id)} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold disabled:opacity-40">Approve academic review</button>
            <button disabled={q.status!=="reviewed"} onClick={()=>publish(q.id)} className="rounded-lg border border-violet-500 px-3 py-2 text-xs font-semibold text-violet-700 disabled:opacity-40">Publish sample</button>
          </div>
        </div>)}
        {!questions.length && <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">No sample questions imported yet.</p>}
      </div>
    </section>
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-semibold">Weekly mock scheduling</h2>
      <p className="text-sm text-slate-600">Create illustrative JAMB Saturday/Sunday event proposals in West Africa Time. No payments or live access.</p>
      <button type="button" onClick={schedule} className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white">Prepare four weekend proposals</button>
      {events.map(event=><div key={event.id} className="flex flex-wrap justify-between gap-2 rounded-lg border border-slate-200 p-3 text-sm">
        <span>{new Intl.DateTimeFormat("en-GB",{dateStyle:"medium",timeZone:"Africa/Lagos"}).format(new Date(event.opensAt))}</span>
        <span>Draft · academic approval required · payment inactive</span>
      </div>)}
    </section>
  </main>;
}
