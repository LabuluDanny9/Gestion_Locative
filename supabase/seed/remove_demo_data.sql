-- Removes only development data explicitly marked as demo.
-- Financial seed rows are intentionally absent so the immutable-payment guard
-- cannot interfere with cleanup.
delete from public.organizations
where code = 'DEMO'
  and is_demo;
