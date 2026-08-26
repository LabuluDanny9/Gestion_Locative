create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  auth_user_id uuid references auth.users(id) on delete set null,
  tenant_number text not null,
  last_name text not null,
  middle_name text,
  first_name text not null,
  gender public.gender_type not null default 'unspecified',
  phone text not null,
  whatsapp_phone text,
  email extensions.citext,
  profession text,
  birth_date date,
  previous_address text,
  identity_document_type public.identity_document_type,
  identity_document_number text,
  emergency_contact_name text,
  emergency_contact_phone text,
  notes text,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  archived_at timestamptz,
  constraint tenants_org_number_key unique (organization_id, tenant_number),
  constraint tenants_org_id_key unique (organization_id, id),
  constraint tenants_number_not_blank check (btrim(tenant_number) <> ''),
  constraint tenants_names_not_blank check (btrim(last_name) <> '' and btrim(first_name) <> ''),
  constraint tenants_phone_not_blank check (btrim(phone) <> ''),
  constraint tenants_birth_date_check check (birth_date is null or birth_date >= date '1900-01-01')
);

create unique index tenants_org_auth_user_key on public.tenants(organization_id, auth_user_id)
where auth_user_id is not null;
create index tenants_auth_user_id_idx on public.tenants(auth_user_id) where auth_user_id is not null;
create index tenants_org_archived_idx on public.tenants(organization_id, archived_at);
create index tenants_name_trgm_idx on public.tenants using gin (
  (first_name || ' ' || coalesce(middle_name, '') || ' ' || last_name) extensions.gin_trgm_ops
);
create index tenants_phone_trgm_idx on public.tenants using gin (phone extensions.gin_trgm_ops);

create table public.leases (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  unit_id uuid not null,
  lease_number text not null,
  start_date date not null,
  end_date date,
  rent_amount numeric(18, 2) not null,
  currency public.currency_code not null,
  guarantee_amount numeric(18, 2) not null default 0,
  advance_amount numeric(18, 2) not null default 0,
  frequency public.billing_frequency not null default 'monthly',
  custom_interval_months smallint,
  due_day smallint not null default 5,
  terms text,
  status public.lease_status not null default 'draft',
  activated_at timestamptz,
  terminated_at timestamptz,
  termination_reason text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  constraint leases_org_unit_fkey foreign key (organization_id, unit_id)
    references public.units(organization_id, id) on delete restrict,
  constraint leases_org_number_key unique (organization_id, lease_number),
  constraint leases_org_id_key unique (organization_id, id),
  constraint leases_number_not_blank check (btrim(lease_number) <> ''),
  constraint leases_date_range_check check (end_date is null or end_date >= start_date),
  constraint leases_amounts_check check (rent_amount > 0 and guarantee_amount >= 0 and advance_amount >= 0),
  constraint leases_due_day_check check (due_day between 1 and 28),
  constraint leases_custom_interval_check check (
    (frequency = 'custom' and custom_interval_months is not null and custom_interval_months > 0)
    or (frequency <> 'custom' and custom_interval_months is null)
  ),
  constraint leases_activation_check check (status <> 'active' or activated_at is not null),
  constraint leases_termination_check check (
    status <> 'terminated' or (terminated_at is not null and btrim(coalesce(termination_reason, '')) <> '')
  ),
  constraint leases_no_overlapping_active_periods exclude using gist (
    unit_id with =,
    daterange(start_date, coalesce(end_date, 'infinity'::date), '[]') with &&
  ) where (status in ('active', 'suspended'))
);

create table public.lease_tenants (
  organization_id uuid not null,
  lease_id uuid not null,
  tenant_id uuid not null,
  is_primary boolean not null default false,
  joined_at date not null,
  left_at date,
  created_at timestamptz not null default statement_timestamp(),
  primary key (lease_id, tenant_id),
  constraint lease_tenants_org_lease_fkey foreign key (organization_id, lease_id)
    references public.leases(organization_id, id) on delete cascade,
  constraint lease_tenants_org_tenant_fkey foreign key (organization_id, tenant_id)
    references public.tenants(organization_id, id) on delete restrict,
  constraint lease_tenants_dates_check check (left_at is null or left_at >= joined_at)
);

