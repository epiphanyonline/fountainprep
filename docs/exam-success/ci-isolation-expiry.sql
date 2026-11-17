-- Disposable PostgreSQL assertions: ownership and expiry are server-side.
-- Run after synthetic transaction fixture tests.
insert into auth.users(id) values ('00000000-0000-4000-8000-000000000002');
do $$
declare
 v_owner uuid := '00000000-0000-4000-8000-000000000001';
 v_other uuid := '00000000-0000-4000-8000-000000000002';
 v_paper uuid;
 v_attempt uuid;
 v_snapshot jsonb;
 v_saved text;
begin
 select id into v_paper from public.exam_papers where title='Synthetic published';
 select exam_private.start_test_attempt(v_owner,v_paper,'expiry-isolation')
   into v_attempt;
 if exam_private.resume_test_attempt(v_other,v_attempt) is not null then
   raise exception 'Cross-learner resume leaked attempt';
 end if;
 select exam_private.save_test_answer(v_other,v_attempt,
   '10000000-0000-4000-8000-000000000001','b','foreign-save')
   into v_saved;
 if v_saved <> 'forbidden' then
   raise exception 'Cross-learner answer write succeeded';
 end if;
 begin
   perform * from exam_private.submit_test_attempt(v_other,v_attempt);
   raise exception 'Foreign learner submitted attempt';
 exception when others then
   if sqlerrm = 'Foreign learner submitted attempt' then raise; end if;
 end;
 -- Simulate server clock passing expiry by setting a past deadline on the
 -- synthetic attempt. No client-provided clock enters the function.
 update public.exam_attempts set expires_at=clock_timestamp()-interval '1 second'
 where id=v_attempt;
 v_snapshot:=exam_private.resume_test_attempt(v_owner,v_attempt);
 if v_snapshot->>'state' <> 'expired' then
   raise exception 'Expired attempt resumed as active';
 end if;
 select exam_private.save_test_answer(v_owner,v_attempt,
   '10000000-0000-4000-8000-000000000001','b','late-save')
 into v_saved;
 if v_saved <> 'closed' then
   raise exception 'Expired attempt accepted answer';
 end if;
 begin
   perform * from exam_private.submit_test_attempt(v_owner,v_attempt);
   raise exception 'Expired attempt submitted';
 exception when others then
   if sqlerrm = 'Expired attempt submitted' then raise; end if;
 end;
 if exists(select 1 from public.exam_results where attempt_id=v_attempt) then
   raise exception 'Unexpected expired attempt result';
 end if;
end $$;
