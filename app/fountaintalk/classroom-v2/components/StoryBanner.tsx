"use client";

import Image from "next/image";
import {
  useMemo,
  useState,
} from "react";

import type {
  StoryArtwork,
} from "../storyArtworkRegistry";

type Props = {
  artwork: StoryArtwork;
};

function alternateExtension(src: string): string | null {
  if (src.endsWith(".svg")) {
    return src.replace(/\.svg$/i, ".png");
  }

  if (src.endsWith(".png")) {
    return src.replace(/\.png$/i, ".svg");
  }

  return null;
}

export default function StoryBanner({
  artwork,
}: Props) {
  const candidates = useMemo(() => {
    const alternate = alternateExtension(artwork.src);

    return alternate
      ? [artwork.src, alternate]
      : [artwork.src];
  }, [artwork.src]);

  const [candidateIndex, setCandidateIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  const src = candidates[candidateIndex];

  return (
    <aside
      className={`v2-story-banner ${
        failed ? "is-missing" : ""
      }`}
      style={{
        "--story-focus":
          artwork.focalPoint ?? "center",
      } as React.CSSProperties}
      aria-label={artwork.alt}
    >
      {!failed && (
        <Image
          key={src}
          src={src}
          alt={artwork.alt}
          fill
          priority={artwork.priority ?? false}
          sizes="(max-width: 900px) 100vw, 55vw"
          className="v2-story-banner-image"
          onError={() => {
            if (candidateIndex < candidates.length - 1) {
              setCandidateIndex((current) => current + 1);
            } else {
              setFailed(true);
            }
          }}
        />
      )}

      {failed && (
        <div className="v2-story-banner-fallback">
          <span>🎬</span>
          <strong>{artwork.alt}</strong>
        </div>
      )}

      {artwork.caption && (
        <p className="v2-story-banner-caption">
          {artwork.caption}
        </p>
      )}
    </aside>
  );
}
