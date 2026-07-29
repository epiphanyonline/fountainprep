do $$
declare
  v_strand_id uuid :=
    'bc906c62-107b-4137-ad7b-eaca64504f00';

  v_module_id uuid;
begin
  select id
  into v_module_id
  from public.curriculum_modules
  where strand_id = v_strand_id
    and title = 'Meeting People'
  limit 1;

  if v_module_id is null then
    insert into public.curriculum_modules (
      strand_id,
      title,
      description,
      sort_order
    )
    values (
      v_strand_id,
      'Meeting People',
      'Simple introductions and polite expressions for meeting someone.',
      2
    )
    returning id
    into v_module_id;
  end if;

  if not exists (
    select 1
    from public.curriculum_lessons
    where module_id = v_module_id
      and title = 'Nice to Meet You'
  ) then
    insert into public.curriculum_lessons (
      module_id,
      title,
      objective,
      homework_hint,
      sort_order
    )
    values (
      v_module_id,
      'Nice to Meet You',
      'The learner will be able to respond politely when meeting someone.',
      'Practise saying a polite greeting to one family member.',
      1
    );
  end if;
end;
$$;