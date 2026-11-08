begin;

-- Rows recorded before this campaign counter are included in the supplied 1168 baseline.
alter table public.launch_signups
  add column if not exists counted_after_baseline boolean not null default false;
alter table public.launch_signups
  alter column counted_after_baseline set default true;

-- Anonymous visitors can read only an aggregate, never the subscriber list.
create or replace function public.get_launch_signup_count()
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
  select 1168 + count(*) from public.launch_signups
  where counted_after_baseline = true;
$$;

revoke all on function public.get_launch_signup_count() from public, anon, authenticated;
grant execute on function public.get_launch_signup_count() to anon, authenticated;

commit;
