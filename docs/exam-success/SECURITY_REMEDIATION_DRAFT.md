# Production security remediation — DRAFT ONLY

**DO NOT RUN IN PRODUCTION WITHOUT STAGING REGRESSION TESTS AND APPROVAL.**

Read-only inspection of Fountain Prep Supabase `cxuizqygogdzhcehhbmc`
(2026-11-17) showed RLS disabled on ten public tables:

- `support_threads`, `support_messages`
- `curriculum_subjects`, `curriculum_stages`, `curriculum_strands`,
  `curriculum_modules`, `curriculum_lessons`
- `tutor_events`, `tutor_event_invites`, `tutor_communications`

Existing support policies: admin SELECT (based on `user_profiles.role`)
and permissive public INSERT. These policies do nothing while RLS is disabled.
The five curriculum and three tutor tables have no RLS policies.
The `anon` and `authenticated` roles hold broad privileges on sampled tables,
including SELECT, INSERT, UPDATE and DELETE.

Additional security-adviser warnings: four security-definer views,
`vw_public_tutors`, `vw_booking_overview`, `vw_open_learning_slots`,
`vw_safe_tutor_profiles`. Investigate view definitions/ownership and public
grants before changing any of them.

## Safest release sequence
1. Inventory exact use of the ten tables from Next.js client components,
   route handlers and server actions. Include guest support workflows.
2. Define row ownership and policy requirements with real user stories:
   public curriculum reading, admin content editing, support ticket intake,
   author-only ticket access, tutor invitation access, admin moderation.
3. Verify how `user_profiles.role` is set and protected against user changes.
4. Build a separate staged migration against a representative nonproduction DB.
5. Test roles: anonymous guest, student, parent, tutor, admin, service role.
   Check legitimate reads/writes continue and cross-account access is denied.
6. Validate all critical live lesson, booking, payment and support flows.
7. Back up, verify rollback and schedule controlled production application.
8. Re-run Supabase security and performance advisors, then regression tests.

## Draft access matrix (requirements, not SQL)
| Resource | anon | student/parent | tutor | admin |
|---|---|---|---|---|
| Public published curriculum | Read only | Read only | Read only | Read/write |
| Unpublished curriculum | None | None | None unless assigned | Read/write |
| Support messages | Submit through validated endpoint only | Own ticket read/write | Own ticket if applicable | Scoped manage |
| Tutor events/invitations | None | None | Assigned events/invites | Manage |
| Tutor communications | None | None | Own messages | Manage |
| Exam answer keys (future) | None | None | None by default | Reviewer/service only |
| Exam attempts (future) | None | Own attempts | Only explicitly assigned | Scoped reporting |

## Explicit hazards
- Do not simply enable RLS on the ten tables without policies: currently
  functional pages may lose access.
- Do not use a globally broad `USING (true)` write policy.
- Do not trust editable `user_metadata` or client-supplied role strings.
- Do not expose production service-role keys in browser code.
- Treat exam prompts and correct answers as protected/licensed content.
- This document does not apply policies or migrate any production data.
