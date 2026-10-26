-- Run this once in the Supabase SQL Editor (Dashboard → SQL → New query)

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

-- Simple private desk: the Next.js API talks to Supabase.
-- Keep your Vercel URL private (family use). Add real auth later if needed.
drop policy if exists "bookings_anon_all" on bookings;
create policy "bookings_anon_all"
  on bookings
  for all
  to anon, authenticated
  using (true)
  with check (true);
