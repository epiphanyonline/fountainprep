-- Fountain Prep live lesson rewards: REVIEW-ONLY SQL DRAFT.
-- DO NOT execute on the live project cxuizqygogdzhcehhbmc.
-- Apply only to an isolated Supabase development/staging database after review.
-- This file is not a Supabase migration and does not change any database.
-- Assumes existing public.lesson_bookings, public.tutor_profiles and auth.users.
begin;

create table public.lesson_point_awards (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.lesson_bookings(id) on delete cascade,
  awarded_by uuid not null default auth.uid() references auth.users(id),
  points integer not null check (points in (1, 2, 5)),
  created_at timestamptz not null default now()
);
create index lesson_point_awards_booking_created_idx
  on public.lesson_point_awards (booking_id, created_at desc);
alter table public.lesson_point_awards enable row level security;

-- Only the assigned tutor may award points, while the classroom is LIVE.
-- An admin may observe points through other authorised administrative tooling,
-- but cannot award points merely because of administrative status.
create policy "Assigned tutor can award points during live classroom"
on public.lesson_point_awards for insert to authenticated
with check (
  awarded_by = (select auth.uid())
  and exists (
    select 1 from public.lesson_bookings b
    join public.tutor_profiles t on t.id = b.tutor_id
    where b.id = booking_id
      and t.user_id = (select auth.uid())
      and b.classroom_status = 'LIVE'
  )
);

create policy "Booking family and assigned tutor can view points"
on public.lesson_point_awards for select to authenticated
using (
  exists (
    select 1 from public.lesson_bookings b
    where b.id = booking_id
      and (
        b.parent_id = (select auth.uid())
        or exists (
          select 1 from public.tutor_profiles t
          where t.id = b.tutor_id and t.user_id = (select auth.uid())
        )
      )
  )
);

-- Do not provide UPDATE or DELETE policies: reward history is append-only.
grant select, insert on public.lesson_point_awards to authenticated;
revoke all on public.lesson_point_awards from anon;

create table public.lesson_tutor_reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.lesson_bookings(id) on delete cascade,
  reviewer_user_id uuid not null default auth.uid() references auth.users(id),
  rating integer not null check (rating between 1 and 5),
  comment text check (comment is null or char_length(comment) <= 1000),
  moderation_status text not null default 'pending'
    check (moderation_status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.lesson_tutor_reviews enable row level security;

-- Parent/guardian owns the booking. Never trust a tutor_id supplied by a client.
create policy "Parent can review own completed lesson"
on public.lesson_tutor_reviews for insert to authenticated
with check (
  reviewer_user_id = (select auth.uid())
  and moderation_status = 'pending'
  and exists (
    select 1 from public.lesson_bookings b
    where b.id = booking_id
      and b.parent_id = (select auth.uid())
      and b.tutor_id is not null
      and b.status = 'COMPLETED'
      and b.classroom_status = 'COMPLETED'
  )
);

create policy "Parent can view own lesson review"
on public.lesson_tutor_reviews for select to authenticated
using (reviewer_user_id = (select auth.uid()));

-- Public tutor reviews require a separate moderation-approved read path;
-- no child/parent feedback is published by these policies.
grant select, insert on public.lesson_tutor_reviews to authenticated;
revoke all on public.lesson_tutor_reviews from anon;

commit;

-- STAGING TESTS (do not execute against production):
-- * tutor can add +1/+2/+5 to assigned LIVE booking; other tutor cannot
-- * parent/learner can see assigned points; unrelated user cannot
-- * tutor cannot award before start or after completion
-- * any attempted manual override of awarded_by is rejected
-- * parent can review a COMPLETED booking once; duplicate is rejected
-- * pending and active bookings cannot be reviewed
-- * tutor and unrelated accounts cannot insert/read private reviews
-- * no modifications to lesson bookings, lesson sessions, or payment tables
-- * separately confirm realtime expectations: UI currently polls every 5 seconds
-- * confirm any future admin moderation uses trusted server-side authorization
