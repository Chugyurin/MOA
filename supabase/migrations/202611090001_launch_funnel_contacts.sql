begin;
-- Also support installations where the earlier aggregate-count migration was not applied.
alter table public.launch_signups add column if not exists counted_after_baseline boolean not null default false;
alter table public.launch_signups alter column counted_after_baseline set default true;
alter table public.launch_signups alter column email drop not null;
alter table public.launch_signups add column phone text unique;
alter table public.launch_signups add column is_test boolean not null default false;
alter table public.launch_signups add constraint launch_signups_one_contact check (num_nonnulls(email,phone)=1);
alter table public.launch_signups add constraint launch_signups_phone_format check(phone is null or phone ~ '^\+[1-9][0-9]{7,14}$');

create table public.launch_events (
 event_id uuid primary key,
 event_name text not null check(event_name in ('page_view','cta_view','cta_click','dialog_open','contact_focus','contact_input_started','contact_valid','contact_blur','consent_changed','submit_attempt','validation_error','submit_started','submit_retry','submit_failed','submit_success','dialog_closed','dialog_interrupted')),
 session_id uuid not null,
 page_id uuid not null,
 flow_id uuid,
 page_path text not null check(page_path in ('/','/how','/care','/price','/about','/404')),
 source text check(source in ('launch_dock','hash','api')),
 contact_type text check(contact_type in ('email','phone','unknown')),
 consent boolean,
 reason text check(reason in ('close_button','escape','outside','success_confirm','hidden','pagehide','contact_invalid','consent_required','save_failed','save_timeout','completed','abandoned')),
 attempt integer check(attempt between 0 and 100),
 elapsed_ms integer check(elapsed_ms between 0 and 86400000),
 is_test boolean not null default false,
 occurred_at timestamptz not null,
 received_at timestamptz not null default now()
);
create index launch_events_name_received on public.launch_events(event_name,received_at);
create index launch_events_flow on public.launch_events(flow_id);
alter table public.launch_events enable row level security;
revoke all on public.launch_events from public, anon, authenticated;

create schema if not exists private;
create function private.store_launch_events(p_events jsonb,p_allow_success boolean)
returns void language plpgsql security definer set search_path = '' as $$
declare e jsonb;
begin
 if p_events is null or jsonb_typeof(p_events) <> 'array' or jsonb_array_length(p_events) not between 1 and 20 or octet_length(p_events::text)>24000 then
  raise exception 'Invalid event batch' using errcode='22023';
 end if;
 for e in select value from jsonb_array_elements(p_events) loop
  if jsonb_typeof(e)<>'object' or exists(select 1 from jsonb_object_keys(e) k where k not in ('event_id','event_name','session_id','page_id','flow_id','page_path','source','contact_type','consent','reason','attempt','elapsed_ms','occurred_at','is_test')) then
   raise exception 'Unsupported event field' using errcode='22023';
  end if;
  if not p_allow_success and e->>'event_name'='submit_success' then
   raise exception 'Success is recorded by the signup transaction' using errcode='22023';
  end if;
  insert into public.launch_events(event_id,event_name,session_id,page_id,flow_id,page_path,source,contact_type,consent,reason,attempt,elapsed_ms,occurred_at,is_test)
  values((e->>'event_id')::uuid,e->>'event_name',(e->>'session_id')::uuid,(e->>'page_id')::uuid,(e->>'flow_id')::uuid,e->>'page_path',e->>'source',e->>'contact_type',(e->>'consent')::boolean,e->>'reason',(e->>'attempt')::integer,(e->>'elapsed_ms')::integer,(e->>'occurred_at')::timestamptz,coalesce((e->>'is_test')::boolean,false))
  on conflict(event_id) do nothing;
 end loop;
end; $$;
revoke all on function private.store_launch_events(jsonb,boolean) from public, anon, authenticated;

create function public.record_launch_events(p_events jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
 perform private.store_launch_events(p_events,false);
 return jsonb_build_object('ok',true);
end; $$;
revoke all on function public.record_launch_events(jsonb) from public, anon, authenticated;
grant execute on function public.record_launch_events(jsonb) to anon, authenticated;

create function public.submit_launch_contact(p_contact text,p_consent boolean,p_context jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
 normalized text := lower(btrim(p_contact));
 kind text;
 e jsonb;
begin
 if p_consent is distinct from true or normalized is null or length(normalized)>254 then
  raise exception 'Invalid signup' using errcode='22023';
 end if;
 if position('@' in normalized)>0 then
  if normalized !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then raise exception 'Invalid email' using errcode='22023'; end if;
  kind := 'email';
  insert into public.launch_signups(email,consent,is_test) values(normalized,true,coalesce((p_context->>'is_test')::boolean,false)) on conflict(email) do nothing;
 else
  if normalized !~ '^[+0-9[:space:]().-]+$' then raise exception 'Invalid phone' using errcode='22023'; end if;
  normalized := regexp_replace(normalized,'[[:space:]().-]','','g');
  if left(normalized,3)='+82' then normalized := '0' || regexp_replace(substr(normalized,4),'^0',''); end if;
  if left(normalized,1)='0' then
   if normalized !~ '^(010[0-9]{8}|01[16789][0-9]{7,8}|02[0-9]{7,8}|0[3-6][1-5][0-9]{7,8}|070[0-9]{8}|050[0-9]{8,9})$' then raise exception 'Invalid phone' using errcode='22023'; end if;
   normalized := '+82' || substr(normalized,2);
  end if;
  if normalized !~ '^\+[1-9][0-9]{7,14}$' then raise exception 'Invalid phone' using errcode='22023'; end if;
  kind := 'phone';
  insert into public.launch_signups(phone,consent,is_test) values(normalized,true,coalesce((p_context->>'is_test')::boolean,false)) on conflict(phone) do nothing;
 end if;
 e := jsonb_build_object('event_id',gen_random_uuid(),'session_id',gen_random_uuid(),'page_id',gen_random_uuid(),'page_path','/','source','api','occurred_at',now())
  || coalesce(p_context,'{}'::jsonb) || jsonb_build_object('event_name','submit_success','contact_type',kind,'consent',true);
 perform private.store_launch_events(jsonb_build_array(e),true);
 return jsonb_build_object('ok',true);
end; $$;
revoke all on function public.submit_launch_contact(text,boolean,jsonb) from public, anon, authenticated;
grant execute on function public.submit_launch_contact(text,boolean,jsonb) to anon, authenticated;

create view public.launch_event_counts with (security_invoker=true) as
 select (received_at at time zone 'Asia/Seoul')::date as day_kst,event_name,
 count(*) as event_count,count(distinct session_id) as session_count,count(distinct flow_id) as flow_count
 from public.launch_events where is_test=false group by 1,2;
revoke all on public.launch_event_counts from public, anon, authenticated;
create or replace function public.get_launch_signup_count()
returns bigint language sql stable security definer set search_path = '' as $$
 select 1168 + count(*) from public.launch_signups where counted_after_baseline=true and is_test=false;
$$;
revoke all on function public.get_launch_signup_count() from public, anon, authenticated;
grant execute on function public.get_launch_signup_count() to anon, authenticated;
commit;
