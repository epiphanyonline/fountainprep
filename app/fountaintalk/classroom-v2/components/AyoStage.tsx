"use client";

import Image from "next/image";

import type {
  AyoPose,
} from "../../types/academy";

const poseImages: Record<AyoPose, string> = {
  neutral: "/images/fountaintalk/ayo-presenter.png",
  welcome: "/images/fountaintalk/ayo-welcome.png",
  "open-hands": "/images/fountaintalk/ayo-open-hands.png",
  explain: "/images/fountaintalk/ayo-explain.png",
  "point-slide": "/images/fountaintalk/ayo-point-slide.png",
  listen: "/images/fountaintalk/ayo-listening.png",
  think: "/images/fountaintalk/ayo-thinking.png",
  encourage: "/images/fountaintalk/ayo-encouraging.png",
  celebrate: "/images/fountaintalk/ayo-celebrating.png",
  "walk-left": "/images/fountaintalk/ayo-walk-left.png",
  "walk-right": "/images/fountaintalk/ayo-walk-right.png",
};

type Props = {
  pose: AyoPose;
  speaking: boolean;
};

export default function AyoStage({
  pose,
  speaking,
}: Props) {
  return (
    <aside
      className={`v2-ayo-stage ${
        speaking ? "is-speaking" : ""
      }`}
    >
      <div className="v2-ayo-glow" />

      <div className="v2-ayo-image-frame">
        <Image
          key={pose}
          src={poseImages[pose]}
          alt="Ayo teaching"
          fill
          priority
          sizes="(max-width: 900px) 76vw, 34vw"
          className="v2-ayo-image"
        />
      </div>

      <div className="v2-ayo-badge">
        <span />
        <div>
          <strong>AYO</strong>
          <small>
            {speaking ? "Teaching now" : "Ready"}
          </small>
        </div>
      </div>

      <style jsx global>{`
        .v2-ayo-stage {
          overflow: hidden;
        }

        .v2-ayo-image-frame {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          overflow: hidden;
        }

        .v2-ayo-image {
          object-fit: contain !important;
          object-position: center bottom !important;
          width: 100% !important;
          height: 100% !important;
          max-width: 100% !important;
          max-height: 100% !important;
          transform: none !important;
        }

        .v2-ayo-stage.is-speaking .v2-ayo-image-frame {
          animation: ayo-natural-breathe 1.8s
            ease-in-out infinite alternate;
          transform-origin: center bottom;
        }

        @keyframes ayo-natural-breathe {
          from {
            transform: translateY(0) scale(1);
          }
          to {
            transform: translateY(-3px) scale(1.006);
          }
        }

        @media (max-width: 900px) {
          .v2-ayo-stage {
            overflow: visible;
          }

          .v2-ayo-badge {
            pointer-events: none;
          }

          .v2-ayo-badge strong {
            font-size: 10px;
          }

          .v2-ayo-badge small {
            font-size: 8px;
          }
        }
      `}</style>
    </aside>
  );
}
