# Unified Fountain Prep AI Tutor — integration charter

Product: one conversational learning companion (AYO), with exam preparation, language learning, homework guidance and general educational support. Human one-to-one tutoring remains a complementary existing service. "All Exams, One Tutor" remains the exam-specific promise.

## Baseline
- Exam tutor PR #4 snapshot 412bc525dc8697853539aa305e4b03f4e259f6e1.
- Speech PR #3 snapshot a4f4198a16222df41f8a1dee5025584536712f71.
- Combined via internal PR #5, not main. Original branches preserved.
- PR #1 learner points and PR #2 exam/mock infrastructure remain separate.

## Architecture
One conversation shell; explicit learner-selected learning context (exam + subject, language + level, homework + subject, or general learning + topic). Mode (teach, practise, simplify, challenge) is independent of context. Start with typed, validated context, not arbitrary client system prompts. Route to specialist curriculum and teaching policies server-side. Preserve topic boundaries, age-appropriate guidance, academic integrity, and uncertainty about syllabus coverage. Homework support teaches reasoning rather than doing assessed work for learners.

Shared authenticated learner identity and consent-aware memory; separate per-context knowledge evidence and review schedules. Distinguish activity from demonstrated mastery. No cross-child data sharing. Existing browser journal is a preview only; no claim of durable memory. Voice is an optional capability; static language phrases use specialist speech and correction precedence, not general English narration. Do not cache private dialogue or learner recordings. Human tutor handoff must reuse existing booking flows only after testing.

## Sequence
1. Combined baseline and preview-only landing shell; no new provider calls.
2. Shared validated conversation contract and tests; retain existing exam preview.
3. Extend context-aware prompts and learning journal, with separate context keys.
4. Isolated authenticated persistence and evidence-based assessment; RLS, consent, deletion and retention checks.
5. Language curriculum and speech integration, including provider licensing, native pronunciation QA, quota and caching tests.
6. Homework uploads with privacy, file validation and safety controls.
7. Study plans, mocks and usage entitlements; review existing exam infrastructure selectively.
8. Cost measurement, pricing decision, regression tests and explicit release approval.

## Release guardrails
No production merge, DB writes, migrations, payment changes, feature-flag activation or spending changes as part of baseline integration. Existing branch-scoped AI and Azure configuration is NOT inherited automatically. Keep live AI disabled on unified branch until budget, WAF, authenticated access, provider eligibility and preview configuration are verified. Speech access needs explicit isolated database enforcement before flags are enabled; never point pilot at production. Local WSL/Docker setup is pending; Orinode access pending. No public launch until end-to-end tests and explicit approval. Subscription tiers and prices remain proposals, not implementation requirements.
