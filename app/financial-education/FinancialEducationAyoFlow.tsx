"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type FinancialEducationAyoTourStep = {
  selector: string;
  title: string;
  text: string;
};

type Props = {
  title: string;
  text: string;
  autoSpeak?: boolean;
  tourSteps?: FinancialEducationAyoTourStep[];
};

export default function FinancialEducationAyoFlow({
  title,
  text,
  autoSpeak = true,
  tourSteps = [],
}: Props) {
  const steps = useMemo(
    () =>
      tourSteps.length > 0
        ? tourSteps
        : [{ selector: "", title, text }],
    [tourSteps, title, text],
  );

  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [tourActive, setTourActive] = useState(tourSteps.length > 0);
  const [stepIndex, setStepIndex] = useState(0);
  const [walking, setWalking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [tourStarted, setTourStarted] = useState(tourSteps.length === 0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const autoAttemptRef = useRef(false);
  const advanceTimerRef = useRef<number | null>(null);
  const visualTimerRef = useRef<number | null>(null);

  const currentStep = steps[Math.min(stepIndex, steps.length - 1)];

  const clearAdvanceTimer = useCallback(() => {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    if (visualTimerRef.current !== null) {
      window.clearTimeout(visualTimerRef.current);
      visualTimerRef.current = null;
    }
  }, []);

  const clearUrl = useCallback(() => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    clearAdvanceTimer();
    controllerRef.current?.abort();
    controllerRef.current = null;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.onended = null;
    }

    clearUrl();
    setSpeaking(false);
    setLoading(false);
    setWalking(false);
  }, [clearAdvanceTimer, clearUrl]);

  const focusStep = useCallback((step: FinancialEducationAyoTourStep) => {
    if (!step.selector) return;

    const target = document.querySelector<HTMLElement>(step.selector);
    if (!target) return;

    setWalking(true);

    target.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });

    window.setTimeout(() => setWalking(false), 650);
  }, []);

  const finishTour = useCallback(() => {
    clearAdvanceTimer();
    setTourActive(false);
    setWalking(false);
    setStepIndex(Math.max(steps.length - 1, 0));
  }, [clearAdvanceTimer, steps.length]);

  const speakText = useCallback(
    async (
      speechText: string,
      onComplete?: () => void,
    ) => {
      clearAdvanceTimer();
      controllerRef.current?.abort();
      controllerRef.current = null;

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.onended = null;
      }

      clearUrl();
      setSpeaking(false);
      setLoading(true);
      setNeedsGesture(false);

      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        const response = await fetch("/api/academy/speech", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: speechText }),
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Voice unavailable");

        const blob = await response.blob();
        if (controller.signal.aborted) return;

        const url = URL.createObjectURL(blob);
        urlRef.current = url;

        const audio = audioRef.current ?? new Audio();
        audioRef.current = audio;
        audio.preload = "auto";
        audio.setAttribute("playsinline", "true");
        audio.setAttribute("webkit-playsinline", "true");
        audio.src = url;

        audio.onplay = () => {
          setLoading(false);
          setSpeaking(true);
          setNeedsGesture(false);
        };

        audio.onended = () => {
          setSpeaking(false);
          clearUrl();
          onComplete?.();
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
    },
    [clearAdvanceTimer, clearUrl],
  );

  const runStep = useCallback(
    (index: number, shouldSpeak = true) => {
      const step = steps[index];
      if (!step || paused || minimized || dismissed) return;

      clearAdvanceTimer();
      setStepIndex(index);
      focusStep(step);

      if (shouldSpeak) {
        window.setTimeout(() => {
          if (!paused && !minimized && !dismissed) {
            void speakText(step.text);
          }
        }, 500);
      }

      // Tour movement is intentionally independent from browser audio autoplay.
      // If narration is blocked, Ayo still continues the visual walkthrough.
      const readingWindow = Math.max(
        5200,
        Math.min(9000, 2600 + step.text.length * 28),
      );

      visualTimerRef.current = window.setTimeout(() => {
        if (paused || minimized || dismissed) return;

        if (index < steps.length - 1) {
          runStep(index + 1, true);
        } else {
          finishTour();
        }
      }, readingWindow);
    },
    [
      clearAdvanceTimer,
      dismissed,
      finishTour,
      focusStep,
      minimized,
      paused,
      speakText,
      steps,
    ],
  );

  useEffect(() => {
    if (!autoSpeak || autoAttemptRef.current || dismissed) return;

    autoAttemptRef.current = true;

    const timer = window.setTimeout(() => {
      if (tourSteps.length === 0) {
        void speakText(text);
      }
    }, 650);

    return () => window.clearTimeout(timer);
  }, [
    autoSpeak,
    dismissed,
    runStep,
    speakText,
    text,
    tourSteps.length,
  ]);

  useEffect(() => {
    if (!tourActive || minimized || dismissed || !currentStep.selector) return;

    const target = document.querySelector<HTMLElement>(currentStep.selector);
    if (!target) return;

    target.classList.add("ayo-tour-focus");

    return () => {
      target.classList.remove("ayo-tour-focus");
    };
  }, [
    currentStep.selector,
    dismissed,
    minimized,
    stepIndex,
    tourActive,
  ]);

  useEffect(() => () => stop(), [stop]);

  const startGuidedTour = () => {
    // This click is the intentional browser gesture that unlocks audible playback.
    setTourStarted(true);
    setTourActive(true);
    setPaused(false);
    setNeedsGesture(false);
    runStep(0, true);
  };

  const pauseTour = () => {
    clearAdvanceTimer();
    if (audioRef.current) audioRef.current.pause();
    setSpeaking(false);
    setLoading(false);
    setPaused(true);
    setWalking(false);
  };

  const resumeTour = () => {
    setPaused(false);
    window.setTimeout(() => runStep(stepIndex, true), 120);
  };

  const replayCurrent = () => {
    if (tourActive) {
      runStep(stepIndex, true);
    } else {
      void speakText(currentStep.text);
    }
  };

  const skipTour = () => {
    stop();
    setPaused(false);
    finishTour();
  };

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
          <small>{paused ? "Paused" : tourActive ? "Tour active" : speaking ? "Speaking" : "Open guide"}</small>
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
    <aside
      className={[
        "ayoGuide",
        speaking ? "speaking" : "",
        walking ? "walking" : "",
      ].join(" ")}
    >
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
            {tourActive && tourStarted && (
              <button
                type="button"
                className="pauseControl"
                onClick={paused ? resumeTour : pauseTour}
                aria-label={paused ? "Resume Ayo tour" : "Pause Ayo tour and audio"}
                title={paused ? "Resume tour" : "Pause tour"}
              >
                {paused ? "▶" : "Ⅱ"}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                pauseTour();
                setMinimized(true);
              }}
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
          {!tourStarted && tourSteps.length > 0
            ? "READY WHEN YOU ARE"
            : paused
              ? `PAUSED · ${stepIndex + 1} OF ${steps.length}`
              : tourActive
                ? `GUIDED TOUR · ${stepIndex + 1} OF ${steps.length}`
            : loading
              ? "Preparing Ayo's voice"
              : speaking
                ? "Presenting now"
                : needsGesture
                  ? "Tap to hear Ayo"
                  : "Your guided journey"}
        </span>

        <h3>{currentStep.title}</h3>
        <p>{currentStep.text}</p>

        {!tourStarted && tourSteps.length > 0 ? (
          <div className="startTourRow">
            <button
              type="button"
              className="startTourButton"
              onClick={startGuidedTour}
            >
              <span className="playDisc">▶</span>
              <span>
                <strong>Start guided tour with Ayo</strong>
                <small>One tap · Ayo takes it from here</small>
              </span>
            </button>
            <small className="startTourNote">
              Ayo will speak and guide you through each experience automatically.
            </small>
          </div>
        ) : (
          <div className="voiceRow">
            <button
              type="button"
              className="voiceButton"
              onClick={() => {
                if (speaking || loading) {
                  if (audioRef.current) audioRef.current.pause();
                  setSpeaking(false);
                  setLoading(false);
                } else {
                  replayCurrent();
                }
              }}
            >
              {loading ? "Preparing..." : speaking ? "Ⅱ Pause audio" : "▶ Hear Ayo"}
            </button>

            {tourActive ? (
              <div className="tourActions">
                <button type="button" className="skipButton" onClick={skipTour}>
                  Skip tour
                </button>
                <small>Ayo will move through this introduction automatically.</small>
              </div>
            ) : (
              <small>
                {needsGesture
                  ? "Tap Hear Ayo to enable voice."
                  : "Ayo continues with you through the Financial Education flow."}
              </small>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        .ayo-tour-focus{
          outline:1px solid rgba(196,181,253,.7)!important;
          outline-offset:6px!important;
          box-shadow:0 0 0 7px rgba(124,58,237,.07),0 22px 52px rgba(15,7,23,.16)!important;
          transition:outline-color .3s ease,box-shadow .3s ease!important;
        }
      `}</style>

      <style jsx>{`
        .ayoGuide{position:relative;min-height:180px;display:grid;grid-template-columns:165px minmax(0,1fr);align-items:end;overflow:visible}
        .ayoStage{position:relative;height:180px;align-self:end}
        .ayoGlow{position:absolute;inset:30% 7% 3%;border-radius:50%;background:radial-gradient(circle,rgba(124,58,237,.22),transparent 67%);filter:blur(22px)}
        .ayoStage :global(.ayoImage){object-fit:contain;object-position:bottom center;filter:drop-shadow(0 20px 28px rgba(42,20,54,.2))}
        .speaking .ayoStage{animation:ayoFloat 2.8s ease-in-out infinite}
        .walking .ayoStage{animation:ayoWalk .65s cubic-bezier(.22,1,.36,1)}
        @keyframes ayoFloat{50%{transform:translateY(-5px)}}
        @keyframes ayoWalk{0%{transform:translateX(0)}45%{transform:translateX(10px) translateY(-4px)}100%{transform:translateX(0)}}
        .ayoPanel{position:relative;z-index:2;margin-left:-18px;padding:18px 18px 17px 30px;border:1px solid rgba(124,58,237,.15);border-radius:22px;background:linear-gradient(135deg,rgba(255,255,255,.98),rgba(247,241,255,.96));box-shadow:0 18px 46px rgba(61,30,82,.11);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
        .ayoTop{display:flex;align-items:center;justify-content:space-between;gap:12px}.ayoIdentity{display:flex;align-items:center;gap:8px}
        .liveDot{width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 5px rgba(34,197,94,.1)}
        .ayoTop strong{color:#4e2767;font-size:9px;letter-spacing:.1em}
        .ayoControls{display:flex;gap:7px;flex-shrink:0}.ayoControls button{width:38px;height:38px;display:grid;place-items:center;border:1px solid #e2d7eb;border-radius:999px;color:#5f4770;background:#fff;font-size:18px;font-weight:900;cursor:pointer;box-shadow:0 5px 14px rgba(61,30,82,.07)}.ayoControls .pauseControl{width:44px;color:#fff;background:linear-gradient(135deg,#6d28d9,#8b5cf6);border-color:transparent;box-shadow:0 8px 20px rgba(109,40,217,.2);font-size:14px}
        .status{display:block;margin-top:11px;color:#7c3aed;font-size:8px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}
        .ayoPanel h3{margin:6px 0 0;color:#281632;font-family:Georgia,"Times New Roman",serif;font-size:26px;line-height:1.05;font-weight:500}
        .ayoPanel p{margin:8px 0 0;color:#6d6075;font-size:11px;line-height:1.55}
        .startTourRow{display:flex;align-items:center;gap:12px;margin-top:15px;flex-wrap:wrap}.startTourButton{min-height:52px;display:inline-flex;align-items:center;gap:11px;padding:7px 18px 7px 8px;border:0;border-radius:999px;color:#fff;background:linear-gradient(135deg,#6d28d9,#8b5cf6);box-shadow:0 12px 28px rgba(109,40,217,.24);font:inherit;cursor:pointer;text-align:left}.playDisc{width:38px;height:38px;display:grid;place-items:center;border-radius:50%;background:rgba(255,255,255,.17);font-size:12px}.startTourButton>span:last-child{display:grid;gap:1px}.startTourButton strong{font-size:10px;letter-spacing:.01em}.startTourButton small{font-size:7px;opacity:.76}.startTourNote{color:#8a7d91;font-size:8px;line-height:1.35}.voiceRow{display:flex;align-items:center;gap:10px;margin-top:13px}.voiceButton{min-height:40px;padding:0 14px;border:0;border-radius:999px;color:#fff;background:linear-gradient(135deg,#6d28d9,#8b5cf6);box-shadow:0 10px 24px rgba(109,40,217,.2);font:inherit;font-size:9px;font-weight:900;cursor:pointer}
        .voiceRow>small,.tourActions small{color:#8a7d91;font-size:8px;line-height:1.35}
        .tourActions{display:flex;align-items:center;gap:9px;min-width:0}.skipButton{min-height:30px;padding:0 10px;border:1px solid #e2d7eb;border-radius:999px;color:#6f587b;background:#fff;font:inherit;font-size:8px;font-weight:850;cursor:pointer;white-space:nowrap}
        @media(max-width:680px){.startTourRow{display:grid}.startTourButton{width:100%;justify-content:flex-start}.startTourNote{display:none}.ayoControls{gap:5px}.ayoControls button{width:36px;height:36px}.ayoControls .pauseControl{width:40px}.ayoGuide{min-height:0;grid-template-columns:90px minmax(0,1fr)}.ayoStage{height:118px}.ayoPanel{margin-left:-10px;padding:14px 13px 14px 18px;border-radius:18px}.ayoPanel h3{font-size:21px}.ayoPanel p{font-size:10px}.voiceRow{display:grid}.voiceButton{width:max-content}.tourActions small,.voiceRow>small{display:none}}
        @media(max-width:420px){.ayoGuide{grid-template-columns:76px minmax(0,1fr)}.ayoStage{height:102px}.ayoTop strong{font-size:8px}}
        @media(prefers-reduced-motion:reduce){.speaking .ayoStage,.walking .ayoStage{animation:none}.ayo-tour-focus{transition:none!important}}
      `}</style>
    </aside>
  );
}
