-- Fix invoice generation on PostgreSQL: date + interval yields a timestamp,
-- so subtract an interval rather than an integer when computing period_end.
create or replace function public.generate_rent_invoices(
  p_organization_id uuid,
  p_through_date date default (current_date + 45)
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_created integer := 0;
  v_due_date date;
  v_interval_months integer;
  v_period_end date;
  v_period_start date;
  v_schedule record;
begin
  if not (
    private.has_permission(p_organization_id, 'leases.manage')
    or private.has_permission(p_organization_id, 'finance.manage')
  ) then
    raise exception 'Insufficient permission' using errcode = '42501';
  end if;

  if p_through_date < current_date - 31 or p_through_date > current_date + 366 then
    raise exception 'Generation date outside the allowed range' using errcode = '22023';
  end if;

  update public.rent_invoices as invoice
  set status = public.calculate_invoice_status(invoice.due_date, invoice.amount_due, invoice.amount_paid, current_date)
  where invoice.organization_id = p_organization_id
    and invoice.status is distinct from public.calculate_invoice_status(invoice.due_date, invoice.amount_due, invoice.amount_paid, current_date);

  for v_schedule in
    select schedule.*, lease.end_date, lease.status as lease_status
    from public.rent_schedules as schedule
    join public.leases as lease
      on lease.organization_id = schedule.organization_id and lease.id = schedule.lease_id
    where schedule.organization_id = p_organization_id
      and lease.status = 'active'
      and schedule.effective_from <= p_through_date
    order by schedule.effective_from, schedule.id
  loop
    v_interval_months := case v_schedule.frequency
      when 'monthly' then 1
      when 'quarterly' then 3
      when 'semiannual' then 6
      when 'annual' then 12
      else v_schedule.custom_interval_months
    end;
    if v_interval_months is null or v_interval_months < 1 then
      raise exception 'Invalid billing interval for schedule %', v_schedule.id using errcode = '22023';
    end if;

    v_period_start := v_schedule.effective_from;
    while v_period_start <= p_through_date
      and (v_schedule.effective_until is null or v_period_start <= v_schedule.effective_until)
      and (v_schedule.end_date is null or v_period_start <= v_schedule.end_date)
    loop
      v_period_end := (v_period_start + make_interval(months => v_interval_months) - interval '1 day')::date;
      if v_schedule.effective_until is not null then v_period_end := least(v_period_end, v_schedule.effective_until); end if;
      if v_schedule.end_date is not null then v_period_end := least(v_period_end, v_schedule.end_date); end if;
      v_due_date := greatest(
        v_period_start,
        make_date(extract(year from v_period_start)::integer, extract(month from v_period_start)::integer, v_schedule.due_day)
      );

      if not exists (
        select 1 from public.rent_invoices as existing
        where existing.lease_id = v_schedule.lease_id
          and existing.period_start = v_period_start
          and existing.period_end = v_period_end
      ) then
        insert into public.rent_invoices (
          organization_id, lease_id, rent_schedule_id, invoice_number,
          period_start, period_end, due_date, amount_due, currency
        ) values (
          p_organization_id, v_schedule.lease_id, v_schedule.id,
          public.next_human_number(p_organization_id, 'invoice', 'ECH'),
          v_period_start, v_period_end, v_due_date, v_schedule.amount, v_schedule.currency
        );
        v_created := v_created + 1;
      end if;

      v_period_start := (v_period_start + make_interval(months => v_interval_months))::date;
    end loop;
  end loop;

  return v_created;
end;
$$;

revoke all on function public.generate_rent_invoices(uuid, date) from public, anon;
grant execute on function public.generate_rent_invoices(uuid, date) to authenticated;

comment on function public.generate_rent_invoices(uuid, date) is
  'Generates each contractual rent period once, refreshes time-based statuses, and caps the generation horizon.';
