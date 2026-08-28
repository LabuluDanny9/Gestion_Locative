-- Create tenants through one authorized transaction, including human numbering.
create or replace function public.create_tenant_record(
  p_organization_id uuid,
  p_first_name text,
  p_last_name text,
  p_phone text,
  p_email text default null,
  p_identity_type public.identity_document_type default null,
  p_identity_number text default null,
  p_previous_address text default null,
  p_emergency_name text default null,
  p_emergency_phone text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_tenant_id uuid;
begin
  if not private.has_permission(p_organization_id, 'tenants.manage') then
    raise exception 'Insufficient permission' using errcode = '42501';
  end if;

  insert into public.tenants (
    organization_id, tenant_number, first_name, last_name, phone, email,
    identity_document_type, identity_document_number, previous_address,
    emergency_contact_name, emergency_contact_phone
  ) values (
    p_organization_id,
    public.next_human_number(p_organization_id, 'tenant', 'LOC'),
    btrim(p_first_name), btrim(p_last_name), btrim(p_phone),
    nullif(btrim(p_email), ''), p_identity_type, nullif(btrim(p_identity_number), ''),
    nullif(btrim(p_previous_address), ''), nullif(btrim(p_emergency_name), ''),
    nullif(btrim(p_emergency_phone), '')
  ) returning id into v_tenant_id;

  return v_tenant_id;
end;
$$;

revoke all on function public.create_tenant_record(uuid, text, text, text, text, public.identity_document_type, text, text, text, text) from public, anon;
grant execute on function public.create_tenant_record(uuid, text, text, text, text, public.identity_document_type, text, text, text, text) to authenticated;
