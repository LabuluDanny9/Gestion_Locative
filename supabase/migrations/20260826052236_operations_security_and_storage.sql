create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  recipient_user_id uuid references auth.users(id) on delete cascade,
  tenant_id uuid,
  notification_type public.notification_type not null,
  title text not null,
  body text not null,
  metadata jsonb not null default '{}'::jsonb,
  scheduled_at timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  constraint notifications_org_tenant_fkey foreign key (organization_id, tenant_id)
    references public.tenants(organization_id, id) on delete cascade,
  constraint notifications_recipient_check check (recipient_user_id is not null or tenant_id is not null),
  constraint notifications_title_body_check check (btrim(title) <> '' and btrim(body) <> ''),
  constraint notifications_metadata_object check (jsonb_typeof(metadata) = 'object')
);

create table public.notification_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  notification_id uuid not null references public.notifications(id) on delete cascade,
  channel public.notification_channel not null,
  recipient text not null,
  provider text not null,
  status public.delivery_status not null default 'pending',
  scheduled_at timestamptz,
  sent_at timestamptz,
  delivered_at timestamptz,
  failed_at timestamptz,
  error_message text,
  retry_count smallint not null default 0,
  provider_message_id text,
  created_at timestamptz not null default statement_timestamp(),
  constraint notification_logs_recipient_provider_check check (
    btrim(recipient) <> '' and btrim(provider) <> ''
  ),
  constraint notification_logs_retry_count_check check (retry_count >= 0),
  constraint notification_logs_failure_check check (
    status <> 'failed' or (failed_at is not null and btrim(coalesce(error_message, '')) <> '')
  )
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  property_id uuid not null,
  unit_id uuid,
  expense_number text not null,
  category text not null,
  description text not null,
  amount numeric(18, 2) not null,
  currency public.currency_code not null,
  incurred_on date not null,
  status public.expense_status not null default 'draft',
  vendor_name text,
  external_reference text,
  approved_by uuid references auth.users(id) on delete restrict,
  paid_at timestamptz,
  created_by uuid references auth.users(id) on delete restrict,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  constraint expenses_org_property_fkey foreign key (organization_id, property_id)
    references public.properties(organization_id, id) on delete restrict,
  constraint expenses_org_unit_property_fkey foreign key (organization_id, unit_id, property_id)
    references public.units(organization_id, id, property_id) on delete restrict,
  constraint expenses_org_number_key unique (organization_id, expense_number),
  constraint expenses_org_id_key unique (organization_id, id),
  constraint expenses_amount_check check (amount > 0),
  constraint expenses_text_check check (
    btrim(expense_number) <> '' and btrim(category) <> '' and btrim(description) <> ''
  ),
  constraint expenses_paid_check check (status <> 'paid' or paid_at is not null)
);

