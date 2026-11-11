
-- One-time login setup

create table if not exists public.member_first_login (
  user_id uuid primary key references auth.users(id) on delete cascade,
  claimed_at timestamptz not null default now()
);

create or replace function public.claim_first_member_login()
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid;
  current_role text;
begin
  current_user_id := auth.uid();

  if current_user_id is null then
    raise exception 'Authentication required.';
  end if;

  select role into current_role
  from public.user_roles
  where user_id = current_user_id;

  if current_role is null then
    raise exception 'User role not found.';
  end if;

  -- Admin can log in more than once.
  if current_role = 'admin' then
    insert into public.login_activity(user_id)
    values (current_user_id);
    return true;
  end if;

  -- A member can log in only once.
  insert into public.member_first_login(user_id)
  values (current_user_id)
  on conflict (user_id) do nothing;

  if not found then
    return false;
  end if;

  insert into public.login_activity(user_id)
  values (current_user_id);

  return true;
end;
$$;

revoke all on function public.claim_first_member_login() from public, anon;
grant execute on function public.claim_first_member_login() to authenticated;

alter table public.member_first_login enable row level security;

revoke all on public.member_first_login from anon, authenticated;
