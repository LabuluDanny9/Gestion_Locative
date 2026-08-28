-- Creates the first real organization for an authenticated account.
-- This is intentionally empty of business/demo data.

create or replace function public.bootstrap_owner_organization(
  p_name text default 'AMIRANDA EMPIRE',
  p_code text default 'AMIRANDA'
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_organization_id uuid;
  v_name text := btrim(p_name);
  v_code text := upper(btrim(p_code));
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  select organization_id into v_organization_id
  from public.organization_members
  where user_id = v_user_id and status = 'active'
  order by joined_at nulls last, created_at
  limit 1;

  if v_organization_id is not null then
    return v_organization_id;
  end if;

  if v_name = '' or v_code !~ '^[A-Z0-9][A-Z0-9_-]{1,31}$' then
    raise exception 'Invalid organization name or code' using errcode = '22023';
  end if;

  insert into public.organizations (
    code, name, slug, status, default_currency, timezone, locale, is_demo, created_by
  ) values (
    v_code,
    v_name,
    lower(regexp_replace(v_code, '[^A-Z0-9]+', '-', 'g')),
    'active',
    'USD',
    'Africa/Lubumbashi',
    'fr-CD',
    false,
    v_user_id
  )
  returning id into v_organization_id;

  insert into public.organization_members (
    organization_id, user_id, role, status, permissions, invited_by, joined_at
  ) values (
    v_organization_id, v_user_id, 'owner', 'active', '{}'::jsonb, v_user_id, statement_timestamp()
  );

  insert into public.app_settings (
    organization_id, platform_name, default_currency, timezone
  ) values (
    v_organization_id, v_name, 'USD', 'Africa/Lubumbashi'
  );

  return v_organization_id;
end;
$$;

revoke all on function public.bootstrap_owner_organization(text, text) from public, anon;
grant execute on function public.bootstrap_owner_organization(text, text) to authenticated;

comment on function public.bootstrap_owner_organization(text, text) is
  'Creates one real owner organization for an authenticated account when none exists.';
