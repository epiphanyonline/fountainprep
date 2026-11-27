"use client";
import { useState } from "react";
import Link from "next/link";
import { emptyMemory, recordMemory } from "./unifiedLearnerMemory";
import { assessmentQuestions, gradePractice, addEvidence, assessmentSummary, type AssessmentEvidence } from "./unifiedAssessment";
import type { TutorChatMessage } from "./conversationBoundary";
import { EXAM_TRACKS, LANGUAGES, SUBJECTS, EXAM_LABELS, LANGUAGE_LABELS, SUBJECT_LABELS, contextKey, parseLearningContext, parseLearningMode, type LearningContext, type LearningMode } from "./learningContext";

const categories = [
  { kind: "exam", title: "Prepare for an exam", icon: "01", description: "Learn concepts and practise exam questions.", initial: { kind: "exam", track: "jamb-maths" } },
  { kind: "language", title: "Learn a language", icon: "02", description: "Build vocabulary and speaking confidence.", initial: { kind: "language", language: "yoruba", level: "foundation" } },
  { kind: "homework", title: "Help with homework", icon: "03", description: "Understand the steps, not just the answer.", initial: { kind: "homework", subject: "mathematics" } },
  { kind: "general", title: "Teach me something", icon: "04", description: "Explore a topic at your own pace.", initial: { kind: "general", subject: "science" } },
] as const satisfies readonly { kind: LearningContext["kind"]; title: string; icon: string; description: string; initial: LearningContext }[];

