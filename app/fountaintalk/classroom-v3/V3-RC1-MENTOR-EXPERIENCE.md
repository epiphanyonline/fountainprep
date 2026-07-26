# V3 RC1 — Mentor Experience

This release combines PR-003 through PR-006 behind composable, academy-independent modules.

## Included

- **Living Memory:** selects a relevant learner memory and lets Ayo recall it naturally in the opening content scene.
- **Adaptive Discovery:** interprets themes in learner responses and gives a two-step Ayo response before the story continues.
- **Cinematic Moments:** declarative camera beats, narration delays, interaction lead time, and intentional silence windows.
- **Journey Ending:** replaces “Lesson complete” with a growth reflection, remembered moment, and gentle next invitation.

## Integration

```tsx
<LivingClassroom
  lesson={lesson}
  arrival={{ preferredName: profile.preferred_name }}
  mentorExperience={{
    memory: { memories: learnerMemories },
    ending: {
      learnerName: profile.preferred_name,
      growthTheme: "courage",
      nextInvitation: "Next, we can explore courage through Esther.",
    },
  }}
  onMemory={persistMemoryHook}
  onConversationResolved={persistLearnerResponse}
  onJourneyComplete={markJourneyComplete}
/>
```

## Rollback

- Disable the mentor ending with `mentorExperience={{ ending: false }}`.
- Omit `memory` to disable recall.
- Existing interactions without `themes` still receive a safe, non-judgmental Ayo response.
- Existing scenes without `cinematic` retain their current timeline behavior.

## Supabase boundary

The package does not create database clients. The host app supplies learner memories and persists callbacks, keeping auth, RLS, and deployment concerns inside FountainPrep.
