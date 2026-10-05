-- FinLed entitlement: run once in Supabase SQL Editor. No secret keys here.

create table if not exists public.subscriptions (
  user_id            uuid primary key references auth.users(id) on delete cascade,
  plan               text not null default 'free' check (plan in ('free','plus','pro')),
  status             text not null default 'inactive' check (status in ('inactive','trialing','active','past_due','canceled')),
  current_period_end timestamptz,
  trial_end          timestamptz,
  provider           text,          -- 'paymongo' | 'xendit' | 'manual_gcash' | 'manual_maya' ...
  provider_ref       text,          -- payment / checkout / reference id from the provider
  updated_at         timestamptz not null default now()
);

alter table public.subscriptions enable row level security;
alter table public.subscriptions force row level security;

-- Signed-in users may read ONLY their own row. No insert/update/delete policies exist,
-- so the browser (anon/authenticated roles) cannot write. The service role bypasses RLS.
drop policy if exists "read own subscription" on public.subscriptions;
create policy "read own subscription" on public.subscriptions
  for select to authenticated using (auth.uid() = user_id);

revoke all on public.subscriptions from anon, authenticated;
grant select on public.subscriptions to authenticated;

-- One 14-day Pro trial per account, decided on the server.
-- SECURITY DEFINER lets this one function write the row; callers cannot choose the dates or plan.
create or replace function public.start_trial()
returns public.subscriptions
language plpgsql security definer set search_path = public as $$
declare r public.subscriptions;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  insert into public.subscriptions (user_id, plan, status, trial_end, provider, updated_at)
  values (auth.uid(), 'pro', 'trialing', now() + interval '14 days', 'trial', now())
  on conflict (user_id) do nothing;
  select * into r from public.subscriptions where user_id = auth.uid();
  return r;
end $$;
revoke all on function public.start_trial() from public, anon;
grant execute on function public.start_trial() to authenticated;
