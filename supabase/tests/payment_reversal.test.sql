begin;

select extensions.plan(8);

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values (
  '00000000-0000-0000-0000-000000000000', '40000000-0000-0000-0000-000000000001',
  'authenticated', 'authenticated', 'reversal-owner@test.invalid', '', statement_timestamp(),
  '{}'::jsonb, '{"display_name":"Reversal owner"}'::jsonb, statement_timestamp(), statement_timestamp()
);
insert into public.organizations (id, code, name, slug)
values ('40000000-0000-0000-0000-000000000002', 'REVTEST', 'Reversal Test', 'reversal-test');
insert into public.organization_members (organization_id, user_id, role, status, joined_at)
values ('40000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', 'owner', 'active', now());
insert into public.properties (id, organization_id, code, name, property_type, address, city)
values ('40000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000002', 'P1', 'Property', 'house', 'Address', 'Lubumbashi');
insert into public.units (id, organization_id, property_id, code, unit_type, indicative_rent, currency)
values ('40000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000003', 'U1', 'house', 350, 'USD');
insert into public.tenants (id, organization_id, tenant_number, first_name, last_name, phone)
values ('40000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000002', 'LOC-REV-1', 'Test', 'Tenant', '+243000000001');

select set_config('request.jwt.claim.sub', '40000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claims', '{"sub":"40000000-0000-0000-0000-000000000001","role":"authenticated"}', true);

select public.create_lease_and_invoices(
  '40000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000005',
  '40000000-0000-0000-0000-000000000004', current_date, current_date + 365,
  350, 'USD', 0, 0, 'monthly', 5, null
);
select public.record_rent_payment(
  '40000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000005',
  (select id from public.leases where organization_id = '40000000-0000-0000-0000-000000000002'),
  200, 'USD', now(), 'cash', null, null, '40000000-0000-0000-0000-000000000006'
);

select extensions.is((select sum(amount_paid) from public.rent_invoices where organization_id = '40000000-0000-0000-0000-000000000002'), 200::numeric, 'payment is allocated before reversal');
select extensions.ok(public.reverse_rent_payment(
  '40000000-0000-0000-0000-000000000002',
  (select id from public.payments where organization_id = '40000000-0000-0000-0000-000000000002'),
  'Duplicate payment entry'
) is not null, 'reversal is recorded atomically');
select extensions.is((select status::text from public.payments where organization_id = '40000000-0000-0000-0000-000000000002'), 'reversed', 'payment is marked reversed');
select extensions.is((select sum(amount_paid) from public.rent_invoices where organization_id = '40000000-0000-0000-0000-000000000002'), 0::numeric, 'invoice allocations are restored');
select extensions.is((select status::text from public.receipts where organization_id = '40000000-0000-0000-0000-000000000002'), 'void', 'receipt is voided');
select extensions.is((select reason from public.payment_reversals where organization_id = '40000000-0000-0000-0000-000000000002'), 'Duplicate payment entry', 'reversal reason is immutable evidence');
select extensions.is((select action from public.audit_logs where organization_id = '40000000-0000-0000-0000-000000000002' and entity_type = 'payment'), 'payment.reversed', 'reversal is audited');
select extensions.is((select count(*) from public.payment_allocations where organization_id = '40000000-0000-0000-0000-000000000002'), 1::bigint, 'allocation evidence is preserved');

select * from extensions.finish();
rollback;
