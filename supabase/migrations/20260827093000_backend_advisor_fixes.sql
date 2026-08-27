-- Targeted fixes from Supabase database advisors.

create index unit_photos_org_unit_fk_idx on public.unit_photos(organization_id, unit_id);
create index unit_photos_uploaded_by_idx on public.unit_photos(uploaded_by) where uploaded_by is not null;

drop policy unit_photos_staff_read on public.unit_photos;
drop policy unit_photos_tenant_read on public.unit_photos;
create policy unit_photos_authorized_read on public.unit_photos for select to authenticated
using (
  private.has_permission(organization_id, 'portfolio.read')
  or private.owns_unit(organization_id, unit_id)
);

comment on function public.create_lease_with_tenant(uuid, uuid, uuid, date, date, numeric, public.currency_code, numeric, numeric, public.billing_frequency, smallint, text) is
  'Intentional SECURITY DEFINER RPC. It performs an explicit leases.manage permission check before any write.';
comment on function public.record_rent_payment(uuid, uuid, uuid, numeric, public.currency_code, timestamptz, public.payment_method, text, text, uuid) is
  'Intentional SECURITY DEFINER RPC. It performs an explicit finance.manage/payments.create permission check and validates the lease party.';
