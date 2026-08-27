-- Backend gallery support and private Storage access for AMIRANDA EMPIRE.

create table public.unit_photos (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  unit_id uuid not null,
  storage_path text not null,
  file_name text not null,
  mime_type text not null,
  file_size_bytes bigint not null,
  room_label text,
  sort_order smallint not null default 0,
  is_cover boolean not null default false,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  constraint unit_photos_org_unit_fkey foreign key (organization_id, unit_id)
    references public.units(organization_id, id) on delete cascade,
  constraint unit_photos_storage_path_key unique (storage_path),
  constraint unit_photos_file_check check (
    btrim(file_name) <> '' and mime_type in ('image/jpeg', 'image/png', 'image/webp')
    and file_size_bytes between 1 and 10485760
  ),
  constraint unit_photos_room_label_check check (room_label is null or btrim(room_label) <> ''),
  constraint unit_photos_sort_order_check check (sort_order between 0 and 99)
);

create index unit_photos_unit_order_idx
  on public.unit_photos(unit_id, sort_order, created_at);
create unique index unit_photos_one_cover_idx
  on public.unit_photos(unit_id) where is_cover;

create trigger unit_photos_set_updated_at before update on public.unit_photos
for each row execute function public.set_updated_at();

alter table public.unit_photos enable row level security;
alter table public.unit_photos force row level security;
revoke all on table public.unit_photos from anon, authenticated;
grant select, insert, update, delete on table public.unit_photos to authenticated;

create policy unit_photos_staff_read on public.unit_photos for select to authenticated
using (private.has_permission(organization_id, 'portfolio.read'));
create policy unit_photos_staff_insert on public.unit_photos for insert to authenticated
with check (
  private.has_permission(organization_id, 'portfolio.manage')
  and uploaded_by = (select auth.uid())
);
create policy unit_photos_staff_update on public.unit_photos for update to authenticated
using (private.has_permission(organization_id, 'portfolio.manage'))
with check (private.has_permission(organization_id, 'portfolio.manage'));
create policy unit_photos_staff_delete on public.unit_photos for delete to authenticated
using (private.has_permission(organization_id, 'portfolio.manage'));
create policy unit_photos_tenant_read on public.unit_photos for select to authenticated
using (private.owns_unit(organization_id, unit_id));

-- Object paths always start with organization_id, preventing cross-organization access.
create policy storage_staff_read on storage.objects for select to authenticated
using (
  bucket_id in ('tenant-photos', 'property-images', 'identity-documents', 'lease-documents', 'receipts')
  and name ~ '^[0-9a-fA-F-]{36}/'
  and private.has_permission(((storage.foldername(name))[1])::uuid, 'documents.read')
);
create policy storage_staff_insert on storage.objects for insert to authenticated
with check (
  bucket_id in ('tenant-photos', 'property-images', 'identity-documents', 'lease-documents', 'receipts')
  and name ~ '^[0-9a-fA-F-]{36}/'
  and private.has_permission(((storage.foldername(name))[1])::uuid, 'documents.manage')
  and owner_id = (select auth.uid()::text)
);
create policy storage_staff_update on storage.objects for update to authenticated
using (
  bucket_id in ('tenant-photos', 'property-images', 'identity-documents', 'lease-documents', 'receipts')
  and name ~ '^[0-9a-fA-F-]{36}/'
  and private.has_permission(((storage.foldername(name))[1])::uuid, 'documents.manage')
)
with check (
  bucket_id in ('tenant-photos', 'property-images', 'identity-documents', 'lease-documents', 'receipts')
  and name ~ '^[0-9a-fA-F-]{36}/'
  and private.has_permission(((storage.foldername(name))[1])::uuid, 'documents.manage')
);
create policy storage_staff_delete on storage.objects for delete to authenticated
using (
  bucket_id in ('tenant-photos', 'property-images', 'identity-documents', 'lease-documents', 'receipts')
  and name ~ '^[0-9a-fA-F-]{36}/'
  and private.has_permission(((storage.foldername(name))[1])::uuid, 'documents.manage')
);

comment on table public.unit_photos is
  'Ordered private gallery for every rental unit; the first cover is enforced per unit.';

