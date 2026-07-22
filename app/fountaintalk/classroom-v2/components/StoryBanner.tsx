"use client";

import Image from "next/image";

import type {
  StoryArtwork,
} from "../storyArtworkRegistry";

type Props = {
  artwork: StoryArtwork;
};

export default function StoryBanner({
  artwork,
}: Props) {
  return (
    <aside
      className="v2-story-banner"
      style={{
        "--story-focus":
          artwork.focalPoint ?? "center",
      } as React.CSSProperties}
      aria-label={artwork.alt}
    >
      <Image
        src={artwork.src}
        alt={artwork.alt}
        fill
        priority={artwork.priority ?? false}
        sizes="(max-width: 900px) 100vw, 55vw"
        className="v2-story-banner-image"
      />

      {artwork.caption && (
        <p className="v2-story-banner-caption">
          {artwork.caption}
        </p>
      )}
    </aside>
  );
}
