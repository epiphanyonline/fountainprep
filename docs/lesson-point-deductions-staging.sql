-- Fountain Prep point correction: REVIEW-ONLY, STAGING-FIRST schema update.
-- DO NOT apply to live project cxuizqygogdzhcehhbmc before acceptance tests.
-- Existing positive awards remain untouched; a negative row is an auditable correction.
-- Use with app/components/lesson/LiveLessonPoints.tsx on the feature branch.
begin;

alter table public.lesson_point_awards
  drop constraint lesson_point_awards_points_check;

alter table public.lesson_point_awards
  add constraint lesson_point_awards_points_check
  check (points in (-5, -2, -1, 1, 2, 5));

-- An append-only correction must never make the lesson balance negative.
-- Locking the booking serialises concurrent deductions without editing award history.
create or replace function public.enforce_nonnegative_lesson_points()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_balance integer;
begin
  if new.points < 0 then
    perform 1 from public.lesson_bookings
      where id = new.booking_id for update;
    if not found then
      raise exception 'Lesson booking not found';
    end if;

    select coalesce(sum(points), 0)
      into v_balance
      from public.lesson_point_awards
      where booking_id = new.booking_id;

    if v_balance + new.points < 0 then
      raise exception 'Point correction exceeds available lesson balance';
    end if;
  end if;
  return new;
end;
$$;

revoke all on function public.enforce_nonnegative_lesson_points()
  from public, anon, authenticated;

drop trigger if exists lesson_point_awards_no_negative_balance
  on public.lesson_point_awards;

create trigger lesson_point_awards_no_negative_balance
before insert on public.lesson_point_awards
for each row execute function public.enforce_nonnegative_lesson_points();

-- Existing RLS continues to allow only the assigned tutor to insert changes
-- during a LIVE lesson. No UPDATE/DELETE privileges or policies are added.
commit;

-- STAGING ACCEPTANCE CHECKLIST:
-- 1. Original +1/+2/+5 buttons remain functional and learner total updates.
-- 2. Assigned tutor can enter -1/-2/-5 while classroom is LIVE.
-- 3. A deduction greater than the lesson balance is rejected (also race-tested).
-- 4. Unrelated tutor and parent cannot insert either positive or negative rows.
-- 5. No adjustments after classroom completion.
-- 6. Learner and admin see net point totals; history shows signed corrections.
-- 7. Payments, lesson bookings, sessions and earnings are unaffected.
-- 8. Apply this script in a disposable staging copy, test, then review release.
