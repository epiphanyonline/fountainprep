alter table public.student_curriculum_progress
enable row level security;

grant select, insert, update, delete
on public.student_curriculum_progress
to authenticated;

drop policy if exists
  "Parents can view own student progress"
on public.student_curriculum_progress;

create policy
  "Parents can view own student progress"
on public.student_curriculum_progress
for select
to authenticated
using (
  exists (
    select 1
    from public.student_profiles student
    join public.parent_profiles parent
      on parent.id = student.parent_id
    where student.id =
      student_curriculum_progress.student_id
      and parent.user_id = auth.uid()
  )
  or is_admin()
);

drop policy if exists
  "Parents can insert own student progress"
on public.student_curriculum_progress;

create policy
  "Parents can insert own student progress"
on public.student_curriculum_progress
for insert
to authenticated
with check (
  exists (
    select 1
    from public.student_profiles student
    join public.parent_profiles parent
      on parent.id = student.parent_id
    where student.id =
      student_curriculum_progress.student_id
      and parent.user_id = auth.uid()
  )
  or is_admin()
);

drop policy if exists
  "Parents can update own student progress"
on public.student_curriculum_progress;

create policy
  "Parents can update own student progress"
on public.student_curriculum_progress
for update
to authenticated
using (
  exists (
    select 1
    from public.student_profiles student
    join public.parent_profiles parent
      on parent.id = student.parent_id
    where student.id =
      student_curriculum_progress.student_id
      and parent.user_id = auth.uid()
  )
  or is_admin()
)
with check (
  exists (
    select 1
    from public.student_profiles student
    join public.parent_profiles parent
      on parent.id = student.parent_id
    where student.id =
      student_curriculum_progress.student_id
      and parent.user_id = auth.uid()
  )
  or is_admin()
);

drop policy if exists
  "Parents can delete own student progress"
on public.student_curriculum_progress;

create policy
  "Parents can delete own student progress"
on public.student_curriculum_progress
for delete
to authenticated
using (
  exists (
    select 1
    from public.student_profiles student
    join public.parent_profiles parent
      on parent.id = student.parent_id
    where student.id =
      student_curriculum_progress.student_id
      and parent.user_id = auth.uid()
  )
  or is_admin()
);