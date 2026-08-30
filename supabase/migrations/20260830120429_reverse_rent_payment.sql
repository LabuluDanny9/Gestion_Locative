-- Phase 9: reverse a completed rent payment atomically without deleting financial evidence.
create or replace function public.reverse_rent_payment(
  p_organization_id uuid,
  p_payment_id uuid,
  p_reason text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_allocation record;
  v_payment public.payments%rowtype;
  v_reversal_id uuid;
begin
  if not private.has_permission(p_organization_id, 'finance.manage') then
    raise exception 'Insufficient permission' using errcode = '42501';
  end if;
  if btrim(coalesce(p_reason, '')) = '' then
    raise exception 'Reversal reason is required' using errcode = '22023';
  end if;

  select payment.* into strict v_payment
  from public.payments as payment
  where payment.organization_id = p_organization_id
    and payment.id = p_payment_id
  for update;

  if v_payment.status <> 'completed' then
    raise exception 'Only a completed payment can be reversed' using errcode = '22023';
  end if;

  insert into public.payment_reversals (
    organization_id, payment_id, original_amount, reason, reversed_by
  ) values (
    p_organization_id, p_payment_id, v_payment.amount, btrim(p_reason), auth.uid()
  ) returning id into v_reversal_id;

  for v_allocation in
    select allocation.rent_invoice_id, allocation.amount
    from public.payment_allocations as allocation
    where allocation.organization_id = p_organization_id
      and allocation.payment_id = p_payment_id
    order by allocation.allocated_at desc, allocation.id desc
  loop
    update public.rent_invoices as invoice
    set amount_paid = invoice.amount_paid - v_allocation.amount
    where invoice.organization_id = p_organization_id
      and invoice.id = v_allocation.rent_invoice_id
      and invoice.amount_paid >= v_allocation.amount;
    if not found then
      raise exception 'Invoice allocation is inconsistent' using errcode = '23514';
    end if;
  end loop;

  update public.payments
  set status = 'reversed'
  where organization_id = p_organization_id and id = p_payment_id;

  update public.receipts
  set status = 'void', voided_at = statement_timestamp(),
      voided_by = auth.uid(), void_reason = btrim(p_reason)
  where organization_id = p_organization_id and payment_id = p_payment_id;

  insert into public.audit_logs (
    organization_id, actor_id, action, entity_type, entity_id,
    old_values, new_values, reason
  ) values (
    p_organization_id, auth.uid(), 'payment.reversed', 'payment', p_payment_id,
    jsonb_build_object('status', v_payment.status, 'amount', v_payment.amount, 'currency', v_payment.currency),
    jsonb_build_object('status', 'reversed', 'reversal_id', v_reversal_id),
    btrim(p_reason)
  );

  return v_reversal_id;
end;
$$;

revoke all on function public.reverse_rent_payment(uuid, uuid, text) from public, anon;
grant execute on function public.reverse_rent_payment(uuid, uuid, text) to authenticated;

comment on function public.reverse_rent_payment(uuid, uuid, text) is
  'Atomically reverses allocations, voids the receipt, and records immutable reversal and audit evidence.';
