"use client";

import { useEffect, useState } from "react";
import {
  TUTOR_TRACKS, moveTutorDemo, restoreTutorDemo, startTutorDemo,
  tutorOutcome, tutorQuestion,
  type TutorTrackId, type TutorSession,
} from "./pilotEngine";

/**
 * Guided, authored tutoring pilot for review of user experience.
 * It is not yet a live generative AI agent and does not access live lessons,
 * Supabase records, payments or tutor accounts.
 */
const STORAGE_KEY = "fountainprep:ai-tutor-guided-preview:v1";
const trackIds: TutorTrackId[] = ["jamb-maths", "jamb-english", "ielts-reading"];
const FUTURE_EXAMS = ["WAEC / NECO", "GCSE", "SAT", "TOEFL"];

export default function TutorPilot() {
  const [selection, setSelection] = useState<TutorTrackId>("jamb-maths");
  const [session, setSession] = useState<TutorSession | null>(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const restored = saved ? restoreTutorDemo(JSON.parse(saved) as unknown) : null;
      if (restored) {
        setSession(restored);
        setSelection(restored.track);
      }
    } catch {
      // Storage can be blocked or contain damaged sample data.
    }
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try {
      if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // The walkthrough still works without browser storage.
    }
  }, [hydrated, session]);

  const track = TUTOR_TRACKS[session?.track ?? selection];
  const question = session ? tutorQuestion(session) : null;
  const outcome = session ? tutorOutcome(session) : null;
  const label = session?.step === "diagnostic"
    ? "Understand your starting point"
    : session?.step === "lesson" ? "Learn the concept"
    : session?.step === "practice" ? "Apply your understanding"
    : session?.step === "reteach" ? "Let's try another explanation"
    : session?.step === "retry" ? "Try a fresh example"
    : session?.step === "complete" ? "Learning checkpoint" : "Meet your tutor";
  const progress = session
    ? session.step === "diagnostic" ? 16
      : session.step === "lesson" ? 35
      : session.step === "practice" ? 65
      : session.step === "reteach" ? 72
      : session.step === "retry" ? 85 : 100
    : 0;

  function start() {
    setSelectedOption("");
    setSession(startTutorDemo(selection));
  }
  function move(action: { type: "teach" | "continue" | "answer"; choiceId?: string }) {
    if (!session) return;
    setSession(moveTutorDemo(session, action));
    setSelectedOption("");
  }
  function reset() {
    setSession(null);
    setSelectedOption("");
  }

  if (!hydrated) return (
    <div className="mx-auto max-w-4xl p-10 text-center text-slate-600" role="status">
      Opening your sample tutoring session…
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f8f6fd] px-4 py-8 text-slate-900 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-3xl bg-gradient-to-br from-violet-800 via-violet-700 to-indigo-800 px-6 py-8 text-white shadow-lg sm:px-10 sm:py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">Fountain Prep · Product Preview</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">One Tutor. Every Exam.</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-violet-100">
            Meet the future Fountain Prep AI Tutor: guided teaching, adaptive knowledge checks and a learning plan built around your examination.
          </p>
          <span className="mt-5 inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold">
            Interactive teaching walkthrough · Free preview
          </span>
        </section>

        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-950">
          <strong>Preview disclosure:</strong> This first walkthrough uses prewritten, original lessons and branching responses—not a live generative AI model.
          It shows how the personal tutor should behave. Results are illustrative, saved only in this browser, and are not official examination-readiness scores.
        </div>

        {!session ? (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold">What are you preparing for?</h2>
              <p className="mt-2 text-sm text-slate-600">
                Choose a starting lesson. Your tutor will check what you know, explain concepts and adapt the next step.
              </p>
              <div className="mt-6 grid gap-3">
                {trackIds.map(id => {
                  const item = TUTOR_TRACKS[id];
                  return (
                    <button type="button" key={id} onClick={() => setSelection(id)}
                      aria-pressed={selection === id}
                      className={"rounded-2xl border-2 p-4 text-left transition " +
                        (selection === id ? "border-violet-600 bg-violet-50" : "border-slate-200 hover:border-violet-300")}>
                      <span className="flex items-start justify-between gap-3">
                        <span>
                          <span className="block text-xs font-semibold uppercase text-violet-700">{item.exam}</span>
                          <span className="mt-1 block font-bold">{item.subject}</span>
                          <span className="mt-1 block text-sm text-slate-600">{item.title}</span>
                        </span>
                        <span aria-hidden="true" className={"mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 " +
                          (selection === id ? "border-violet-700 bg-violet-700 text-xs text-white" : "border-slate-300")}>
                          {selection === id ? "✓" : ""}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <button type="button" onClick={start}
                className="mt-6 w-full rounded-xl bg-violet-700 px-6 py-4 font-semibold text-white hover:bg-violet-800 sm:w-auto">
                Meet my tutor
              </button>
            </section>
            <aside className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-bold">Your tutor does more than test you</h2>
              <div className="space-y-4">
                {[
                  ["1", "Diagnose", "Find out what you understand before teaching."],
                  ["2", "Explain", "Teach the concept with a worked example."],
                  ["3", "Adapt", "Give a simpler explanation when an answer is wrong."],
                  ["4", "Reassess", "Test whether you can apply what you learned."],
                ].map(([number, name, detail]) => (
                  <div key={number} className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">{number}</span>
                    <div>
                      <p className="font-semibold">{name}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-5">
                <p className="text-sm font-semibold">Planned future specialisations</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {FUTURE_EXAMS.map(exam =>
                    <span key={exam} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">{exam}</span>)}
                </div>
                <p className="mt-3 text-xs text-slate-500">Not yet supported in this prototype.</p>
              </div>
            </aside>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(270px,0.85fr)]">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-xl text-violet-800" aria-hidden="true">✦</div>
                  <div>
                    <p className="font-bold">Fountain Prep Tutor</p>
                    <p className="text-xs text-slate-500">{track.exam} · {track.subject}</p>
                  </div>
                </div>
                <button type="button" onClick={reset} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50">
                  Change subject
                </button>
              </div>

              <div className="space-y-5 p-5 sm:p-7" aria-live="polite" aria-atomic="false">
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">{label}</p>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-700 font-bold text-white" aria-hidden="true">FP</div>
                  <div className="max-w-[90%] space-y-2 rounded-2xl rounded-tl-sm bg-slate-100 px-5 py-4 text-sm leading-7 sm:text-base">
                    <p>{session.step === "diagnostic" ? track.welcome :
                      session.step === "lesson" ? (session.explainedFirst ?
                        "That's a good choice. We'll build the idea together before you try a question." :
                        "Thanks for trying. Your answer helps me see where to begin.") :
                      session.step === "practice" ? "Now let's apply the principle in a different situation. Take your time." :
                      session.step === "reteach" ? "I can explain that another way. We're looking for understanding, not speed." :
                      session.step === "retry" ? "Let's test the same skill using a new example." :
                      session.feedback}
                    </p>
                    {session.step === "diagnostic" && <p>First, I have a short diagnostic question for you.</p>}
                    {session.step === "lesson" && (
                      <div className="space-y-3">
                        <p className="font-semibold">Core idea</p>
                        <p>{track.concept}</p>
                        <p>{track.analogy}</p>
                        <p className="rounded-xl bg-white p-3 text-slate-800"><strong>Worked example:</strong> {track.guidedExample}</p>
                      </div>
                    )}
                    {session.step === "reteach" && <div className="space-y-3">
                      <p>{track.simplerExplanation}</p>
                      <p className="rounded-xl bg-white p-3"><strong>Remember:</strong> {track.guidedExample}</p>
                    </div>}
                    {session.step === "complete" && <p className="mt-2 text-sm text-slate-700">This short checkpoint is only a snapshot. A real tutor would revisit the skill across multiple lessons before declaring mastery.</p>}
                  </div>
                </div>

                {session.feedback && session.step !== "complete" &&
                  <p className="ml-12 rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-violet-900">{session.feedback}</p>}

                {question && (
                  <div className="space-y-4 rounded-2xl border border-slate-200 p-4 sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase text-violet-700">
                        {session.step === "diagnostic" ? "Diagnostic question" :
                         session.step === "retry" ? "Second chance" : "Knowledge check"}
                      </span>
                      <span className="text-xs text-slate-500">Choose one answer</span>
                    </div>
                    <h3 className="text-base font-semibold leading-7">{question.prompt}</h3>
                    <fieldset className="space-y-2">
                      <legend className="sr-only">Select an answer</legend>
                      {question.options.map(option =>
                        <label key={option.id} className={"flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 text-sm leading-6 " +
                          (selectedOption === option.id ? "border-violet-600 bg-violet-50" : "border-slate-200 hover:border-violet-300")}>
                          <input type="radio" name={question.id} value={option.id}
                            checked={selectedOption === option.id}
                            onChange={() => setSelectedOption(option.id)}
                            className="mt-1 accent-violet-700"/>
                          <span>{option.text}</span>
                        </label>)}
                    </fieldset>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" disabled={!selectedOption}
                        onClick={() => move({ type: "answer", choiceId: selectedOption })}
                        className="rounded-xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white disabled:opacity-40">Check my understanding</button>
                      {(session.step === "diagnostic" || session.step === "practice") &&
                        <button type="button" onClick={() => move({ type: "teach" })}
                          className="rounded-xl border border-violet-300 px-5 py-3 text-sm font-semibold text-violet-700">
                          {session.step === "diagnostic" ? "Teach me first" : "Explain it differently"}
                        </button>}
                    </div>
                  </div>
                )}

                {(session.step === "lesson" || session.step === "reteach") &&
                  <button type="button" onClick={() => move({ type: "continue" })}
                    className="rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white hover:bg-violet-800">
                    {session.step === "lesson" ? "I'm ready to practise" : "Try a new example"}
                  </button>}

                {session.step === "complete" && (
                  <div className="space-y-4">
                    <div className={"rounded-xl p-5 " +
                      (outcome === "demonstrated" ? "bg-emerald-50" :
                       outcome === "improving" ? "bg-violet-50" : "bg-amber-50")}>
                      <p className="text-xs font-semibold uppercase tracking-wide">Sample learning outcome</p>
                      <h3 className="mt-2 text-xl font-bold">
                        {outcome === "demonstrated" ? "Understanding demonstrated" :
                         outcome === "improving" ? "You're improving" : "More practice recommended"}
                      </h3>
                      <p className="mt-2 text-sm leading-6">
                        {outcome === "demonstrated"
                          ? "You applied the idea to a practice problem. We'd reinforce it with more examples over time."
                          : outcome === "improving"
                          ? "You improved after a different explanation. Your tutor would schedule a follow-up check."
                          : "The topic needs more teaching and guided exercises. It is too early to call it mastered."}
                      </p>
                    </div>
                    <p className="text-sm text-slate-600"><strong>Suggested next lesson:</strong> {track.nextLesson}</p>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => {setSession(startTutorDemo(session.track));setSelectedOption("");}}
                        className="rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white">Try this lesson again</button>
                      <button type="button" onClick={reset} className="rounded-xl border border-slate-300 px-5 py-3 font-semibold">
                        Explore another subject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <aside className="space-y-5">
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <p className="text-xs font-bold uppercase tracking-wide text-violet-700">Your learning journey</p>
                <h2 className="mt-2 text-lg font-bold">{track.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{track.goal}</p>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar"
                  aria-label="Sample lesson progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
                  <div className="h-full rounded-full bg-violet-600 transition-all" style={{width: progress + "%"}} />
                </div>
                <p className="mt-2 text-xs text-slate-500">{progress}% through this sample lesson</p>
                <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm">
                  <p><strong>1.</strong> Check current understanding</p>
                  <p><strong>2.</strong> Explain the idea</p>
                  <p><strong>3.</strong> Apply and reassess</p>
                  <p><strong>4.</strong> Plan the next lesson</p>
                </div>
              </section>
              <section className="rounded-3xl border border-slate-200 bg-white p-5 text-sm leading-6 shadow-sm sm:p-6">
                <p className="font-bold">What is saved?</p>
                <p className="mt-2 text-slate-600">
                  The chosen subject and sample answers are kept in this browser so you can refresh the page and continue.
                  No student account, provider AI conversation, examination result or payment is created.
                </p>
              </section>
            </aside>
          </div>
        )}

        <p className="pb-6 text-center text-xs leading-5 text-slate-500">
          Fountain Prep AI Tutor is in development. This walkthrough is a teaching prototype, not an exam certification, a live AI chatbot or an official past-paper product.
        </p>
      </div>
    </main>
  );
}
