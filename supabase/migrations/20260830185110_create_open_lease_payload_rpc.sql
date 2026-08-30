-- A single JSON argument gives PostgREST one stable, unambiguous RPC signature.
-- Input is validated here and the existing authorized transaction remains the
-- source of truth for lease creation and invoice generation.
create or replace function public.create_open_lease_from_payload(p_payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_organization_id uuid;
  v_tenant_id uuid;
  v_unit_id uuid;
  v_start_date date;
  v_rent_amount numeric;
  v_currency public.currency_code;
  v_guarantee_amount numeric;
  v_frequency public.billing_frequency;
  v_due_day smallint;
  v_terms text;
  v_lease_id uuid;
begin
  if p_payload is null or jsonb_typeof(p_payload) <> 'object' then
    raise exception 'Invalid lease payload' using errcode = '22023';
  end if;

  v_organization_id := (p_payload ->> 'organization_id')::uuid;
  v_tenant_id := (p_payload ->> 'tenant_id')::uuid;
  v_unit_id := (p_payload ->> 'unit_id')::uuid;
  v_start_date := (p_payload ->> 'start_date')::date;
  v_rent_amount := (p_payload ->> 'rent_amount')::numeric;
  v_currency := (p_payload ->> 'currency')::public.currency_code;
  v_guarantee_amount := coalesce((p_payload ->> 'guarantee_amount')::numeric, 0);
  v_frequency := coalesce(nullif(p_payload ->> 'frequency', '')::public.billing_frequency, 'monthly');
  v_due_day := coalesce((p_payload ->> 'due_day')::smallint, 5);
  v_terms := nullif(btrim(p_payload ->> 'terms'), '');

  if v_organization_id is null or v_tenant_id is null or v_unit_id is null
    or v_start_date is null or v_rent_amount is null or v_currency is null
    or v_rent_amount <= 0 or v_guarantee_amount < 0
    or v_due_day < 1 or v_due_day > 28 then
    raise exception 'Invalid lease payload' using errcode = '22023';
  end if;

  if not private.has_permission(v_organization_id, 'leases.manage') then
    raise exception 'Insufficient permission' using errcode = '42501';
  end if;

  v_lease_id := public.create_lease_with_tenant(
    v_organization_id, v_tenant_id, v_unit_id, v_start_date, null,
    v_rent_amount, v_currency, v_guarantee_amount, 0,
    v_frequency, v_due_day, v_terms
  );
  perform public.generate_rent_invoices(
    v_organization_id,
    least(greatest(v_start_date + 45, current_date + 45), current_date + 366)
  );
  return v_lease_id;
end;
$$;

revoke all on function public.create_open_lease_from_payload(jsonb) from public, anon;
grant execute on function public.create_open_lease_from_payload(jsonb) to authenticated;

comment on function public.create_open_lease_from_payload(jsonb) is
  'Creates an open-ended lease and initial invoices from one validated payload.';

notify pgrst, 'reload schema';
