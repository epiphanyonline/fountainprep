"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LivingLesson, LivingScene, MemoryHook, RecommendationHook } from "../engine/types";
import { ARRIVAL_SCENE_ID, createArrivalScene, type ArrivalContext } from "../engine/arrival";
import { JOURNEY_ENDING_SCENE_ID } from "../engine/journey/JourneyEndingDirector";
import { conductMentorExperience, type MentorExperienceContext } from "../engine/mentorExperience";
import {
  JourneyStateEngine,
  type JourneyCheckpoint,
  type JourneyStatePersistence,
  type JourneyStateTelemetryEvent,
  type JourneyTransition,
} from "../engine/journey-state";
import { useSceneOrchestrator } from "../hooks/useSceneOrchestrator";
import LivingStage from "./LivingStage";


export interface JourneyStateConfig {
  /** Safe rollout switch. Defaults to false. */
  enabled?: boolean;
  learnerId: string;
  persistence?: JourneyStatePersistence;
  /** Resume the last checkpoint when one exists. Defaults to true. */
  resume?: boolean;
  /** Save after every completed scene. Defaults to true. */
  checkpointEveryScene?: boolean;
  onTransition?: (transition: JourneyTransition) => void;
  onCheckpoint?: (checkpoint: JourneyCheckpoint) => void;
  onTelemetry?: (event: JourneyStateTelemetryEvent) => void;
}

export interface LivingClassroomProps {
  lesson: LivingLesson;
  arrival?: ArrivalContext;
  arrivalEnabled?: boolean;
  /** Memory recall and journey-ending configuration. Set ending:false for rollback. */
  mentorExperience?: MentorExperienceContext;
  journeyState?: JourneyStateConfig;
  onMemory?: (hook: MemoryHook) => void;
  onRecommendation?: (hook: RecommendationHook) => void;
  onArrivalComplete?: () => void;
  onConversationResolved?: (scene: LivingScene, answer?: string) => void;
  onJourneyComplete?: () => void;
}

