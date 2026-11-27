# Conversational AI tutor — preview-only integration

## What is built
- Preview-only endpoint: `POST /api/ai-tutor-preview/chat`
- Preview-only learner page: `/ai-tutor-preview/chat`
- Original JAMB Maths, Use of English and IELTS Reading lesson contexts
- Server-side model adapter (AI Gateway), strict alternating chat history,
  700-character user turn cap, 11-message history cap, max 520 output tokens,
  timeout and no-cache HTTP responses
- Chat UI stores only transient browser memory; a page refresh clears chat.
  Guided authored demo remains available on `/ai-tutor-preview`.
- No existing production tutoring, bookings, learner points, Stripe or
  Supabase code was modified.

## Fail-closed operation

**Do not set these flags until all conditions below are met.**

```
FOUNTAIN_TUTOR_AI_PREVIEW_ENABLED=true
FOUNTAIN_TUTOR_AI_SPENDING_APPROVED=true
```

The server also requires `VERCEL_ENV=preview` and Vercel AI Gateway
authentication via `VERCEL_OIDC_TOKEN` or a server-only `AI_GATEWAY_API_KEY`.
Never put either credential into `NEXT_PUBLIC_` variables.

The connected Fountain Prep Vercel project had **no dedicated project AI
Gateway spending budget** when inspected. These flags remain unset. We
must set a hard project/key budget and verify it applies to the exact
project credentials before activating actual model calls. Do not assume
serverless instance-memory rate limits enforce a global usage limit.

## Prior to even private live-AI testing

1. Confirm model access and costs under the selected team/project.
2. Set an enforced AI Gateway monthly spending cap and request/usage limit,
   inspect team and project inherited budgets, and test exhaustion behavior.
3. Restrict preview access to specific testers (Vercel SSO currently
   protects preview deployments); add durable per-account/IP rate limiting
   and anti-automation controls. Origin checks alone are not authentication.
4. Assess minor and parent permissions, retention/privacy terms, model
   data handling, content moderation, and safeguarding. Never solicit
   sensitive learner data in a demo.
5. Add deterministic evaluation cases (correct/incorrect maths, syllabus
   accuracy, refusal of unsafe content, injection prompts and context drift).
6. Conduct one low-spend authorised model smoke test, review response and
   usage logs, then enable chat for the designated testers only.

## Known limitations
- This release provides a **real server-side model integration path**, not
  yet a working live AI conversation. The API intentionally returns 503
  until cost and security gates are approved.
- Model content is not yet independently assessed, and neither one chat
  exchange nor one practice question measures examination readiness.
- The assistant's live chat history is browser-only and unverified; there
  is no durable per-learner memory or database staging environment yet.
- No exam-specific official partnership or official past-paper licence.

## 26 November 2026 — controlled free-credit pilot configuration

- Fountain Prep project AI Gateway budget: USD 5, monthly; alerts 50%, 75%, 100%.
- The project's preview chat endpoint has a Vercel WAF fixed-window rule:
  six requests per IP per 3600 seconds, only on preview environment.
- Two AI feature switches are now set on the Vercel project **preview
  environment scoped to the `feature/personal-ai-exam-tutor` branch only**.
- The gateway code authenticates with the deployment project's OIDC token
  **only**, not standalone API keys (which may bypass project-level budgets).
- Before generation, the backend calls the authenticated AI Gateway model
  availability endpoint and selects only an `eligible` model from a
  small allowlist of low-cost language models.
- An ineligible model, missing OIDC token, unapproved branch, unavailable
  Gateway, disabled flags or exhausted credit returns an error rather than
  silently falling back to paid provider keys.
- No AI-generated learner outcome is recognised as an official exam score.
- The Vercel project requires SSO on preview deployments. Confirm actual
  login access and one real completion manually before declaring the
  conversational tutor live-tested.
- Vercel spending caps are soft: the request crossing the cap can finish.
  Do not claim the $5 budget is a mathematically hard spending ceiling.

This documentation-only commit also triggers a new preview deployment so
that branch-scoped Vercel environment changes take effect. It does not
change the main or production branch.
