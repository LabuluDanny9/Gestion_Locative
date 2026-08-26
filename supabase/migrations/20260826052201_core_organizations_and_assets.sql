create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  name text not null,
  slug extensions.citext not null,
  status public.organization_status not null default 'active',
  default_currency public.currency_code not null default 'USD',
  timezone text not null default 'Africa/Lubumbashi',
  locale text not null default 'fr-CD',
  is_demo boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  archived_at timestamptz,
  constraint organizations_code_key unique (code),
  constraint organizations_slug_key unique (slug),
  constraint organizations_code_format check (code ~ '^[A-Z0-9][A-Z0-9_-]{1,31}$'),
  constraint organizations_name_not_blank check (btrim(name) <> ''),
  constraint organizations_timezone_not_blank check (btrim(timezone) <> ''),
  constraint organizations_archived_at_check check ((status = 'archived') = (archived_at is not null))
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  first_name text,
  last_name text,
  phone text,
  avatar_path text,
  preferred_locale text not null default 'fr-CD',
  timezone text not null default 'Africa/Lubumbashi',
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  constraint profiles_display_name_not_blank check (btrim(display_name) <> '')
);

create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  status public.membership_status not null default 'invited',
  permissions jsonb not null default '{}'::jsonb,
  invited_by uuid references auth.users(id) on delete set null,
  joined_at timestamptz,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  constraint organization_members_org_user_key unique (organization_id, user_id),
  constraint organization_members_org_id_key unique (organization_id, id),
  constraint organization_members_permissions_object check (jsonb_typeof(permissions) = 'object'),
  constraint organization_members_joined_at_check check (
    (status = 'active' and joined_at is not null) or status <> 'active'
  )
);

create table public.number_sequences (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entity_type text not null,
  sequence_year smallint not null,
  last_value bigint not null default 0,
  updated_at timestamptz not null default statement_timestamp(),
  primary key (organization_id, entity_type, sequence_year),
  constraint number_sequences_entity_type_check check (
    entity_type in ('tenant', 'lease', 'payment', 'receipt', 'invoice')
  ),
  constraint number_sequences_year_check check (sequence_year between 2000 and 9999),
  constraint number_sequences_value_check check (last_value >= 0)
);

create or replace function public.next_human_number(
  p_organization_id uuid,
  p_entity_type text,
  p_prefix text,
  p_year smallint default extract(year from current_date)::smallint,
  p_padding smallint default 4
)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_value bigint;
begin
  if p_entity_type not in ('tenant', 'lease', 'payment', 'receipt', 'invoice') then
    raise exception 'Unsupported entity type: %', p_entity_type using errcode = '22023';
  end if;

  if p_prefix !~ '^[A-Z]{2,10}$' or p_padding not between 1 and 12 then
    raise exception 'Invalid number prefix or padding' using errcode = '22023';
  end if;

  insert into public.number_sequences as sequence_row (
    organization_id,
    entity_type,
    sequence_year,
    last_value
  )
  values (p_organization_id, p_entity_type, p_year, 1)
  on conflict (organization_id, entity_type, sequence_year)
  do update set
    last_value = sequence_row.last_value + 1,
    updated_at = statement_timestamp()
  returning last_value into v_value;

  return format('%s-%s-%s', p_prefix, p_year, lpad(v_value::text, p_padding, '0'));
end;
$$;

revoke all on function public.next_human_number(uuid, text, text, smallint, smallint) from public, anon, authenticated;

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  owner_user_id uuid references auth.users(id) on delete set null,
  code text not null,
  name text not null,
  property_type public.property_type not null,
  address text not null,
  commune text,
  city text not null,
  province text,
  country text not null default 'République démocratique du Congo',
  description text,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  status public.property_status not null default 'active',
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  archived_at timestamptz,
  constraint properties_org_code_key unique (organization_id, code),
  constraint properties_org_id_key unique (organization_id, id),
  constraint properties_code_not_blank check (btrim(code) <> ''),
  constraint properties_name_not_blank check (btrim(name) <> ''),
  constraint properties_address_not_blank check (btrim(address) <> ''),
  constraint properties_latitude_check check (latitude is null or latitude between -90 and 90),
  constraint properties_longitude_check check (longitude is null or longitude between -180 and 180),
  constraint properties_archived_at_check check ((status = 'archived') = (archived_at is not null))
);

