create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique not null,
  email text unique,
  username text,
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
  cash_collect integer default 0,
  not_cash integer default 0,
  ec integer default 0,
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
  houses integer default 0,
  parcels integer default 0,
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

create table if not exists public.kpi_grades (
  id uuid primary key default gen_random_uuid(),
  branch text not null,
  grade integer not null,
  monthly_ll_point numeric(10,1) not null,
  created_at timestamp with time zone default now(),
  unique(branch, grade)
);
create index if not exists idx_kpi_grades_branch on public.kpi_grades(branch);

create table if not exists public.monthly_kpi (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  year integer not null,
  month integer not null,
  total_points numeric(10,1) not null default 0,
  grade integer not null default 5,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, year, month)
);
create index if not exists idx_monthly_kpi_user_year_month on public.monthly_kpi(user_id, year, month);

create table if not exists public.user_warnings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  warning_date date not null,
  warning_count integer not null default 1,
  reason text,
  created_at timestamp with time zone default now(),
  unique(user_id, warning_date)
);
create index if not exists idx_user_warnings_user_date on public.user_warnings(user_id, warning_date);
