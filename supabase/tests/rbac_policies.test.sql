begin;

select extensions.plan(15);

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
select
  '00000000-0000-0000-0000-000000000000'::uuid,
  id,
  'authenticated',
  'authenticated',
  role || '@rbac.test',
  '',
  statement_timestamp(),
  '{}'::jsonb,
  jsonb_build_object('display_name', initcap(role)),
  statement_timestamp(),
  statement_timestamp()
from (values
  ('10000000-0000-0000-0000-000000000001'::uuid, 'superadmin'),
  ('10000000-0000-0000-0000-000000000002'::uuid, 'owner'),
  ('10000000-0000-0000-0000-000000000003'::uuid, 'manager'),
  ('10000000-0000-0000-0000-000000000004'::uuid, 'cashier'),
  ('10000000-0000-0000-0000-000000000005'::uuid, 'tenant')
) as users(id, role);

insert into public.organizations (id, code, name, slug)
values
  ('20000000-0000-0000-0000-000000000001', 'RBAC-A', 'Organisation A', 'rbac-a'),
  ('20000000-0000-0000-0000-000000000002', 'RBAC-B', 'Organisation B', 'rbac-b');

insert into public.organization_members (
  organization_id, user_id, role, status, joined_at, permissions
)
values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'super_admin', 'active', now(), '{}'),
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'owner', 'active', now(), '{}'),
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'manager', 'active', now(), '{"portfolio.read": false}'),
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'cashier', 'active', now(), '{"finance.manage": true}'),
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005', 'tenant', 'active', now(), '{}');

create function pg_temp.allowed(p_user uuid, p_permission public.app_permission)
returns boolean
language plpgsql
as $$
begin
  perform set_config('request.jwt.claim.sub', p_user::text, true);
  perform set_config('request.jwt.claims', jsonb_build_object('sub', p_user, 'role', 'authenticated')::text, true);
  return private.has_permission('20000000-0000-0000-0000-000000000001', p_permission);
end;
$$;

select extensions.is((select count(*) from public.profiles where id::text like '10000000-%'), 5::bigint, 'auth trigger creates one profile per user');
select extensions.ok(pg_temp.allowed('10000000-0000-0000-0000-000000000001', 'audit.read'), 'super admin has audit access');
select extensions.ok(pg_temp.allowed('10000000-0000-0000-0000-000000000002', 'members.manage'), 'owner manages members');
select extensions.ok(pg_temp.allowed('10000000-0000-0000-0000-000000000002', 'organization.update'), 'owner updates organization');
select extensions.ok(pg_temp.allowed('10000000-0000-0000-0000-000000000003', 'portfolio.manage'), 'manager manages portfolio');
select extensions.ok(not pg_temp.allowed('10000000-0000-0000-0000-000000000003', 'members.manage'), 'manager cannot manage members by default');
select extensions.ok(not pg_temp.allowed('10000000-0000-0000-0000-000000000003', 'portfolio.read'), 'boolean override can remove a default permission');
select extensions.ok(pg_temp.allowed('10000000-0000-0000-0000-000000000004', 'payments.create'), 'cashier records payments');
select extensions.ok(pg_temp.allowed('10000000-0000-0000-0000-000000000004', 'finance.manage'), 'boolean override can add a permission');
select extensions.ok(not pg_temp.allowed('10000000-0000-0000-0000-000000000004', 'members.read'), 'cashier cannot browse members');
select extensions.ok(pg_temp.allowed('10000000-0000-0000-0000-000000000005', 'portal.read'), 'tenant accesses own portal');
select extensions.ok(pg_temp.allowed('10000000-0000-0000-0000-000000000005', 'maintenance.create'), 'tenant creates maintenance request');
select extensions.ok(not pg_temp.allowed('10000000-0000-0000-0000-000000000005', 'finance.read'), 'tenant cannot browse organization finances');

select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000002', true);
select extensions.ok(not private.is_active_member('20000000-0000-0000-0000-000000000002'), 'membership never crosses organizations');

select extensions.ok(
  (select count(*) from pg_policies where schemaname = 'public' and roles @> array['authenticated'::name]) >= 90,
  'authenticated policies are installed on the application schema'
);

select * from extensions.finish();
rollback;
