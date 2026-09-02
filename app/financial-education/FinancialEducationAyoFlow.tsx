"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  title: string;
  text: string;
  autoSpeak?: boolean;
};

export default function FinancialEducationAyoFlow({
  title,
  text,
  autoSpeak = true,
}: Props) {
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const autoAttemptRef = useRef(false);

  const clearUrl = useCallback(() => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    clearUrl();
    setSpeaking(false);
    setLoading(false);
  }, [clearUrl]);

  const speak = useCallback(async () => {
    stop();
    setLoading(true);
    setNeedsGesture(false);

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const response = await fetch("/api/academy/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error("Voice unavailable");

      const blob = await response.blob();
      if (controller.signal.aborted) return;

      clearUrl();

      const url = URL.createObjectURL(blob);
      urlRef.current = url;

      const audio = audioRef.current ?? new Audio();
      audioRef.current = audio;
      audio.preload = "auto";
      audio.src = url;

      audio.onplay = () => {
        setLoading(false);
        setSpeaking(true);
        setNeedsGesture(false);
      };

      audio.onended = () => {
        setSpeaking(false);
        clearUrl();
      };

      try {
        await audio.play();
      } catch {
        setLoading(false);
        setSpeaking(false);
        setNeedsGesture(true);
      }
    } catch {
      if (!controller.signal.aborted) {
        setLoading(false);
        setSpeaking(false);
        setNeedsGesture(true);
      }
    }
  }, [clearUrl, stop, text]);

  useEffect(() => {
    if (!autoSpeak || autoAttemptRef.current || dismissed) return;

    autoAttemptRef.current = true;

    const timer = window.setTimeout(() => {
      void speak();
    }, 650);

    return () => window.clearTimeout(timer);
  }, [autoSpeak, dismissed, speak]);

  useEffect(() => () => stop(), [stop]);

  if (dismissed) return null;

  if (minimized) {
    return (
      <button
        type="button"
        className="ayoMini"
        onClick={() => setMinimized(false)}
        aria-label="Open Ayo guide"
      >
        <span className={speaking ? "miniPulse speaking" : "miniPulse"} />
        <span>
          <strong>Ayo</strong>
          <small>{speaking ? "Speaking" : "Open guide"}</small>
        </span>
        <b>↑</b>

        <style jsx>{`
          .ayoMini{position:fixed;right:16px;bottom:max(18px,calc(env(safe-area-inset-bottom) + 14px));z-index:95;min-height:50px;display:flex;align-items:center;gap:9px;padding:7px 12px 7px 8px;border:1px solid rgba(124,58,237,.16);border-radius:999px;color:#39204d;background:rgba(255,255,255,.96);box-shadow:0 14px 36px rgba(46,24,64,.18);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);cursor:pointer}
          .miniPulse{width:33px;height:33px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#a78bfa)}
          .miniPulse.speaking{animation:pulse 1.4s ease-in-out infinite}
          .ayoMini>span:nth-child(2){display:grid;text-align:left}
          .ayoMini strong{font-size:11px}.ayoMini small{color:#8c8194;font-size:9px;font-weight:750}.ayoMini b{color:#7c3aed}
          @keyframes pulse{50%{box-shadow:0 0 0 7px rgba(124,58,237,.09)}}
        `}</style>
      </button>
    );
  }

  return (
    <aside className={speaking ? "ayoGuide speaking" : "ayoGuide"}>
      <div className="ayoStage">
        <div className="ayoGlow" />
        <Image
          src="/images/fountaintalk/ayo-welcome.png"
          alt="Ayo, your Fountain Prep guide"
          fill
          sizes="160px"
          priority
          className="ayoImage"
        />
      </div>

      <div className="ayoPanel">
        <div className="ayoTop">
          <div className="ayoIdentity">
            <span className="liveDot" />
            <strong>AYO · YOUR GUIDE</strong>
          </div>

          <div className="ayoControls">
            <button
              type="button"
              onClick={() => setMinimized(true)}
              aria-label="Minimise Ayo"
              title="Minimise"
            >
              —
            </button>
            <button
              type="button"
              onClick={() => {
                stop();
                setDismissed(true);
              }}
              aria-label="Close Ayo guide"
              title="Close"
            >
              ×
            </button>
          </div>
        </div>

        <span className="status">
          {loading
            ? "Preparing Ayo's voice"
            : speaking
              ? "Presenting now"
              : needsGesture
                ? "Tap to hear Ayo"
                : "Your guided journey"}
        </span>

        <h3>{title}</h3>
        <p>{text}</p>

        <div className="voiceRow">
          <button
            type="button"
            className="voiceButton"
            onClick={() => {
              if (speaking) stop();
              else void speak();
            }}
          >
            {loading ? "Preparing..." : speaking ? "■ Stop" : "▶ Hear Ayo"}
          </button>

          <small>
            {needsGesture
              ? "Your browser needs one tap before audio can play automatically."
              : "Ayo continues with you through the Financial Education flow."}
          </small>
        </div>
      </div>

      <style jsx>{`
        .ayoGuide{position:relative;min-height:180px;display:grid;grid-template-columns:165px minmax(0,1fr);align-items:end;overflow:visible}
        .ayoStage{position:relative;height:180px;align-self:end}
        .ayoGlow{position:absolute;inset:30% 7% 3%;border-radius:50%;background:radial-gradient(circle,rgba(124,58,237,.22),transparent 67%);filter:blur(22px)}
        .ayoStage :global(.ayoImage){object-fit:contain;object-position:bottom center;filter:drop-shadow(0 20px 28px rgba(42,20,54,.2))}
        .speaking .ayoStage{animation:ayoFloat 2.8s ease-in-out infinite}
        @keyframes ayoFloat{50%{transform:translateY(-5px)}}
        .ayoPanel{position:relative;z-index:2;margin-left:-18px;padding:18px 18px 17px 30px;border:1px solid rgba(124,58,237,.15);border-radius:22px;background:linear-gradient(135deg,rgba(255,255,255,.98),rgba(247,241,255,.96));box-shadow:0 18px 46px rgba(61,30,82,.11);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
        .ayoTop{display:flex;align-items:center;justify-content:space-between;gap:12px}.ayoIdentity{display:flex;align-items:center;gap:8px}
        .liveDot{width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 5px rgba(34,197,94,.1)}
        .ayoTop strong{color:#4e2767;font-size:9px;letter-spacing:.1em}
        .ayoControls{display:flex;gap:6px}.ayoControls button{width:30px;height:30px;display:grid;place-items:center;border:1px solid #e2d7eb;border-radius:999px;color:#5f4770;background:#fff;font-size:18px;font-weight:900;cursor:pointer}
        .status{display:block;margin-top:11px;color:#7c3aed;font-size:8px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}
        .ayoPanel h3{margin:6px 0 0;color:#281632;font-family:Georgia,"Times New Roman",serif;font-size:26px;line-height:1.05;font-weight:500}
        .ayoPanel p{margin:8px 0 0;color:#6d6075;font-size:11px;line-height:1.55}
        .voiceRow{display:flex;align-items:center;gap:10px;margin-top:13px}.voiceButton{min-height:40px;padding:0 14px;border:0;border-radius:999px;color:#fff;background:linear-gradient(135deg,#6d28d9,#8b5cf6);box-shadow:0 10px 24px rgba(109,40,217,.2);font:inherit;font-size:9px;font-weight:900;cursor:pointer}
        .voiceRow small{color:#8a7d91;font-size:8px;line-height:1.35}
        @media(max-width:680px){.ayoGuide{min-height:0;grid-template-columns:90px minmax(0,1fr)}.ayoStage{height:118px}.ayoPanel{margin-left:-10px;padding:14px 13px 14px 18px;border-radius:18px}.ayoPanel h3{font-size:21px}.ayoPanel p{font-size:10px}.voiceRow{display:grid}.voiceButton{width:max-content}.voiceRow small{display:none}}
        @media(max-width:420px){.ayoGuide{grid-template-columns:76px minmax(0,1fr)}.ayoStage{height:102px}.ayoTop strong{font-size:8px}}
      `}</style>
    </aside>
  );
}
