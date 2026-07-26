"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LivingScene, MemoryHook, RecommendationHook } from "../engine/types";
import { orchestrateScene } from "../engine/SceneOrchestrator";

export interface SceneOrchestratorCallbacks {
  onMemoryHook?: (hook: MemoryHook) => void;
  onRecommendationHook?: (hook: RecommendationHook) => void;
  onSceneComplete?: (scene: LivingScene) => void;
  onInteractionResolved?: (scene: LivingScene, answer?: string) => void;
}

export function useSceneOrchestrator(
  scenes: LivingScene[],
  callbacks: SceneOrchestratorCallbacks = {},
) {
  const [started, setStarted] = useState(false);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interactionResolved, setInteractionResolved] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const frameRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);
  const firedRef = useRef(new Set<string>());
  const scene = scenes[sceneIndex];

  useEffect(() => {
    setElapsedMs(0);
    setPaused(false);
    setInteractionResolved(false);
    lastRef.current = null;
    firedRef.current.clear();
  }, [sceneIndex]);

  const orchestrated = useMemo(
    () => (scene ? orchestrateScene(scene, elapsedMs) : null),
    [scene, elapsedMs],
  );

  const blockedByInteraction = Boolean(
    orchestrated?.director.shouldPauseForInteraction && !interactionResolved,
  );

  useEffect(() => {
    if (!orchestrated) return;

    for (const hook of orchestrated.snapshot.memoryHooks) {
      const key = `memory:${hook.id}`;
      if (!firedRef.current.has(key)) {
        firedRef.current.add(key);
        callbacks.onMemoryHook?.(hook);
      }
    }

    for (const hook of orchestrated.snapshot.recommendationHooks) {
      const key = `recommendation:${hook.id}`;
      if (!firedRef.current.has(key)) {
        firedRef.current.add(key);
        callbacks.onRecommendationHook?.(hook);
      }
    }

    if (orchestrated.snapshot.complete && scene) {
      const key = `complete:${scene.id}`;
      if (!firedRef.current.has(key)) {
        firedRef.current.add(key);
        callbacks.onSceneComplete?.(scene);
      }
    }
  }, [callbacks, orchestrated, scene]);

  useEffect(() => {
    if (!started || paused || blockedByInteraction || !scene) return;

    const tick = (now: number) => {
      const previous = lastRef.current ?? now;
      lastRef.current = now;
      setElapsedMs((value) => value + Math.min(now - previous, 100));
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      lastRef.current = null;
    };
  }, [blockedByInteraction, paused, scene, started]);

  const next = useCallback(() => {
    setSceneIndex((index) => Math.min(index + 1, Math.max(0, scenes.length - 1)));
  }, [scenes.length]);

  const previous = useCallback(() => {
    setSceneIndex((index) => Math.max(index - 1, 0));
  }, []);

  const goTo = useCallback((nextIndex: number) => {
    setSceneIndex(Math.min(Math.max(0, nextIndex), Math.max(0, scenes.length - 1)));
  }, [scenes.length]);

  const resolveInteraction = useCallback((answer?: string) => {
    if (scene) callbacks.onInteractionResolved?.(scene, answer);
    setInteractionResolved(true);
    setPaused(false);
    lastRef.current = null;
  }, [callbacks, scene]);

  return {
    started,
    start: () => setStarted(true),
    scene,
    sceneIndex,
    elapsedMs,
    orchestrated,
    paused,
    blockedByInteraction,
    interactionResolved,
    togglePause: () => setPaused((value) => !value),
    seek: (nextMs: number) => setElapsedMs(Math.max(0, nextMs)),
    resolveInteraction,
    next,
    previous,
    goTo,
    isLastScene: sceneIndex === scenes.length - 1,
    progress: scenes.length ? Math.round(((sceneIndex + 1) / scenes.length) * 100) : 0,
  };
}
