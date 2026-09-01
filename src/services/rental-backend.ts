import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { buildLeaseCreationRpc, type LeaseCreationInput } from "@/services/lease-creation";
import type { Database } from "@/types/database.types";

type Client = SupabaseClient<Database>;
type Currency = Database["public"]["Enums"]["currency_code"];

export async function getActiveOrganization(supabase: Client, userId: string) {
  const findMembership = () => supabase
    .from("organization_members")
    .select("organization_id, role")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("joined_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  let { data: membership, error } = await findMembership();
  if (error) throw error;
  if (!membership) {
    const { error: bootstrapError } = await supabase.rpc("bootstrap_owner_organization", {
      p_code: "AMIRANDA",
      p_name: "AMIRANDA EMPIRE",
    });
    if (bootstrapError) throw bootstrapError;
    ({ data: membership, error } = await findMembership());
    if (error) throw error;
  }
  if (!membership) throw new Error("Impossible de créer l’espace AMIRANDA EMPIRE pour ce compte.");
  return membership;
}

export async function createProperty(supabase: Client, organizationId: string, input: {
  name: string; code: string; propertyType: Database["public"]["Enums"]["property_type"];
  description?: string; address: string; city: string; country: string;
}) {
  const { data, error } = await supabase.from("properties").insert({
    organization_id: organizationId, name: input.name, code: input.code,
    property_type: input.propertyType, description: input.description || null,
    address: input.address, city: input.city, country: input.country,
  }).select("id").single();
  if (error) throw error;
  return data.id;
}

export async function createUnit(supabase: Client, organizationId: string, input: {
  propertyId: string; code: string; unitType: Database["public"]["Enums"]["unit_type"];
  bedrooms: number; livingRooms: number; bathrooms: number; kitchens: number;
  area?: number; rent: number; currency: Currency; status: Database["public"]["Enums"]["unit_status"];
}) {
  const { data: unit, error } = await supabase.from("units").insert({
    organization_id: organizationId, property_id: input.propertyId, code: input.code,
    unit_type: input.unitType, bedrooms: input.bedrooms, living_rooms: input.livingRooms,
    bathrooms: input.bathrooms, kitchens: input.kitchens, area_square_meters: input.area ?? null,
    indicative_rent: input.rent, currency: input.currency, status: input.status,
  }).select("id").single();
  if (error) throw error;
  return unit.id;
}

export type UnitPhotoMetadata = {
  storagePath: string;
  fileName: string;
  mimeType: "image/jpeg" | "image/png" | "image/webp";
  fileSize: number;
};

export type LeaseDocumentMetadata = {
  storagePath: string;
  fileName: string;
  mimeType: "application/pdf" | "application/msword" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document" | "image/jpeg" | "image/png";
  fileSize: number;
};

export type TenantDocumentMetadata = {
  storagePath: string;
  fileName: string;
  mimeType: "application/pdf" | "image/jpeg" | "image/png";
  fileSize: number;
};

export async function attachUnitPhotos(supabase: Client, userId: string, organizationId: string, unitId: string, photos: UnitPhotoMetadata[]) {
  const expectedPrefix = `${organizationId}/units/${unitId}/`;
  if (photos.length > 12) throw new Error("Maximum 12 photos par logement.");
  for (const [index, photo] of photos.entries()) {
    if (!photo.storagePath.startsWith(expectedPrefix) || !["image/jpeg", "image/png", "image/webp"].includes(photo.mimeType) || photo.fileSize < 1 || photo.fileSize > 6_291_456) {
      throw new Error(`Photo invalide : ${photo.fileName}`);
    }
    const { error } = await supabase.from("unit_photos").insert({
      organization_id: organizationId, unit_id: unitId, storage_path: photo.storagePath,
      file_name: photo.fileName, mime_type: photo.mimeType, file_size_bytes: photo.fileSize,
      sort_order: index, is_cover: index === 0, uploaded_by: userId,
    });
    if (error) throw error;
  }
}

export async function rollbackUnitCreation(supabase: Client, organizationId: string, unitId: string, storagePaths: string[]) {
  const expectedPrefix = `${organizationId}/units/${unitId}/`;
  const safePaths = storagePaths.filter((path) => path.startsWith(expectedPrefix));
  if (safePaths.length) await supabase.storage.from("property-images").remove(safePaths);
  const { error } = await supabase.from("units").delete().eq("id", unitId).eq("organization_id", organizationId);
  if (error) throw error;
}

export async function createTenant(supabase: Client, organizationId: string, input: {
  firstName: string; lastName: string; phone: string; email?: string;
  identityType?: Database["public"]["Enums"]["identity_document_type"];
  identityNumber?: string; previousAddress?: string; emergencyName?: string; emergencyPhone?: string;
}) {
  const { data, error } = await supabase.rpc("create_tenant_record", {
    p_organization_id: organizationId, p_first_name: input.firstName, p_last_name: input.lastName,
    p_phone: input.phone, p_email: input.email, p_identity_type: input.identityType,
    p_identity_number: input.identityNumber, p_previous_address: input.previousAddress,
    p_emergency_name: input.emergencyName, p_emergency_phone: input.emergencyPhone,
  });
  if (error) throw error;
  return data;
}

export async function attachTenantDocuments(supabase: Client, userId: string, organizationId: string, tenantId: string, documents: TenantDocumentMetadata[]) {
  const expectedPrefix = `${organizationId}/tenants/${tenantId}/`;
  const allowedMimeTypes = ["application/pdf", "image/jpeg", "image/png"];
  if (documents.reduce((total, document) => total + document.fileSize, 0) > 3_145_728) throw new Error("Le total des documents dépasse 3 Mo.");
  for (const document of documents) {
    if (!document.storagePath.startsWith(expectedPrefix) || !allowedMimeTypes.includes(document.mimeType) || document.fileSize < 1) {
      throw new Error(`Document invalide : ${document.fileName}`);
    }
    const { error } = await supabase.from("documents").insert({
      organization_id: organizationId, tenant_id: tenantId, bucket_id: "identity-documents",
      storage_path: document.storagePath, file_name: document.fileName, mime_type: document.mimeType,
      file_size_bytes: document.fileSize, kind: "identity_document", is_sensitive: true, uploaded_by: userId,
    });
    if (error) throw error;
  }
}

export async function rollbackTenantCreation(supabase: Client, organizationId: string, tenantId: string, storagePaths: string[]) {
  const expectedPrefix = `${organizationId}/tenants/${tenantId}/`;
  const safePaths = storagePaths.filter((path) => path.startsWith(expectedPrefix));
  if (safePaths.length) await supabase.storage.from("identity-documents").remove(safePaths);
  const { error } = await supabase.from("tenants").delete().eq("id", tenantId).eq("organization_id", organizationId);
  if (error) throw error;
}

export async function deleteTenant(supabase: Client, organizationId: string, tenantId: string) {
  const { data: documents, error: documentsError } = await supabase
    .from("documents")
    .select("bucket_id, storage_path")
    .eq("organization_id", organizationId)
    .eq("tenant_id", tenantId);
  if (documentsError) throw documentsError;

  const { data: deleted, error } = await supabase
    .from("tenants")
    .delete()
    .eq("organization_id", organizationId)
    .eq("id", tenantId)
    .select("id")
    .maybeSingle();
  if (error) throw error;
  if (!deleted) throw new Error("Tenant deletion was not authorized or the tenant no longer exists.");

  const pathsByBucket = new Map<string, string[]>();
  for (const document of documents ?? []) {
    const expectedPrefix = `${organizationId}/tenants/${tenantId}/`;
    if (!document.storage_path.startsWith(expectedPrefix)) continue;
    pathsByBucket.set(document.bucket_id, [...(pathsByBucket.get(document.bucket_id) ?? []), document.storage_path]);
  }
  await Promise.all([...pathsByBucket].map(async ([bucket, paths]) => {
    const { error: storageError } = await supabase.storage.from(bucket).remove(paths);
    if (storageError) console.error("Le locataire a été supprimé mais certains fichiers privés n’ont pas pu être nettoyés", storageError);
  }));
}

export async function createLease(supabase: Client, organizationId: string, input: LeaseCreationInput) {
  const { data, error } = await supabase.rpc("create_lease_with_tenant", buildLeaseCreationRpc(organizationId, input));
  if (error) throw error;

  // Invoice generation must not prevent the already-created lease and its
  // documents from completing when PostgREST refreshes a secondary RPC late.
  const currentThroughDate = new Date();
  currentThroughDate.setUTCDate(currentThroughDate.getUTCDate() + 45);
  const startThroughDate = new Date(`${input.startDate}T00:00:00Z`);
  startThroughDate.setUTCDate(startThroughDate.getUTCDate() + 45);
  const maximumThroughDate = new Date();
  maximumThroughDate.setUTCDate(maximumThroughDate.getUTCDate() + 366);
  const throughDate = new Date(Math.min(
    Math.max(currentThroughDate.getTime(), startThroughDate.getTime()),
    maximumThroughDate.getTime(),
  ));
  const { error: invoiceError } = await supabase.rpc("generate_rent_invoices", {
    p_organization_id: organizationId,
    p_through_date: throughDate.toISOString().slice(0, 10),
  });
  if (invoiceError) console.error("Échec de la génération initiale des échéances", invoiceError);
  return data;
}

export async function attachLeaseDocuments(supabase: Client, userId: string, organizationId: string, leaseId: string, documents: LeaseDocumentMetadata[]) {
  const expectedPrefix = `${organizationId}/leases/${leaseId}/`;
  const allowedMimeTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg", "image/png"];
  if (documents.length > 8) throw new Error("Maximum 8 documents par contrat.");
  if (documents.reduce((total, document) => total + document.fileSize, 0) > 20_971_520) throw new Error("Le total des documents dépasse 20 Mo.");
  for (const document of documents) {
    if (!document.storagePath.startsWith(expectedPrefix) || !allowedMimeTypes.includes(document.mimeType) || document.fileSize < 1 || document.fileSize > 10_485_760) {
      throw new Error(`Document invalide : ${document.fileName}`);
    }
    const { error } = await supabase.from("documents").insert({
      organization_id: organizationId, lease_id: leaseId, bucket_id: "lease-documents",
      storage_path: document.storagePath, file_name: document.fileName, mime_type: document.mimeType,
      file_size_bytes: document.fileSize, kind: "lease_document", is_sensitive: true, uploaded_by: userId,
    });
    if (error) throw error;
  }
}

export async function rollbackLeaseCreation(supabase: Client, organizationId: string, leaseId: string, storagePaths: string[]) {
  const expectedPrefix = `${organizationId}/leases/${leaseId}/`;
  const safePaths = storagePaths.filter((path) => path.startsWith(expectedPrefix));
  if (safePaths.length) await supabase.storage.from("lease-documents").remove(safePaths);
  const { error } = await supabase.rpc("rollback_lease_creation", { p_lease_id: leaseId, p_organization_id: organizationId });
  if (error) throw error;
}

export async function generateRentInvoices(supabase: Client, organizationId: string, throughDate: string) {
  const { data, error } = await supabase.rpc("generate_rent_invoices", {
    p_organization_id: organizationId,
    p_through_date: throughDate,
  });
  if (error) throw error;
  return data;
}

export async function recordPayment(supabase: Client, organizationId: string, input: {
  tenantId: string; leaseId: string; amount: number; currency: Currency; paidAt: string;
  method: Database["public"]["Enums"]["payment_method"]; reference?: string; note?: string;
  idempotencyKey: string;
}) {
  const loadOutstanding = async () => {
    const { data: balances, error: balanceError } = await supabase
      .from("rent_invoice_balances")
      .select("balance")
      .eq("organization_id", organizationId)
      .eq("lease_id", input.leaseId)
      .eq("currency", input.currency);
    if (balanceError) throw balanceError;
    return (balances ?? []).reduce((total, row) => total + Number(row.balance ?? 0), 0);
  };

  let outstanding = await loadOutstanding();
  if (input.amount > outstanding + 0.005) {
    const throughDate = new Date();
    throughDate.setUTCDate(throughDate.getUTCDate() + 366);
    await generateRentInvoices(supabase, organizationId, throughDate.toISOString().slice(0, 10));
    outstanding = await loadOutstanding();
  }
  if (input.amount > outstanding + 0.005) {
    throw new Error(`Ce montant dépasse les échéances contractuelles disponibles (${outstanding} ${input.currency}).`);
  }

  const { data, error } = await supabase.rpc("record_rent_payment", {
    p_organization_id: organizationId, p_tenant_id: input.tenantId, p_lease_id: input.leaseId,
    p_amount: input.amount, p_currency: input.currency, p_paid_at: input.paidAt,
    p_method: input.method, p_external_reference: input.reference,
    p_note: input.note, p_idempotency_key: input.idempotencyKey,
  });
  if (error) throw error;
  if (!data) throw new Error("Le paiement a été enregistré sans identifiant exploitable.");
  return { paymentId: data, outstandingBefore: outstanding };
}

export async function reversePayment(supabase: Client, organizationId: string, paymentId: string, reason: string) {
  const { data, error } = await supabase.rpc("reverse_rent_payment", {
    p_organization_id: organizationId,
    p_payment_id: paymentId,
    p_reason: reason,
  });
  if (error) throw error;
  return data;
}
