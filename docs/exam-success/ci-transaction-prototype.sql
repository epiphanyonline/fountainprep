-- CI-ONLY PERSISTENT MOCK TRANSACTION PROTOTYPE.
-- Executed exclusively against disposable PostgreSQL in GitHub Actions.
-- THIS IS NOT A SUPABASE MIGRATION. Do not apply to production or staging
-- without access-control, academic, concurrency and entitlement review.
--
-- Caller identity must be verified in a future server-only adapter.
-- The functions take learner IDs for synthetic CI testing, NOT browser use.
-- No EXECUTE permission for anon/authenticated roles is granted.
begin;
alter table public.exam_attempts add column start_request_key text;
create unique index exam_attempt_start_once
  on public.exam_attempts(learner_user_id,start_request_key);

create table exam_private.attempt_question_snapshots (
  attempt_id uuid not null references public.exam_attempts(id) on delete cascade,
  question_id uuid not null references public.exam_questions(id) on delete restrict,
  options jsonb not null,
  correct_option_id text not null,
  points numeric(8,2) not null,
  primary key(attempt_id,question_id)
);
create table exam_private.answer_save_requests (
  attempt_id uuid not null references public.exam_attempts(id) on delete cascade,
  request_key text not null,
  question_id uuid not null,
  selected_option_id text,
  created_at timestamptz not null default now(),
  primary key(attempt_id,request_key)
);
revoke all on exam_private.attempt_question_snapshots,
  exam_private.answer_save_requests from public,anon,authenticated;
alter table exam_private.attempt_question_snapshots enable row level security;
alter table exam_private.answer_save_requests enable row level security;

create or replace function exam_private.start_test_attempt(
  p_learner uuid,p_paper uuid,p_request text
) returns uuid language plpgsql set search_path='' as $$
declare
  v_id uuid;
  v_seconds integer;
  v_count integer;
begin
  if p_learner is null or p_paper is null or length(p_request) not between 1 and 128 then
    raise exception 'invalid start request';
  end if;
  -- Serialize requests for the same user to avoid overlapping idempotent starts.
  perform 1 from auth.users where id=p_learner;
  if not found then raise exception 'unknown learner'; end if;

  select duration_seconds into v_seconds
    from public.exam_papers where id=p_paper and status='published'
    for share;
  if v_seconds is null then raise exception 'paper unavailable'; end if;

  select id into v_id from public.exam_attempts
    where learner_user_id=p_learner and start_request_key=p_request;
  if v_id is not null then
    if (select paper_id from public.exam_attempts where id=v_id) <> p_paper then
      raise exception 'start idempotency conflict';
    end if;
    return v_id;
  end if;

  insert into public.exam_attempts(
    paper_id,learner_user_id,started_at,expires_at,start_request_key
  ) values (
    p_paper,p_learner,clock_timestamp(),
    clock_timestamp() + make_interval(secs=>v_seconds),p_request
  )
  on conflict(learner_user_id,start_request_key) do nothing
  returning id into v_id;
  if v_id is null then
    select id into v_id from public.exam_attempts
      where learner_user_id=p_learner and start_request_key=p_request;
    if (select paper_id from public.exam_attempts where id=v_id) <> p_paper then
      raise exception 'start idempotency conflict';
    end if;
    return v_id;
  end if;

  insert into exam_private.attempt_question_snapshots(
    attempt_id,question_id,options,correct_option_id,points
  )
  select v_id,q.id,q.options,k.correct_option_id,q.points
    from public.exam_paper_questions pq
    join public.exam_questions q on q.id=pq.question_id
    join exam_private.answer_keys k on k.question_id=q.id
    where pq.paper_id=p_paper and q.status='published';

  select count(*) into v_count from exam_private.attempt_question_snapshots
    where attempt_id=v_id;
  if v_count=0 or v_count<>(select count(*) from public.exam_paper_questions
                                 where paper_id=p_paper) then
    raise exception 'paper missing approved questions/keys';
  end if;
  return v_id;
end $$;

create or replace function exam_private.save_test_answer(
  p_learner uuid,p_attempt uuid,p_question uuid,p_option text,p_request text
) returns text language plpgsql set search_path='' as $$
declare
  v_attempt public.exam_attempts%rowtype;
  v_options jsonb;
  v_previous record;
