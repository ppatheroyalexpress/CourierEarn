alter table public.users enable row level security;
alter table public.transactions enable row level security;
alter table public.pickups enable row level security;
alter table public.sessions enable row level security;

create or replace function public.current_auth_user_id() returns uuid
language sql stable
as $$
  select coalesce(
    (select auth.uid()),
    null
  );
$$;

create policy if not exists "Users are viewable by owner"
on public.users
for select
using (auth_user_id = auth.uid());

create policy if not exists "Users are updatable by owner"
on public.users
for update
using (auth_user_id = auth.uid());

create policy if not exists "Users can insert own profile"
on public.users
for insert
with check (auth_user_id = auth.uid());

create policy if not exists "Transactions viewable by owner"
on public.transactions
for select
using (user_id in (select id from public.users where auth_user_id = auth.uid()));

create policy if not exists "Transactions updatable by owner"
on public.transactions
for update
using (user_id in (select id from public.users where auth_user_id = auth.uid()));

create policy if not exists "Transactions insertable by owner"
on public.transactions
for insert
with check (user_id in (select id from public.users where auth_user_id = auth.uid()));

create policy if not exists "Pickups viewable by owner"
on public.pickups
for select
using (user_id in (select id from public.users where auth_user_id = auth.uid()));

create policy if not exists "Pickups updatable by owner"
on public.pickups
for update
using (user_id in (select id from public.users where auth_user_id = auth.uid()));

create policy if not exists "Pickups insertable by owner"
on public.pickups
for insert
with check (user_id in (select id from public.users where auth_user_id = auth.uid()));

create policy if not exists "Sessions viewable by owner"
on public.sessions
for select
using (user_id in (select id from public.users where auth_user_id = auth.uid()));

create policy if not exists "Sessions updatable by owner"
on public.sessions
for update
using (user_id in (select id from public.users where auth_user_id = auth.uid()));

create policy if not exists "Sessions insertable by owner"
on public.sessions
for insert
with check (user_id in (select id from public.users where auth_user_id = auth.uid()));
