# Transactional Mock Exam Backend — Staging Implementation Contract

Status: **engineering specification, not production deployment**.
The existing `docs/exam-success/staging-schema-DRAFT.sql` is intentionally outside
`supabase/migrations`. Do not run it against project `cxuizqygogdzhcehhbmc`.

## Preflight blockers
- Provide an isolated Supabase staging project with separate project URL, JWT signing
  configuration and service credentials.
- Verify the exact 2027 syllabuses and question licensing; use synthetic fixtures only
  during technical validation.
- The current proposed schema is incomplete: `exam_papers` require immutable
  question snapshots, paper/subject sections, answer versions and exam entitlements.
- `exam_questions` needs separate structured option content and strict formats
  rather than assuming all questions are objective.
- No real payment charges or learner data should be used for staging testing.

## Five required server operations

1. **Start attempt** — Verify JWT identity through Supabase `auth.getUser` on
   the server (not a client-supplied learner ID), verify entitlement and published,
   approved paper, check usage quotas; in a transaction create attempt with server
   timestamps, paper version snapshot, `expires_at = transaction_timestamp() +
   duration`, and unique `(user_id,idempotency_key)`. On replay return the same
   attempt without creating another.
2. **Fetch questions** — Verify the attempt belongs to the authenticated user and
   is active. Read only the assigned immutable question versions and option
   display labels. Never expose `correct_option_id`, marking metadata or
   unreleased explanations to the browser.
3. **Save answer** — Use a single database transaction with
   `SELECT ... FOR UPDATE` on attempt, verify owner, state, server deadline and
   membership of question in the assigned paper. Validate selected option ID.
   Enforce unique request idempotency key; delayed request retries must not overwrite
   newer answers. Persist answer with monotonically increasing answer revision.
4. **Submit** — Lock attempt and require owner; read private answer keys and the
   frozen exam paper definition; mark and insert result in the SAME transaction
   using an immutable marking-policy version. Unanswered questions count as
   zero. Return saved result on duplicate submission. Finalise attempt exactly once.
5. **Expire** — Server-side job/submit-on-timeout must handle exams whose browser
   closes, applying explicit policy for grading on deadline or recording expired
   incomplete attempts. Browser clock is only visual guidance.

## Staging test matrix

| Test | Required result |
|---|---|
| Anonymous request | 401 / no row access |
| Student A accesses student B's attempt | 403/404 / no data |
| Student B guesses another student's question IDs | Forbidden |
| Save after submit/expiry | Closed |
| Delayed identical save retry after a newer answer | No overwrite |
| Same idempotency key with different payload | Conflict |
| Double submit in two concurrent requests | One result row; same score |
| Browser disconnects mid-paper | Reconnect and recover saved answers |
| Browser changes machine clock | Server exam expiry still enforced |
| Attempt reload after question-bank edit | Same immutable paper version |
| Submitted result after a refund | Defined entitlement policy |
| Direct anonymous Data API query of answer keys | Denied |
| Published vs draft questions | Draft unavailable |
| Invalid question options | Rejected |
| Score by board/variant and paper version | Reproducible |

## Release requirements
- All tests against staging, plus `npm test`, `npx tsc --noEmit`,
  `npm run build`, and existing live-tutoring payment regression tests.
- No database policy changes until separate production security-remediation
  migration is reviewed; fix pre-existing RLS issues as a dedicated release.
- Confirm Stripe Nigerian payment-method eligibility before checkout changes.
- Release exam modules behind separate default-off flag.
- No merge or production deployment without explicit approval.
