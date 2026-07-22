"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  ClassroomScene,
} from "../types";

type ScenePlayerOptions = {
  scenes: ClassroomScene[];
};

export function useScenePlayer({
  scenes,
}: ScenePlayerOptions) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(
  null
);

  const scene = scenes[sceneIndex] ?? scenes[0];
  const isLastScene = sceneIndex >= scenes.length - 1;

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      globalThis.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopNarration = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }, []);

  const next = useCallback(() => {
    clearTimer();
    stopNarration();

    setSceneIndex((current) =>
      Math.min(current + 1, Math.max(scenes.length - 1, 0))
    );
  }, [clearTimer, scenes.length, stopNarration]);

  const previous = useCallback(() => {
    clearTimer();
    stopNarration();

    setSceneIndex((current) => Math.max(current - 1, 0));
  }, [clearTimer, stopNarration]);

  const speakScene = useCallback(
    (currentScene: ClassroomScene) => {
      if (
        typeof window === "undefined" ||
        !("speechSynthesis" in window)
      ) {
        if (
          currentScene.interactionMode === "lecture" &&
          currentScene.durationMs > 0
        ) {
          timerRef.current = globalThis.setTimeout(
            next,
            currentScene.durationMs
          );
        }
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(
        currentScene.narration
      );
      const voices = window.speechSynthesis.getVoices();

      utterance.voice =
        voices.find((voice) =>
          voice.lang.toLowerCase().startsWith("en-gb")
        ) ??
        voices.find((voice) =>
          voice.lang.toLowerCase().startsWith("en")
        ) ??
        null;

      utterance.lang = utterance.voice?.lang ?? "en-GB";
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => {
        setSpeaking(false);

        if (
          currentScene.interactionMode === "lecture" &&
          !paused &&
          !handRaised &&
          !isLastScene
        ) {
          timerRef.current = globalThis.setTimeout(next, 900);
        }
      };

      utterance.onerror = () => {
        setSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [handRaised, isLastScene, next, paused]
  );

  useEffect(() => {
    if (!started || paused || handRaised || !scene) return;

    clearTimer();
    speakScene(scene);

    return () => {
      clearTimer();
      stopNarration();
    };
  }, [
    clearTimer,
    handRaised,
    paused,
    scene,
    speakScene,
    started,
    stopNarration,
  ]);

  const start = useCallback(() => {
    setSceneIndex(0);
    setStarted(true);
    setPaused(false);
    setHandRaised(false);
  }, []);

  const togglePause = useCallback(() => {
    setPaused((current) => {
      const nextPaused = !current;

      if (nextPaused) {
        clearTimer();
        stopNarration();
      }

      return nextPaused;
    });
  }, [clearTimer, stopNarration]);

  const raiseHand = useCallback(() => {
    clearTimer();
    stopNarration();
    setHandRaised(true);
    setPaused(true);
  }, [clearTimer, stopNarration]);

  const resumeAfterQuestion = useCallback(() => {
    setHandRaised(false);
    setPaused(false);
  }, []);

  const progress = useMemo(
    () =>
      Math.round(
        ((sceneIndex + 1) / Math.max(scenes.length, 1)) *
          100
      ),
    [sceneIndex, scenes.length]
  );

  return {
    scene,
    sceneIndex,
    totalScenes: scenes.length,
    started,
    paused,
    speaking,
    handRaised,
    isLastScene,
    progress,
    start,
    next,
    previous,
    togglePause,
    raiseHand,
    resumeAfterQuestion,
  };
}