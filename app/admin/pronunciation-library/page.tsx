"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import { voiceProfiles } from "@/app/fountaintalk/speech/voiceProfiles";
import type { SupportedLanguage } from "@/app/types/fountaintalk";

type Revision = { id: number; language: string; phrase: string; review_note: string; created_at: string };

async function authorisedFetch(url: string, options: RequestInit = {}) {
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw new Error("Sign in with an authorised speech reviewer account.");
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${data.session.access_token}`);
  const response = await fetch(url, { ...options, headers, cache: "no-store" });
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.error || "Request failed.");
  }
  return response;
}

export default function PronunciationLibraryPage() {
  const [language, setLanguage] = useState<SupportedLanguage>("yoruba");
  const [phrase, setPhrase] = useState("");
  const [note, setNote] = useState("");
  const [recording, setRecording] = useState<File | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioSource, setAudioSource] = useState("");
  useEffect(() => () => { if (audioUrl) URL.revokeObjectURL(audioUrl); }, [audioUrl]);

  async function refresh() {
    const response = await authorisedFetch(`/api/fountaintalk/pronunciation-library?language=${language}`);
    const result = await response.json();
    setRevisions(result.revisions ?? []);
  }
  async function run(task: () => Promise<void>) {
    setBusy(true); setMessage("");
    try { await task(); } catch (e) { setMessage(e instanceof Error ? e.message : "Request failed."); }
    finally { setBusy(false); }
  }
  async function listen(mode: "generated" | "approved") {
    const result = await authorisedFetch("/api/fountaintalk/speech", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, text: phrase, mode }),
    });
    setAudioUrl(URL.createObjectURL(await result.blob()));
    setAudioSource(result.headers.get("X-FountainTalk-Audio-Source") ?? mode);
  }
  async function publish(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!recording || !confirmed) return;
    await run(async () => {
      const body = new FormData();
      body.append("language", language); body.append("phrase", phrase);
      body.append("reviewNote", note); body.append("audio", recording);
      body.append("confirmed", "yes");
      await authorisedFetch("/api/fountaintalk/pronunciation-library", { method: "POST", body });
      setConfirmed(false); setNote(""); setRecording(null);
      setMessage("Reviewed recording published. Future pilot requests use this revision.");
      await refresh();
    });
  }
  return (
    <main style={{ maxWidth: 760, margin: "40px auto", padding: 20 }}>
      <Link href="/admin">← Admin</Link>
      <h1>Pronunciation library</h1>
      <p>Speech pilot · Authorised reviewers only. Review exact wording and tones before publishing. Never upload a learner recording or a voice without permission.</p>
      <fieldset disabled={busy} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 20, display: "grid", gap: 12 }}>
        <label>Language <select value={language} onChange={e => { setLanguage(e.target.value as SupportedLanguage); setRevisions([]); setAudioUrl(""); setConfirmed(false); setRecording(null); setNote(""); }}>
          {Object.keys(voiceProfiles).map(name => <option key={name} value={name}>{name}</option>)}
        </select></label>
        <label>Exact target phrase (including tone marks)
          <textarea value={phrase} maxLength={400} rows={3} onChange={e => { setPhrase(e.target.value); setConfirmed(false); setAudioUrl(""); setRecording(null); }} style={{ display: "block", width: "100%" }} />
        </label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button disabled={!phrase.trim()} onClick={() => void run(() => listen("generated"))}>Listen to AI</button>
          <button disabled={!phrase.trim()} onClick={() => void run(() => listen("approved"))}>Listen to approved</button>
          <button onClick={() => void run(refresh)}>Load review history</button>
        </div>
        {audioUrl && <div><p>Audio source: {audioSource}</p><audio controls src={audioUrl} /></div>}
        <form onSubmit={publish} style={{ display: "grid", gap: 12 }}>
          <h2>Publish corrected recording</h2>
          <label>WAV or MP3 (max 1.5 MB)<input key={language + phrase} type="file" accept=".wav,.mp3,audio/wav,audio/mpeg" onChange={e => { setRecording(e.target.files?.[0] ?? null); setConfirmed(false); }} /></label>
          <button type="button" disabled={!recording} onClick={() => { if (recording) { setAudioUrl(URL.createObjectURL(recording)); setAudioSource("local preview"); } }}>Preview upload</button>
          <label>Review note <textarea required maxLength={500} value={note} onChange={e => setNote(e.target.value)} /></label>
          <label><input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} /> I reviewed the exact phrase for pronunciation accuracy and have permission to publish this recording.</label>
          <button type="submit" disabled={!phrase.trim() || !note.trim() || !recording || !confirmed}>Publish approved recording</button>
        </form>
      </fieldset>
      <p role="status">{busy ? "Working…" : message}</p>
      <h2>Recent review history</h2>
      {revisions.length === 0 ? <p>No history loaded.</p> : revisions.map(r => <article key={r.id} style={{ padding: 12, borderBottom: "1px solid #ddd" }}><button onClick={() => { setPhrase(r.phrase); setConfirmed(false); setAudioUrl(""); setRecording(null); }}>{r.phrase}</button><p>Revision {r.id} · {new Date(r.created_at).toLocaleString()}</p><p>{r.review_note}</p></article>)}
    </main>
  );
}
