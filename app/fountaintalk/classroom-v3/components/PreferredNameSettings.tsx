"use client";

import { FormEvent, useState } from "react";

export interface PreferredNameSettingsProps {
  preferredName: string;
  onSave: (preferredName: string) => void | Promise<void>;
}

export default function PreferredNameSettings({ preferredName, onSave }: PreferredNameSettingsProps) {
  const [name, setName] = useState(preferredName);
  const [saved, setSaved] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const clean = name.trim().replace(/\s+/g, " ").slice(0, 40);
    if (!clean) return;
    await onSave(clean);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5">
      <label htmlFor="preferred-name-settings" className="font-semibold text-slate-900">What should Ayo call you?</label>
      <p className="mt-1 text-sm text-slate-500">This changes classroom greetings only, not your official account name.</p>
      <div className="mt-4 flex gap-3">
        <input id="preferred-name-settings" maxLength={40} value={name} onChange={(e) => setName(e.target.value)} className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-2" />
        <button className="rounded-xl bg-slate-950 px-5 py-2 font-semibold text-white">Save</button>
      </div>
      {saved && <p className="mt-2 text-sm font-medium text-emerald-700">Ayo will call you {name.trim()} from now on.</p>}
    </form>
  );
}