create unique index lease_tenants_one_primary_idx on public.lease_tenants(lease_id)
where is_primary and left_at is null;

create table public.rent_schedules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  lease_id uuid not null,
  effective_from date not null,
  effective_until date,
  amount numeric(18, 2) not null,
  currency public.currency_code not null,
  frequency public.billing_frequency not null,
  custom_interval_months smallint,
  due_day smallint not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  constraint rent_schedules_org_lease_fkey foreign key (organization_id, lease_id)
    references public.leases(organization_id, id) on delete cascade,
  constraint rent_schedules_org_id_key unique (organization_id, id),
  constraint rent_schedules_date_range_check check (effective_until is null or effective_until >= effective_from),
  constraint rent_schedules_amount_check check (amount > 0),
  constraint rent_schedules_due_day_check check (due_day between 1 and 28),
  constraint rent_schedules_custom_interval_check check (
    (frequency = 'custom' and custom_interval_months is not null and custom_interval_months > 0)
    or (frequency <> 'custom' and custom_interval_months is null)
  ),
  constraint rent_schedules_no_overlapping_periods exclude using gist (
    lease_id with =,
    daterange(effective_from, coalesce(effective_until, 'infinity'::date), '[]') with &&
  )
);

create table public.rent_invoices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  lease_id uuid not null,
  rent_schedule_id uuid,
  invoice_number text not null,
  period_start date not null,
  period_end date not null,
  due_date date not null,
  amount_due numeric(18, 2) not null,
  amount_paid numeric(18, 2) not null default 0,
  balance numeric(18, 2) generated always as (amount_due - amount_paid) stored,
  currency public.currency_code not null,
  status public.invoice_status not null default 'upcoming',
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  constraint rent_invoices_org_lease_fkey foreign key (organization_id, lease_id)
    references public.leases(organization_id, id) on delete restrict,
  constraint rent_invoices_org_schedule_fkey foreign key (organization_id, rent_schedule_id)
    references public.rent_schedules(organization_id, id) on delete restrict,
  constraint rent_invoices_org_number_key unique (organization_id, invoice_number),
  constraint rent_invoices_lease_period_key unique (lease_id, period_start, period_end),
  constraint rent_invoices_org_id_key unique (organization_id, id),
  constraint rent_invoices_period_check check (period_end >= period_start),
  constraint rent_invoices_amounts_check check (
    amount_due > 0 and amount_paid >= 0 and amount_paid <= amount_due
  )
);

create or replace function public.sync_rent_invoice_status()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.status := public.calculate_invoice_status(
    new.due_date,
    new.amount_due,
    new.amount_paid,
    current_date
  );
  return new;
end;
$$;

revoke all on function public.sync_rent_invoice_status() from public, anon, authenticated;

create trigger rent_invoices_sync_status
before insert or update of due_date, amount_due, amount_paid on public.rent_invoices
for each row execute function public.sync_rent_invoice_status();

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  payment_number text not null,
  tenant_id uuid not null,
  lease_id uuid not null,
  unit_id uuid not null,
  amount numeric(18, 2) not null,
  currency public.currency_code not null,
  paid_at timestamptz not null,
  method public.payment_method not null,
  external_reference text,
  note text,
  status public.payment_status not null default 'completed',
  idempotency_key uuid not null default gen_random_uuid(),
  received_by uuid references auth.users(id) on delete restrict,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  constraint payments_org_tenant_fkey foreign key (organization_id, tenant_id)
    references public.tenants(organization_id, id) on delete restrict,
  constraint payments_org_lease_fkey foreign key (organization_id, lease_id)
    references public.leases(organization_id, id) on delete restrict,
  constraint payments_org_unit_fkey foreign key (organization_id, unit_id)
    references public.units(organization_id, id) on delete restrict,
  constraint payments_org_number_key unique (organization_id, payment_number),
  constraint payments_org_idempotency_key unique (organization_id, idempotency_key),
  constraint payments_org_id_key unique (organization_id, id),
  constraint payments_amount_check check (amount > 0),
  constraint payments_number_not_blank check (btrim(payment_number) <> '')
);

