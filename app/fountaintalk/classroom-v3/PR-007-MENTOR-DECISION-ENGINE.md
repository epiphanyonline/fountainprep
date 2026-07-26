# PR-007 — Mentor Decision Engine

## Goal

Add one deterministic, testable decision layer for Ayo while preserving RC1 behavior and keeping presentation inside the existing scene runtime.

## Added

- `engine/mentor/MentorDecisionEngine.ts` — evaluates policies and emits one primary action.
- `engine/mentor/MentorContext.ts` — immutable decision snapshot.
- `engine/mentor/MentorDecision.ts` — typed action and telemetry contracts.
- `engine/mentor/MentorPolicy.ts` — curiosity, memory, reflection, silence, celebration, and recommendation policies.
- `engine/mentor/ExperiencePlanner.ts` — advisory scene-to-intent plan.
- `engine/mentor/index.ts` — public exports.

## Integration

`MentorExperience` remains the compatibility facade. Enable the new engine with:

```ts
mentorExperience={{
  decisionEngine: {
    enabled: true,
    onTelemetry: (event) => analytics.track(event.type, event),
  },
}}
```

The flag defaults to `false`; existing RC1 journeys therefore keep their current behavior until explicitly enrolled.

## Rollout

1. Internal and automated testing.
2. Beta learner cohort.
3. 10%, 50%, then 100% traffic.
4. Remove the RC1 compatibility branch only after telemetry and learner outcomes are stable.

## Rollback

Set `decisionEngine.enabled` to `false`. No content migration or schema rollback is required.

## Architectural boundaries

- Mentor Decision Engine decides.
- Mentor Experience coordinates.
- Scene Orchestrator executes timing.
- Living Classroom renders.
