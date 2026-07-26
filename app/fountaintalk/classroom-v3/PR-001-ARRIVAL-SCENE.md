# PR-001 — Arrival Scene

## Purpose

Make entering Classroom V3 feel like returning to Ayo, rather than opening another lesson.
Arrival is implemented as the first Living Scene, preserving the platform principle: **Everything is a scene.**

## Learner experience

1. The classroom opens immediately.
2. Ayo welcomes the learner by preferred name.
3. Ayo can recall the learner's previous journey.
4. Ayo introduces today's promise with curiosity.
5. The learner selects **Let's begin**.
6. The existing Scene Orchestrator continues into lesson content.

## Integration

```tsx
<LivingClassroom
  lesson={lesson}
  arrival={{
    preferredName: profile.preferred_name,
    firstVisit: learnerStats.livingClassroomVisits === 0,
    journeyRecall: "Yesterday we stood with David on the hillside.",
    todayPromise: "Today we'll discover what everyone else failed to see.",
  }}
  onArrivalComplete={() => analytics.track("classroom_arrival_completed")}
/>
```

`arrivalEnabled` defaults to `true`. Set it to `false` only when the host application already provides an arrival scene.

## Changed surface

- Added `arrival` scene kind and lifecycle phase.
- Added `continue` interaction mode.
- Added `createArrivalScene` and `ArrivalContext`.
- Integrated arrival into `LivingClassroom` without a separate route or modal.
- Added focused arrival tests.

## Backward compatibility

Existing lessons and scenes require no changes. The host can disable the arrival scene with `arrivalEnabled={false}` during staged rollout or rollback.
