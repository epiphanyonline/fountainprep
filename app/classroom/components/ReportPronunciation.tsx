"use client";
import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import type { SupportedLanguage } from "@/app/types/fountaintalk";

export default function ReportPronunciation({ language, phrase, lessonId }: {
  language: SupportedLanguage; phrase: string; lessonId: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  async function submit() {
    setStatus("sending");
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) throw new Error("Sign in required");
      const response = await fetch("/api/fountaintalk/pronunciation-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session.access_token}` },
        body: JSON.stringify({ language, phrase, lessonId }),
      });
      if (!response.ok) throw new Error("Report not saved");
      setStatus("sent");
    } catch { setStatus("error"); }
  }
  return <div className="rounded-xl border border-purple-100 bg-white p-3 text-sm">
    <button type="button" disabled={status === "sending" || status === "sent"} onClick={() => void submit()}
      className="text-purple-700 underline disabled:opacity-60">
      {status === "sent" ? "Pronunciation reported" : status === "sending" ? "Sending…" : "Report pronunciation"}
    </button>
    <p role="status" className="mt-1 text-slate-600">{status === "sent" ? "Thank you. You can continue your lesson." : status === "error" ? "Report not saved. You can retry or continue." : "Something sounds wrong? Let us know."}</p>
  </div>;
}
