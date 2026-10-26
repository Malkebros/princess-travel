-- Run this once in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/lzikzynkbxrkirvhfirj/sql/new

create table if not exists bookings (
  id text primary key,
  customer_name text not null default '',
  phone text not null default '',
  email text not null default '',
  from_code text not null default '',
  to_code text not null default '',
  depart_date text not null default '',
  return_date text not null default '',
  passengers text not null default '1',
  price text not null default '',
  stage text not null default 'open',
  notes text not null default '',
  next_action text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table bookings enable row level security;

drop policy if exists "bookings_anon_all" on bookings;
create policy "bookings_anon_all"
  on bookings
  for all
  using (true)
  with check (true);

-- Allow both legacy anon JWT and new publishable API keys
grant select, insert, update, delete on table bookings to anon, authenticated, service_role;
