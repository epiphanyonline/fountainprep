"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import type { LanguageCurriculum, SupportedLanguage } from "@/app/types/fountaintalk";
import ReportPronunciation from "@/app/classroom/components/ReportPronunciation";

type Pilot = { curricula: LanguageCurriculum[]; readiness: { orinode: boolean; azure: boolean; cacheEnabled: boolean } };

async function pilotFetch(path: string, init: RequestInit = {}) {
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw new Error("Sign in with your authorised pilot account first.");
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${data.session.access_token}`);
  const response = await fetch(path, { ...init, headers, cache: "no-store" });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Pilot request failed.");
  }
  return response;
}

export default function LanguagePilotPage() {
  const [pilot, setPilot] = useState<Pilot | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage>("yoruba");
  const [lessonId, setLessonId] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [audioSource, setAudioSource] = useState("");
  const [completed, setCompleted] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrl = useRef<string | null>(null);
  const requestVersion = useRef(0);

  function stopAudio() {
    requestVersion.current++;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src");
      audioRef.current.load();
    }
    if (objectUrl.current) {
      URL.revokeObjectURL(objectUrl.current);
      objectUrl.current = null;
    }
    setAudioSource("");
  }
  useEffect(() => () => {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    requestVersion.current++;
  }, []);

  const course = pilot?.curricula.find(c => c.language === language)?.courses.find(c => c.level === "foundation");
  const lessons = course?.units.flatMap(unit => unit.lessons) ?? [];
  const lesson = lessons.find(l => l.id === lessonId) ?? lessons[0];
  const step = lesson?.steps[stepIndex];
  const phrase = step?.expectedPhrase;

  async function loadPilot() {
    setBusy(true); setMessage("");
    try {
      const response = await pilotFetch("/api/fountaintalk/pilot-curriculum");
      const body: Pilot = await response.json();
      setPilot(body);
      if (body.curricula.length) setLanguage(body.curricula[0].language);
      setLessonId(""); setStepIndex(0);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Pilot unavailable."); }
    finally { setBusy(false); }
  }
  function selectLesson(id: string) {
    stopAudio(); setLessonId(id); setStepIndex(0); setMessage("");
  }
  async function listen(slow: boolean) {
    if (!phrase) return;
    stopAudio();
    const version = requestVersion.current;
    setBusy(true); setMessage("");
    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) throw new Error("Sign in required.");
      const localAudio = step?.nativeAudioUrl;
      let response = await fetch("/api/fountaintalk/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ language, text: phrase, ...(localAudio ? { mode: "approved" } : {}) }),
      });
      let source = response.headers.get("X-FountainTalk-Audio-Source") ?? "";
      if (localAudio && response.status === 404) {
        response = await fetch(localAudio);
        source = "curriculum recording";
      }
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Pronunciation unavailable.");
      }
      const blob = await response.blob();
      if (version !== requestVersion.current) return;
      if (!blob.type.startsWith("audio/") || !blob.size) throw new Error("Invalid audio response.");
      if (!audioRef.current) throw new Error("Audio player unavailable.");
      const url = URL.createObjectURL(blob);
      objectUrl.current = url;
      audioRef.current.src = url;
      audioRef.current.playbackRate = slow ? 0.75 : 1;
      setAudioSource(source || "language audio");
      await audioRef.current.play();
    } catch (error) {
      if (version === requestVersion.current) setMessage(error instanceof Error ? error.message : "Audio unavailable.");
    } finally { setBusy(false); }
  }
  function advance() {
    if (!lesson) return;
    stopAudio(); setMessage("");
    if (stepIndex < lesson.steps.length - 1) setStepIndex(i => i + 1);
    else {
      setCompleted(previous => previous.includes(lesson.id) ? previous : [...previous, lesson.id]);
      const next = lessons[lessons.findIndex(l => l.id === lesson.id) + 1];
      if (next) selectLesson(next.id);
      else setMessage("You reached the end of the pilot course.");
    }
  }

  return <main className="mx-auto max-w-4xl space-y-5 p-5 sm:p-8">
    <div className="flex flex-wrap justify-between gap-3 text-sm"><Link href="/admin">← Admin</Link><Link href="/admin/pronunciation-library">Pronunciation review library</Link></div>
    <header><p className="font-semibold text-purple-700">FountainTalk • Staff-only preview</p><h1 className="text-3xl font-bold">Language learning pilot</h1><p className="mt-2 text-slate-600">Explore the draft curriculum and test specialist pronunciation. This preview does not save learner progress, change subscriptions, award real points or run AI conversation assessment.</p></header>
    {process.env.NEXT_PUBLIC_FOUNTAINTALK_MULTILINGUAL_SPEECH !== "true" ? <p role="status">The language pilot is disabled in this environment.</p> : !pilot ? <button className="rounded-xl bg-purple-700 px-5 py-3 text-white" disabled={busy} onClick={() => void loadPilot()}>{busy ? "Loading…" : "Open authorised pilot"}</button> : <>
      <div className="rounded-xl border p-4 text-sm">
        <p>Orinode key: {pilot.readiness.orinode ? "Configured (not yet tested)" : "Not configured"}</p>
        <p>Azure key and region: {pilot.readiness.azure ? "Configured (not yet tested)" : "Not configured"}</p>
        <p>Audio reuse: {pilot.readiness.cacheEnabled ? "Enabled" : "Disabled"}</p>
      </div>
      <fieldset disabled={busy} className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2">
        <label>Language<select className="block w-full rounded-lg border p-2" value={language} onChange={e => { setLanguage(e.target.value as SupportedLanguage); selectLesson(""); }}>{pilot.curricula.map(c => <option key={c.language} value={c.language}>{c.title}</option>)}</select></label>
        <label>Lesson<select className="block w-full rounded-lg border p-2" value={lesson?.id ?? ""} onChange={e => selectLesson(e.target.value)}>{course?.units.map(unit => <optgroup key={unit.id} label={unit.title}>{unit.lessons.map(l => <option key={l.id} value={l.id}>{l.title}{completed.includes(l.id) ? " ✓" : ""}</option>)}</optgroup>)}</select></label>
      </fieldset>
      {lesson && step && <section className="space-y-4 rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-purple-700">{lesson.title} · Step {stepIndex + 1} of {lesson.steps.length}</p>
        <progress className="w-full" value={stepIndex + 1} max={lesson.steps.length} />
        <h2 className="text-xl font-bold">{step.title}</h2>
        <p>{step.teacherPrompt}</p>
        {phrase && <><div className="rounded-xl bg-purple-50 p-4 text-center text-3xl font-bold">{phrase}</div>
          {step.pronunciationTip && <p className="text-sm text-slate-600">{step.pronunciationTip}</p>}
          <div className="flex flex-wrap gap-3"><button className="rounded-lg bg-purple-700 px-4 py-2 text-white" disabled={busy} onClick={() => void listen(false)}>Listen</button><button className="rounded-lg border px-4 py-2" disabled={busy} onClick={() => void listen(true)}>Listen slowly</button></div>
          <ReportPronunciation key={`${language}:${lesson.id}:${phrase}`} language={language} phrase={phrase} lessonId={lesson.id} />
        </>}
        <audio ref={audioRef} controls className="w-full" hidden={!audioSource} />
        {audioSource && <p className="text-sm">Audio source: {audioSource}</p>}
        <div className="flex justify-between"><button className="rounded-lg border px-4 py-2" disabled={busy || stepIndex===0} onClick={() => { stopAudio(); setStepIndex(i=>i-1); }}>Previous</button><button className="rounded-lg bg-purple-700 px-4 py-2 text-white" disabled={busy} onClick={advance}>{stepIndex===lesson.steps.length-1?"Finish preview lesson":"Next step"}</button></div>
      </section>}
      <p className="text-sm text-slate-600">Preview completion: {lessons.filter(l=>completed.includes(l.id)).length} / {lessons.length} lessons in this language. Session only.</p>
    </>}
    {message && <p role="status" className="rounded-xl border p-3">{message}</p>}
  </main>;
}
