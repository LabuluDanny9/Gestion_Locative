begin;

select extensions.plan(10);

select extensions.has_table('public', 'organizations', 'organizations table exists');
select extensions.has_table('public', 'payments', 'payments table exists');
select extensions.is(
  (select count(*) from pg_class join pg_namespace on pg_namespace.oid = pg_class.relnamespace
   where pg_namespace.nspname = 'public' and pg_class.relkind = 'r' and pg_class.relrowsecurity),
  26::bigint,
  'RLS is enabled on every application table'
);
select extensions.is(
  (select count(*) from pg_class join pg_namespace on pg_namespace.oid = pg_class.relnamespace
   where pg_namespace.nspname = 'public' and pg_class.relkind = 'r' and pg_class.relforcerowsecurity),
  26::bigint,
  'RLS is forced on every application table'
);
select extensions.ok(
  exists (select 1 from pg_trigger where tgrelid = 'public.payments'::regclass and tgname = 'payments_prevent_delete'),
  'payments cannot be physically deleted'
);
select extensions.ok(
  exists (select 1 from pg_constraint where conrelid = 'public.rent_invoices'::regclass and conname = 'rent_invoices_lease_period_key'),
  'invoice generation is idempotent per lease and period'
);
select extensions.is(public.calculate_invoice_status(current_date, 350, 350, current_date)::text, 'paid', 'paid status is calculated');
select extensions.is(public.calculate_invoice_status(current_date, 350, 200, current_date)::text, 'partial', 'partial status is calculated');
select extensions.is(public.calculate_invoice_status(current_date - 31, 350, 0, current_date)::text, 'arrears', 'arrears status is calculated');
select extensions.is(
  (select count(*) from storage.buckets where id in ('tenant-photos', 'property-images', 'identity-documents', 'lease-documents', 'receipts') and not public),
  5::bigint,
  'all application storage buckets are private'
);

select * from extensions.finish();
rollback;
