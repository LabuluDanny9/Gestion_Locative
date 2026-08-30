-- Dedicated RPC for open-ended leases. Keeping a stable parameter list avoids
-- PostgREST resolution failures caused by sending a null end-date parameter.
create or replace function public.create_open_lease_and_invoices(
  p_organization_id uuid,
  p_tenant_id uuid,
  p_unit_id uuid,
  p_start_date date,
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
begin
  v_lease_id := public.create_lease_with_tenant(
    p_organization_id, p_tenant_id, p_unit_id, p_start_date, null,
    p_rent_amount, p_currency, p_guarantee_amount, p_advance_amount,
    p_frequency, p_due_day, p_terms
  );
  perform public.generate_rent_invoices(
    p_organization_id,
    least(greatest(p_start_date + 45, current_date + 45), current_date + 366)
  );
  return v_lease_id;
end;
$$;

revoke all on function public.create_open_lease_and_invoices(uuid, uuid, uuid, date, numeric, public.currency_code, numeric, numeric, public.billing_frequency, smallint, text) from public, anon;
grant execute on function public.create_open_lease_and_invoices(uuid, uuid, uuid, date, numeric, public.currency_code, numeric, numeric, public.billing_frequency, smallint, text) to authenticated;

comment on function public.create_open_lease_and_invoices(uuid, uuid, uuid, date, numeric, public.currency_code, numeric, numeric, public.billing_frequency, smallint, text) is
  'Creates an open-ended lease and its initial rent invoices in one authorized transaction.';

notify pgrst, 'reload schema';
