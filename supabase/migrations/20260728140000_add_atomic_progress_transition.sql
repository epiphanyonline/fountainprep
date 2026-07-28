create or replace function public.save_student_episode_progress(
  p_student_id uuid,
  p_lesson_id uuid,
  p_status text,
  p_current_step_index integer default 0,
  p_tutor_id uuid default null,
  p_notes text default null,
  p_homework text default null
)
returns public.student_curriculum_progress
language plpgsql
security invoker
set search_path = public
as $$
declare
  saved_progress public.student_curriculum_progress;
begin
  if p_current_step_index < 0 then
    raise exception 'current_step_index cannot be negative';
  end if;

  if p_status not in (
    'not_started',
    'in_progress',
    'completed'
  ) then
    raise exception 'Invalid progress status: %', p_status;
  end if;

  update public.student_curriculum_progress
  set
    status = 'not_started',
    current_step_index = 0,
    completed_at = null
  where student_id = p_student_id
    and status = 'in_progress'
    and lesson_id is distinct from p_lesson_id;

  insert into public.student_curriculum_progress (
    student_id,
    lesson_id,
    status,
    current_step_index,
    completed_at,
    tutor_id,
    notes,
    homework
  )
  values (
    p_student_id,
    p_lesson_id,
    p_status,
    case
      when p_status = 'completed' then 0
      else p_current_step_index
    end,
    case
      when p_status = 'completed'
        then now()
      else null
    end,
    p_tutor_id,
    p_notes,
    p_homework
  )
  on conflict (student_id, lesson_id)
  do update set
    status = excluded.status,
    current_step_index =
      excluded.current_step_index,
    completed_at = excluded.completed_at,
    tutor_id = excluded.tutor_id,
    notes = excluded.notes,
    homework = excluded.homework
  returning *
  into saved_progress;

  return saved_progress;
end;
$$;

revoke all
on function public.save_student_episode_progress(
  uuid,
  uuid,
  text,
  integer,
  uuid,
  text,
  text
)
from public;

grant execute
on function public.save_student_episode_progress(
  uuid,
  uuid,
  text,
  integer,
  uuid,
  text,
  text
)
to authenticated;

grant execute
on function public.save_student_episode_progress(
  uuid,
  uuid,
  text,
  integer,
  uuid,
  text,
  text
)
to service_role;