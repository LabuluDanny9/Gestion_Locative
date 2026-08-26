-- Phase 3: authentication support, role permissions and tenant-safe RLS.
create type public.app_permission as enum (
  'organization.read',
  'organization.update',
  'members.read',
  'members.manage',
  'portfolio.read',
  'portfolio.manage',
  'tenants.read',
  'tenants.manage',
  'leases.read',
  'leases.manage',
  'finance.read',
  'finance.manage',
  'payments.create',
  'notifications.read',
  'notifications.manage',
  'documents.read',
  'documents.manage',
  'settings.read',
  'settings.manage',
  'reports.read',
  'audit.read',
  'portal.read',
  'maintenance.create'
);

create table public.role_permissions (
  role public.app_role not null,
  permission public.app_permission not null,
  created_at timestamptz not null default statement_timestamp(),
  primary key (role, permission)
);

comment on table public.role_permissions is
  'Immutable default permission matrix. Per-membership boolean overrides live in organization_members.permissions.';

insert into public.role_permissions (role, permission)
select role, permission
from unnest(array['super_admin', 'owner']::public.app_role[]) as role
cross join unnest(enum_range(null::public.app_permission)) as permission;

insert into public.role_permissions (role, permission) values
  ('manager', 'organization.read'),
  ('manager', 'members.read'),
  ('manager', 'portfolio.read'),
  ('manager', 'portfolio.manage'),
  ('manager', 'tenants.read'),
  ('manager', 'tenants.manage'),
  ('manager', 'leases.read'),
  ('manager', 'leases.manage'),
  ('manager', 'finance.read'),
  ('manager', 'payments.create'),
  ('manager', 'notifications.read'),
  ('manager', 'notifications.manage'),
  ('manager', 'documents.read'),
  ('manager', 'documents.manage'),
  ('manager', 'settings.read'),
  ('manager', 'reports.read'),
  ('cashier', 'organization.read'),
  ('cashier', 'portfolio.read'),
  ('cashier', 'tenants.read'),
  ('cashier', 'leases.read'),
  ('cashier', 'finance.read'),
  ('cashier', 'payments.create'),
  ('cashier', 'documents.read'),
  ('cashier', 'reports.read'),
  ('tenant', 'organization.read'),
  ('tenant', 'portal.read'),
  ('tenant', 'maintenance.create');

alter table public.role_permissions enable row level security;
alter table public.role_permissions force row level security;
revoke all on table public.role_permissions from anon, authenticated;
grant select on table public.role_permissions to authenticated;

