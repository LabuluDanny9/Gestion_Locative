-- Keep contract creation recoverable while browser-side document uploads complete.
create or replace function public.rollback_lease_creation(
  p_organization_id uuid,
  p_lease_id uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_unit_id uuid;
begin
  if not private.has_permission(p_organization_id, 'leases.manage') then
    raise exception 'Insufficient permission' using errcode = '42501';
  end if;

  select unit_id into v_unit_id
  from public.leases
  where id = p_lease_id
    and organization_id = p_organization_id
    and created_by = auth.uid()
    and created_at >= statement_timestamp() - interval '1 hour'
  for update;

  if v_unit_id is null then
    raise exception 'Lease cannot be rolled back' using errcode = '42501';
  end if;
  if exists (select 1 from public.payments where lease_id = p_lease_id) then
    raise exception 'Lease with payments cannot be rolled back' using errcode = '23514';
  end if;

  delete from public.leases where id = p_lease_id and organization_id = p_organization_id;
  update public.units
  set status = 'available'
  where id = v_unit_id
    and organization_id = p_organization_id
    and not exists (
      select 1 from public.leases
      where organization_id = p_organization_id and unit_id = v_unit_id and status = 'active'
    );
end;
$$;

revoke all on function public.rollback_lease_creation(uuid, uuid) from public, anon;
grant execute on function public.rollback_lease_creation(uuid, uuid) to authenticated;

update storage.buckets
set allowed_mime_types = array[
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png'
]
where id = 'lease-documents';

-- PostgREST sometimes retains the old function catalog after remote migrations.
notify pgrst, 'reload schema';
