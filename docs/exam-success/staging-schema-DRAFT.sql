-- DESIGN ONLY. THIS FILE IS NOT IN supabase/migrations AND MUST NOT BE APPLIED
-- TO THE CURRENT FOUNTAIN PREP DATABASE.
-- Rehearse in an isolated Supabase staging database first.
-- All content is synthetic; no production learner rows are touched.
begin;

create table public.exam_papers (
  id uuid primary key default gen_random_uuid(),
  board text not null check(board in ('JAMB','WAEC','NECO','IELTS')),
  variant text not null,
  country_code char(2) not null,
  syllabus_year integer not null check(syllabus_year between 2000 and 2100),
  version integer not null check(version > 0),
  status text not null default 'draft' check(status in ('draft','reviewed','published','retired')),
  duration_seconds integer not null check(duration_seconds > 0),
  title text not null,
  reviewed_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  constraint exam_paper_variant_valid check(
    (board='JAMB' and variant='utme' and country_code='NG') or
    (board='WAEC' and variant='wassce' and country_code='NG') or
    (board='NECO' and variant='ssce' and country_code='NG') or
    (board='IELTS' and variant in ('academic','general_training'))
  ),
  constraint exam_papers_reviewed_before_publish check(
    status <> 'published' or reviewed_by is not null
  ),
  unique(board,variant,country_code,syllabus_year,version)
);

create table public.exam_questions (
  id uuid primary key default gen_random_uuid(),
  board text not null,
  syllabus_year integer not null,
  subject_code text not null,
  topic_code text not null,
  prompt text not null,
  options jsonb not null,
  points numeric(8,2) not null check(points > 0),
  licence text not null,
  reviewed_by uuid references auth.users(id),
  status text not null default 'draft' check(status in ('draft','reviewed','published','retired')),
  created_at timestamptz not null default now(),
  constraint exam_options_array check(jsonb_typeof(options)='array'),
  constraint exam_question_reviewed_before_publish check(status <> 'published' or reviewed_by is not null)
);

create table public.exam_paper_questions (
  paper_id uuid not null references public.exam_papers(id) on delete restrict,
  question_id uuid not null references public.exam_questions(id) on delete restrict,
  sort_order integer not null check(sort_order >= 0),
  primary key(paper_id,question_id),
  unique(paper_id,sort_order)
);

-- Isolated private marking data: not directly exposed by the Data API.
create schema if not exists exam_private;
create table exam_private.answer_keys (
  question_id uuid primary key references public.exam_questions(id) on delete restrict,
  correct_option_id text not null
);
revoke all on schema exam_private from public, anon, authenticated;
revoke all on all tables in schema exam_private from public, anon, authenticated;

create table public.exam_attempts (
  id uuid primary key default gen_random_uuid(),
  paper_id uuid not null references public.exam_papers(id) on delete restrict,
  learner_user_id uuid not null references auth.users(id),
  state text not null default 'in_progress' check(state in ('in_progress','submitted','expired')),
  started_at timestamptz not null default now(),
  expires_at timestamptz not null,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  constraint exam_attempt_time_valid check(expires_at > started_at),
  constraint exam_attempt_submit_valid check(
    (state='submitted' and submitted_at is not null)
    or (state<>'submitted' and submitted_at is null)
  )
);
create index exam_attempts_owner_idx on public.exam_attempts(learner_user_id,created_at desc);

create table public.exam_attempt_answers (
  attempt_id uuid not null references public.exam_attempts(id) on delete cascade,
  question_id uuid not null references public.exam_questions(id) on delete restrict,
  selected_option_id text,
  saved_at timestamptz not null default now(),
  primary key(attempt_id,question_id)
);

create table public.exam_results (
  attempt_id uuid primary key references public.exam_attempts(id) on delete cascade,
  earned numeric(10,2) not null check(earned >= 0),
  possible numeric(10,2) not null check(possible >= earned),
  scored_at timestamptz not null default now(),
  marking_version text not null
);

-- Critical rule: browser clients can READ OWN attempts and results only.
-- They CANNOT directly create attempts, save answers or submit exams.
-- All mutations must occur through an authenticated, server-only service
-- that verifies user, paper status, question membership, time window and
-- idempotency. Its own service-role privilege must never reach the browser.
alter table public.exam_papers enable row level security;
alter table public.exam_questions enable row level security;
alter table public.exam_paper_questions enable row level security;
alter table public.exam_attempts enable row level security;
alter table public.exam_attempt_answers enable row level security;
alter table public.exam_results enable row level security;
alter table exam_private.answer_keys enable row level security;

-- Public catalogue: published papers only. Question payloads are NOT exposed
-- yet: only an authenticated endpoint should reveal active assigned questions.
create policy exam_papers_catalogue on public.exam_papers
for select to authenticated using(status='published');
create policy exam_attempts_owner_read on public.exam_attempts
for select to authenticated using(learner_user_id=(select auth.uid()));
create policy exam_answers_owner_read on public.exam_attempt_answers
for select to authenticated using(
 exists(select 1 from public.exam_attempts a
 where a.id=attempt_id and a.learner_user_id=(select auth.uid()))
);
create policy exam_results_owner_read on public.exam_results
for select to authenticated using(
 exists(select 1 from public.exam_attempts a
 where a.id=attempt_id and a.learner_user_id=(select auth.uid()))
);

-- Eliminate unexpected access from default grants, including broad writes.
revoke all on public.exam_papers,public.exam_questions,public.exam_paper_questions,
 public.exam_attempts,public.exam_attempt_answers,public.exam_results from anon, authenticated;
grant select on public.exam_papers,public.exam_attempts,public.exam_attempt_answers,
 public.exam_results to authenticated;
-- No direct client grants to exam_questions, paper_questions or private keys.

commit;

-- NOT READY FOR PRODUCTION:
-- (1) Needs migration-generation via CLI, staging permission validation.
-- (2) Requires trusted transactional server save/submit/scoring procedures.
-- (3) Requires paper immutability enforcement after first attempt.
-- (4) Needs academic review workflow, assets, variants and author licensing.
-- (5) App endpoints must not be enabled while these gates are open.
