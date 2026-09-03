import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { documentKindLabels, type DocumentFilters } from "@/features/documents/document-data";
import type { Database } from "@/types/database.types";

type Client = SupabaseClient<Database>;
type Role = Database["public"]["Enums"]["app_role"];

async function hasPermission(supabase: Client, role: Role, permission: "documents.read" | "documents.manage") {
  const { data, error } = await supabase.from("role_permissions").select("permission").eq("role", role).eq("permission", permission).maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export const canReadDocuments = (supabase: Client, role: Role) => hasPermission(supabase, role, "documents.read");
export const canManageDocuments = (supabase: Client, role: Role) => hasPermission(supabase, role, "documents.manage");

export async function loadDocumentLibrary(supabase: Client, organizationId: string, role: Role, filters: DocumentFilters) {
  const [documentResult, propertyResult, tenantResult, leaseResult, unitResult, manage] = await Promise.all([
    supabase.from("documents").select("*").eq("organization_id", organizationId).order("created_at", { ascending: false }),
    supabase.from("properties").select("id, name").eq("organization_id", organizationId).is("archived_at", null).order("name"),
    supabase.from("tenants").select("id, tenant_number, first_name, last_name").eq("organization_id", organizationId).is("archived_at", null).order("last_name"),
    supabase.from("leases").select("id, lease_number, unit_id").eq("organization_id", organizationId).order("created_at", { ascending: false }),
    supabase.from("units").select("id, code, property_id").eq("organization_id", organizationId),
    canManageDocuments(supabase, role),
  ]);
  for (const result of [documentResult, propertyResult, tenantResult, leaseResult, unitResult]) if (result.error) throw result.error;

  const properties = propertyResult.data ?? [];
  const tenants = tenantResult.data ?? [];
  const leases = leaseResult.data ?? [];
  const units = unitResult.data ?? [];
  const propertyById = new Map(properties.map((item) => [item.id, item.name]));
  const tenantById = new Map(tenants.map((item) => [item.id, `${item.first_name} ${item.last_name}`.trim()]));
  const unitById = new Map(units.map((item) => [item.id, item]));
  const leaseById = new Map(leases.map((item) => [item.id, item]));
  const query = filters.query.toLocaleLowerCase("fr");

  const source = (row: Database["public"]["Tables"]["documents"]["Row"]) => {
    if (row.property_id) return { type: "property" as const, label: propertyById.get(row.property_id) ?? "Propriété" };
    if (row.tenant_id) return { type: "tenant" as const, label: tenantById.get(row.tenant_id) ?? "Locataire" };
    if (row.lease_id) {
      const lease = leaseById.get(row.lease_id);
      const unit = lease ? unitById.get(lease.unit_id) : undefined;
      return { type: "lease" as const, label: lease ? `${lease.lease_number}${unit ? ` · ${unit.code}` : ""}` : "Contrat" };
    }
    return { type: "organization" as const, label: "AMIRANDA EMPIRE" };
  };

  const rows = (documentResult.data ?? []).map((row) => ({ row, source: source(row) }))
    .filter(({ row, source: itemSource }) => (!filters.kind || row.kind === filters.kind)
      && (!filters.link || itemSource.type === filters.link)
      && (!query || `${row.file_name} ${documentKindLabels[row.kind]} ${itemSource.label}`.toLocaleLowerCase("fr").includes(query)));

  const documents = await Promise.all(rows.map(async ({ row, source: itemSource }) => {
    const { data } = await supabase.storage.from(row.bucket_id).createSignedUrl(row.storage_path, 300, { download: row.file_name });
    return {
      id: row.id,
      name: row.file_name,
      kind: row.kind,
      kindLabel: documentKindLabels[row.kind],
      mimeType: row.mime_type,
      size: row.file_size_bytes,
      createdAt: row.created_at,
      source: itemSource,
      downloadUrl: data?.signedUrl,
    };
  }));

  return {
    documents,
    canManage: manage,
    filters,
    options: {
      properties,
      tenants: tenants.map((item) => ({ id: item.id, label: `${item.first_name} ${item.last_name}`.trim(), number: item.tenant_number })),
      leases: leases.map((item) => ({ id: item.id, label: item.lease_number, unit: unitById.get(item.unit_id)?.code ?? "" })),
    },
  };
}
