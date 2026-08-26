-- Composite indexes cover every foreign key exactly as declared. PostgreSQL
-- does not create these automatically, and they are required for efficient
-- joins, tenant filtering and referential actions.

create index buildings_org_property_fk_idx on public.buildings(organization_id, property_id);
create index deposit_transactions_org_deposit_fk_idx on public.deposit_transactions(organization_id, deposit_id);
create index deposit_transactions_recorded_by_fk_idx on public.deposit_transactions(recorded_by);
create index deposits_org_lease_fk_idx on public.deposits(organization_id, lease_id);

create index documents_org_expense_fk_idx on public.documents(organization_id, expense_id);
create index documents_org_lease_fk_idx on public.documents(organization_id, lease_id);
create index documents_org_maintenance_fk_idx on public.documents(organization_id, maintenance_request_id);
create index documents_org_property_fk_idx on public.documents(organization_id, property_id);
create index documents_org_receipt_fk_idx on public.documents(organization_id, receipt_id);
create index documents_org_tenant_fk_idx on public.documents(organization_id, tenant_id);
create index documents_uploaded_by_fk_idx on public.documents(uploaded_by);

create index expenses_created_by_fk_idx on public.expenses(created_by);
create index expenses_org_property_fk_idx on public.expenses(organization_id, property_id);
create index expenses_org_unit_property_fk_idx on public.expenses(organization_id, unit_id, property_id);
create index floors_org_building_fk_idx on public.floors(organization_id, building_id);

create index lease_tenants_org_lease_fk_idx on public.lease_tenants(organization_id, lease_id);
create index lease_tenants_org_tenant_fk_idx on public.lease_tenants(organization_id, tenant_id);
create index leases_org_unit_fk_idx on public.leases(organization_id, unit_id);

create index maintenance_org_property_fk_idx on public.maintenance_requests(organization_id, property_id);
create index maintenance_org_tenant_fk_idx on public.maintenance_requests(organization_id, tenant_id);
create index maintenance_org_unit_property_fk_idx on public.maintenance_requests(organization_id, unit_id, property_id);
create index maintenance_created_by_fk_idx on public.maintenance_requests(created_by);
create index notifications_org_tenant_fk_idx on public.notifications(organization_id, tenant_id);

create index organization_members_invited_by_fk_idx on public.organization_members(invited_by);
create index organizations_created_by_fk_idx on public.organizations(created_by);

create index payment_allocations_allocated_by_fk_idx on public.payment_allocations(allocated_by);
create index payment_allocations_org_invoice_fk_idx on public.payment_allocations(organization_id, rent_invoice_id);
create index payment_allocations_org_payment_fk_idx on public.payment_allocations(organization_id, payment_id);
create index payment_reversals_org_payment_fk_idx on public.payment_reversals(organization_id, payment_id);

create index payments_org_lease_fk_idx on public.payments(organization_id, lease_id);
create index payments_org_tenant_fk_idx on public.payments(organization_id, tenant_id);
create index payments_org_unit_fk_idx on public.payments(organization_id, unit_id);

create index receipts_org_payment_fk_idx on public.receipts(organization_id, payment_id);
create index receipts_voided_by_fk_idx on public.receipts(voided_by);

create index rent_invoices_org_lease_fk_idx on public.rent_invoices(organization_id, lease_id);
create index rent_invoices_org_schedule_fk_idx on public.rent_invoices(organization_id, rent_schedule_id);
create index rent_schedules_created_by_fk_idx on public.rent_schedules(created_by);
create index rent_schedules_org_lease_fk_idx on public.rent_schedules(organization_id, lease_id);

create index units_org_building_property_fk_idx on public.units(organization_id, building_id, property_id);
create index units_org_floor_building_fk_idx on public.units(organization_id, floor_id, building_id);
create index units_org_property_fk_idx on public.units(organization_id, property_id);