const modes: { value: LearningMode; label: string }[] = [
  { value: "teach", label: "Teach me" }, { value: "practise", label: "Let me practise" },
  { value: "simplify", label: "Explain simply" }, { value: "challenge", label: "Challenge me" },
];
function label(context: LearningContext) {
  if (context.kind === "exam") return EXAM_LABELS[context.track];
  if (context.kind === "language") return LANGUAGE_LABELS[context.language];
  return SUBJECT_LABELS[context.subject];
}
function starter(context: LearningContext) {
  if (context.kind === "language") return "Teach me a simple greeting in " + label(context) + ".";
  if (context.kind === "exam") return "Teach me a foundational concept in " + label(context) + " and check my understanding.";
  if (context.kind === "homework") return "Show me how to approach a " + label(context).toLowerCase() + " homework problem step by step.";
  return "Teach me a beginner-friendly concept in " + label(context).toLowerCase() + ".";
}
export default function UnifiedTutorWorkspace({ liveEnabled = false }: { liveEnabled?: boolean }) {
  const [memory, setMemory] = useState(emptyMemory);
  const [evidence, setEvidence] = useState<AssessmentEvidence[]>([]);
  const [feedback, setFeedback] = useState("");
  const [history, setHistory] = useState<TutorChatMessage[]>([]);
  const [context, setContext] = useState<LearningContext>(categories[0].initial);
  const [mode, setMode] = useState<LearningMode>("teach");
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  function change(next: LearningContext) {
    setContext(next); setFeedback(""); setHistory([]); setDraft(""); setNotice(""); setError(""); setMode("teach");
  }
  async function submit() {
    if (busy || !draft.trim()) return;
    setBusy(true); setNotice(""); setError("");
    const message: TutorChatMessage = { role: "user", content: draft.trim() };
    // Retain whole exchanges only, and respect both character and UTF-8 body limits.
    let outgoing = [...history.slice(-10), message];
    const payload = () => JSON.stringify({ context, mode, messages: outgoing });
    while (outgoing.length > 1 && (outgoing.reduce((n,m) => n + m.content.length, 0) > 7500 || new TextEncoder().encode(payload()).length > 12000)) outgoing = outgoing.slice(2);
    try {
      const response = await fetch("/api/ai-tutor-preview/unified", {
        method: "POST", credentials: "same-origin", cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: payload(),
      });
      if (!response.ok) throw new Error("Preview request could not be validated.");
      const data = await response.json();
      if (data.context !== contextKey(context) || data.mode !== mode) throw new Error("Unexpected preview response.");
      if (data.status === "answered" && data.live === true && liveEnabled && typeof data.response === "string" && data.response.trim()) {
        setMemory(previous => recordMemory(previous, context, mode, new Date().toISOString()));
        setHistory([...outgoing, { role: "assistant", content: data.response.trim().slice(0,1300) }]);
      } else if (data.status === "validated" && data.live === false) {
        setNotice("Request validated for " + label(context) + ". Live AI replies are not enabled in this workspace yet.");
      } else throw new Error("Unexpected preview response.");
      setDraft("");
    } catch { setError("Unable to complete the request. Your message has been retained; please try again."); }
    finally { setBusy(false); }
  }
  const summary = assessmentSummary(context,evidence);
  const question = assessmentQuestions(context).find(q=>!evidence.some(e=>e.context===contextKey(context)&&e.questionId===q.id));
  const activity = memory.entries.find(e=>contextKey(e.context)===contextKey(context));
  const options = context.kind === "exam" ? EXAM_TRACKS.map(value => ({value, label: EXAM_LABELS[value]}))
    : context.kind === "language" ? LANGUAGES.map(value => ({value, label: LANGUAGE_LABELS[value]}))
    : SUBJECTS.map(value => ({value, label: SUBJECT_LABELS[value]}));
  const selection = context.kind === "exam" ? context.track : context.kind === "language" ? context.language : context.subject;
  return (
    <main className="min-h-screen bg-[#faf9fd] px-4 py-8 text-slate-900 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-bold tracking-wide text-violet-800">FOUNTAIN PREP <span className="font-normal text-slate-500"> / AYO</span></p>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">Development preview</span>
        </header>
        <section className="py-9 text-center sm:py-12">
          <div aria-hidden="true" className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-700 text-xl font-bold text-white">A</div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">What would you like to learn today?</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">One learning companion for your exams, languages, homework and everyday curiosity.</p>
        </section>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Learning categories">
          {categories.map(item => <button key={item.kind} type="button" disabled={busy} aria-pressed={context.kind === item.kind} onClick={() => change(item.initial)}
            className={"rounded-2xl border p-4 text-left transition disabled:opacity-60 " + (context.kind === item.kind ? "border-violet-500 bg-violet-50 ring-1 ring-violet-500" : "border-slate-200 bg-white hover:border-violet-300")}>
            <span className="text-xs font-bold text-violet-700">{item.icon}</span>
            <span className="mt-1 block font-semibold">{item.title}</span>
            <span className="mt-1 block text-sm text-slate-600">{item.description}</span>
          </button>)}
        </div>
        <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="text-sm font-semibold" htmlFor="learning-context">Choose your {context.kind === "language" ? "language" : "subject"}</label>
            <select id="learning-context" value={selection} disabled={busy} className="max-w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              onChange={event => {
                const value = event.target.value;
                const next = parseLearningContext(context.kind === "exam" ? {kind:"exam",track:value} : context.kind === "language" ? {kind:"language",language:value,level:"foundation"} : {kind:context.kind,subject:value});
                if (next) change(next);
              }}>
              {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
          <div className="mt-4 flex flex-wrap gap-2" aria-label="Teaching modes">
            {modes.map(item => <button key={item.value} type="button" disabled={busy} aria-pressed={mode === item.value}
              onClick={() => { const next = parseLearningMode(item.value); if (next) {setMode(next); setNotice("");} }}
              className={"rounded-full border px-3 py-2 text-xs font-semibold " + (mode === item.value ? "border-violet-700 bg-violet-700 text-white" : "border-slate-200 text-slate-700")}>{item.label}</button>)}
          </div>
          {history.length > 0 && <div className="mt-5 space-y-3" aria-live="polite">
            {history.map((message,index) => <div key={index} className={"rounded-xl p-4 text-sm leading-6 whitespace-pre-wrap break-words " + (message.role === "user" ? "bg-violet-700 text-white ml-6" : "bg-slate-100 mr-6")}>
              <p className="mb-1 text-xs font-bold">{message.role === "user" ? "You" : "AYO"}</p>{message.content}
            </div>)}
            <button type="button" disabled={busy} onClick={() => {setHistory([]);setDraft("");setError("");setNotice("");}} className="text-sm font-semibold text-violet-700">Start a new conversation</button>
          </div>}
          <form className="mt-5" onSubmit={event => {event.preventDefault(); void submit();}}>
            <label htmlFor="unified-message" className="sr-only">Your learning request</label>
            <textarea id="unified-message" value={draft} disabled={busy} onChange={event => {setDraft(event.target.value); setNotice(""); setError("");}} maxLength={700} required
              placeholder="Ask AYO to explain a topic..." className="min-h-28 w-full resize-y rounded-xl border border-slate-300 p-4 text-sm focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600"/>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <button type="button" disabled={busy} onClick={() => {setDraft(starter(context));setNotice("");setError("");}} className="text-sm font-semibold text-violet-700 hover:underline">Try a sample request</button>
              <button type="submit" disabled={busy || !draft.trim()} className="rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white disabled:opacity-40">{busy ? "Working…" : liveEnabled ? "Ask AYO" : "Validate request"}</button>
            </div>
          </form>
          <p className="mt-4 text-xs leading-5 text-slate-500">{liveEnabled ? "Restricted AI preview. Replies may be inaccurate. Conversation is held in this tab only; no saved learner profile or voice generation." : "Validation-only preview. No AI replies, voice generation or saved learner history."} Use fictional examples only; do not enter personal details.</p>
          {notice && <p role="status" className="mt-3 rounded-xl bg-violet-50 p-3 text-sm text-violet-900">{notice}</p>}
          {error && <p role="alert" className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{error}</p>}
        </section>
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">Your learning activity</h2>
          <p className="mt-2 text-sm text-slate-600">{label(context)} · {activity?.sessions ?? 0} completed AI exchanges · {activity?.help ?? 0} requests for simpler explanations</p>
          <p className="mt-2 text-xs text-slate-500">Temporary preview activity only. Not saved to an account or a measure of mastery.</p>
          <h3 className="mt-5 font-semibold">Quick knowledge check</h3>
          <p className="mt-1 text-sm text-slate-600">{summary.available ? summary.correct + " correct out of " + summary.attempted + " first attempts" : "Sample questions are not yet available for this subject."}</p>
          {question && <div className="mt-3 space-y-2">
            <p className="text-sm font-medium">{question.prompt}</p>
            {question.options.map(option=><button key={option.id} type="button" disabled={busy} className="block w-full rounded-lg border border-slate-200 p-3 text-left text-sm hover:border-violet-500" onClick={()=>{
              const result=gradePractice(context,question.id,option.id);
              if(result){setEvidence(previous=>addEvidence(previous,result.evidence));setFeedback((result.evidence.correct?"Correct. ":"Not quite. ")+result.explanation);}
            }}>{option.text}</button>)}
          </div>}
          {feedback && <p role="status" className="mt-3 text-sm text-violet-900">{feedback}</p>}
          <p className="mt-3 text-xs text-slate-500">Original low-stakes sample questions, not official exams or proficiency scores.</p>
          <button type="button" disabled={busy} onClick={()=>{setMemory(emptyMemory());setEvidence([]);setFeedback("");}} className="mt-3 text-sm text-violet-700 underline">Clear preview activity</button>
        </section>
        <section className="mt-7 grid gap-3 sm:grid-cols-2">
          <Link href="/subjects" className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-violet-300"><strong>Learn with a human tutor</strong><p className="mt-1 text-sm text-slate-600">Explore existing live one-to-one lessons.</p></Link>
          <Link href="/financial-education" className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-violet-300"><strong>Financial Literacy Academy</strong><p className="mt-1 text-sm text-slate-600">Explore the existing financial education pathway.</p></Link>
        </section>
        <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-violet-800">
          <Link href="/ai-tutor-preview">Guided exam demonstration</Link>
          <Link href="/ai-tutor-preview/chat">Original exam chat preview</Link>
        </div>
      </div>
    </main>
  );
}
