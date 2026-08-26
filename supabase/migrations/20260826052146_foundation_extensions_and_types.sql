-- Extensions required for case-insensitive values, exclusion constraints and search.
create extension if not exists citext with schema extensions;
create extension if not exists btree_gist with schema extensions;
create extension if not exists pg_trgm with schema extensions;
create extension if not exists pgtap with schema extensions;

create type public.currency_code as enum ('USD', 'CDF');
create type public.app_role as enum ('super_admin', 'owner', 'manager', 'cashier', 'tenant');
create type public.membership_status as enum ('invited', 'active', 'suspended');
create type public.organization_status as enum ('active', 'suspended', 'archived');

create type public.property_type as enum (
  'building',
  'plot',
  'residence',
  'house',
  'villa',
  'residential_complex',
  'commercial',
  'other'
);
create type public.property_status as enum ('active', 'inactive', 'archived');
create type public.unit_type as enum (
  'apartment',
  'studio',
  'house',
  'room',
  'office',
  'shop',
  'warehouse',
  'other'
);
create type public.unit_status as enum ('available', 'occupied', 'reserved', 'maintenance', 'unavailable');
create type public.gender_type as enum ('female', 'male', 'other', 'unspecified');
create type public.identity_document_type as enum ('national_id', 'passport', 'driving_license', 'voter_card', 'other');

create type public.lease_status as enum ('draft', 'active', 'suspended', 'terminated', 'expired');
create type public.billing_frequency as enum ('monthly', 'quarterly', 'semiannual', 'annual', 'custom');
create type public.invoice_status as enum (
  'upcoming',
  'due_soon',
  'due_today',
  'partial',
  'paid',
  'late',
  'unpaid',
  'arrears'
);
create type public.deposit_kind as enum ('guarantee', 'advance');
create type public.deposit_transaction_type as enum ('payment', 'refund', 'withholding', 'adjustment');

create type public.payment_method as enum ('cash', 'mobile_money', 'bank_transfer', 'bank_deposit', 'other');
create type public.payment_status as enum ('pending', 'completed', 'reversed', 'cancelled');
create type public.allocation_type as enum ('automatic', 'manual');
create type public.receipt_status as enum ('issued', 'void');

create type public.notification_type as enum (
  'payment_received',
  'payment_partial',
  'payment_due_soon',
  'payment_due_today',
  'payment_late',
  'payment_overdue',
  'lease_expiring',
  'system'
);
create type public.notification_channel as enum ('in_app', 'whatsapp', 'sms', 'email');
create type public.delivery_status as enum ('pending', 'scheduled', 'sent', 'delivered', 'failed', 'cancelled');
create type public.document_kind as enum (
  'tenant_photo',
  'property_image',
  'identity_document',
  'lease_document',
  'receipt',
  'expense_proof',
  'maintenance_attachment',
  'other'
);
create type public.expense_status as enum ('draft', 'approved', 'paid', 'cancelled');
create type public.maintenance_priority as enum ('low', 'normal', 'high', 'urgent');
create type public.maintenance_status as enum ('open', 'assigned', 'in_progress', 'resolved', 'cancelled');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := statement_timestamp();
  return new;
end;
$$;

create or replace function public.calculate_invoice_status(
  p_due_date date,
  p_amount_due numeric,
  p_amount_paid numeric,
  p_as_of_date date default current_date
)
returns public.invoice_status
language sql
immutable
security invoker
set search_path = ''
as $$
  select case
    when p_amount_paid >= p_amount_due then 'paid'::public.invoice_status
    when p_amount_paid > 0 then 'partial'::public.invoice_status
    when p_due_date > p_as_of_date + 3 then 'upcoming'::public.invoice_status
    when p_due_date > p_as_of_date then 'due_soon'::public.invoice_status
    when p_due_date = p_as_of_date then 'due_today'::public.invoice_status
    when p_due_date <= p_as_of_date - 30 then 'arrears'::public.invoice_status
    else 'late'::public.invoice_status
  end;
$$;

create or replace function public.prevent_financial_delete()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  raise exception 'Physical deletion is forbidden for financial table %. Reverse or cancel the record instead.', tg_table_name
    using errcode = '55000';
end;
$$;

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.calculate_invoice_status(date, numeric, numeric, date) from public, anon, authenticated;
revoke all on function public.prevent_financial_delete() from public, anon, authenticated;

comment on function public.calculate_invoice_status(date, numeric, numeric, date) is
  'Pure invoice status calculation. The as-of date is explicit so historical and test calculations remain deterministic.';