create table public.maintenance_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  property_id uuid not null,
  unit_id uuid,
  tenant_id uuid,
  request_number text not null,
  title text not null,
  description text not null,
  priority public.maintenance_priority not null default 'normal',
  status public.maintenance_status not null default 'open',
  assigned_to uuid references auth.users(id) on delete set null,
  requested_at timestamptz not null default statement_timestamp(),
  resolved_at timestamptz,
  resolution_notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  constraint maintenance_org_property_fkey foreign key (organization_id, property_id)
    references public.properties(organization_id, id) on delete restrict,
  constraint maintenance_org_unit_property_fkey foreign key (organization_id, unit_id, property_id)
    references public.units(organization_id, id, property_id) on delete restrict,
  constraint maintenance_org_tenant_fkey foreign key (organization_id, tenant_id)
    references public.tenants(organization_id, id) on delete restrict,
  constraint maintenance_org_number_key unique (organization_id, request_number),
  constraint maintenance_org_id_key unique (organization_id, id),
  constraint maintenance_text_check check (
    btrim(request_number) <> '' and btrim(title) <> '' and btrim(description) <> ''
  ),
  constraint maintenance_resolution_check check (
    status <> 'resolved'
    or (resolved_at is not null and btrim(coalesce(resolution_notes, '')) <> '')
  )
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  property_id uuid,
  tenant_id uuid,
  lease_id uuid,
  receipt_id uuid,
  expense_id uuid,
  maintenance_request_id uuid,
  kind public.document_kind not null,
  file_name text not null,
  bucket_id text not null,
  storage_path text not null,
  mime_type text not null,
  file_size_bytes bigint not null,
  checksum_sha256 text,
  is_sensitive boolean not null default true,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  constraint documents_org_property_fkey foreign key (organization_id, property_id)
    references public.properties(organization_id, id) on delete cascade,
  constraint documents_org_tenant_fkey foreign key (organization_id, tenant_id)
    references public.tenants(organization_id, id) on delete cascade,
  constraint documents_org_lease_fkey foreign key (organization_id, lease_id)
    references public.leases(organization_id, id) on delete cascade,
  constraint documents_org_receipt_fkey foreign key (organization_id, receipt_id)
    references public.receipts(organization_id, id) on delete restrict,
  constraint documents_org_expense_fkey foreign key (organization_id, expense_id)
    references public.expenses(organization_id, id) on delete cascade,
  constraint documents_org_maintenance_fkey foreign key (organization_id, maintenance_request_id)
    references public.maintenance_requests(organization_id, id) on delete cascade,
  constraint documents_bucket_path_key unique (bucket_id, storage_path),
  constraint documents_single_parent_check check (
    num_nonnulls(property_id, tenant_id, lease_id, receipt_id, expense_id, maintenance_request_id) <= 1
  ),
  constraint documents_file_check check (
    btrim(file_name) <> '' and btrim(bucket_id) <> '' and btrim(storage_path) <> ''
    and btrim(mime_type) <> '' and file_size_bytes > 0
  ),
  constraint documents_checksum_check check (
    checksum_sha256 is null or checksum_sha256 ~ '^[a-f0-9]{64}$'
  )
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete restrict,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  old_values jsonb,
  new_values jsonb,
  reason text,
  ip_address inet,
  user_agent text,
  request_id uuid,
  created_at timestamptz not null default statement_timestamp(),
  constraint audit_logs_action_entity_check check (btrim(action) <> '' and btrim(entity_type) <> ''),
  constraint audit_logs_old_values_object check (old_values is null or jsonb_typeof(old_values) = 'object'),
  constraint audit_logs_new_values_object check (new_values is null or jsonb_typeof(new_values) = 'object')
);

create table public.app_settings (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  platform_name text not null default 'Gestion Locative',
  logo_path text,
  landlord_contact jsonb not null default '{}'::jsonb,
  default_currency public.currency_code not null default 'USD',
  timezone text not null default 'Africa/Lubumbashi',
  reminder_rules jsonb not null default '{"due_soon_days": 3, "late_days": [1, 3, 7, 15, 30]}'::jsonb,
  notification_templates jsonb not null default '{}'::jsonb,
  receipt_settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  constraint app_settings_platform_name_check check (btrim(platform_name) <> ''),
  constraint app_settings_json_objects_check check (
    jsonb_typeof(landlord_contact) = 'object'
    and jsonb_typeof(reminder_rules) = 'object'
    and jsonb_typeof(notification_templates) = 'object'
    and jsonb_typeof(receipt_settings) = 'object'
  )
);

create index notifications_user_read_idx on public.notifications(recipient_user_id, read_at, created_at desc)
where recipient_user_id is not null;
create index notifications_tenant_id_idx on public.notifications(tenant_id) where tenant_id is not null;
create index notifications_org_scheduled_idx on public.notifications(organization_id, scheduled_at)
where scheduled_at is not null;
create index notification_logs_notification_id_idx on public.notification_logs(notification_id);
create index notification_logs_org_status_scheduled_idx on public.notification_logs(organization_id, status, scheduled_at);
create index expenses_property_incurred_idx on public.expenses(property_id, incurred_on desc);
create index expenses_unit_id_idx on public.expenses(unit_id) where unit_id is not null;
create index expenses_approved_by_idx on public.expenses(approved_by) where approved_by is not null;
create index maintenance_property_status_idx on public.maintenance_requests(property_id, status);
create index maintenance_unit_id_idx on public.maintenance_requests(unit_id) where unit_id is not null;
create index maintenance_tenant_id_idx on public.maintenance_requests(tenant_id) where tenant_id is not null;
create index maintenance_assigned_to_idx on public.maintenance_requests(assigned_to) where assigned_to is not null;
create index documents_organization_kind_idx on public.documents(organization_id, kind, created_at desc);
create index documents_property_id_idx on public.documents(property_id) where property_id is not null;
create index documents_tenant_id_idx on public.documents(tenant_id) where tenant_id is not null;
create index documents_lease_id_idx on public.documents(lease_id) where lease_id is not null;
create index documents_receipt_id_idx on public.documents(receipt_id) where receipt_id is not null;
create index documents_expense_id_idx on public.documents(expense_id) where expense_id is not null;
create index documents_maintenance_id_idx on public.documents(maintenance_request_id) where maintenance_request_id is not null;
create index audit_logs_org_created_idx on public.audit_logs(organization_id, created_at desc);
create index audit_logs_actor_id_idx on public.audit_logs(actor_id) where actor_id is not null;
create index audit_logs_entity_idx on public.audit_logs(entity_type, entity_id, created_at desc);

