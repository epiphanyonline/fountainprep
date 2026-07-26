# PR-008 Change Log

- Added `engine/journey-state/` with typed phases, state, transitions, persistence, telemetry, and runtime engine.
- Added optional `journeyPhase` authoring field to `LivingScene`.
- Added journey phase context to Mentor Decision Engine calls.
- Added feature-flagged `LivingClassroom` integration for resume, checkpointing, phase display, and completion.
- Added scene-player `goTo()` support for checkpoint restoration.
- Added local-storage persistence helper and host/Supabase adapter contract.
- Added journey state unit tests and rollout/rollback documentation.
- Bumped package version to `0.9.0`.
