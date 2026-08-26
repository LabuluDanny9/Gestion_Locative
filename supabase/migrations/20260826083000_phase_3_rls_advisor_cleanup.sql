-- Consolidate staff and tenant policies to avoid evaluating multiple permissive
-- policies for the same action. Internal counters remain explicitly inaccessible.
create policy number_sequences_no_direct_access
on public.number_sequences for all
to authenticated
using (false)
with check (false);

alter policy tenants_staff_read on public.tenants
using (private.has_permission(organization_id, 'tenants.read') or private.owns_tenant(organization_id, id));
drop policy tenants_portal_read on public.tenants;

alter policy leases_staff_read on public.leases
using (private.has_permission(organization_id, 'leases.read') or private.owns_lease(organization_id, id));
drop policy leases_portal_read on public.leases;

alter policy lease_tenants_staff_read on public.lease_tenants
using (private.has_permission(organization_id, 'leases.read') or private.owns_lease(organization_id, lease_id));
drop policy lease_tenants_portal_read on public.lease_tenants;

alter policy rent_schedules_staff_read on public.rent_schedules
using (private.has_permission(organization_id, 'leases.read') or private.owns_lease(organization_id, lease_id));
drop policy rent_schedules_portal_read on public.rent_schedules;

alter policy rent_invoices_staff_read on public.rent_invoices
using (private.has_permission(organization_id, 'finance.read') or private.owns_lease(organization_id, lease_id));
drop policy rent_invoices_portal_read on public.rent_invoices;

alter policy payments_staff_read on public.payments
using (private.has_permission(organization_id, 'finance.read') or private.owns_tenant(organization_id, tenant_id));
drop policy payments_portal_read on public.payments;

alter policy payment_allocations_staff_read on public.payment_allocations
using (
  private.has_permission(organization_id, 'finance.read')
  or (private.owns_payment(organization_id, payment_id) and private.owns_invoice(organization_id, rent_invoice_id))
);
drop policy payment_allocations_portal_read on public.payment_allocations;

alter policy payment_reversals_staff_read on public.payment_reversals
using (private.has_permission(organization_id, 'finance.read') or private.owns_payment(organization_id, payment_id));
drop policy payment_reversals_portal_read on public.payment_reversals;

alter policy deposits_staff_read on public.deposits
using (private.has_permission(organization_id, 'finance.read') or private.owns_lease(organization_id, lease_id));
drop policy deposits_portal_read on public.deposits;

alter policy deposit_transactions_staff_read on public.deposit_transactions
using (
  private.has_permission(organization_id, 'finance.read')
  or exists (
    select 1 from public.deposits as deposit
    where deposit.organization_id = deposit_transactions.organization_id
      and deposit.id = deposit_transactions.deposit_id
      and private.owns_lease(deposit.organization_id, deposit.lease_id)
  )
);
drop policy deposit_transactions_portal_read on public.deposit_transactions;

alter policy receipts_staff_read on public.receipts
using (private.has_permission(organization_id, 'finance.read') or private.owns_payment(organization_id, payment_id));
drop policy receipts_portal_read on public.receipts;

alter policy units_staff_read on public.units
using (private.has_permission(organization_id, 'portfolio.read') or private.owns_unit(organization_id, id));
drop policy units_portal_read on public.units;

alter policy properties_staff_read on public.properties
using (
  private.has_permission(organization_id, 'portfolio.read')
  or exists (
    select 1 from public.units as unit
    where unit.organization_id = properties.organization_id
      and unit.property_id = properties.id
      and private.owns_unit(unit.organization_id, unit.id)
  )
);
drop policy properties_portal_read on public.properties;

alter policy buildings_staff_read on public.buildings
using (
  private.has_permission(organization_id, 'portfolio.read')
  or exists (
    select 1 from public.units as unit
    where unit.organization_id = buildings.organization_id
      and unit.building_id = buildings.id
      and private.owns_unit(unit.organization_id, unit.id)
  )
);
drop policy buildings_portal_read on public.buildings;

alter policy floors_staff_read on public.floors
using (
  private.has_permission(organization_id, 'portfolio.read')
  or exists (
    select 1 from public.units as unit
    where unit.organization_id = floors.organization_id
      and unit.floor_id = floors.id
      and private.owns_unit(unit.organization_id, unit.id)
  )
);
drop policy floors_portal_read on public.floors;

alter policy notifications_staff_read on public.notifications
using (
  private.has_permission(organization_id, 'notifications.read')
  or recipient_user_id = (select auth.uid())
  or (tenant_id is not null and private.owns_tenant(organization_id, tenant_id))
);
drop policy notifications_recipient_read on public.notifications;

alter policy maintenance_requests_staff_read on public.maintenance_requests
using (
  private.has_permission(organization_id, 'portfolio.read')
  or (tenant_id is not null and private.owns_tenant(organization_id, tenant_id))
);
drop policy maintenance_tenant_read on public.maintenance_requests;

alter policy documents_staff_read on public.documents
using (
  private.has_permission(organization_id, 'documents.read')
  or (tenant_id is not null and private.owns_tenant(organization_id, tenant_id))
  or (lease_id is not null and private.owns_lease(organization_id, lease_id))
  or (receipt_id is not null and private.owns_receipt(organization_id, receipt_id))
);
drop policy documents_portal_read on public.documents;

alter policy payments_staff_insert on public.payments
with check (
  private.has_permission(organization_id, 'finance.manage')
  or (private.has_permission(organization_id, 'payments.create') and received_by = (select auth.uid()))
);
drop policy payments_record_authorized on public.payments;

alter policy maintenance_requests_staff_insert on public.maintenance_requests
with check (
  private.has_permission(organization_id, 'portfolio.manage')
  or (
    tenant_id is not null
    and created_by = (select auth.uid())
    and private.has_permission(organization_id, 'maintenance.create')
    and private.owns_tenant(organization_id, tenant_id)
    and (unit_id is null or private.owns_unit(organization_id, unit_id))
  )
);
drop policy maintenance_tenant_insert on public.maintenance_requests;

alter policy notifications_staff_update on public.notifications
using (
  private.has_permission(organization_id, 'notifications.manage')
  or recipient_user_id = (select auth.uid())
)
with check (
  private.has_permission(organization_id, 'notifications.manage')
  or recipient_user_id = (select auth.uid())
);
drop policy notifications_recipient_update on public.notifications;
