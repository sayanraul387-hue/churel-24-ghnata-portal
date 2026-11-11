
-- CHUREL VERIFICATION PORTAL
-- Maximum 7 member registrations
-- Phone + password authentication
-- Never store passwords in public tables.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 80),
  phone text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'member'
    check (role in ('admin','member'))
);

create table if not exists public.site_settings (
  id integer primary key check (id = 1),
  max_users integer not null default 7
);

-- Ensure the limit constraint allows up to 7.
alter table public.site_settings
drop constraint if exists site_settings_max_users_check;

alter table public.site_settings
add constraint site_settings_max_users_check
check (max_users between 1 and 7);

-- Keep existing setting; create 7 only if no row exists.
insert into public.site_settings(id, max_users)
values (1, 7)
on conflict (id) do nothing;

-- Set the registration limit to 7.
update public.site_settings
set max_users = 7
where id = 1;

create table if not exists public.login_activity (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  logged_in_at timestamptz not null default now()
);

create table if not exists public.member_content (
  id integer primary key check (id = 1),
  title text not null default 'Welcome',
  body text not null default 'The administrator has not added information yet.',
  updated_at timestamptz not null default now()
);

insert into public.member_content(id, title, body)
values (1, 'Welcome', 'The administrator has not added information yet.')
on conflict (id) do nothing;

-- Registration limit function.
create or replace function public.handle_new_member()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_count integer;
  supplied_name text;
  allowed_users integer;
begin
  -- Serialize simultaneous registrations.
  perform pg_advisory_xact_lock(74102911);

  select count(*)
  into current_count
  from public.profiles;

  select max_users
  into allowed_users
  from public.site_settings
  where id = 1;

  if allowed_users is null then
    raise exception 'Registration settings are missing.';
  end if;

  if current_count >= allowed_users then
    raise exception 'Maximum user limit reached: all registration slots are occupied.';
  end if;

  supplied_name := coalesce(
    new.raw_user_meta_data ->> 'full_name',
    'Member'
  );

  if char_length(trim(supplied_name)) < 2 then
    raise exception 'Please provide a valid full name.';
  end if;

  insert into public.profiles(id, full_name, phone)
  values (new.id, trim(supplied_name), new.phone);

  insert into public.user_roles(user_id, role)
  values (new.id, 'member');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_limited on auth.users;

create trigger on_auth_user_created_limited
after insert on auth.users
for each row
execute function public.handle_new_member();

-- Admin role helper.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = (select auth.uid())
      and role = 'admin'
  );
$$;

-- Enable RLS.
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.site_settings enable row level security;
alter table public.login_activity enable row level security;
alter table public.member_content enable row level security;

-- Profiles policies.
drop policy if exists "members read own profile; admins read all"
on public.profiles;

create policy "members read own profile; admins read all"
on public.profiles
for select to authenticated
using (
  id = (select auth.uid())
  or public.is_admin()
);

-- User roles policies.
drop policy if exists "users read own role; admins read all roles"
on public.user_roles;

create policy "users read own role; admins read all roles"
on public.user_roles
for select to authenticated
using (
  user_id = (select auth.uid())
  or public.is_admin()
);

-- Site settings policies.
drop policy if exists "authenticated users read settings"
on public.site_settings;

create policy "authenticated users read settings"
on public.site_settings
for select to authenticated
using (true);

drop policy if exists "admins manage settings"
on public.site_settings;

create policy "admins manage settings"
on public.site_settings
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Login activity policies.
drop policy if exists "admins read login activity"
on public.login_activity;

create policy "admins read login activity"
on public.login_activity
for select to authenticated
using (public.is_admin());

-- Member content policies.
drop policy if exists "authenticated users read member content"
on public.member_content;

create policy "authenticated users read member content"
on public.member_content
for select to authenticated
using (true);

drop policy if exists "admins manage member content"
on public.member_content;

create policy "admins manage member content"
on public.member_content
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Permissions.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;

revoke all on public.user_roles from anon, authenticated;
grant select on public.user_roles to authenticated;

revoke all on public.login_activity from anon, authenticated;
grant select on public.login_activity to authenticated;

revoke all on public.site_settings from anon, authenticated;
grant select on public.site_settings to authenticated;
grant insert, update, delete on public.site_settings to authenticated;

revoke all on public.member_content from anon, authenticated;
grant select on public.member_content to authenticated;
grant insert, update, delete on public.member_content to authenticated;

-- Secure login audit.
create or replace function public.record_my_login()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required.';
  end if;

  insert into public.login_activity(user_id)
  values (auth.uid());
end;
$$;

revoke all on function public.record_my_login()
from public, anon;

grant execute on function public.record_my_login()
to authenticated;

-- IMPORTANT:
-- After creating your account, promote your own account to admin.
-- Replace the phone number with your verified E.164 phone number.
--
-- update public.user_roles r
-- set role = 'admin'
-- from auth.users u
-- where r.user_id = u.id
-- and u.phone = '+919876543210';
