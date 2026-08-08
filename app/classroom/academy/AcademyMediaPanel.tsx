"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Props = {
  activityId: string;
  title: string;
  text: string;
  explanation?: string | null;
  instruction?: string | null;
  narrationText?: string | null;
  visualTitle?: string | null;
  visualDescription?: string | null;
  story?: string | null;
  autoNarrate?: boolean;
};

function chooseVoice(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | null {
  const english = voices.filter((voice) =>
    voice.lang.toLowerCase().startsWith("en"),
  );

  const preferredTerms = [
    "natural",
    "neural",
    "premium",
    "enhanced",
    "google uk english",
    "microsoft sonia",
    "microsoft ryan",
    "microsoft aria",
    "microsoft guy",
  ];

  for (const term of preferredTerms) {
    const match = english.find((voice) =>
      voice.name.toLowerCase().includes(term),
    );
    if (match) return match;
  }

  const gbVoice = english.find(
    (voice) =>
      voice.lang.toLowerCase() === "en-gb",
  );

  return gbVoice ?? english[0] ?? voices[0] ?? null;
}

export default function AcademyMediaPanel({
  activityId,
  title,
  text,
  explanation,
  instruction,
  narrationText,
  visualTitle,
  visualDescription,
  story,
  autoNarrate = true,
}: Props) {
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);
  const lastAutoNarrated =
    useRef<string | null>(null);

  const speechText = useMemo(() => {
    if (narrationText?.trim()) {
      return narrationText.trim();
    }

    return [
      title,
      text,
      explanation,
      story,
      instruction,
    ]
      .filter(Boolean)
      .join(". ");
  }, [
    explanation,
    instruction,
    narrationText,
    story,
    text,
    title,
  ]);

  const stop = useCallback(() => {
    if (typeof window === "undefined") return;

    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback(() => {
    if (
      typeof window === "undefined" ||
      !speechText.trim()
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        speechText,
      );

    const selectedVoice =
      chooseVoice(voices);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = "en-GB";
    }

    utterance.rate = 0.92;
    utterance.pitch = 1.02;
    utterance.volume = 1;

    utterance.onstart = () =>
      setSpeaking(true);
    utterance.onend = () =>
      setSpeaking(false);
    utterance.onerror = () =>
      setSpeaking(false);

    window.speechSynthesis.speak(
      utterance,
    );
  }, [speechText, voices]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const loadVoices = () => {
      setVoices(
        window.speechSynthesis.getVoices(),
      );
    };

    loadVoices();
    window.speechSynthesis.addEventListener(
      "voiceschanged",
      loadVoices,
    );

    return () => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        loadVoices,
      );
    };
  }, []);

  useEffect(() => {
    stop();

    if (
      autoNarrate &&
      lastAutoNarrated.current !==
        activityId
    ) {
      lastAutoNarrated.current =
        activityId;

      const timer =
        window.setTimeout(
          () => speak(),
          450,
        );

      return () => {
        window.clearTimeout(timer);
        stop();
      };
    }

    return stop;
  }, [
    activityId,
    autoNarrate,
    speak,
    stop,
  ]);

  return (
    <section className="mediaPanel">
      <div className="visualStage">
        <div className="slideLabel">
          Visual learning
        </div>

        <div className="visualCore">
          <span className="visualIcon">
            {story ? "📖" : "💡"}
          </span>

          <div>
            <strong>
              {visualTitle ||
                title}
            </strong>
            <p>
              {visualDescription ||
                explanation ||
                "Listen, look at the idea, then apply it in the activity."}
            </p>
          </div>
        </div>

        <div
          className="visualRing ringOne"
          aria-hidden="true"
        />
        <div
          className="visualRing ringTwo"
          aria-hidden="true"
        />
      </div>

      {story ? (
        <div className="storyCard">
          <small>
            REAL-LIFE STORY / CASE
          </small>
          <p>{story}</p>
        </div>
      ) : null}

      <div className="audioBar">
        <button
          type="button"
          className="primaryAudio"
          onClick={speak}
          disabled={speaking}
        >
          {speaking
            ? "🔊 Playing lesson…"
            : "🔊 Hear again"}
        </button>

        {speaking ? (
          <button
            type="button"
            onClick={stop}
          >
            Stop
          </button>
        ) : null}

        <span>
          The lesson is read aloud
          automatically.
        </span>
      </div>

      <style jsx>{`
        .mediaPanel {
          display: grid;
          gap: 14px;
          margin-top: 22px;
        }

        .visualStage {
          position: relative;
          min-height: 190px;
          display: grid;
          place-items: center;
          overflow: hidden;
          padding: 28px;
          border: 1px solid
            rgba(124, 58, 237, 0.12);
          border-radius: 25px;
          background:
            radial-gradient(
              circle at 72% 32%,
              rgba(124, 58, 237, 0.15),
              transparent 29%
            ),
            linear-gradient(
              135deg,
              #fff,
              #f5efff
            );
        }

        .slideLabel {
          position: absolute;
          top: 14px;
          left: 16px;
          z-index: 3;
          color: #7c3aed;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .visualCore {
          position: relative;
          z-index: 2;
          width: min(560px, 92%);
          display: grid;
          grid-template-columns:
            auto 1fr;
          align-items: center;
          gap: 18px;
          padding: 20px;
          border-radius: 23px;
          background:
            rgba(255, 255, 255, 0.94);
          box-shadow:
            0 16px 42px
            rgba(57, 34, 84, 0.1);
        }

        .visualIcon {
          width: 62px;
          height: 62px;
          display: grid;
          place-items: center;
          border-radius: 19px;
          background: #f2eaff;
          font-size: 29px;
        }

        .visualCore strong {
          display: block;
          color: #2d183f;
          font-size: 19px;
        }

        .visualCore p {
          margin: 7px 0 0;
          color: #716479;
          line-height: 1.55;
        }

        .visualRing {
          position: absolute;
          border: 1px solid
            rgba(124, 58, 237, 0.11);
          border-radius: 50%;
        }

        .ringOne {
          width: 190px;
          height: 190px;
          right: -30px;
          top: -35px;
        }

        .ringTwo {
          width: 300px;
          height: 300px;
          right: -80px;
          top: -90px;
        }

        .storyCard {
          padding: 19px;
          border: 1px solid
            rgba(180, 125, 0, 0.16);
          border-radius: 21px;
          background:
            linear-gradient(
              135deg,
              #fffaf0,
              #fff5d9
            );
        }

        .storyCard small {
          color: #9a6700;
          font-weight: 950;
          letter-spacing: 0.08em;
        }

        .storyCard p {
          margin: 8px 0 0;
          color: #584c39;
          line-height: 1.68;
        }

        .audioBar {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 9px;
        }

        .audioBar button {
          min-height: 45px;
          padding: 0 16px;
          border: 0;
          border-radius: 14px;
          color: #5b21b6;
          background: #f2eaff;
          font-weight: 900;
          cursor: pointer;
        }

        .audioBar .primaryAudio {
          color: #fff;
          background:
            linear-gradient(
              135deg,
              #7c3aed,
              #6d28d9
            );
        }

        .audioBar button:disabled {
          opacity: 0.72;
          cursor: wait;
        }

        .audioBar span {
          color: #81758a;
          font-size: 12px;
          font-weight: 700;
        }

        @media (max-width: 620px) {
          .visualStage {
            min-height: 165px;
            padding: 22px 14px;
          }

          .visualCore {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .visualIcon {
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
}