create table public.payment_allocations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  payment_id uuid not null,
  rent_invoice_id uuid not null,
  amount numeric(18, 2) not null,
  allocation_type public.allocation_type not null default 'automatic',
  allocated_by uuid references auth.users(id) on delete restrict,
  allocated_at timestamptz not null default statement_timestamp(),
  constraint payment_allocations_org_payment_fkey foreign key (organization_id, payment_id)
    references public.payments(organization_id, id) on delete restrict,
  constraint payment_allocations_org_invoice_fkey foreign key (organization_id, rent_invoice_id)
    references public.rent_invoices(organization_id, id) on delete restrict,
  constraint payment_allocations_payment_invoice_key unique (payment_id, rent_invoice_id),
  constraint payment_allocations_amount_check check (amount > 0)
);

create table public.payment_reversals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  payment_id uuid not null,
  original_amount numeric(18, 2) not null,
  reason text not null,
  reversed_by uuid not null references auth.users(id) on delete restrict,
  reversed_at timestamptz not null default statement_timestamp(),
  created_at timestamptz not null default statement_timestamp(),
  constraint payment_reversals_org_payment_fkey foreign key (organization_id, payment_id)
    references public.payments(organization_id, id) on delete restrict,
  constraint payment_reversals_payment_key unique (payment_id),
  constraint payment_reversals_amount_check check (original_amount > 0),
  constraint payment_reversals_reason_not_blank check (btrim(reason) <> '')
);

create table public.deposits (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  lease_id uuid not null,
  kind public.deposit_kind not null,
  amount_required numeric(18, 2) not null,
  amount_paid numeric(18, 2) not null default 0,
  amount_refunded numeric(18, 2) not null default 0,
  amount_withheld numeric(18, 2) not null default 0,
  remaining_due numeric(18, 2) generated always as (greatest(amount_required - amount_paid, 0)) stored,
  currency public.currency_code not null,
  withholding_reason text,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  constraint deposits_org_lease_fkey foreign key (organization_id, lease_id)
    references public.leases(organization_id, id) on delete restrict,
  constraint deposits_lease_kind_key unique (lease_id, kind),
  constraint deposits_org_id_key unique (organization_id, id),
  constraint deposits_amounts_check check (
    amount_required >= 0 and amount_paid >= 0 and amount_refunded >= 0 and amount_withheld >= 0
    and amount_refunded + amount_withheld <= amount_paid
  ),
  constraint deposits_withholding_reason_check check (
    amount_withheld = 0 or btrim(coalesce(withholding_reason, '')) <> ''
  )
);

create table public.deposit_transactions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  deposit_id uuid not null,
  transaction_type public.deposit_transaction_type not null,
  amount numeric(18, 2) not null,
  currency public.currency_code not null,
  occurred_at timestamptz not null default statement_timestamp(),
  reference text,
  reason text,
  recorded_by uuid references auth.users(id) on delete restrict,
  created_at timestamptz not null default statement_timestamp(),
  constraint deposit_transactions_org_deposit_fkey foreign key (organization_id, deposit_id)
    references public.deposits(organization_id, id) on delete restrict,
  constraint deposit_transactions_amount_check check (amount > 0),
  constraint deposit_transactions_reason_check check (
    transaction_type not in ('refund', 'withholding', 'adjustment')
    or btrim(coalesce(reason, '')) <> ''
  )
);