create policy role_permissions_authenticated_read
on public.role_permissions for select
to authenticated
using (true);

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.has_permission(
  p_organization_id uuid,
  p_permission public.app_permission
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((
    select case
      when jsonb_typeof(member.permissions -> p_permission::text) = 'boolean'
        then (member.permissions ->> p_permission::text)::boolean
      else exists (
        select 1
        from public.role_permissions as defaults
        where defaults.role = member.role
          and defaults.permission = p_permission
      )
    end
    from public.organization_members as member
    join public.organizations as organization
      on organization.id = member.organization_id
    where member.organization_id = p_organization_id
      and member.user_id = (select auth.uid())
      and member.status = 'active'
      and organization.status = 'active'
  ), false);
$$;

create or replace function private.is_active_member(p_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members as member
    join public.organizations as organization on organization.id = member.organization_id
    where member.organization_id = p_organization_id
      and member.user_id = (select auth.uid())
      and member.status = 'active'
      and organization.status = 'active'
  );
$$;

create or replace function private.owns_tenant(p_organization_id uuid, p_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.has_permission(p_organization_id, 'portal.read')
    and exists (
      select 1
      from public.tenants as tenant
      where tenant.organization_id = p_organization_id
        and tenant.id = p_tenant_id
        and tenant.auth_user_id = (select auth.uid())
    );
$$;

create or replace function private.owns_lease(p_organization_id uuid, p_lease_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.has_permission(p_organization_id, 'portal.read')
    and exists (
      select 1
      from public.lease_tenants as lease_tenant
      join public.tenants as tenant
        on tenant.organization_id = lease_tenant.organization_id
       and tenant.id = lease_tenant.tenant_id
      where lease_tenant.organization_id = p_organization_id
        and lease_tenant.lease_id = p_lease_id
        and lease_tenant.left_at is null
        and tenant.auth_user_id = (select auth.uid())
    );
$$;

create or replace function private.owns_unit(p_organization_id uuid, p_unit_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.has_permission(p_organization_id, 'portal.read')
    and exists (
      select 1
      from public.leases as lease
      where lease.organization_id = p_organization_id
        and lease.unit_id = p_unit_id
        and lease.status in ('active', 'suspended')
        and private.owns_lease(lease.organization_id, lease.id)
    );
$$;

create or replace function private.owns_payment(p_organization_id uuid, p_payment_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.payments as payment
    where payment.organization_id = p_organization_id
      and payment.id = p_payment_id
      and private.owns_tenant(payment.organization_id, payment.tenant_id)
  );
$$;

create or replace function private.owns_invoice(p_organization_id uuid, p_invoice_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.rent_invoices as invoice
    where invoice.organization_id = p_organization_id
      and invoice.id = p_invoice_id
      and private.owns_lease(invoice.organization_id, invoice.lease_id)
  );
$$;

create or replace function private.owns_receipt(p_organization_id uuid, p_receipt_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.receipts as receipt
    where receipt.organization_id = p_organization_id
      and receipt.id = p_receipt_id
      and private.owns_payment(receipt.organization_id, receipt.payment_id)
  );
$$;

create or replace function private.can_view_profile(p_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select p_profile_id = (select auth.uid()) or exists (
    select 1
    from public.organization_members as target_member
    where target_member.user_id = p_profile_id
      and target_member.status = 'active'
      and private.has_permission(target_member.organization_id, 'members.read')
  );
$$;

revoke all on all functions in schema private from public, anon;
grant execute on function private.has_permission(uuid, public.app_permission) to authenticated;
grant execute on function private.is_active_member(uuid) to authenticated;
grant execute on function private.owns_tenant(uuid, uuid) to authenticated;
grant execute on function private.owns_lease(uuid, uuid) to authenticated;
grant execute on function private.owns_unit(uuid, uuid) to authenticated;
grant execute on function private.owns_payment(uuid, uuid) to authenticated;
grant execute on function private.owns_invoice(uuid, uuid) to authenticated;
grant execute on function private.owns_receipt(uuid, uuid) to authenticated;
grant execute on function private.can_view_profile(uuid) to authenticated;

create or replace function private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, first_name, last_name)
  values (
    new.id,
    coalesce(
      nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'Utilisateur'
    ),
    nullif(btrim(new.raw_user_meta_data ->> 'first_name'), ''),
    nullif(btrim(new.raw_user_meta_data ->> 'last_name'), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function private.handle_new_auth_user() from public, anon, authenticated;

drop trigger if exists auth_user_profile_created on auth.users;
create trigger auth_user_profile_created
after insert on auth.users
for each row execute function private.handle_new_auth_user();

-- Protect the last active owner from accidental lockout.
create or replace function private.protect_last_owner()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  active_owner_count integer;
begin
  if old.status = 'active'
     and old.role in ('owner', 'super_admin')
     and (tg_op = 'DELETE' or new.status <> 'active' or new.role not in ('owner', 'super_admin')) then
    select count(*) into active_owner_count
    from public.organization_members as member
    where member.organization_id = old.organization_id
      and member.status = 'active'
      and member.role in ('owner', 'super_admin')
      and member.id <> old.id;

    if active_owner_count = 0 then
      raise exception 'Une organisation doit conserver au moins un propriétaire actif.'
        using errcode = 'check_violation';
    end if;
  end if;

  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

revoke all on function private.protect_last_owner() from public, anon, authenticated;

create trigger organization_members_protect_last_owner
before update or delete on public.organization_members
for each row execute function private.protect_last_owner();

-- Core identity and organization policies.
grant select, update on table public.profiles to authenticated;
create policy profiles_read_authorized on public.profiles for select to authenticated
using (private.can_view_profile(id));
create policy profiles_update_self on public.profiles for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

grant select, update on table public.organizations to authenticated;
create policy organizations_read_member on public.organizations for select to authenticated
using (private.has_permission(id, 'organization.read'));
create policy organizations_update_authorized on public.organizations for update to authenticated
using (private.has_permission(id, 'organization.update'))
with check (private.has_permission(id, 'organization.update'));

grant select, insert, update, delete on table public.organization_members to authenticated;
create policy organization_members_read on public.organization_members for select to authenticated
using (user_id = (select auth.uid()) or private.has_permission(organization_id, 'members.read'));
create policy organization_members_insert on public.organization_members for insert to authenticated
with check (private.has_permission(organization_id, 'members.manage'));
create policy organization_members_update on public.organization_members for update to authenticated
using (private.has_permission(organization_id, 'members.manage'))
with check (private.has_permission(organization_id, 'members.manage'));
create policy organization_members_delete on public.organization_members for delete to authenticated
using (private.has_permission(organization_id, 'members.manage'));

-- Staff policies for organization-scoped tables.
do $$
declare
  item record;
begin
  for item in
    select * from (values
      ('properties', 'portfolio.read', 'portfolio.manage'),
      ('buildings', 'portfolio.read', 'portfolio.manage'),
      ('floors', 'portfolio.read', 'portfolio.manage'),
      ('units', 'portfolio.read', 'portfolio.manage'),
      ('maintenance_requests', 'portfolio.read', 'portfolio.manage'),
      ('tenants', 'tenants.read', 'tenants.manage'),
      ('leases', 'leases.read', 'leases.manage'),
      ('lease_tenants', 'leases.read', 'leases.manage'),
      ('rent_schedules', 'leases.read', 'leases.manage'),
      ('rent_invoices', 'finance.read', 'finance.manage'),
      ('payments', 'finance.read', 'finance.manage'),
      ('payment_allocations', 'finance.read', 'finance.manage'),
      ('payment_reversals', 'finance.read', 'finance.manage'),
      ('deposits', 'finance.read', 'finance.manage'),
      ('deposit_transactions', 'finance.read', 'finance.manage'),
      ('receipts', 'finance.read', 'finance.manage'),
      ('expenses', 'finance.read', 'finance.manage'),
      ('notifications', 'notifications.read', 'notifications.manage'),
      ('notification_logs', 'notifications.read', 'notifications.manage'),
      ('documents', 'documents.read', 'documents.manage'),
      ('app_settings', 'settings.read', 'settings.manage')
    ) as policy_map(table_name, read_permission, write_permission)
  loop
    execute format('grant select, insert, update, delete on table public.%I to authenticated', item.table_name);
    execute format(
      'create policy %I on public.%I for select to authenticated using (private.has_permission(organization_id, %L::public.app_permission))',
      item.table_name || '_staff_read', item.table_name, item.read_permission
    );
    execute format(
      'create policy %I on public.%I for insert to authenticated with check (private.has_permission(organization_id, %L::public.app_permission))',
      item.table_name || '_staff_insert', item.table_name, item.write_permission
    );
    execute format(
      'create policy %I on public.%I for update to authenticated using (private.has_permission(organization_id, %L::public.app_permission)) with check (private.has_permission(organization_id, %L::public.app_permission))',
      item.table_name || '_staff_update', item.table_name, item.write_permission, item.write_permission
    );
    execute format(
      'create policy %I on public.%I for delete to authenticated using (private.has_permission(organization_id, %L::public.app_permission))',
      item.table_name || '_staff_delete', item.table_name, item.write_permission
    );
  end loop;
end;
$$;

-- A cashier/manager may record a payment but cannot mutate other finance rows.
create policy payments_record_authorized on public.payments for insert to authenticated
with check (
  private.has_permission(organization_id, 'payments.create')
  and received_by = (select auth.uid())
);

-- Tenant portal: read only the rows connected to the authenticated tenant.
create policy tenants_portal_read on public.tenants for select to authenticated
using (private.owns_tenant(organization_id, id));

create policy leases_portal_read on public.leases for select to authenticated
using (private.owns_lease(organization_id, id));

create policy lease_tenants_portal_read on public.lease_tenants for select to authenticated
using (private.owns_lease(organization_id, lease_id));

create policy rent_schedules_portal_read on public.rent_schedules for select to authenticated
using (private.owns_lease(organization_id, lease_id));

create policy rent_invoices_portal_read on public.rent_invoices for select to authenticated
using (private.owns_lease(organization_id, lease_id));

create policy payments_portal_read on public.payments for select to authenticated
using (private.owns_tenant(organization_id, tenant_id));

create policy payment_allocations_portal_read on public.payment_allocations for select to authenticated
using (
  private.owns_payment(organization_id, payment_id)
  and private.owns_invoice(organization_id, rent_invoice_id)
);

create policy payment_reversals_portal_read on public.payment_reversals for select to authenticated
using (private.owns_payment(organization_id, payment_id));

create policy deposits_portal_read on public.deposits for select to authenticated
using (private.owns_lease(organization_id, lease_id));

create policy deposit_transactions_portal_read on public.deposit_transactions for select to authenticated
using (exists (
  select 1 from public.deposits as deposit
  where deposit.organization_id = deposit_transactions.organization_id
    and deposit.id = deposit_transactions.deposit_id
    and private.owns_lease(deposit.organization_id, deposit.lease_id)
));

create policy receipts_portal_read on public.receipts for select to authenticated
using (private.owns_payment(organization_id, payment_id));

create policy units_portal_read on public.units for select to authenticated
using (private.owns_unit(organization_id, id));

create policy properties_portal_read on public.properties for select to authenticated
using (exists (
  select 1 from public.units as unit
  where unit.organization_id = properties.organization_id
    and unit.property_id = properties.id
    and private.owns_unit(unit.organization_id, unit.id)
));

create policy buildings_portal_read on public.buildings for select to authenticated
using (exists (
  select 1 from public.units as unit
  where unit.organization_id = buildings.organization_id
    and unit.building_id = buildings.id
    and private.owns_unit(unit.organization_id, unit.id)
));

create policy floors_portal_read on public.floors for select to authenticated
using (exists (
  select 1 from public.units as unit
  where unit.organization_id = floors.organization_id
    and unit.floor_id = floors.id
    and private.owns_unit(unit.organization_id, unit.id)
));

create policy notifications_recipient_read on public.notifications for select to authenticated
using (
  recipient_user_id = (select auth.uid())
  or (tenant_id is not null and private.owns_tenant(organization_id, tenant_id))
);

create policy notifications_recipient_update on public.notifications for update to authenticated
using (recipient_user_id = (select auth.uid()))
with check (recipient_user_id = (select auth.uid()));

create policy maintenance_tenant_read on public.maintenance_requests for select to authenticated
using (tenant_id is not null and private.owns_tenant(organization_id, tenant_id));

create policy maintenance_tenant_insert on public.maintenance_requests for insert to authenticated
with check (
  tenant_id is not null
  and created_by = (select auth.uid())
  and private.has_permission(organization_id, 'maintenance.create')
  and private.owns_tenant(organization_id, tenant_id)
  and (unit_id is null or private.owns_unit(organization_id, unit_id))
);

create policy documents_portal_read on public.documents for select to authenticated
using (
  (tenant_id is not null and private.owns_tenant(organization_id, tenant_id))
  or (lease_id is not null and private.owns_lease(organization_id, lease_id))
  or (receipt_id is not null and private.owns_receipt(organization_id, receipt_id))
);

-- Audit evidence is append-only from the client perspective.
grant select on table public.audit_logs to authenticated;
create policy audit_logs_authorized_read on public.audit_logs for select to authenticated
using (
  organization_id is not null
  and private.has_permission(organization_id, 'audit.read')
);

-- Views are security-invoker and therefore retain the underlying table policies.
grant select on table public.rent_invoice_balances, public.rent_arrears to authenticated;

-- No browser role may operate internal counters directly.
revoke all on table public.number_sequences from anon, authenticated;
