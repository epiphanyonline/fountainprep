"use client";

import { FormEvent, useState } from "react";

export interface PreferredNameOnboardingProps {
  initialName?: string;
  onContinue: (preferredName: string) => void | Promise<void>;
}

export default function PreferredNameOnboarding({
  initialName = "",
  onContinue,
}: PreferredNameOnboardingProps) {
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    const clean = name.trim().replace(/\s+/g, " ");
    if (!clean) return setError("Please tell Ayo what to call you.");
    setSaving(true);
    setError("");
    try {
      await onContinue(clean.slice(0, 40));
    } catch {
      setError("We could not save that name. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-xl rounded-3xl border border-white/15 bg-slate-950/80 p-6 text-white shadow-2xl backdrop-blur md:p-9">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Ayo</p>
      <h1 className="mt-3 text-3xl font-semibold">Before we begin, what should I call you?</h1>
      <p className="mt-3 text-white/70">You can change this later. It will not alter certificates, billing, or official school records.</p>
      <form className="mt-7" onSubmit={submit}>
        <label className="block text-sm font-medium text-white/80" htmlFor="preferred-name">Preferred name</label>
        <input
          id="preferred-name"
          autoComplete="nickname"
          autoFocus
          maxLength={40}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Daniel or Danny"
          className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-lg outline-none ring-amber-300 transition focus:ring-2"
        />
        {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}
        <button disabled={saving} className="mt-5 w-full rounded-2xl bg-amber-300 px-5 py-3 font-semibold text-slate-950 disabled:opacity-60">
          {saving ? "Saving…" : "Begin with Ayo"}
        </button>
      </form>
    </section>
  );
}