create table public.receipts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  payment_id uuid not null,
  receipt_number text not null,
  public_token uuid not null default gen_random_uuid(),
  amount numeric(18, 2) not null,
  currency public.currency_code not null,
  balance_after numeric(18, 2) not null default 0,
  issued_at timestamptz not null default statement_timestamp(),
  issued_by uuid references auth.users(id) on delete restrict,
  status public.receipt_status not null default 'issued',
  voided_at timestamptz,
  voided_by uuid references auth.users(id) on delete restrict,
  void_reason text,
  storage_path text,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  constraint receipts_org_payment_fkey foreign key (organization_id, payment_id)
    references public.payments(organization_id, id) on delete restrict,
  constraint receipts_payment_key unique (payment_id),
  constraint receipts_org_number_key unique (organization_id, receipt_number),
  constraint receipts_public_token_key unique (public_token),
  constraint receipts_org_id_key unique (organization_id, id),
  constraint receipts_amounts_check check (amount > 0 and balance_after >= 0),
  constraint receipts_void_check check (
    status <> 'void'
    or (voided_at is not null and voided_by is not null and btrim(coalesce(void_reason, '')) <> '')
  )
);

create index leases_unit_status_idx on public.leases(unit_id, status);
create index leases_org_status_dates_idx on public.leases(organization_id, status, start_date, end_date);
create index leases_created_by_idx on public.leases(created_by) where created_by is not null;
create index lease_tenants_tenant_id_idx on public.lease_tenants(tenant_id);
create index rent_schedules_lease_effective_idx on public.rent_schedules(lease_id, effective_from);
create index rent_invoices_org_status_due_idx on public.rent_invoices(organization_id, status, due_date);
create index rent_invoices_lease_due_idx on public.rent_invoices(lease_id, due_date);
create index rent_invoices_open_balance_idx on public.rent_invoices(organization_id, due_date)
where amount_paid < amount_due;
create index payments_org_paid_at_idx on public.payments(organization_id, paid_at desc);
create index payments_tenant_id_idx on public.payments(tenant_id);
create index payments_lease_id_idx on public.payments(lease_id);
create index payments_unit_id_idx on public.payments(unit_id);
create index payments_received_by_idx on public.payments(received_by) where received_by is not null;
create index payment_allocations_invoice_id_idx on public.payment_allocations(rent_invoice_id);
create index payment_reversals_reversed_by_idx on public.payment_reversals(reversed_by);
create index deposits_lease_id_idx on public.deposits(lease_id);
create index deposit_transactions_deposit_id_idx on public.deposit_transactions(deposit_id);
create index receipts_issued_by_idx on public.receipts(issued_by) where issued_by is not null;

create trigger tenants_set_updated_at before update on public.tenants
for each row execute function public.set_updated_at();
create trigger leases_set_updated_at before update on public.leases
for each row execute function public.set_updated_at();
create trigger rent_schedules_set_updated_at before update on public.rent_schedules
for each row execute function public.set_updated_at();
create trigger rent_invoices_set_updated_at before update on public.rent_invoices
for each row execute function public.set_updated_at();
create trigger payments_set_updated_at before update on public.payments
for each row execute function public.set_updated_at();
create trigger deposits_set_updated_at before update on public.deposits
for each row execute function public.set_updated_at();
create trigger receipts_set_updated_at before update on public.receipts
for each row execute function public.set_updated_at();

create trigger payments_prevent_delete before delete on public.payments
for each row execute function public.prevent_financial_delete();
create trigger payment_allocations_prevent_delete before delete on public.payment_allocations
for each row execute function public.prevent_financial_delete();
create trigger payment_reversals_prevent_delete before delete on public.payment_reversals
for each row execute function public.prevent_financial_delete();
create trigger deposit_transactions_prevent_delete before delete on public.deposit_transactions
for each row execute function public.prevent_financial_delete();
create trigger receipts_prevent_delete before delete on public.receipts
for each row execute function public.prevent_financial_delete();

comment on table public.rent_schedules is
  'Versioned contractual rent terms. Invoices retain their own amount snapshot for historical accuracy.';
comment on table public.payment_reversals is
  'Immutable reversal evidence kept separately from the original payment.';
