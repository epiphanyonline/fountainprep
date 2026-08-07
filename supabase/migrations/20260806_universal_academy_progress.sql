create table if not exists public.student_academy_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  academy_code text not null,
  programme_id text not null,
  course_id text not null,
  unit_id text not null,
  lesson_id text not null,
  status text not null default 'not_started'
    check (status in ('not_started', 'in_progress', 'completed')),
  current_activity_index integer not null default 0
    check (current_activity_index >= 0),
  points_earned integer not null default 0
    check (points_earned >= 0),
  score numeric null,
  started_at timestamptz null,
  completed_at timestamptz null,
  last_studied_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, lesson_id)
);

create index if not exists student_academy_progress_student_idx
  on public.student_academy_progress(student_id);

create index if not exists student_academy_progress_path_idx
  on public.student_academy_progress(
    student_id,
    academy_code,
    programme_id,
    course_id
  );

create table if not exists public.student_academy_achievements (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  academy_code text not null,
  lesson_id text not null,
  achievement_type text not null default 'lesson_completion',
  title text not null,
  description text null,
  points_awarded integer not null default 0,
  earned_at timestamptz not null default now(),
  unique (
    student_id,
    lesson_id,
    achievement_type
  )
);

alter table public.student_academy_progress enable row level security;
alter table public.student_academy_achievements enable row level security;

drop policy if exists "Parents manage academy progress"
  on public.student_academy_progress;

create policy "Parents manage academy progress"
  on public.student_academy_progress
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.student_profiles student
      join public.parent_profiles parent
        on parent.id = student.parent_id
      where student.id = student_academy_progress.student_id
        and parent.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.student_profiles student
      join public.parent_profiles parent
        on parent.id = student.parent_id
      where student.id = student_academy_progress.student_id
        and parent.user_id = auth.uid()
    )
  );

drop policy if exists "Parents manage academy achievements"
  on public.student_academy_achievements;

create policy "Parents manage academy achievements"
  on public.student_academy_achievements
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.student_profiles student
      join public.parent_profiles parent
        on parent.id = student.parent_id
      where student.id = student_academy_achievements.student_id
        and parent.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.student_profiles student
      join public.parent_profiles parent
        on parent.id = student.parent_id
      where student.id = student_academy_achievements.student_id
        and parent.user_id = auth.uid()
    )
  );

create or replace function public.set_academy_progress_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  new.last_studied_at = now();
  return new;
end;
$$;

drop trigger if exists set_academy_progress_updated_at
  on public.student_academy_progress;

create trigger set_academy_progress_updated_at
before update on public.student_academy_progress
for each row
execute function public.set_academy_progress_updated_at();
