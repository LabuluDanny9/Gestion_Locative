-- Central private document library for organization files.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'organization-documents',
  'organization-documents',
  false,
  10485760,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy organization_documents_staff_read on storage.objects for select to authenticated
using (
  bucket_id = 'organization-documents'
  and name ~ '^[0-9a-fA-F-]{36}/'
  and private.has_permission(((storage.foldername(name))[1])::uuid, 'documents.read')
);

create policy organization_documents_staff_insert on storage.objects for insert to authenticated
with check (
  bucket_id = 'organization-documents'
  and name ~ '^[0-9a-fA-F-]{36}/'
  and private.has_permission(((storage.foldername(name))[1])::uuid, 'documents.manage')
  and owner_id = (select auth.uid()::text)
);

create policy organization_documents_staff_update on storage.objects for update to authenticated
using (
  bucket_id = 'organization-documents'
  and name ~ '^[0-9a-fA-F-]{36}/'
  and private.has_permission(((storage.foldername(name))[1])::uuid, 'documents.manage')
)
with check (
  bucket_id = 'organization-documents'
  and name ~ '^[0-9a-fA-F-]{36}/'
  and private.has_permission(((storage.foldername(name))[1])::uuid, 'documents.manage')
);

create policy organization_documents_staff_delete on storage.objects for delete to authenticated
using (
  bucket_id = 'organization-documents'
  and name ~ '^[0-9a-fA-F-]{36}/'
  and private.has_permission(((storage.foldername(name))[1])::uuid, 'documents.manage')
);

comment on table public.documents is
  'Metadata registry for private organization, property, tenant, lease and financial documents.';
