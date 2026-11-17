"use client";

/**
 * PRIVATE DESIGN PROTOTYPE — not mounted in app routes.
 * Synthetic question content only. No database, payments, account access,
 * browser answer keys, or production exam access.
 * 
 * This UI shows the intended workflow, but it does not autosave to a server,
 * issue real exam scores or represent a finished product.
 */
import { useEffect, useState } from "react";

type DemoQuestion = {
  id: string;
  prompt: string;
  options: { id: string; label: string }[];
};
const questions: DemoQuestion[] = [
  {
    id: "demo_1",
    prompt: "Which sentence is correctly punctuated?",
    options: [
      { id: "a", label: "After the lesson we revised, the topic." },
      { id: "b", label: "After the lesson, we revised the topic." },
      { id: "c", label: "After, the lesson we revised the topic." },
      { id: "d", label: "After the lesson we revised the topic," },
    ],
  },
  {
    id: "demo_2",
    prompt: "What is the value of 3 × (4 + 2)?",
    options: [
      { id: "a", label: "14" },
      { id: "b", label: "18" },
      { id: "c", label: "20" },
      { id: "d", label: "24" },
    ],
  },
];
const demoDurationSeconds = 180;

export default function MockExamPrototype() {
  const [started, setStarted] = useState(false);
  const [remaining, setRemaining] = useState(demoDurationSeconds);
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!started || submitted || remaining <= 0) return;
    const id = setInterval(() => setRemaining(current => Math.max(0, current - 1)), 1000);
    return () => clearInterval(id);
  }, [started, submitted, remaining]);

  const expired = started && remaining === 0;
  const complete = submitted || expired;
  const current = questions[activeIndex];
  const answeredCount = questions.filter(question => Boolean(answers[question.id])).length;
  const clock = `${Math.floor(remaining / 60).toString().padStart(2,"0")}:${(remaining % 60).toString().padStart(2,"0")}`;

  return (
    <section aria-label="Mock Exam Centre prototype" className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">Fountain Prep · Concept demo</p>
          <h1 className="text-2xl font-bold">Mock Exam Centre</h1>
          <p className="mt-1 text-sm text-slate-600">Synthetic questions — not an official exam</p>
        </div>
        <div className="rounded-xl bg-slate-100 px-4 py-2 text-center">
          <p className="text-xs font-medium text-slate-600">Demonstration timer</p>
          <p aria-live="off" className="text-xl font-semibold tabular-nums">{clock}</p>
        </div>
      </header>
      {!started ? (
        <div className="space-y-4">
          <p>This isolated concept demonstrates question navigation, flags and answer selection.</p>
          <p className="text-sm text-slate-600">Responses are held in temporary page memory only. No actual exam attempt is stored.</p>
          <button type="button" onClick={() => setStarted(true)} className="rounded-lg bg-violet-700 px-5 py-3 font-medium text-white hover:bg-violet-800">Start demonstration</button>
        </div>
      ) : complete ? (
        <div className="space-y-3" role="status">
          <h2 className="text-xl font-semibold">{expired ? "Demonstration time has ended" : "Demonstration submitted"}</h2>
          <p>Answered {answeredCount} of {questions.length} questions.</p>
          <p className="text-sm text-slate-600">No real score is generated. Final marking will be performed securely on the server.</p>
          <button type="button" onClick={() => {
            setStarted(false);setRemaining(demoDurationSeconds);setActiveIndex(0);
            setAnswers({});setFlagged({});setSubmitted(false);
          }} className="rounded-lg border border-slate-300 px-4 py-2">Restart demo</button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
            <span>Question {activeIndex + 1} of {questions.length}</span>
            <span>{answeredCount} answered</span>
          </div>
          <h2 className="text-lg font-semibold">{current.prompt}</h2>
          <fieldset className="space-y-2">
            <legend className="mb-3 text-sm font-medium text-slate-600">Choose one answer</legend>
            {current.options.map(option => (
              <label key={option.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 hover:border-violet-500">
                <input type="radio" name={current.id} value={option.id} checked={answers[current.id] === option.id}
                  onChange={() => setAnswers(prev => ({...prev,[current.id]:option.id}))}
                  className="mt-1 accent-violet-700" />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setFlagged(prev => ({...prev,[current.id]:!prev[current.id]}))}
              className="rounded-lg border border-amber-400 px-3 py-2 text-sm">
              {flagged[current.id] ? "Remove flag" : "Flag for review"}
            </button>
            <button type="button" disabled={activeIndex === 0} onClick={() => setActiveIndex(i => i - 1)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-50">Previous</button>
            <button type="button" disabled={activeIndex === questions.length - 1} onClick={() => setActiveIndex(i => i + 1)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-50">Next</button>
          </div>
          <nav aria-label="Question navigation" className="flex flex-wrap gap-2">
            {questions.map((question,index) => (
              <button key={question.id} type="button" onClick={() => setActiveIndex(index)}
                aria-current={activeIndex === index ? "step" : undefined}
                aria-label={`Question ${index + 1}${answers[question.id] ? ", answered" : ""}${flagged[question.id] ? ", flagged" : ""}`}
                className={`min-h-10 min-w-10 rounded-lg border text-sm font-semibold ${activeIndex === index ? "border-violet-700 bg-violet-100" : answers[question.id] ? "border-emerald-600 bg-emerald-50" : "border-slate-300"}`}>
                {index + 1}{flagged[question.id] ? "*" : ""}
              </button>
            ))}
          </nav>
          <button type="button" onClick={() => {
            if (window.confirm("Submit this demonstration? You cannot edit answers afterwards.")) setSubmitted(true);
          }} className="rounded-lg bg-violet-700 px-5 py-3 font-medium text-white hover:bg-violet-800">Submit demonstration</button>
        </>
      )}
    </section>
  );
}
