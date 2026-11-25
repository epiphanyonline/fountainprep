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
