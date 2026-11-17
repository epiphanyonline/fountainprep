# Fountain Prep — Exam Success / IELTS foundation (development only)

Status: **design and isolated utility only**. No production routes, database migrations,
payment changes, feature flags or deployment changes in this branch.

## Scope
- Nigeria-first: JAMB UTME, WAEC WASSCE, NECO SSCE.
- IELTS Academic and General Training; shared global examination specification.
- Shared topic teaching where accurate; separate examination-year, paper, scoring and licensing rules.
- Combined Mock Exam Centre with diagnostic, practice and full mock modes.
- Reuse current authentication, academy progress, Stripe checkout and live tutoring without changing them.

## Existing platform evidence (read-only audit, 2026-11-17)
- Supabase project `cxuizqygogdzhcehhbmc` on the connected Fountainprep account.
- Existing tables: `student_academy_progress`, `academy_purchases`,
  `academy_payment_attempts`, `academy_subscriptions`,
  `student_academy_achievements`, `curriculum_lessons`, `lesson_bookings`.
- **No public tables named for exam, question, assessment or mock** currently.
- Five IELTS progress records refer to `ielts-academic-foundation` (four
  completed, one in-progress), distinct from the current source file's
  `ielts-foundation`. Preserve both identities; do not rewrite learner history.
- Current `proxy.ts` redirects protected self-paced routes and
  `FEATURES.SELF_PACED_ACADEMY` is false.
- Stripe webhook contains existing live-booking, academy-subscription and
  academy-purchase paths. Do not alter existing webhook branches.

## Proposed future tables (NOT created)
1. `exam_boards`: JAMB, WAEC, NECO, IELTS.
2. `exam_specifications`: board, exam name, country, examination year,
   variant (IELTS Academic/General), duration, sections, scoring policy,
   provenance/source, status.
3. `exam_subjects`: syllabus version, subject code, scope, availability.
4. `exam_topics` and `exam_topic_lessons`: reusable concepts linked to
   multiple exam-specific syllabuses.
5. `exam_questions`: question id, format, prompt, assets, subject, topic,
   source/licence, author, review status, difficulty, immutable version.
6. `exam_question_options` and private `exam_answer_keys`: option text and
   correct answers separated from learner-facing payloads.
7. `exam_papers` and `exam_paper_questions`: immutable versioned blueprints,
   sections, order, weights, release window.
8. `exam_attempts`: user/student, paper version, started/submitted/expires,
   exam mode, resume token policy, status.
9. `exam_attempt_answers`: attempt/question, answer version, saved_at,
   server-side ownership and time checks.
10. `exam_results` and `exam_feedback`: scores, rubric versions,
    uncertainty in AI estimates, competency breakdown, next lessons.
11. `exam_entitlements`: purchase reference, exam/pack access and expiry,
    AI evaluation quota, refund/revocation status.

### Database protections (before any migration)
- Every new exposed table has RLS and least-privilege policies.
- Draft answer keys and paid question content should be accessed only through
  authorised server APIs; don't publish answer keys through client views or
  unrestricted SQL grants.
- Students may read only their attempts, answers and results; examiner/admin
  permissions must be independently verified on the server.
- Immutable snapshots for started papers; safe autosave with idempotent
  submissions; server timestamps control expiry.
- Never accept exam scores supplied by the browser.
- Encrypt/limit retention for IELTS microphone recordings; age-aware consent.
- Never claim unofficial AI IELTS band estimates are certified scores.

## Delivery sequence
1. Security policy review and rollback plan — no direct production changes.
2. Recover historical IELTS curriculum definitions where available.
3. Approve syllabus versions, authored/licensed question sources and review workflow.
4. Add separate dev/staging migrations and server APIs with tests.
5. Build Mock Exam Centre UI behind disabled feature flag.
6. Run permissions, payment, concurrency, interrupted network, autosave, scoring
   and regression tests against staging before discussing production rollout.

## Security finding requiring a separate controlled change
Supabase advisor reports ten public tables with RLS disabled, including
`support_threads`, `support_messages`, five `curriculum_*` tables and three
`tutor_*` tables; four public views also flagged as security-definer.
These are **existing production risks**. No policies were changed during this work.

Safe remediation requires:
1. Inventory actual client/server access and present policies, grants, views.
2. Identify tables meant for anonymous public reading vs private communications.
3. Prepare and rehearse role-specific SELECT/INSERT/UPDATE/DELETE policies in staging.
4. Regression-test support workflows, curriculum pages, tutor/admin workflows.
5. Arrange a backup, rollback instructions and controlled change window.
6. Only then, with an explicit production-change approval, enable policies/grants.

**Do not paste a blanket `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` into
production**: this can interrupt active learning and support without correct policies.

## Current work items
- `features/exam-success/objectiveScoring.ts`: pure server-oriented scoring
  primitive for *single-choice* questions only; no production integration.
- `features/exam-success/objectiveScoring.test.ts`: unit test cases.
- No mock-exam products, real exam questions, customer payments or learner-facing
  access have been activated.

## Open validation gates
- Run unit tests and TypeScript/build on the branch in a safe CI or clone.
- Confirm historical IELTS code using earlier commit trees/local backups.
- Verify 2027 exam board syllabuses and format before creating exam papers.
- Validate NGN payment options with the existing Stripe account.
