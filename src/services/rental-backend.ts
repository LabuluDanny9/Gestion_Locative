import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

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

export async function createTenant(supabase: Client, userId: string, organizationId: string, input: {
  firstName: string; lastName: string; phone: string; email?: string;
  identityType?: Database["public"]["Enums"]["identity_document_type"];
  identityNumber?: string; previousAddress?: string; emergencyName?: string; emergencyPhone?: string; documents: File[];
}) {
  if (input.documents.reduce((total, document) => total + document.size, 0) > 3_145_728) throw new Error("Le total des documents dépasse 3 Mo.");
  const { data, error } = await supabase.rpc("create_tenant_record", {
    p_organization_id: organizationId, p_first_name: input.firstName, p_last_name: input.lastName,
    p_phone: input.phone, p_email: input.email, p_identity_type: input.identityType,
    p_identity_number: input.identityNumber, p_previous_address: input.previousAddress,
    p_emergency_name: input.emergencyName, p_emergency_phone: input.emergencyPhone,
  });
  if (error) throw error;
  const uploaded: string[] = [];
  try {
    for (const document of input.documents) {
      if (!['application/pdf', 'image/jpeg', 'image/png'].includes(document.type) || document.size > 3_145_728) {
        throw new Error(`Document invalide : ${document.name}`);
      }
      const extension = document.name.split(".").pop()?.toLowerCase() || "bin";
      const path = `${organizationId}/tenants/${data}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from("identity-documents").upload(path, document, { contentType: document.type, upsert: false });
      if (uploadError) throw uploadError;
      uploaded.push(path);
      const { error: metadataError } = await supabase.from("documents").insert({
        organization_id: organizationId, tenant_id: data, bucket_id: "identity-documents",
        storage_path: path, file_name: document.name, mime_type: document.type,
        file_size_bytes: document.size, kind: "identity_document", is_sensitive: true, uploaded_by: userId,
      });
      if (metadataError) throw metadataError;
    }
    return data;
  } catch (cause) {
    if (uploaded.length) await supabase.storage.from("identity-documents").remove(uploaded);
    await supabase.from("tenants").delete().eq("id", data).eq("organization_id", organizationId);
    throw cause;
  }
}

export async function createLease(supabase: Client, organizationId: string, input: {
  tenantId: string; unitId: string; startDate: string; endDate: string;
  rent: number; currency: Currency; guarantee: number;
  frequency: Database["public"]["Enums"]["billing_frequency"]; dueDay: number; terms?: string;
}) {
  const { data, error } = await supabase.rpc("create_lease_and_invoices", {
    p_organization_id: organizationId, p_tenant_id: input.tenantId, p_unit_id: input.unitId,
    p_start_date: input.startDate, p_end_date: input.endDate, p_rent_amount: input.rent,
    p_currency: input.currency, p_guarantee_amount: input.guarantee,
    p_frequency: input.frequency, p_due_day: input.dueDay, p_terms: input.terms,
  });
  if (error) throw error;
  return data;
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
  const { data, error } = await supabase.rpc("record_rent_payment", {
    p_organization_id: organizationId, p_tenant_id: input.tenantId, p_lease_id: input.leaseId,
    p_amount: input.amount, p_currency: input.currency, p_paid_at: input.paidAt,
    p_method: input.method, p_external_reference: input.reference,
    p_note: input.note, p_idempotency_key: input.idempotencyKey,
  });
  if (error) throw error;
  return data;
}