begin
  if length(p_request) not between 1 and 128 then
    raise exception 'invalid save request';
  end if;
  select * into v_attempt from public.exam_attempts
    where id=p_attempt and learner_user_id=p_learner for update;
  if not found then return 'forbidden'; end if;
  if v_attempt.state<>'in_progress' or clock_timestamp()>=v_attempt.expires_at then
    return 'closed';
  end if;
  select options into v_options from exam_private.attempt_question_snapshots
    where attempt_id=p_attempt and question_id=p_question;
  if v_options is null then return 'invalid_question'; end if;
  if p_option is not null and not (v_options ? p_option) then
    return 'invalid_question';
  end if;
  select question_id,selected_option_id into v_previous
    from exam_private.answer_save_requests
    where attempt_id=p_attempt and request_key=p_request;
  if found then
    if v_previous.question_id<>p_question or
       v_previous.selected_option_id is distinct from p_option then
      raise exception 'save idempotency conflict';
    end if;
    return 'saved';
  end if;
  insert into public.exam_attempt_answers(attempt_id,question_id,selected_option_id)
    values(p_attempt,p_question,p_option)
    on conflict(attempt_id,question_id) do update
      set selected_option_id=excluded.selected_option_id,
          saved_at=clock_timestamp();
  insert into exam_private.answer_save_requests(
    attempt_id,request_key,question_id,selected_option_id
  ) values(p_attempt,p_request,p_question,p_option);
  return 'saved';
end $$;

create or replace function exam_private.submit_test_attempt(
  p_learner uuid,p_attempt uuid
) returns table(earned numeric,possible numeric,already_submitted boolean)
language plpgsql set search_path='' as $$
declare v_attempt public.exam_attempts%rowtype;
begin
  select * into v_attempt from public.exam_attempts
    where id=p_attempt and learner_user_id=p_learner for update;
  if not found then raise exception 'forbidden'; end if;
  if v_attempt.state='submitted' then
    return query select r.earned,r.possible,true
      from public.exam_results r where r.attempt_id=p_attempt;
    return;
  end if;
  if v_attempt.state<>'in_progress' or clock_timestamp()>=v_attempt.expires_at then
    raise exception 'closed';
  end if;
  insert into public.exam_results(attempt_id,earned,possible,marking_version)
  select p_attempt,
         coalesce(sum(case when a.selected_option_id=s.correct_option_id
                           then s.points else 0 end),0),
         coalesce(sum(s.points),0),
         'ci-objective-v1'
    from exam_private.attempt_question_snapshots s
    left join public.exam_attempt_answers a
      on a.attempt_id=s.attempt_id and a.question_id=s.question_id
    where s.attempt_id=p_attempt;
  update public.exam_attempts
     set state='submitted',submitted_at=clock_timestamp() where id=p_attempt;
  return query select r.earned,r.possible,false
    from public.exam_results r where r.attempt_id=p_attempt;
end $$;

-- Resume uses the same authoritative DB clock and frozen question snapshot.
-- The result is a JSON object containing only the learner's own saved answers
-- and display options. Never return private keys, marking weights or rubrics.
create or replace function exam_private.resume_test_attempt(
  p_learner uuid, p_attempt uuid
) returns jsonb language plpgsql set search_path='' as $resume$
declare
  v_attempt public.exam_attempts%rowtype;
  v_questions jsonb;
  v_answers jsonb;
  v_state text;
begin
  select * into v_attempt from public.exam_attempts
    where id=p_attempt and learner_user_id=p_learner;
  if not found then return null; end if;

  v_state := case
    when v_attempt.state='in_progress' and clock_timestamp()>=v_attempt.expires_at
      then 'expired'
    else v_attempt.state
  end;
  select coalesce(jsonb_agg(
    jsonb_build_object(
      'id',s.question_id,
      'format','single_choice',
      'optionIds',s.options
    ) order by pq.sort_order
  ), '[]'::jsonb)
  into v_questions
  from exam_private.attempt_question_snapshots s
  join public.exam_paper_questions pq
    on pq.question_id=s.question_id and pq.paper_id=v_attempt.paper_id
  where s.attempt_id=p_attempt;

  select coalesce(jsonb_agg(
    jsonb_build_object(
      'questionId',a.question_id,
      'optionId',a.selected_option_id
    ) order by a.saved_at, a.question_id
  ), '[]'::jsonb)
  into v_answers
  from public.exam_attempt_answers a where a.attempt_id=p_attempt;

  return jsonb_build_object(
    'attemptId',v_attempt.id,
    'expiresAt',v_attempt.expires_at,
    'state',v_state,
    'questions',v_questions,
    'answers',v_answers
  );
end $resume$;

revoke all on function exam_private.start_test_attempt(uuid,uuid,text),
  exam_private.save_test_answer(uuid,uuid,uuid,text,text),
  exam_private.submit_test_attempt(uuid,uuid),
  exam_private.resume_test_attempt(uuid,uuid)
  from public,anon,authenticated;
commit;
