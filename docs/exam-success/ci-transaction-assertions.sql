-- Synthetic CI test of durable, transactional mock attempts.
-- No production credentials, Supabase connections or real learner information.
insert into public.exam_questions (
 id,board,syllabus_year,subject_code,topic_code,prompt,options,points,licence,
 status,reviewed_by
) values
 ('10000000-0000-4000-8000-000000000001','JAMB',2027,'ENG','GRAMMAR',
  'Synthetic example A','["a","b","c"]'::jsonb,2,'original synthetic','published',
  '00000000-0000-4000-8000-000000000001'),
 ('10000000-0000-4000-8000-000000000002','JAMB',2027,'MATH','ALGEBRA',
  'Synthetic example B','["x","y"]'::jsonb,3,'original synthetic','published',
  '00000000-0000-4000-8000-000000000001');
insert into exam_private.answer_keys(question_id,correct_option_id) values
 ('10000000-0000-4000-8000-000000000001','b'),
 ('10000000-0000-4000-8000-000000000002','x');
insert into public.exam_paper_questions(paper_id,question_id,sort_order)
select p.id,'10000000-0000-4000-8000-000000000001'::uuid,0
 from public.exam_papers p where p.title='Synthetic published';
insert into public.exam_paper_questions(paper_id,question_id,sort_order)
select p.id,'10000000-0000-4000-8000-000000000002'::uuid,1
 from public.exam_papers p where p.title='Synthetic published';

do $$
declare
 v_user uuid := '00000000-0000-4000-8000-000000000001';
 v_paper uuid;
 v_attempt uuid;
 v_replay uuid;
 v_score record;
 v_answer text;
begin
 select id into v_paper from public.exam_papers
   where title='Synthetic published';

 select exam_private.start_test_attempt(v_user,v_paper,'start-key-1')
   into v_attempt;
 select exam_private.start_test_attempt(v_user,v_paper,'start-key-1')
   into v_replay;
 if v_attempt<>v_replay then raise exception 'Start was not idempotent'; end if;

 select exam_private.save_test_answer(v_user,v_attempt,
   '10000000-0000-4000-8000-000000000001','a','save-key-1') into v_answer;
 if v_answer<>'saved' then raise exception 'First answer was not saved'; end if;
 select exam_private.save_test_answer(v_user,v_attempt,
   '10000000-0000-4000-8000-000000000001','b','save-key-2') into v_answer;
 if v_answer<>'saved' then raise exception 'Corrected answer not saved'; end if;
 select exam_private.save_test_answer(v_user,v_attempt,
   '10000000-0000-4000-8000-000000000001','a','save-key-1') into v_answer;
 if (select selected_option_id from public.exam_attempt_answers
      where attempt_id=v_attempt and
        question_id='10000000-0000-4000-8000-000000000001') <> 'b' then
   raise exception 'Old answer retry overwrote new answer';
 end if;

 -- Change bank answers/weights: started attempt must retain original snapshot.
 update exam_private.answer_keys set correct_option_id='a'
 where question_id='10000000-0000-4000-8000-000000000001';
 update public.exam_questions set points=90
 where id='10000000-0000-4000-8000-000000000001';

 select * into v_score from exam_private.submit_test_attempt(v_user,v_attempt);
 if v_score.earned<>2 or v_score.possible<>5 or v_score.already_submitted then
   raise exception 'Frozen marking failed: earned %, possible %, repeat %',
     v_score.earned,v_score.possible,v_score.already_submitted;
 end if;
 select * into v_score from exam_private.submit_test_attempt(v_user,v_attempt);
 if v_score.earned<>2 or v_score.possible<>5 or not v_score.already_submitted then
   raise exception 'Submit replay was not idempotent';
 end if;
 select exam_private.save_test_answer(v_user,v_attempt,
   '10000000-0000-4000-8000-000000000002','x','save-key-after') into v_answer;
 if v_answer<>'closed' then raise exception 'Saved after submission'; end if;
end $$;

-- Explicitly verify browser roles cannot call privileged routines.
do $$
begin
 if has_function_privilege('authenticated',
     'exam_private.start_test_attempt(uuid,uuid,text)','EXECUTE') then
   raise exception 'Unexpected authenticated execution access';
 end if;
 if has_function_privilege('anon',
     'exam_private.submit_test_attempt(uuid,uuid)','EXECUTE') then
   raise exception 'Unexpected anonymous execution access';
 end if;
end $$;
