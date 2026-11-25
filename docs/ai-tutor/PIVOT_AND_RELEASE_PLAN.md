# Fountain Prep AI Tutor — Guided Preview and Pivot

## Product promise

**One Tutor. Every Exam.** The core product is preparation with a tutor
that teaches, diagnoses, reteaches, checks retention and plans revisions.
Practice questions and mock papers are learning tools, not the paid product.

## Preview available on feature branch

- /ai-tutor-preview (Vercel preview deployments only, 404 in production).
- Initial specialisations: JAMB Maths, JAMB Use of English, IELTS Reading.
- Uses original authored examples and prewritten branching teacher dialogue.
- Accepts diagnostic and follow-up answers; shows a simpler explanation
  when learners make a mistake or request help; gives a next-lesson suggestion.
- Persists only minimal demonstration state to browser localStorage.
- No account data, sessions in Supabase, billing, payment, learner points,
  production lesson booking data or generative AI calls.
- Preview labels must not imply an actual live AI tutor or true mastery score.

## Architecture for the future actual AI tutor

1. **Verified curricula**: exam-specific, versioned learning objectives and
   materials. Keep tutor's evidence tied to actual subject/board syllabus.
2. **Tutor state**: server-authenticated user, chosen exam, target date, topic,
   mastery evidence, previously taught examples and retention checkpoints.
3. **Controlled generation**: server-only model calls with restricted prompts,
   retrieved reviewed lesson content, explicit limits, context windows and
   response-format validation. Don't embed AI credentials in a browser.
4. **Pedagogical orchestration**: diagnose → teach → ask learner to explain →
   targeted questions → remediate → spaced review. Generated answers checked
   by deterministic graders for objective/mathematics tasks where possible.
5. **Safeguarding**: age-appropriate features, adult/parent controls where
   needed, content moderation, abuse protection, exam integrity, privacy
   protections and human escalation. Avoid predicting guaranteed exam scores.
6. **Financial controls**: verified identity, entitlement, rate limits, token
   budgets, usage reporting, circuit breakers and model cost measurement.
7. **Human tutor connection**: optional scheduled follow-up through existing
   Fountain Prep lesson flows only after isolated integration tests.
8. **Release**: staging DB, academic QA, usability testing, security review
   and explicit approval before enabling the live service.

## Existing Exam Success branch

Draft PR #2 holds optional exam scoring, question-bank drafting and weekly
mock infrastructure. It is deliberately separate. Do **not** merge all of
PR #2 into the tutor branch; import only individually reviewed pieces as
needed, retaining production-disabled payment functions.

## Required validation

- The independent teaching paths must adapt correctly to good, mistaken,
  repeated and incomplete answers.
- Browser restoration must reject malformed state.
- Preview-only route must not appear on the production site.
- No modifications to existing production lessons, booking, tutor reviews,
  parent login or Stripe routes.
- A single short walkthrough does not establish full learning mastery.
