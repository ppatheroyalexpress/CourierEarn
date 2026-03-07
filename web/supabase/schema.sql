create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique not null,
  email text unique,
  full_name text,
  avatar_url text,
  branch text,
  phone text,
  created_at timestamp with time zone default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  pickup_location text not null,
  dropoff_location text not null,
  amount numeric(10,2) not null,
  status text check (status in ('pending','in_transit','delivered','cancelled')) default 'pending',
  created_at timestamp with time zone default now(),
  delivered_at timestamp with time zone
);
create index if not exists idx_transactions_user_id on public.transactions(user_id);
create index if not exists idx_transactions_status on public.transactions(status);

create table if not exists public.pickups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  scheduled_at timestamp with time zone not null,
  location text not null,
  notes text,
  created_at timestamp with time zone default now()
);
create index if not exists idx_pickups_user_id on public.pickups(user_id);
create index if not exists idx_pickups_scheduled_at on public.pickups(scheduled_at);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  expires_at timestamp with time zone not null,
  device_info text
);
create index if not exists idx_sessions_user_id on public.sessions(user_id);
create index if not exists idx_sessions_expires_at on public.sessions(expires_at);
