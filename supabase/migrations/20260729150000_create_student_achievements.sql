create table if not exists public.student_achievements (
  id uuid primary key default gen_random_uuid(),

  student_id uuid not null
    references public.student_profiles(id)
    on delete cascade,

  episode_id uuid not null
    references public.curriculum_lessons(id)
    on delete cascade,

  achievement_type text not null
    default 'lesson_completion',

  title text not null,

  description text,

  points_awarded integer not null
    default 0,

  earned_at timestamptz not null
    default now(),

  constraint student_achievements_student_episode_unique
    unique (
      student_id,
      episode_id,
      achievement_type
    )
);

create index if not exists
  student_achievements_student_id_idx
on public.student_achievements(student_id);

create index if not exists
  student_achievements_episode_id_idx
on public.student_achievements(episode_id);

alter table public.student_achievements
enable row level security;

drop policy if exists
  "Parents can view child achievements"
on public.student_achievements;

drop policy if exists
  "Parents can create child achievements"
on public.student_achievements;

create policy
  "Parents can view child achievements"
on public.student_achievements
for select
to authenticated
using (
  (
    exists (
      select 1
      from public.student_profiles student
      join public.parent_profiles parent
        on parent.id = student.parent_id
      where
        student.id =
          student_achievements.student_id
        and parent.user_id = auth.uid()
    )
  )
  or public.is_admin()
);

create policy
  "Parents can create child achievements"
on public.student_achievements
for insert
to authenticated
with check (
  (
    exists (
      select 1
      from public.student_profiles student
      join public.parent_profiles parent
        on parent.id = student.parent_id
      where
        student.id =
          student_achievements.student_id
        and parent.user_id = auth.uid()
    )
  )
  or public.is_admin()
);