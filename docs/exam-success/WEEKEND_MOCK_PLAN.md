# Large Question Bank + Weekly Paid Mock — Design and Launch Gates

## Integration with the existing app

Everything lives under Fountain Prep's existing Next.js repository and uses
isolated `features/exam-success/` code. The established
`/exam-success-preview` route renders preview-only sample material. Flags
`FEATURES.EXAM_SUCCESS` and `FEATURES.WEEKEND_PAID_MOCKS` are both
**false**. Existing `SELF_PACED_ACADEMY` remains unchanged. No live
tutoring, billing, booking, Stripe or authentication routes are altered.

## Large reviewed question bank

Model each question with:
- board, exam variant, syllabus year, subject, topic and subtopic;
- question type, complexity, difficulty, mark weighting and duration;
- accessible prompt/media and answer options where applicable;
- private marking key or rubric stored separately;
- canonical duplicate-group identity (paraphrases must not appear in one paper);
- author, licensed source, date, reviewer, publication state, revision;
- lifecycle history and accessibility/translation review when applicable.

Publish only after an academic reviewer approves both question and answer
key. Synthetic example questions in the preview are not a production question
bank. Don't claim copyrighted past papers are licensed without permission.

For scale, build subject/topic coverage inventories before committing
quantity targets. Thousands of high-quality questions is an eventual content
production target, NOT a current inventory. Track coverage, reviewer
capacity and historical test-item quality.

## Every-weekend mock events

1. Admin creates a draft event with board, date window, currency, price,
   syllabus year, subject sections and immutable paper revision.
2. Assemble papers with the reviewed-only deterministic selector, avoiding
   repeated/near-duplicate groups and favouring previously unused questions.
3. Academic QA validates the assembled paper and answer key.
4. Student receives an order and pays via the existing supported checkout
   provider. A signed, amount/currency-verified webhook settles the order
   and creates exactly one learner/event entitlement.
5. Exam access requires verified learner identity, paid or authorised
   entitlement, open time window and attempt cap. No access based on
   client-submitted receipts or unverified success redirects.
6. Start freezes item order and marking versions. Continue/resume uses
   server clocks and transactional save/submit routines.
7. Provide score/skills analysis after the approved release policy.
   Separate public leaderboards need consent, age-aware privacy controls,
   anti-cheating safeguards and moderation; none are enabled today.

**Payment is NOT implemented or enabled in this branch.** The
`weekendMockAccess` module is policy logic only. Prices are examples only,
not a chosen business policy.

## Launch gates

- Separate Supabase staging project (currently not available in connected account)
- Secure staging-only role and transactional adapter with minimal grants
- Real reviewed, licensed question inventory sufficient for event paper
- Reliability under high concurrent weekend participation
- Complete payment/refund, cancellation and idempotent webhook rehearsal
- No impact to existing customer Stripe transactions, tutor sessions or bookings
- Admin examination audit trail and content revision/publishing permissions
- Explicit production release approval after regression and security review

No changes to the production database or payments are authorized by this plan.
