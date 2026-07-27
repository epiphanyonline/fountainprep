do $$
declare
  v_subject_id uuid;
  v_journey_id uuid;
  v_module_id uuid;
begin
  select id
  into v_subject_id
  from public.curriculum_subjects
  where lower(name) = 'yoruba'
  limit 1;

  if v_subject_id is null then
    raise exception 'Yoruba subject was not found';
  end if;

  select id
  into v_journey_id
  from public.curriculum_strands
  where subject_id = v_subject_id
    and stage_id is null
    and lower(title) = 'yoruba foundation'
  limit 1;

  if v_journey_id is null then
    insert into public.curriculum_strands (
      subject_id,
      stage_id,
      title,
      description,
      proficiency_code,
      proficiency_name,
      estimated_hours,
      is_active,
      sort_order
    )
    values (
      v_subject_id,
      null,
      'Yoruba Foundation',
      'Build essential Yoruba speaking and listening skills through greetings, introductions, everyday vocabulary, and simple conversations.',
      'A0',
      'Foundation',
      10,
      true,
      1
    )
    returning id into v_journey_id;
  else
    update public.curriculum_strands
    set
      description = 'Build essential Yoruba speaking and listening skills through greetings, introductions, everyday vocabulary, and simple conversations.',
      proficiency_code = 'A0',
      proficiency_name = 'Foundation',
      estimated_hours = 10,
      is_active = true
    where id = v_journey_id;
  end if;

  select id
  into v_module_id
  from public.curriculum_modules
  where strand_id = v_journey_id
    and lower(title) = 'greetings and introductions'
  limit 1;

  if v_module_id is null then
    insert into public.curriculum_modules (
      strand_id,
      title,
      description,
      sort_order
    )
    values (
      v_journey_id,
      'Greetings and Introductions',
      'Learn how to greet people politely and introduce yourself in Yoruba.',
      1
    )
    returning id into v_module_id;
  end if;

  insert into public.curriculum_lessons (
    module_id,
    title,
    objective,
    homework_hint,
    sort_order
  )
  select
    v_module_id,
    'Good Morning',
    'The learner will be able to say good morning politely in Yoruba.',
    'Practise saying Ẹ káàárọ̀ to someone in the morning.',
    1
  where not exists (
    select 1
    from public.curriculum_lessons
    where module_id = v_module_id
      and lower(title) = 'good morning'
  );

  insert into public.curriculum_lessons (
    module_id,
    title,
    objective,
    homework_hint,
    sort_order
  )
  select
    v_module_id,
    'Good Afternoon',
    'The learner will be able to say good afternoon politely in Yoruba.',
    'Practise saying Ẹ káàsán during the afternoon.',
    2
  where not exists (
    select 1
    from public.curriculum_lessons
    where module_id = v_module_id
      and lower(title) = 'good afternoon'
  );

  insert into public.curriculum_lessons (
    module_id,
    title,
    objective,
    homework_hint,
    sort_order
  )
  select
    v_module_id,
    'Good Evening',
    'The learner will be able to say good evening politely in Yoruba.',
    'Practise saying Ẹ káalẹ́ during the evening.',
    3
  where not exists (
    select 1
    from public.curriculum_lessons
    where module_id = v_module_id
      and lower(title) = 'good evening'
  );

  insert into public.curriculum_lessons (
    module_id,
    title,
    objective,
    homework_hint,
    sort_order
  )
  select
    v_module_id,
    'What Is Your Name?',
    'The learner will be able to ask someone their name in Yoruba.',
    'Practise asking Kí ni orúkọ rẹ?',
    4
  where not exists (
    select 1
    from public.curriculum_lessons
    where module_id = v_module_id
      and lower(title) = 'what is your name?'
  );

  insert into public.curriculum_lessons (
    module_id,
    title,
    objective,
    homework_hint,
    sort_order
  )
  select
    v_module_id,
    'My Name Is',
    'The learner will be able to introduce themselves in Yoruba.',
    'Practise saying Orúkọ mi ni followed by your name.',
    5
  where not exists (
    select 1
    from public.curriculum_lessons
    where module_id = v_module_id
      and lower(title) = 'my name is'
  );
end
$$;