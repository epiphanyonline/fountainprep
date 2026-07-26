# PR-008 — Journey State Engine

## Purpose

Adds a feature-flagged emotional journey state above scene playback. Existing journeys remain valid: authors may declare `journeyPhase`, while older scenes are mapped from `kind`.

## Runtime

`JourneyStateEngine` tracks:

- current scene and phase
- completed scene IDs
- start/update/completion timestamps
- resumable checkpoints
- phase, checkpoint, resume, and completion telemetry

Supported phases:

`arrival → curiosity → challenge → discovery → reflection → growth → celebration → invitation → complete`

## LivingClassroom integration

Enable incrementally:

```tsx
<LivingClassroom
  lesson={lesson}
  journeyState={{
    enabled: true,
    learnerId: learner.id,
    persistence: journeyPersistence,
    onTelemetry: analytics.track,
  }}
/>
```

The runtime restores a matching scene ID, checkpoints completed scenes, and marks the journey complete at the journey ending.

## Supabase integration

The package deliberately does not import Supabase. Implement `JourneyStatePersistence` in the host application so credentials, table names, row-level security, retries, and observability remain production-owned.

```ts
const journeyPersistence: JourneyStatePersistence = {
  async load(learnerId, lessonId) {
    // SELECT checkpoint for learnerId + lessonId
  },
  async save(checkpoint) {
    // UPSERT checkpoint using learnerId + lessonId as the unique key
  },
};
```

Suggested table fields: `learner_id`, `lesson_id`, `scene_id`, `scene_index`, `scene_count`, `phase`, `completed_scene_ids`, `started_at`, `updated_at`, `completed_at`, `version`.

## Compatibility and rollback

- `journeyState.enabled` defaults to false.
- Existing content requires no migration.
- Remove or disable the prop to return to PR-007 behavior.
- Checkpoints are versioned and invalid versions are ignored safely.

## Validation

- Journey state unit tests cover inference, transitions, persistence, resume, and completion.
- Core TypeScript build remains strict.
