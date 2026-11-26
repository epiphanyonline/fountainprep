"use client";

import { useState } from "react";
import { TUTOR_TRACKS, type TutorTrackId } from "./pilotEngine";
import type { TutorChatMessage } from "./conversationBoundary";

const TRACKS: TutorTrackId[] = ["jamb-maths", "jamb-english", "ielts-reading"];

export default function TutorConversationPreview({ liveEnabled = false }: { liveEnabled?: boolean }) {
  const [track, setTrack] = useState<TutorTrackId>("jamb-maths");
  const [history, setHistory] = useState<TutorChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  function clear() {
    if (pending) return;
    setHistory([]);
    setDraft("");
    setError("");
  }
  async function send() {
    const text = draft.trim();
    if (pending || !text || text.length > 700) return;
    setPending(true);
    setError("");
    setDraft("");
    // A strict alternating user/assistant history is transmitted; keep at
    // most 5 previous complete exchanges to bound privacy and usage cost.
    const previous = history.slice(-10);
    const outgoing: TutorChatMessage[] = [...previous, { role: "user", content: text }];
    try {
      const response = await fetch("/api/ai-tutor-preview/chat", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ track, messages: outgoing }),
        cache: "no-store",
      });
      if (!response.ok) {
        setDraft(text);
        if (response.status === 503) {
          setError("The live tutor is temporarily unavailable. The eligible model or AI Gateway credit may not be available. Try the guided teaching walkthrough instead.");
        } else if (response.status === 403) {
          setError("This preview is restricted to authorised visitors.");
        } else {
          setError("The tutor could not reply. Please try again.");
        }
        return;
      }
      const payload: unknown = await response.json();
      if (!payload || typeof payload !== "object" || !("response" in payload) ||
          typeof payload.response !== "string" || !payload.response.trim()) {
        setDraft(text);
        setError("The tutor returned an unexpected response.");
        return;
      }
      const answer = payload.response.trim().slice(0, 1300);
      setHistory([...outgoing, { role: "assistant", content: answer }]);
    } catch {
      setDraft(text);
      setError("Network unavailable. Your last message was not submitted.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f6fd] px-4 py-8 text-slate-900 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl space-y-5">
        <a href="/ai-tutor-preview" className="text-sm font-semibold text-violet-800 hover:underline">← Guided lesson preview</a>
        <header className="rounded-3xl bg-gradient-to-br from-violet-800 to-indigo-900 p-6 text-white sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-violet-200">Fountain Prep · AI Tutor development</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Talk to your exam tutor</h1>
          <p className="mt-2 text-sm leading-6 text-violet-100">
            A conversational teaching experience that will ask questions, correct misconceptions and adapt explanations.
          </p>
        </header>
        <aside className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <strong>Restricted development feature.</strong> {liveEnabled ? "Live AI conversations are enabled for authorised preview testers, subject to free-credit eligibility and rate limits." : "Live AI messages are disabled until spending and access checks are confirmed."}
          Do not enter names, contact details or other private information. No conversation is saved to a learner profile; this browser tab only keeps the current visible history.
          AI tutoring does not guarantee exam results, and exam content is not yet academically certified.
        </aside>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <label htmlFor="tutor-track" className="mb-2 block text-sm font-semibold">Exam and topic</label>
          <select id="tutor-track" value={track} disabled={pending} onChange={event => {
              setTrack(event.target.value as TutorTrackId);
              setHistory([]);
              setError("");
            }} className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm">
            {TRACKS.map(id=><option key={id} value={id}>{TUTOR_TRACKS[id].exam} — {TUTOR_TRACKS[id].title}</option>)}
          </select>
          <p className="mt-2 text-xs text-slate-500">Only three original sample lessons are currently available.</p>
          <div className="mt-6 space-y-3" aria-live="polite">
            {history.length === 0 && <div className="rounded-xl bg-violet-50 p-5 text-sm leading-6">
              Tell the tutor what you understand or what you find difficult about <strong>{TUTOR_TRACKS[track].title}</strong>.
              It should respond with an explanation and one targeted knowledge check.
            </div>}
            {history.map((message,index)=>(
              <div key={index} className={"flex " + (message.role === "user" ? "justify-end" : "justify-start")}>
                <div className={"max-w-[92%] whitespace-pre-wrap break-words rounded-xl p-4 text-sm leading-6 " +
                  (message.role === "user" ? "bg-violet-700 text-white" : "bg-slate-100 text-slate-800")}>
                  <p className="mb-1 text-xs font-bold">{message.role === "user" ? "Learner" : "Fountain Prep AI Tutor"}</p>
                  {message.content}
                </div>
              </div>
            ))}
            {pending && <p className="text-sm text-slate-600" role="status">Tutor is preparing a response…</p>}
            {error && <p role="alert" className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">{error}</p>}
          </div>
          <form onSubmit={event => {event.preventDefault();void send();}} className="mt-6 space-y-3">
            <label htmlFor="tutor-message" className="block text-sm font-semibold">Your message</label>
            <textarea id="tutor-message" value={draft} disabled={pending}
              onChange={event=>setDraft(event.target.value.slice(0,700))}
              placeholder="I'm struggling with percentages. Can you explain and quiz me?"
              className="min-h-28 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-violet-500 focus:outline-none"
              maxLength={700} required />
            <div className="flex flex-wrap justify-between gap-3">
              <button type="button" onClick={clear} disabled={pending}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-40">Clear conversation</button>
              <button type="submit" disabled={pending || !draft.trim()}
                className="rounded-lg bg-violet-700 px-5 py-3 text-sm font-bold text-white disabled:opacity-40">
                {pending ? "Sending…" : "Ask the tutor"}
              </button>
            </div>
            <p className="text-xs text-slate-500">{draft.length}/700 characters · No automatic saving · Responses are AI-generated when enabled</p>
          </form>
        </section>
      </div>
    </main>
  );
}
