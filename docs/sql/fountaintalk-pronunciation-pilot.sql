-- STAGING SCHEMA DRAFT. Do not execute on production. Convert to a verified migration
-- using the Supabase CLI after applying/testing on an isolated development database.
begin;
create table public.fountaintalk_pronunciation_revisions (
  id bigint generated always as identity primary key,
  language text not null check (language in ('yoruba','igbo','hausa','mandarin','spanish','french')),
  phrase text collate "C" not null check (char_length(phrase) between 1 and 400),
  audio_base64 text not null check (char_length(audio_base64) between 1 and 2000000),
  content_type text not null check (content_type in ('audio/wav','audio/mpeg')),
  review_note text not null check (char_length(review_note) between 1 and 500),
  approved_by uuid not null,
  created_at timestamptz not null default now()
);
create index fountaintalk_pronunciation_revision_lookup
  on public.fountaintalk_pronunciation_revisions(language, phrase, id desc);
alter table public.fountaintalk_pronunciation_revisions enable row level security;
revoke all on public.fountaintalk_pronunciation_revisions from public, anon, authenticated, service_role;
grant select, insert on public.fountaintalk_pronunciation_revisions to service_role;
grant usage, select on sequence public.fountaintalk_pronunciation_revisions_id_seq to service_role;

create table public.fountaintalk_speech_pilot_quota (
  user_id uuid not null,
  quota_day date not null,
  requests integer not null check (requests between 1 and 100),
  primary key (user_id, quota_day)
);
alter table public.fountaintalk_speech_pilot_quota enable row level security;
revoke all on public.fountaintalk_speech_pilot_quota from public, anon, authenticated, service_role;
grant select, insert, update on public.fountaintalk_speech_pilot_quota to service_role;

create function public.fountaintalk_reserve_speech_pilot(p_user_id uuid)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare reserved_count integer;
begin
  insert into public.fountaintalk_speech_pilot_quota as q(user_id, quota_day, requests)
  values (p_user_id, (now() at time zone 'UTC')::date, 1)
  on conflict (user_id, quota_day) do update set requests = q.requests + 1
  where q.requests < 100
  returning requests into reserved_count;
  return reserved_count is not null;
end;
$$;
revoke all on function public.fountaintalk_reserve_speech_pilot(uuid) from public, anon, authenticated;
grant execute on function public.fountaintalk_reserve_speech_pilot(uuid) to service_role;
-- Optional generated-audio cache: static curriculum phrases only.
create table public.fountaintalk_speech_cache (
  language text not null check (language in ('yoruba','igbo','hausa','mandarin','spanish','french')),
  phrase text collate "C" not null check (char_length(phrase) between 1 and 400),
  voice_version text not null check (char_length(voice_version) between 1 and 200),
  audio_base64 text not null check (char_length(audio_base64) between 1 and 2000000),
  created_at timestamptz not null default now(),
  primary key (language, phrase, voice_version)
);
alter table public.fountaintalk_speech_cache enable row level security;
revoke all on public.fountaintalk_speech_cache from public, anon, authenticated, service_role;
grant select, insert on public.fountaintalk_speech_cache to service_role;

create table public.fountaintalk_pronunciation_reports (
  reporter_id uuid not null,
  language text not null check (language in ('yoruba','igbo','hausa','mandarin','spanish','french')),
  phrase text collate "C" not null check (char_length(phrase) between 1 and 400),
  lesson_id text not null check (char_length(lesson_id) between 1 and 200),
  revision_id bigint not null default 0,
  reported_at timestamptz not null default now(),
  dismissed boolean not null default false,
  primary key (reporter_id, language, phrase, revision_id)
);
create index fountaintalk_pronunciation_reports_inbox
  on public.fountaintalk_pronunciation_reports(language, phrase, revision_id) where not dismissed;
alter table public.fountaintalk_pronunciation_reports enable row level security;
revoke all on public.fountaintalk_pronunciation_reports from public, anon, authenticated, service_role;
grant select, insert, update on public.fountaintalk_pronunciation_reports to service_role;

create function public.fountaintalk_report_pronunciation(p_reporter uuid, p_language text, p_phrase text, p_lesson text)
returns void language sql security invoker set search_path = '' as $
  insert into public.fountaintalk_pronunciation_reports(reporter_id, language, phrase, lesson_id, revision_id)
  values (p_reporter,p_language,p_phrase,p_lesson,coalesce((
    select max(r.id) from public.fountaintalk_pronunciation_revisions r where r.language=p_language and r.phrase=p_phrase
  ),0))
  on conflict (reporter_id,language,phrase,revision_id) do nothing;
$;
revoke all on function public.fountaintalk_report_pronunciation(uuid,text,text,text) from public, anon, authenticated;
grant execute on function public.fountaintalk_report_pronunciation(uuid,text,text,text) to service_role;

create function public.fountaintalk_open_pronunciation_issues(p_language text)
returns table(phrase text, report_count bigint, latest_report timestamptz, lesson_id text)
language sql stable security invoker set search_path = '' as $
  select p.phrase, count(*), max(p.reported_at), min(p.lesson_id)
  from public.fountaintalk_pronunciation_reports p
  where p.language=p_language and not p.dismissed
    and p.revision_id=coalesce((select max(r.id) from public.fountaintalk_pronunciation_revisions r
        where r.language=p.language and r.phrase=p.phrase),0)
  group by p.phrase
  order by count(*) desc, max(p.reported_at) desc
  limit 100;
$;
revoke all on function public.fountaintalk_open_pronunciation_issues(text) from public, anon, authenticated;
grant execute on function public.fountaintalk_open_pronunciation_issues(text) to service_role;
commit;
