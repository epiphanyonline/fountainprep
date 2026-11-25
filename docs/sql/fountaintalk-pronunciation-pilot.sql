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
commit;
