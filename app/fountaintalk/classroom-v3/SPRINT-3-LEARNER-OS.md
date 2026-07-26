# Sprint 3 — Learner Identity and Mentor Letters

This increment adds the first production-shaped Learner OS capability to Living Classroom V3.

## Included

- Preferred-name onboarding and editable preferred-name settings
- Separation between official account name and classroom preferred name
- Learner profile model, browser storage adapter, missions, growth signals, and mentor memories
- Safe `{{preferredName}}` narration templates
- Mentor Letter Engine supporting weekly, welcome, birthday, anniversary, academy-completion, and encouragement letters
- Letter eligibility preferences
- Reusable letter card and a complete weekly-letter example

## Integration

```tsx
const stored = await profileStore.load(user.id);

if (!stored) {
  return <PreferredNameOnboarding onContinue={async preferredName => {
    const profile = createLearnerProfile({ learnerId: user.id, accountName: user.name, preferredName });
    await profileStore.save(profile);
  }} />;
}
```

Render personalized scene narration without putting learner-specific text in curriculum data:

```ts
const narration = renderLearnerTemplate(scene.narration ?? "", profile, {
  academyName: "Bible Academy",
});
```

Generate a weekly letter on the server from real weekly activity aggregates, save it, and expose it in the learner journal. The included browser store is a development adapter only; production should use the application database.

## Privacy and product rules

- Preferred name never overwrites legal/account identity.
- Certificates, invoices, identity verification, and institutional records use official profile fields.
- Learners can disable mentor letters and personalized narration.
- Ayo should use the learner's name sparingly: greetings, encouragement, important prompts, and celebrations.
- Letter claims must be derived from real learner events. Do not invent progress or emotional conclusions.
