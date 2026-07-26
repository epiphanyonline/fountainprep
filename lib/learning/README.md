# Fountain Learning Engine — Domain Foundation

This folder is the canonical, academy-neutral domain layer for FountainPrep.

## Design rules

1. No academy-specific logic belongs here.
2. UI components may import this layer; this layer must not import UI components.
3. Supabase row types should be mapped into these domain types at repository boundaries.
4. Existing content should migrate through `legacy-adapters.ts` rather than being rewritten all at once.
5. Episode completion is calculated centrally by `calculateEpisodeCompletion`.

## Hierarchy

`Academy → Pathway → Journey → Episode → Activity`

## First integration target

Use the adapters to connect `app/fountainprep/content/types.ts` to this model. After that, connect Living Classroom V3 scenes to `EpisodeSection` and `Activity` without changing its presentation layer.