create trigger notifications_set_updated_at before update on public.notifications
for each row execute function public.set_updated_at();
create trigger expenses_set_updated_at before update on public.expenses
for each row execute function public.set_updated_at();
create trigger maintenance_requests_set_updated_at before update on public.maintenance_requests
for each row execute function public.set_updated_at();
create trigger documents_set_updated_at before update on public.documents
for each row execute function public.set_updated_at();
create trigger app_settings_set_updated_at before update on public.app_settings
for each row execute function public.set_updated_at();

create or replace view public.rent_invoice_balances
with (security_invoker = true)
as
select
  invoice.id,
  invoice.organization_id,
  invoice.lease_id,
  invoice.invoice_number,
  invoice.period_start,
  invoice.period_end,
  invoice.due_date,
  invoice.amount_due,
  invoice.amount_paid,
  invoice.balance,
  invoice.currency,
  public.calculate_invoice_status(
    invoice.due_date,
    invoice.amount_due,
    invoice.amount_paid,
    current_date
  ) as status,
  greatest(current_date - invoice.due_date, 0) as days_late
from public.rent_invoices as invoice;

create or replace view public.rent_arrears
with (security_invoker = true)
as
select
  invoice.organization_id,
  lease_tenant.tenant_id,
  invoice.lease_id,
  lease.unit_id,
  invoice.currency,
  sum(invoice.balance) as total_balance,
  count(*)::bigint as invoice_count,
  min(invoice.due_date) as oldest_due_date,
  max(current_date - invoice.due_date) as maximum_days_late
from public.rent_invoices as invoice
join public.leases as lease on lease.id = invoice.lease_id
join public.lease_tenants as lease_tenant
  on lease_tenant.lease_id = invoice.lease_id
  and lease_tenant.is_primary
  and lease_tenant.left_at is null
where invoice.amount_paid < invoice.amount_due
  and invoice.due_date < current_date
group by
  invoice.organization_id,
  lease_tenant.tenant_id,
  invoice.lease_id,
  lease.unit_id,
  invoice.currency;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('tenant-photos', 'tenant-photos', false, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('property-images', 'property-images', false, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('identity-documents', 'identity-documents', false, 10485760, array['application/pdf', 'image/jpeg', 'image/png']),
  ('lease-documents', 'lease-documents', false, 20971520, array['application/pdf']),
  ('receipts', 'receipts', false, 10485760, array['application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'organizations',
    'profiles',
    'organization_members',
    'number_sequences',
    'properties',
    'buildings',
    'floors',
    'units',
    'tenants',
    'leases',
    'lease_tenants',
    'rent_schedules',
    'rent_invoices',
    'payments',
    'payment_allocations',
    'payment_reversals',
    'deposits',
    'deposit_transactions',
    'receipts',
    'notifications',
    'notification_logs',
    'expenses',
    'maintenance_requests',
    'documents',
    'audit_logs',
    'app_settings'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('alter table public.%I force row level security', table_name);
    execute format('revoke all on table public.%I from anon, authenticated', table_name);
  end loop;
end;
$$;

revoke all on table public.rent_invoice_balances from anon, authenticated;
revoke all on table public.rent_arrears from anon, authenticated;
alter default privileges in schema public revoke all on tables from anon, authenticated;

comment on view public.rent_arrears is
  'Calculated arrears by lease and currency. No manually maintained arrears value is stored.';
comment on table public.audit_logs is
  'Append-only business audit evidence. RLS policies and grants are introduced with RBAC in Phase 3.';
