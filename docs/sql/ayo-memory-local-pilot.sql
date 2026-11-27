-- DRAFT ONLY: disposable local Supabase, synthetic accounts. Not a migration.
-- Do not execute on a linked or production database.
begin;
create table public.ayo_memory_pilot_enrollment (
  user_id uuid primary key references auth.users(id) on delete cascade,
  enrollment_id uuid not null unique default gen_random_uuid(),
  consented_at timestamptz not null default now(),
  unique (user_id, enrollment_id)
);
create table public.ayo_memory_pilot_attempt (
  user_id uuid not null,
  enrollment_id uuid not null,
  context_key text not null check (length(context_key) between 1 and 80),
  question_id text not null check (length(question_id) between 1 and 80),
  correct boolean not null,
  answered_at timestamptz not null default now(),
  primary key (user_id,enrollment_id,context_key,question_id),
  foreign key (user_id,enrollment_id)
    references public.ayo_memory_pilot_enrollment(user_id,enrollment_id) on delete cascade
);
create table public.ayo_memory_pilot_exchange (
  user_id uuid not null,
  enrollment_id uuid not null,
  event_id uuid not null,
  context_key text not null check (length(context_key) between 1 and 80),
  mode text not null check (mode in ('teach','practise','simplify','challenge')),
  completed_at timestamptz not null default now(),
  primary key (user_id,enrollment_id,event_id),
  foreign key (user_id,enrollment_id)
    references public.ayo_memory_pilot_enrollment(user_id,enrollment_id) on delete cascade
);
create index ayo_memory_pilot_exchange_recent on public.ayo_memory_pilot_exchange(user_id,enrollment_id,completed_at desc);
alter table public.ayo_memory_pilot_enrollment enable row level security;
alter table public.ayo_memory_pilot_attempt enable row level security;
alter table public.ayo_memory_pilot_exchange enable row level security;
revoke all on public.ayo_memory_pilot_enrollment,public.ayo_memory_pilot_attempt,public.ayo_memory_pilot_exchange from public,anon,authenticated,service_role;
grant select on public.ayo_memory_pilot_enrollment,public.ayo_memory_pilot_attempt,public.ayo_memory_pilot_exchange to authenticated;
grant select,insert,delete on public.ayo_memory_pilot_enrollment to service_role;
grant select,insert on public.ayo_memory_pilot_attempt,public.ayo_memory_pilot_exchange to service_role;
create policy ayo_memory_enrollment_own_read on public.ayo_memory_pilot_enrollment for select to authenticated using ((select auth.uid())=user_id);
create policy ayo_memory_attempt_own_read on public.ayo_memory_pilot_attempt for select to authenticated using ((select auth.uid())=user_id);
create policy ayo_memory_exchange_own_read on public.ayo_memory_pilot_exchange for select to authenticated using ((select auth.uid())=user_id);
-- No client writes. No raw prompts, answers, recordings, or personal profile fields.
-- Revoking enrolment deletes both child tables; a new enrolment cannot inherit old events.
commit;
