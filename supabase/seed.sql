-- Development-only seed. Every row belongs to the DEMO organization and can be
-- removed with supabase/seed/remove_demo_data.sql.

insert into public.organizations (
  id,
  code,
  name,
  slug,
  default_currency,
  timezone,
  locale,
  is_demo
)
values (
  '00000000-0000-4000-8000-000000000001',
  'DEMO',
  'Portefeuille de démonstration',
  'demo',
  'USD',
  'Africa/Lubumbashi',
  'fr-CD',
  true
)
on conflict (id) do nothing;

insert into public.app_settings (organization_id, platform_name)
values ('00000000-0000-4000-8000-000000000001', 'Gestion Locative · Démonstration')
on conflict (organization_id) do nothing;

insert into public.properties (
  id,
  organization_id,
  code,
  name,
  property_type,
  address,
  commune,
  city,
  province,
  country,
  description
)
values (
  '00000000-0000-4000-8000-000000000101',
  '00000000-0000-4000-8000-000000000001',
  'PROP-DEMO-01',
  'Résidence Mwangaza',
  'residence',
  '100, avenue de la Démonstration',
  'Lubumbashi',
  'Lubumbashi',
  'Haut-Katanga',
  'République démocratique du Congo',
  'Données fictives réservées au développement.'
)
on conflict (id) do nothing;

insert into public.buildings (
  id,
  organization_id,
  property_id,
  code,
  name
)
values (
  '00000000-0000-4000-8000-000000000201',
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000101',
  'BAT-A',
  'Bâtiment A'
)
on conflict (id) do nothing;

insert into public.floors (
  id,
  organization_id,
  building_id,
  code,
  name,
  level_number
)
values (
  '00000000-0000-4000-8000-000000000301',
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000201',
  'RDC',
  'Rez-de-chaussée',
  0
)
on conflict (id) do nothing;

insert into public.units (
  id,
  organization_id,
  property_id,
  building_id,
  floor_id,
  code,
  unit_number,
  unit_type,
  area_square_meters,
  bedrooms,
  living_rooms,
  kitchens,
  bathrooms,
  toilets,
  indicative_rent,
  currency,
  status
)
values
  (
    '00000000-0000-4000-8000-000000000401',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000101',
    '00000000-0000-4000-8000-000000000201',
    '00000000-0000-4000-8000-000000000301',
    'UNIT-A-01',
    'A01',
    'apartment',
    72,
    2,
    1,
    1,
    1,
    1,
    350,
    'USD',
    'occupied'
  ),
  (
    '00000000-0000-4000-8000-000000000402',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000101',
    '00000000-0000-4000-8000-000000000201',
    '00000000-0000-4000-8000-000000000301',
    'UNIT-A-02',
    'A02',
    'apartment',
    68,
    2,
    1,
    1,
    1,
    1,
    325,
    'USD',
    'available'
  )
on conflict (id) do nothing;

insert into public.tenants (
  id,
  organization_id,
  tenant_number,
  last_name,
  middle_name,
  first_name,
  gender,
  phone,
  whatsapp_phone,
  profession,
  emergency_contact_name,
  emergency_contact_phone,
  notes
)
values (
  '00000000-0000-4000-8000-000000000501',
  '00000000-0000-4000-8000-000000000001',
  'LOC-DEMO-0001',
  'Kasongo',
  null,
  'Amina',
  'female',
  '+243990000001',
  '+243990000001',
  'Architecte',
  'Contact de démonstration',
  '+243990000002',
  'Profil fictif réservé aux tests de développement.'
)
on conflict (id) do nothing;

insert into public.leases (
  id,
  organization_id,
  unit_id,
  lease_number,
  start_date,
  end_date,
  rent_amount,
  currency,
  guarantee_amount,
  advance_amount,
  frequency,
  due_day,
  terms,
  status,
  activated_at
)
values (
  '00000000-0000-4000-8000-000000000601',
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000401',
  'LEASE-DEMO-0001',
  date_trunc('month', current_date)::date,
  (date_trunc('month', current_date) + interval '1 year - 1 day')::date,
  350,
  'USD',
  700,
  350,
  'monthly',
  5,
  'Contrat fictif pour validation du schéma de développement.',
  'active',
  statement_timestamp()
)
on conflict (id) do nothing;

insert into public.lease_tenants (
  organization_id,
  lease_id,
  tenant_id,
  is_primary,
  joined_at
)
values (
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000601',
  '00000000-0000-4000-8000-000000000501',
  true,
  date_trunc('month', current_date)::date
)
on conflict (lease_id, tenant_id) do nothing;

insert into public.rent_schedules (
  id,
  organization_id,
  lease_id,
  effective_from,
  effective_until,
  amount,
  currency,
  frequency,
  due_day
)
values (
  '00000000-0000-4000-8000-000000000701',
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000601',
  date_trunc('month', current_date)::date,
  (date_trunc('month', current_date) + interval '1 year - 1 day')::date,
  350,
  'USD',
  'monthly',
  5
)
on conflict (id) do nothing;

insert into public.rent_invoices (
  id,
  organization_id,
  lease_id,
  rent_schedule_id,
  invoice_number,
  period_start,
  period_end,
  due_date,
  amount_due,
  currency
)
values (
  '00000000-0000-4000-8000-000000000801',
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000601',
  '00000000-0000-4000-8000-000000000701',
  'INV-DEMO-0001',
  date_trunc('month', current_date)::date,
  (date_trunc('month', current_date) + interval '1 month - 1 day')::date,
  (date_trunc('month', current_date) + interval '4 days')::date,
  350,
  'USD'
)
on conflict (id) do nothing;

insert into public.deposits (
  id,
  organization_id,
  lease_id,
  kind,
  amount_required,
  currency
)
values
  (
    '00000000-0000-4000-8000-000000000901',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000601',
    'guarantee',
    700,
    'USD'
  ),
  (
    '00000000-0000-4000-8000-000000000902',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000601',
    'advance',
    350,
    'USD'
  )
on conflict (id) do nothing;

insert into public.number_sequences (organization_id, entity_type, sequence_year, last_value)
values
  ('00000000-0000-4000-8000-000000000001', 'tenant', extract(year from current_date)::smallint, 1),
  ('00000000-0000-4000-8000-000000000001', 'lease', extract(year from current_date)::smallint, 1),
  ('00000000-0000-4000-8000-000000000001', 'invoice', extract(year from current_date)::smallint, 1)
on conflict (organization_id, entity_type, sequence_year) do nothing;
