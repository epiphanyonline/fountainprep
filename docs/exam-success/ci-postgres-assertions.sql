-- Only executes in disposable PostgreSQL CI. Requires bootstrap and draft schema.
-- Assertions fail the CI job if the design grants unrestricted browser access.
do $$
declare
  expected text;
  actual boolean;
begin
  for expected in select unnest(array[
    'exam_papers','exam_questions','exam_paper_questions',
    'exam_attempts','exam_attempt_answers','exam_results'
  ]) loop
    select c.relrowsecurity into actual
      from pg_class c join pg_namespace n on n.oid=c.relnamespace
      where n.nspname='public' and c.relname=expected;
    if actual is distinct from true then
      raise exception 'RLS missing: %', expected;
    end if;
  end loop;
  if not (select relrowsecurity from pg_class c
        join pg_namespace n on n.oid=c.relnamespace
        where n.nspname='exam_private' and c.relname='answer_keys') then
    raise exception 'Private answer keys missing RLS';
  end if;
  if has_table_privilege('anon','public.exam_attempts','SELECT') then
    raise exception 'Anonymous attempts read unexpectedly granted';
  end if;
  if has_table_privilege('authenticated','public.exam_attempts','INSERT') then
    raise exception 'Student direct attempt writes unexpectedly granted';
  end if;
  if has_table_privilege('authenticated','public.exam_attempt_answers','UPDATE') then
    raise exception 'Student direct answer update unexpectedly granted';
  end if;
  if has_table_privilege('authenticated','exam_private.answer_keys','SELECT') then
    raise exception 'Student answer keys unexpectedly accessible';
  end if;
  if has_table_privilege('anon','public.exam_questions','SELECT') then
    raise exception 'Anonymous question bank unexpectedly accessible';
  end if;
  if not has_table_privilege('authenticated','public.exam_papers','SELECT') then
    raise exception 'Authenticated catalogue read should be granted';
  end if;
end $$;

-- Test published-only catalogue RLS using synthetic data.
insert into auth.users(id) values
  ('00000000-0000-4000-8000-000000000001');
insert into public.exam_papers
  (board,variant,country_code,syllabus_year,version,status,
   duration_seconds,title,reviewed_by)
values
  ('JAMB','utme','NG',2027,1,'draft',7200,'Synthetic draft',null),
  ('JAMB','utme','NG',2027,1,'published',7200,'Synthetic published',
   '00000000-0000-4000-8000-000000000001');

set role authenticated;
do $$
declare count_visible int;
begin
  select count(*) into count_visible from public.exam_papers;
  if count_visible <> 1 then
    raise exception 'Expected exactly one published paper, got %', count_visible;
  end if;
end $$;
reset role;
