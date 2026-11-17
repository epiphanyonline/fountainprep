# Authenticated Examination Integration — Current Boundary

**Draft PR only. No public API endpoint is mounted.**

## Files

- `verifiedLearner.ts`: verifies bearer token through the staging Supabase
  Auth `getUser` call and checks the staging ref differs from production.
- `stagingAuthStore.ts`: establishes a learner-bound store only after
  authentication and isolation checks.
- `stagingExamHandler.ts`: composes an unmounted POST handler with the
  staging-only gate.
- `mockHttp.ts`: supports `start`, `save`, `resume`, `submit`.
- `stagingExamHandler.test.ts`: synthetic end-to-end HTTP tests, including
  production blocking and answer-key redaction.

## What this DOES NOT do

- Does not create an external Supabase project or its database schema.
- Does not execute mock SQL against Fountain Prep production.
- Does not expose a Next.js route or activate examinations on the live site.
- Does not create the real PostgreSQL transport / permissions bridge.
- Does not persist demonstration answers across different browsers.
- Does not integrate enrolment or pricing with Stripe.

## Required bridge to actual staging

The SQL prototype is intentionally in private `exam_private` schema and
its routines have no direct `authenticated`/ `anon` EXECUTE grant.
Supabase Data API must **not** expose this schema just to make `rpc` work.

A future independently provisioned staging backend must implement
`ResumableExamStore` through a trusted server-side data gateway with:
- Staging-project-only credentials, no `NEXT_PUBLIC_` secret variables.
- Explicitly bound verified learner identity, never a request-supplied UUID.
- Single-transaction start/save/submit operations, with row locks.
- Private answer-key access only inside the server transaction.
- Versioned exam snapshots, idempotency and entitlement checks.
- Appropriate database role with only necessary privileges.
- No production connection string or service-role credentials.
- Staging app and all API endpoints behind separate access controls.

Production ref currently known as `cxuizqygogdzhcehhbmc`. Never use
that project as staging, even if it appears on a Vercel Preview deployment.

## Validation

Run GitHub's isolated PR checks before requesting any staging access.
After staging is separately provisioned, test user A/user B isolation,
concurrent starts/submissions, interrupted browsers, expired papers, schema
grants, entitlement enforcement and failure redaction. Manual production
regression tests and explicit approval remain requirements for merging.
