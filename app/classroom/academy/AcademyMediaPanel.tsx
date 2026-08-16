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
  const [speaking, setSpeaking] =
    useState(false);

  const [loadingAudio, setLoadingAudio] =
    useState(false);

  const [audioError, setAudioError] =
    useState("");

  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  const audioUrlRef =
    useRef<string | null>(null);

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
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    setSpeaking(false);
  }, []);

  const clearAudioUrl = useCallback(() => {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(
        audioUrlRef.current,
      );

      audioUrlRef.current = null;
    }
  }, []);

  const generateAudio =
    useCallback(async () => {
      if (!speechText.trim()) {
        return null;
      }

      const response = await fetch(
        "/api/academy/speech",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            text: speechText,
          }),
        },
      );

      if (!response.ok) {
        const responseText =
          await response.text();

        let message =
          "The natural teaching voice is temporarily unavailable.";

        try {
          const parsed =
            responseText
              ? JSON.parse(responseText)
              : {};

          if (parsed.error) {
            message = parsed.error;
          }
        } catch {
          // Keep default message.
        }

        throw new Error(message);
      }

      const blob = await response.blob();

      clearAudioUrl();

      const url =
        URL.createObjectURL(blob);

      audioUrlRef.current = url;

      return url;
    }, [
      clearAudioUrl,
      speechText,
    ]);

  const speak =
    useCallback(async () => {
      if (!speechText.trim()) {
        return;
      }

      stop();
      setAudioError("");
      setLoadingAudio(true);

      try {
        const audioUrl =
          audioUrlRef.current ||
          (await generateAudio());

        if (!audioUrl) return;

        const audio =
          new Audio(audioUrl);

        audioRef.current = audio;

        audio.onplay = () => {
          setSpeaking(true);
          setLoadingAudio(false);
        };

        audio.onended = () => {
          setSpeaking(false);
          audioRef.current = null;
        };

        audio.onerror = () => {
          setSpeaking(false);
          setLoadingAudio(false);
          audioRef.current = null;

          setAudioError(
            "The lesson voice could not be played. Please try again.",
          );
        };

        await audio.play();
      } catch (error) {
        console.error(
          "Academy narration error:",
          error,
        );

        setSpeaking(false);
        setLoadingAudio(false);

        setAudioError(
          error instanceof Error
            ? error.message
            : "The natural teaching voice is temporarily unavailable.",
        );
      }
    }, [
      generateAudio,
      speechText,
      stop,
    ]);

  useEffect(() => {
    stop();
    clearAudioUrl();
    setAudioError("");

    if (
      autoNarrate &&
      lastAutoNarrated.current !==
        activityId
    ) {
      lastAutoNarrated.current =
        activityId;

      const timer =
        window.setTimeout(
          () => {
            void speak();
          },
          500,
        );

      return () => {
        window.clearTimeout(timer);
        stop();
        clearAudioUrl();
      };
    }

    return () => {
      stop();
      clearAudioUrl();
    };
  }, [
    activityId,
    autoNarrate,
    clearAudioUrl,
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
              {visualTitle || title}
            </strong>

            <p>
              {visualDescription ||
                explanation ||
                "Listen, explore the idea, then apply it in the activity."}
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
          onClick={() =>
            void speak()
          }
          disabled={
            speaking ||
            loadingAudio
          }
        >
          {loadingAudio
            ? "Preparing tutor voice..."
            : speaking
              ? "🔊 Tutor speaking..."
              : "🔊 Hear tutor again"}
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
          Natural tutor narration
        </span>
      </div>

      {audioError ? (
        <div className="audioError">
          {audioError}
        </div>
      ) : null}

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
            rgba(
              255,
              255,
              255,
              0.94
            );
          box-shadow:
            0 16px 42px
            rgba(
              57,
              34,
              84,
              0.1
            );
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
            rgba(
              124,
              58,
              237,
              0.11
            );
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
            rgba(
              180,
              125,
              0,
              0.16
            );
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
          box-shadow:
            0 12px 28px
            rgba(
              109,
              40,
              217,
              0.2
            );
        }

        .audioBar button:disabled {
          opacity: 0.78;
          cursor: wait;
        }

        .audioBar span {
          color: #81758a;
          font-size: 12px;
          font-weight: 700;
        }

        .audioError {
          padding: 12px 14px;
          border-radius: 14px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #9a3412;
          font-size: 13px;
          font-weight: 750;
        }

        @media (
          max-width: 620px
        ) {
          .visualStage {
            min-height: 165px;
            padding: 22px 14px;
          }

          .visualCore {
            grid-template-columns:
              1fr;
            text-align: center;
          }

          .visualIcon {
            margin: 0 auto;
          }

          .audioBar {
            align-items:
              stretch;
          }

          .audioBar button {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}