export default function LivingClassroom({
  lesson,
  arrival,
  arrivalEnabled = true,
  mentorExperience,
  journeyState,
  onMemory,
  onRecommendation,
  onArrivalComplete,
  onConversationResolved,
  onJourneyComplete,
}: LivingClassroomProps) {
  const [ambientEnabled, setAmbientEnabled] = useState(true);
  const restoredRef = useRef(false);
  const scenes = useMemo(() => {
    const conducted = conductMentorExperience(lesson, mentorExperience);
    return arrivalEnabled ? [createArrivalScene(lesson, arrival), ...conducted] : conducted;
  }, [arrival, arrivalEnabled, lesson, mentorExperience]);

  const journeyEngine = useMemo(() => {
    if (!journeyState?.enabled) return null;
    return new JourneyStateEngine({
      learnerId: journeyState.learnerId,
      lessonId: lesson.id,
      persistence: journeyState.persistence,
      onTransition: journeyState.onTransition,
      onTelemetry: journeyState.onTelemetry,
    });
  }, [
    journeyState?.enabled,
    journeyState?.learnerId,
    journeyState?.persistence,
    journeyState?.onTransition,
    journeyState?.onTelemetry,
    lesson.id,
  ]);

  const player = useSceneOrchestrator(scenes, {
    onMemoryHook: onMemory,
    onRecommendationHook: onRecommendation,
    onInteractionResolved: onConversationResolved,
    onSceneComplete: (scene) => {
      if (!journeyEngine) return;
      journeyEngine.completeScene(scene.id);
      if (journeyState?.checkpointEveryScene !== false) {
        void journeyEngine.checkpoint().then((checkpoint) => {
          if (checkpoint) journeyState?.onCheckpoint?.(checkpoint);
        });
      }
    },
  });

  useEffect(() => {
    if (!player.started) player.start();
  }, [player]);

  useEffect(() => {
    restoredRef.current = false;
  }, [journeyEngine]);

  useEffect(() => {
    if (!journeyEngine || restoredRef.current || journeyState?.resume === false) return;
    restoredRef.current = true;
    void journeyEngine.restore().then((checkpoint) => {
      if (!checkpoint) return;
      const restoredIndex = scenes.findIndex((scene) => scene.id === checkpoint.sceneId);
      if (restoredIndex >= 0) player.goTo(restoredIndex);
    });
  }, [journeyEngine, journeyState?.resume, player, scenes]);

  useEffect(() => {
    if (!journeyEngine || !player.scene) return;
    journeyEngine.enter(player.scene, player.sceneIndex, scenes.length);
  }, [journeyEngine, player.scene, player.sceneIndex, scenes.length]);

  if (!player.scene || !player.orchestrated) return null;

  const isArrival = player.scene.id === ARRIVAL_SCENE_ID;
  const isEnding = player.scene.id === JOURNEY_ENDING_SCENE_ID;
  const contentSceneIndex = Math.max(0, player.sceneIndex - (arrivalEnabled ? 1 : 0));
  const contentSceneNumber = Math.min(lesson.scenes.length, contentSceneIndex + 1);
  const sceneProgress = player.orchestrated.durationMs
    ? Math.min(100, Math.round((player.elapsedMs / player.orchestrated.durationMs) * 100))
    : 0;

  const resolveInteraction = (answer?: string) => {
    player.resolveInteraction(answer);
    if (isArrival) {
      onArrivalComplete?.();
      player.next();
    } else if (isEnding) {
      if (journeyEngine) void journeyEngine.complete();
      onJourneyComplete?.();
    }
  };

  return (
    <main className={`living-shell ${isArrival ? "is-arrival" : ""} ${isEnding ? "is-ending" : ""}`}>
      <header>
        <div className="brand"><small>FountainTalk</small><strong>{lesson.title}</strong></div>
        <div className="progress">
          <span>{isArrival ? "Arrival" : isEnding ? "Journey reflection" : `Scene ${contentSceneNumber} of ${lesson.scenes.length} · ${journeyEngine?.current?.phase ?? player.orchestrated.snapshot.phase}`}</span>
          <i><b style={{ width: `${isArrival ? 0 : isEnding ? 100 : sceneProgress}%` }} /></i>
        </div>
        <strong>{isArrival ? "" : isEnding ? "" : `${Math.round((contentSceneNumber / Math.max(1, lesson.scenes.length)) * 100)}%`}</strong>
      </header>

      <LivingStage
        scene={player.scene}
        orchestrated={player.orchestrated}
        onInteractionResolved={resolveInteraction}
        ambientEnabled={ambientEnabled && !player.paused}
        interactionResolved={player.interactionResolved}
      />

      {!isArrival && !isEnding && (
        <footer>
          <button onClick={player.previous} disabled={contentSceneIndex === 0}>← Previous</button>
          <div className="center-controls">
            <button onClick={player.togglePause}>{player.paused ? "Resume" : "Pause"}</button>
            <button onClick={() => setAmbientEnabled((value) => !value)}>{ambientEnabled ? "Sound on" : "Sound off"}</button>
          </div>
          <button onClick={player.next} disabled={player.isLastScene || player.blockedByInteraction}>Next scene →</button>
        </footer>
      )}

      <style jsx>{`
        .living-shell{min-height:100vh;background:#050812;color:white;padding:18px}.living-shell.is-arrival,.living-shell.is-ending{display:grid;grid-template-rows:auto 1fr}.living-shell.is-arrival :global(.living-stage),.living-shell.is-ending :global(.living-stage){min-height:calc(100vh - 98px)}
        header,footer{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:16px;padding:14px}header>strong{justify-self:end}.brand{display:flex;flex-direction:column}.brand small{color:#a78bfa;text-transform:uppercase;letter-spacing:.1em;font-weight:900}.progress{min-width:340px}.progress span{display:block;text-align:center;font-size:12px;color:#cbd5e1;text-transform:capitalize}.progress i{display:block;height:5px;margin-top:7px;background:#253047;border-radius:99px}.progress b{display:block;height:100%;background:#8b5cf6;border-radius:inherit;transition:width .2s linear}footer button{padding:12px 16px;border:1px solid #334155;border-radius:10px;background:#111827;color:white;font-weight:800}footer button:disabled{opacity:.4}footer>button:last-child{justify-self:end}.center-controls{display:flex;gap:8px}
        @media(max-width:760px){header{grid-template-columns:1fr auto}.progress{grid-column:1/-1;grid-row:2;min-width:0}footer{grid-template-columns:1fr 1fr}.center-controls{display:none}footer>button:last-child{justify-self:stretch}.living-shell.is-arrival :global(.living-stage),.living-shell.is-ending :global(.living-stage){min-height:calc(100vh - 126px)}}
      `}</style>
    </main>
  );
}
