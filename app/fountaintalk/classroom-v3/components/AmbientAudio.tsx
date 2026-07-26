"use client";

import { useEffect, useRef } from "react";

export default function AmbientAudio({ src, volume = 0.16, loop = true, enabled = true }: { src?: string; volume?: number; loop?: boolean; enabled?: boolean }) {
  const ref = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = ref.current;
    if (!audio || !src) return;
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.loop = loop;
    if (enabled) void audio.play().catch(() => undefined);
    else audio.pause();
    return () => audio.pause();
  }, [enabled, loop, src, volume]);

  if (!src) return null;
  return <audio ref={ref} src={src} preload="auto" aria-hidden />;
}
