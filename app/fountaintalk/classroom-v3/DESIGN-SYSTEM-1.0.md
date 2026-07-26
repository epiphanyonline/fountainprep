# FountainPrep Design System 1.0

## Purpose

FountainPrep should feel like opening a beautiful book, not operating education software. The system is calm, warm, timeless, cinematic, spacious and thoughtful.

## Product rules

1. Every screen has one primary action.
2. A learner sees no more than seven major choices at once.
3. Whitespace is functional, not decorative.
4. Typography carries hierarchy before colour does.
5. Every screen makes the next step obvious within five seconds.
6. Motion supports attention and never competes with it.
7. Ayo says “I’ll be your tutor.” Learner-facing copy does not call him a mentor.
8. Personalisation is learned gradually through use, not demanded through onboarding questionnaires.

## Foundations

### Colour

- Canvas `#F7F3EB`: default app background.
- Paper `#FFFDF8`: raised reading surfaces.
- Ink `#211F1B`: primary text.
- Muted `#726D64`: secondary text.
- Forest `#365244`: trusted primary action.
- Olive `#71805B`: supporting accent.
- Gold `#C59A45`: progress, focus and story detail.
- Sky `#AFC6D4`: gentle informational accent.
- Night `#101722`: classroom and cinematic contexts.

Semantic colours must never be the only carrier of meaning.

### Typography

- Display and headings: Fraunces, with Georgia fallback.
- Body and interface: Inter, with system sans-serif fallback.
- Comfortable body line length: 45–75 characters.
- Minimum body size: 16px.

### Spacing

Use a 4px base scale, with 8px as the normal rhythm. Major sections use 48–96px vertical spacing. Dense information displays are not part of the learner-facing language.

### Shape

- Controls: 10–16px radius.
- Cards: 20–32px radius.
- Pill controls are reserved for compact actions and filters.

### Motion

- Quick feedback: 180ms.
- Calm transitions: 320ms.
- Cinematic scene transitions: up to 700ms.
- Honour `prefers-reduced-motion` everywhere.
- Avoid bounce, confetti, shaking and looping attention effects.

## Core components

- Button: primary, secondary and quiet variants.
- Card: paper-like content surface.
- JourneyTile: visual entry point into a story journey.
- EpisodeRow: ordered story progression.
- Progress: subtle, non-competitive journey progress.
- AyoMessage: tutor intervention with compact identity treatment.
- Reflection surface: one prompt, one writing area, one next action.

## Layout patterns

### Welcome
Centered, minimal and invitation-led. One button.

### Home
Continue the active journey first. Recommendations are secondary.

### Academy
Featured journey, then a restrained catalogue. Avoid course-marketplace density.

### Journey
Story premise, current progress and ordered episodes.

### Classroom
Night palette, immersive visual field and limited interface chrome.

### Reflection
One reflective question. No grading language.

### Profile
A learning journal, not an analytics dashboard.

## Accessibility baseline

- WCAG AA contrast for text and essential controls.
- Visible `:focus-visible` state.
- 44px minimum touch targets.
- Semantic headings and landmarks.
- Text alternatives for meaningful artwork.
- Reduced-motion support.
- Keyboard access for all interactions.
- Never disable zoom.

## Voice

Ayo is warm, concise, clear and curious. He is the learner’s tutor.

Use:

> Before there was a king, there was a shepherd.

Avoid:

> Today we will complete lesson one and review the following objectives.

## Art direction

- Painterly digital realism, not photography and not cartoon styling.
- Golden-hour and soft natural light.
- Earth, stone, linen, olive and dusk colours.
- Cinematic framing with one clear focal point.
- Human expressions should be subtle and approachable.
- Avoid glossy stock imagery, visual spectacle and crowded compositions.

## Engineering source of truth

- Tokens: `product/design-system/foundations/tokens.ts`
- Components: `product/design-system/components/`
- Global implementation: `product/app/product.css`
- Visual test page: `/design-system`