create table public.buildings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  property_id uuid not null,
  code text not null,
  name text not null,
  description text,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  archived_at timestamptz,
  constraint buildings_org_property_fkey foreign key (organization_id, property_id)
    references public.properties(organization_id, id) on delete cascade,
  constraint buildings_property_code_key unique (property_id, code),
  constraint buildings_org_id_key unique (organization_id, id),
  constraint buildings_org_id_property_key unique (organization_id, id, property_id),
  constraint buildings_code_not_blank check (btrim(code) <> ''),
  constraint buildings_name_not_blank check (btrim(name) <> '')
);

create table public.floors (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  building_id uuid not null,
  code text not null,
  name text,
  level_number smallint not null,
  description text,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  constraint floors_org_building_fkey foreign key (organization_id, building_id)
    references public.buildings(organization_id, id) on delete cascade,
  constraint floors_building_level_key unique (building_id, level_number),
  constraint floors_building_code_key unique (building_id, code),
  constraint floors_org_id_key unique (organization_id, id),
  constraint floors_org_id_building_key unique (organization_id, id, building_id),
  constraint floors_code_not_blank check (btrim(code) <> '')
);

create table public.units (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  property_id uuid not null,
  building_id uuid,
  floor_id uuid,
  code text not null,
  unit_number text,
  unit_type public.unit_type not null,
  area_square_meters numeric(10, 2),
  bedrooms smallint not null default 0,
  living_rooms smallint not null default 0,
  kitchens smallint not null default 0,
  bathrooms smallint not null default 0,
  toilets smallint not null default 0,
  has_balcony boolean not null default false,
  has_garage boolean not null default false,
  has_yard boolean not null default false,
  description text,
  indicative_rent numeric(18, 2),
  currency public.currency_code not null default 'USD',
  status public.unit_status not null default 'available',
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  archived_at timestamptz,
  constraint units_org_property_fkey foreign key (organization_id, property_id)
    references public.properties(organization_id, id) on delete cascade,
  constraint units_org_building_property_fkey foreign key (organization_id, building_id, property_id)
    references public.buildings(organization_id, id, property_id) on delete restrict,
  constraint units_org_floor_building_fkey foreign key (organization_id, floor_id, building_id)
    references public.floors(organization_id, id, building_id) on delete restrict,
  constraint units_org_code_key unique (organization_id, code),
  constraint units_org_id_key unique (organization_id, id),
  constraint units_org_id_property_key unique (organization_id, id, property_id),
  constraint units_code_not_blank check (btrim(code) <> ''),
  constraint units_floor_requires_building check (floor_id is null or building_id is not null),
  constraint units_area_check check (area_square_meters is null or area_square_meters > 0),
  constraint units_room_counts_check check (
    bedrooms >= 0 and living_rooms >= 0 and kitchens >= 0 and bathrooms >= 0 and toilets >= 0
  ),
  constraint units_indicative_rent_check check (indicative_rent is null or indicative_rent >= 0)
);

create index organization_members_user_id_idx on public.organization_members(user_id);
create index organization_members_org_role_status_idx on public.organization_members(organization_id, role, status);
create index properties_owner_user_id_idx on public.properties(owner_user_id) where owner_user_id is not null;
create index properties_org_status_idx on public.properties(organization_id, status);
create index properties_name_trgm_idx on public.properties using gin (name extensions.gin_trgm_ops);
create index buildings_property_id_idx on public.buildings(property_id);
create index floors_building_id_idx on public.floors(building_id);
create index units_property_status_idx on public.units(property_id, status);
create index units_building_id_idx on public.units(building_id) where building_id is not null;
create index units_floor_id_idx on public.units(floor_id) where floor_id is not null;

create trigger organizations_set_updated_at before update on public.organizations
for each row execute function public.set_updated_at();
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger organization_members_set_updated_at before update on public.organization_members
for each row execute function public.set_updated_at();
create trigger properties_set_updated_at before update on public.properties
for each row execute function public.set_updated_at();
create trigger buildings_set_updated_at before update on public.buildings
for each row execute function public.set_updated_at();
create trigger floors_set_updated_at before update on public.floors
for each row execute function public.set_updated_at();
create trigger units_set_updated_at before update on public.units
for each row execute function public.set_updated_at();

comment on table public.number_sequences is
  'Per-organization counters used to produce collision-safe human-readable references.';
