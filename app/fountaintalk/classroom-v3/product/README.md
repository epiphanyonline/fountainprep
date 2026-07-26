# FountainPrep Product Experience — Milestone 1

This folder is a drop-in Next.js 15 App Router product shell built around the existing Living Classroom engine.

## Routes

- `/welcome` — first arrival with the final approved copy: “I'm Ayo. I'll be your tutor.”
- `/home` — one clear continuation action
- `/academies/bible` — calm Bible Academy journey library
- `/journeys/david` — six-episode David journey
- `/journeys/david/classroom` — interactive classroom product page
- `/reflection` — one-question reflection flow
- `/profile` — learning journal, not a settings dashboard

## Integration

1. Copy `product/app`, `product/components`, and `product/content` into the host Next.js application.
2. Merge `product/app/product.css` into the host global stylesheet or import it from the product route layout.
3. Replace the demonstration classroom body in `journeys/david/classroom/page.tsx` with the existing `LivingClassroom` component and the David journey content.
4. Replace demonstration progress and reflections with Supabase queries using the authenticated learner id.
5. Protect authenticated routes with the host application's existing Supabase middleware.

No onboarding questionnaire is included. Ayo learns through the learner's real journey and reflections.
