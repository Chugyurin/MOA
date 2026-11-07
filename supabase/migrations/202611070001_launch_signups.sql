begin;

create table if not exists public.launch_signups (
  id bigint generated always as identity primary key,
  email text not null unique check (length(email) <= 254),
  consent boolean not null check (consent = true),
  created_at timestamptz not null default now()
);

alter table public.launch_signups enable row level security;
revoke all on table public.launch_signups from anon, authenticated;
revoke all on sequence public.launch_signups_id_seq from anon, authenticated;

-- This function is the only visitor-facing entrypoint: insert only, no lookup.
-- The fixed search_path and qualified table prevent object substitution.
create or replace function public.submit_launch_signup(p_email text, p_consent boolean)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_email text := lower(btrim(p_email));
begin
  if p_consent is distinct from true
    or normalized_email is null
    or length(normalized_email) > 254
    or normalized_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  then
    raise exception 'Invalid signup' using errcode = '22023';
  end if;

  insert into public.launch_signups(email, consent)
  values (normalized_email, true)
  on conflict (email) do nothing;
  -- Same result for new/duplicate emails; never reveal existing subscribers.
  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.submit_launch_signup(text, boolean) from public, anon, authenticated;
grant execute on function public.submit_launch_signup(text, boolean) to anon, authenticated;

commit;
