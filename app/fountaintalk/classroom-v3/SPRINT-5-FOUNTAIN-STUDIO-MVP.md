# Sprint 5 — Fountain Studio MVP

This release introduces the first mergeable authoring surface for Living Classroom stories.

## Included

- Searchable, filterable story library
- Metadata and scene form editing
- Shared Living Classroom preview (no duplicate renderer)
- Real-time story validation
- Draft → Review → Approved → Published workflow
- Semantic version checks and immutable published snapshots
- Rollback to any published version as a new draft
- In-memory repository suitable for UI development and tests
- David flagship story seeded as editable content
- Responsive, keyboard-operable Studio UI
- Unit tests for workflow, publishing, and immutable edits

## Integration

```tsx
import { FountainStudioApp, studioSeed } from "@fountainprep/living-classroom-v3";
import "@fountainprep/living-classroom-v3/studio/styles/studio.css";

export default function StudioPage() {
  return <FountainStudioApp seed={studioSeed} />;
}
```

## Persistence boundary

`MemoryStudioRepository` intentionally implements the `StudioRepository` contract. Replace it with your database/API adapter without changing Studio components.

Required repository methods:

```ts
interface StudioRepository {
  list(): Promise<StudioStoryRecord[]>;
  get(id: string): Promise<StudioStoryRecord | null>;
  save(record: StudioStoryRecord): Promise<StudioStoryRecord>;
}
```

## Publishing safety

Publishing succeeds only when:

1. The story passes `validateStory` with no errors.
2. The record is already approved.
3. The caller supplies the current version.
4. The next semantic version is greater than the current version.

Every published version stores an immutable story snapshot.

## Next production step

Implement a Postgres-backed `StudioRepository` plus authentication/authorization around workflow actions. The authoring and publishing domain contracts do not need to change.
