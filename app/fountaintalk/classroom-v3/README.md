# FountainTalk Living Classroom V3

## Sprint 2.1 — Scene Orchestrator

This package advances the Sprint 1 scene renderer into an event-driven experience engine. It is intentionally academy-neutral: Bible, Wealth, Languages, Mathematics, Coding, biographies and professional skills all use the same runtime.

## Included

- `SceneOrchestrator` — compiles elapsed scene time into a complete directed scene state.
- Timeline reducer — supports phase, background, artwork, actors, narration, overlays, camera, ambience, interaction, memory, recommendations, celebration and completion events.
- Scene lifecycle — initialize, preload, intro, story, discovery, interaction, reflection, assessment, celebration, transition and complete.
- Camera controller — reusable cinematic presets and smooth viewport transforms.
- Character director — actor entrance, action, animation and exit state.
- Discovery/reflection interactions — pause the timeline until the learner responds.
- Ambient audio controller — scene atmosphere with safe autoplay fallback.
- Memory hooks — emitted once for persistence by the host app.
- Recommendation hooks — emitted once for Ayo's contextual academy guidance.
- Responsive Living Stage — layered background, artwork, characters, overlays, narration and interaction UI.
- David experience — a three-scene executable reference lesson.

## Install

Copy this folder to:

```text
app/fountaintalk/classroom-v3/
```

Use the client component:

```tsx
import { LivingClassroom, davidExperience } from "@/app/fountaintalk/classroom-v3";

export default function DemoPage() {
  return (
    <LivingClassroom
      lesson={davidExperience}
      onMemory={(hook) => console.log("Persist memory", hook)}
      onRecommendation={(hook) => console.log("Queue Ayo recommendation", hook)}
    />
  );
}
```

## Integration contract

The engine emits memory and recommendation hooks; it does not persist them itself. Connect these callbacks to the platform's API/database. This keeps rendering independent from learner data and subscription services.

## Migration

Keep Classroom V2 active. Migrate one flagship lesson through `adaptV2Scene`, validate its behavior, then expand academy by academy. Do not add academy-specific conditions to the engine.

## Next sprint

- Narration audio/TTS synchronization
- Story flashbacks and scene reconstruction
- Transition director between scenes
- Assessment result states
- Adaptive pacing profiles
- Persistent learner memory API adapter
- Knowledge graph node/edge contracts

---

## Sprint 3 add-on: Learner OS and Mentor Letters

See `SPRINT-3-LEARNER-OS.md` for preferred-name onboarding, editable classroom identity, learner profile contracts, personalization templates, and the weekly Mentor Letter Engine.


## Sprint 4 — Flagship vertical slice

This package now includes `David: Before the Giant`, a complete 10-chapter and 30-scene story journey, story validation, runtime conversion, completion evidence, and tests. See `SPRINT-4-DAVID-FLAGSHIP.md`.

## Sprint 5: Fountain Studio MVP

The package now exports a visual story library/editor, shared-runtime preview, validation panel, workflow domain, semantic publishing, immutable versions, and rollback support. See `SPRINT-5-FOUNTAIN-STUDIO-MVP.md`.

## V3 RC1 Mentor Experience

RC1 adds living memory recall, adaptive Ayo responses, cinematic direction, and a growth-focused journey ending. See `V3-RC1-MENTOR-EXPERIENCE.md` for host-app integration and rollback controls.

## PR-007 Mentor Decision Engine

Version 0.8.0 adds a feature-flagged mentor decision layer under `engine/mentor`. It selects one intentional action per scene, supports advisory experience planning, and emits typed telemetry without changing RC1 behavior by default. See `PR-007-MENTOR-DECISION-ENGINE.md`.

## PR-008: Journey State Engine

Journey progress can now be represented as learner-facing emotional phases rather than scene numbers alone. The engine is opt-in, supports authored or inferred phases, emits telemetry, and persists through a host-provided adapter. See `PR-008-JOURNEY-STATE-ENGINE.md`.

## FountainPrep Design System 1.0

The learner-facing visual system is located in `product/design-system`. In a Next.js host application, mount `product/app` and visit `/design-system` for the visual test page. The governing handbook is `DESIGN-SYSTEM-1.0.md`.
