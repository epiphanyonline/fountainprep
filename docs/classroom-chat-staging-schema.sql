-- REVIEW-ONLY DRAFT: DO NOT RUN AGAINST LIVE FOUNTAIN PREP DATABASE.
-- Requires a dedicated isolated development/staging project for testing.
-- Fountain Prep project reference (production): cxuizqygogdzhcehhbmc.
-- Linked only to public.lesson_bookings; does not alter lesson, payment or booking tables.
begin;

create table public.lesson_chat_messages (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.lesson_bookings(id) on delete cascade,
  sender_id uuid not null default auth.uid() references auth.users(id),
  body text not null check (char_length(btrim(body)) between 1 and 1000),
  created_at timestamptz not null default now()
);

create index lesson_chat_messages_booking_date_idx
  on public.lesson_chat_messages(booking_id, created_at, id);

alter table public.lesson_chat_messages enable row level security;

-- A participant must be the booking's parent account or the assigned tutor,
-- or an active administrator. Authorization is checked against existing tables,
-- not client-supplied role or mutable user metadata.
create policy "Booking participants may read classroom chat"
on public.lesson_chat_messages
for select to authenticated
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
        or exists (
          select 1 from public.user_profiles p
          where p.id = (select auth.uid())
            and p.role = 'ADMIN'
            and coalesce(p.is_active, true)
        )
      )
  )
);

create policy "Booking participants may send classroom chat"
on public.lesson_chat_messages
for insert to authenticated
with check (
  sender_id = (select auth.uid())
  and exists (
    select 1 from public.lesson_bookings b
    where b.id = booking_id
      and (
        b.parent_id = (select auth.uid())
        or exists (
          select 1 from public.tutor_profiles t
          where t.id = b.tutor_id and t.user_id = (select auth.uid())
        )
        or exists (
          select 1 from public.user_profiles p
          where p.id = (select auth.uid())
            and p.role = 'ADMIN'
            and coalesce(p.is_active, true)
        )
      )
  )
);

-- No UPDATE/DELETE for authenticated clients; chat history is append only.
revoke all on public.lesson_chat_messages from anon;
grant select, insert on public.lesson_chat_messages to authenticated;
commit;

-- PRE-RELEASE CHECKLIST (staging only)
-- parent account can send/read on own booking; cannot access another booking
-- assigned tutor can send/read own booking, never another tutor's booking
-- admin role with active profile can send/read; inactive admin cannot
-- no unauthenticated user access
-- forged sender_id rejected; empty or >1000-character messages rejected
-- message appears on both sides after refresh without Google Meet
-- chat does not block video classroom when DB query fails
-- test child safeguarding workflow, retention and administrator audit requirements
-- never enable NEXT_PUBLIC_ENABLE_CLASSROOM_CHAT on production before tests
