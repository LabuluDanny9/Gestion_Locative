begin;

select extensions.plan(5);

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values (
  '00000000-0000-0000-0000-000000000000', '30000000-0000-0000-0000-000000000001',
  'authenticated', 'authenticated', 'invoice-owner@test.invalid', '', statement_timestamp(),
  '{}'::jsonb, '{"display_name":"Invoice owner"}'::jsonb, statement_timestamp(), statement_timestamp()
);

insert into public.organizations (id, code, name, slug)
values ('30000000-0000-0000-0000-000000000002', 'INVTEST', 'Invoice Test', 'invoice-test');
insert into public.organization_members (organization_id, user_id, role, status, joined_at)
values ('30000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'owner', 'active', now());
insert into public.properties (id, organization_id, code, name, property_type, address, city)
values ('30000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000002', 'P1', 'Property', 'house', 'Address', 'Lubumbashi');
insert into public.units (id, organization_id, property_id, code, unit_type, indicative_rent, currency)
values ('30000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000003', 'U1', 'house', 350, 'USD');
insert into public.tenants (id, organization_id, tenant_number, first_name, last_name, phone)
values ('30000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000002', 'LOC-TEST-1', 'Test', 'Tenant', '+243000000000');

select set_config('request.jwt.claim.sub', '30000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claims', '{"sub":"30000000-0000-0000-0000-000000000001","role":"authenticated"}', true);

select extensions.ok(
  public.create_lease_and_invoices(
    '30000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000005',
    '30000000-0000-0000-0000-000000000004', current_date, current_date + 365,
    350, 'USD', 0, 0, 'monthly', 5, null
  ) is not null,
  'contract and invoices are created atomically'
);
select extensions.is((select count(*) from public.rent_invoices where organization_id = '30000000-0000-0000-0000-000000000002'), 2::bigint, '45-day horizon creates two monthly periods');
select extensions.is((select amount_due from public.rent_invoices where organization_id = '30000000-0000-0000-0000-000000000002' order by due_date limit 1), 350::numeric, 'invoice uses the contractual rent');
select extensions.is((select status::text from public.rent_invoices where organization_id = '30000000-0000-0000-0000-000000000002' order by due_date limit 1), 'due_today', 'first invoice status is derived on the server');
select public.generate_rent_invoices('30000000-0000-0000-0000-000000000002', current_date + 45);
select extensions.is((select count(*) from public.rent_invoices where organization_id = '30000000-0000-0000-0000-000000000002'), 2::bigint, 'regeneration is idempotent');

select * from extensions.finish();
rollback;
