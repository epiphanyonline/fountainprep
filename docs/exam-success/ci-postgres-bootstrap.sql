-- TEST BOOTSTRAP ONLY: ephemeral PostgreSQL CI database, NEVER production.
-- Supabase auth objects needed by the staging schema.
create schema if not exists auth;
create table if not exists auth.users (id uuid primary key);
create or replace function auth.uid() returns uuid
language sql stable as $$ select null::uuid $$;
-- Mimic Supabase roles for RLS/grants inspection.
do $$
begin
  if not exists (select 1 from pg_roles where rolname='anon') then
    create role anon nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname='authenticated') then
    create role authenticated nologin;
  end if;
end $$;
