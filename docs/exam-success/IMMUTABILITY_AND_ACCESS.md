# Exam paper immutability and answer-key boundary

This is a design checklist for the first staging migration. The current
`staging-schema-DRAFT.sql` must **not** be applied without these corrections.

## Versioned content

A learner's attempt must reference a frozen, reviewed paper revision.
A paper revision includes:
- exam board, examination variant, country and syllabus year;
- ordered sections and subject-specific scoring rules;
- question revision IDs (not mutable question IDs alone);
- option revision IDs and review/provenance metadata;
- marking policy revision and total marks;
- release and retirement timestamps.

After a paper is published or attempted, changing any question, options,
question weight, duration or answer key must create a **new paper revision**.
The previous revision stays readable for authorised historical scoring and
audit, but cannot be changed or removed while attempts depend on it.

## Strict access separation

Browser payload: prompt, approved media URLs, option labels, assigned order,
attempt ID, authoritative expires_at and answer-saving revision.

Never send before exam submission: correct answer IDs, hidden explanations,
other learners' answers, internal reviewers' notes, answer-key schema names,
or grading criteria intended only for trained reviewers.

Question source and licensing details are visible to admin/reviewers, not
necessarily to learners.

For IELTS Speaking/Writing or WAEC/NECO theory, use a separate rubric-led
workflow with mandatory declaration that AI marks are estimates unless a
qualified human has validated them. Never use the objective scorer for those.

## Atomic staging operations (security invariants)

- `start_attempt`: lock published paper revision, verify entitlement and
  request key, create one attempt with DB timestamps.
- `save_answer`: row-lock owned active attempt; validate question membership
  and option; enforce saved-answer revision and request idempotency.
- `submit_attempt`: row-lock attempt; atomically move state and score against
  frozen private answers; on repeat return exact saved result.
- `expire_attempt`: server-side deadline and policy for grading answers
  saved before timeout, even when user is disconnected.

All transactions run with least-privilege server credentials; never expose a
service role key to frontend code. Design RLS for both owner reads and
admin reporting; browser has no direct write grants.

## Existing draft schema blockers

1. `exam_questions` should distinguish reusable educational content
   from exam-specific question revisions and support non-objective formats.
2. `exam_paper_questions` needs a frozen order and question revision.
3. Answer-key records should reference frozen question revisions.
4. A documented unique request-key table and answer revision are required.
5. The published paper's full shape and mark allocation must be validated.
6. Timers are server-authoritative, with explicitly specified expire policy.
7. Paper creation/administration permissions require role-safe RLS and
   protected write procedures.
8. Retention and consent rules are required for IELTS recordings and minors.

This document is design-only and does not authorise production rollout.