create or replace function public.create_lease_with_tenant(
  p_organization_id uuid,
  p_tenant_id uuid,
  p_unit_id uuid,
  p_start_date date,
  p_end_date date,
  p_rent_amount numeric,
  p_currency public.currency_code,
  p_guarantee_amount numeric default 0,
  p_advance_amount numeric default 0,
  p_frequency public.billing_frequency default 'monthly',
  p_due_day smallint default 5,
  p_terms text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_lease_id uuid;
  v_lease_number text;
begin
  if not private.has_permission(p_organization_id, 'leases.manage') then
    raise exception 'Insufficient permission' using errcode = '42501';
  end if;

  v_lease_number := public.next_human_number(p_organization_id, 'lease', 'CTR');
  insert into public.leases (
    organization_id, unit_id, lease_number, start_date, end_date, rent_amount,
    currency, guarantee_amount, advance_amount, frequency, due_day, terms,
    status, activated_at, created_by
  ) values (
    p_organization_id, p_unit_id, v_lease_number, p_start_date, p_end_date,
    p_rent_amount, p_currency, p_guarantee_amount, p_advance_amount, p_frequency,
    p_due_day, nullif(btrim(p_terms), ''), 'active', statement_timestamp(), auth.uid()
  ) returning id into v_lease_id;

  insert into public.lease_tenants (
    organization_id, lease_id, tenant_id, is_primary, joined_at
  ) values (p_organization_id, v_lease_id, p_tenant_id, true, p_start_date);

  insert into public.rent_schedules (
    organization_id, lease_id, effective_from, effective_until, amount,
    currency, frequency, due_day, created_by
  ) values (
    p_organization_id, v_lease_id, p_start_date, p_end_date, p_rent_amount,
    p_currency, p_frequency, p_due_day, auth.uid()
  );

  update public.units set status = 'occupied' where id = p_unit_id and organization_id = p_organization_id;
  return v_lease_id;
end;
$$;

revoke all on function public.create_lease_with_tenant(uuid, uuid, uuid, date, date, numeric, public.currency_code, numeric, numeric, public.billing_frequency, smallint, text) from public, anon;
grant execute on function public.create_lease_with_tenant(uuid, uuid, uuid, date, date, numeric, public.currency_code, numeric, numeric, public.billing_frequency, smallint, text) to authenticated;

create or replace function public.record_rent_payment(
  p_organization_id uuid,
  p_tenant_id uuid,
  p_lease_id uuid,
  p_amount numeric,
  p_currency public.currency_code,
  p_paid_at timestamptz,
  p_method public.payment_method,
  p_external_reference text default null,
  p_note text default null,
  p_idempotency_key uuid default gen_random_uuid()
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_payment_id uuid;
  v_unit_id uuid;
  v_remaining numeric(18,2) := p_amount;
  v_allocate numeric(18,2);
  v_invoice record;
  v_balance numeric(18,2);
begin
  if not (
    private.has_permission(p_organization_id, 'finance.manage')
    or private.has_permission(p_organization_id, 'payments.create')
  ) then
    raise exception 'Insufficient permission' using errcode = '42501';
  end if;
  if p_amount <= 0 then raise exception 'Payment amount must be positive' using errcode = '22023'; end if;

  select lease.unit_id into strict v_unit_id
  from public.leases as lease
  join public.lease_tenants as party on party.lease_id = lease.id
  where lease.organization_id = p_organization_id and lease.id = p_lease_id
    and party.tenant_id = p_tenant_id and party.left_at is null
    and lease.status in ('active', 'suspended');

  insert into public.payments (
    organization_id, payment_number, tenant_id, lease_id, unit_id, amount,
    currency, paid_at, method, external_reference, note, idempotency_key, received_by
  ) values (
    p_organization_id, public.next_human_number(p_organization_id, 'payment', 'PAY'),
    p_tenant_id, p_lease_id, v_unit_id, p_amount, p_currency, p_paid_at, p_method,
    nullif(btrim(p_external_reference), ''), nullif(btrim(p_note), ''), p_idempotency_key, auth.uid()
  ) returning id into v_payment_id;

  for v_invoice in
    select id, amount_due - amount_paid as open_amount
    from public.rent_invoices
    where organization_id = p_organization_id and lease_id = p_lease_id
      and currency = p_currency and amount_paid < amount_due
    order by due_date, created_at
    for update
  loop
    exit when v_remaining <= 0;
    v_allocate := least(v_remaining, v_invoice.open_amount);
    insert into public.payment_allocations (
      organization_id, payment_id, rent_invoice_id, amount, allocation_type, allocated_by
    ) values (p_organization_id, v_payment_id, v_invoice.id, v_allocate, 'automatic', auth.uid());
    update public.rent_invoices set amount_paid = amount_paid + v_allocate where id = v_invoice.id;
    v_remaining := v_remaining - v_allocate;
  end loop;

  select coalesce(sum(amount_due - amount_paid), 0) into v_balance
  from public.rent_invoices
  where organization_id = p_organization_id and lease_id = p_lease_id
    and currency = p_currency and amount_paid < amount_due;

  insert into public.receipts (
    organization_id, payment_id, receipt_number, amount, currency, balance_after, issued_by
  ) values (
    p_organization_id, v_payment_id,
    public.next_human_number(p_organization_id, 'receipt', 'REC'),
    p_amount, p_currency, v_balance, auth.uid()
  );
  return v_payment_id;
exception
  when unique_violation then
    select id into v_payment_id from public.payments
    where organization_id = p_organization_id and idempotency_key = p_idempotency_key;
    if v_payment_id is null then raise; end if;
    return v_payment_id;
end;
$$;

revoke all on function public.record_rent_payment(uuid, uuid, uuid, numeric, public.currency_code, timestamptz, public.payment_method, text, text, uuid) from public, anon;
grant execute on function public.record_rent_payment(uuid, uuid, uuid, numeric, public.currency_code, timestamptz, public.payment_method, text, text, uuid) to authenticated;
