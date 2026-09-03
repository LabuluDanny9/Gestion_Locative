"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireUser } from "@/features/auth/server";
import { mutationMessage } from "@/features/backend/mutation-errors";
import { canManageDocuments } from "@/services/document-read-model";
import { getActiveOrganization } from "@/services/rental-backend";

const allowedTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
] as const;

const uploadSchema = z.object({
  fileName: z.string().trim().min(1).max(200),
  mimeType: z.enum(allowedTypes),
  fileSize: z.number().int().min(1).max(10_485_760),
  link: z.string().trim().min(1),
});

async function actionContext() {
  const { supabase, user } = await requireUser();
  const membership = await getActiveOrganization(supabase, user.id);
  if (!await canManageDocuments(supabase, membership.role)) throw new Error("Vous n’avez pas l’autorisation de gérer les documents.");
  return { supabase, user, organizationId: membership.organization_id };
}

async function resolveLink(supabase: Awaited<ReturnType<typeof requireUser>>["supabase"], organizationId: string, value: string) {
  const [type, rawId] = value.split(":", 2);
  if (type === "organization") return { kind: "other" as const };
  const id = z.string().uuid().parse(rawId);
  if (type === "property") {
    const { data, error } = await supabase.from("properties").select("id").eq("organization_id", organizationId).eq("id", id).maybeSingle();
    if (error) throw error;
    if (!data) throw new Error("Cette propriété est introuvable.");
    return { kind: "other" as const, property_id: id };
  }
  if (type === "tenant") {
    const { data, error } = await supabase.from("tenants").select("id").eq("organization_id", organizationId).eq("id", id).maybeSingle();
    if (error) throw error;
    if (!data) throw new Error("Ce locataire est introuvable.");
    return { kind: "identity_document" as const, tenant_id: id };
  }
  if (type === "lease") {
    const { data, error } = await supabase.from("leases").select("id").eq("organization_id", organizationId).eq("id", id).maybeSingle();
    if (error) throw error;
    if (!data) throw new Error("Ce contrat est introuvable.");
    return { kind: "lease_document" as const, lease_id: id };
  }
  throw new Error("Choisissez un classement valide.");
}

export async function prepareLibraryUploadAction(input: { fileName: string; mimeType: string; fileSize: number; link: string }) {
  try {
    const parsed = uploadSchema.parse(input);
    const { supabase, organizationId } = await actionContext();
    const link = await resolveLink(supabase, organizationId, parsed.link);
    const extensionByType: Record<(typeof allowedTypes)[number], string> = {
      "application/pdf": "pdf",
      "application/msword": "doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
      "image/jpeg": "jpg",
      "image/png": "png",
    };
    const path = `${organizationId}/library/${crypto.randomUUID()}.${extensionByType[parsed.mimeType]}`;
    const { data, error } = await supabase.storage.from("organization-documents").createSignedUploadUrl(path);
    if (error) throw error;
    return { ok: true as const, upload: { path: data.path, token: data.token, ...parsed, ...link } };
  } catch (cause) {
    console.error("Échec de la préparation du document", cause);
    return { ok: false as const, message: mutationMessage(cause) };
  }
}

type PreparedUpload = Extract<Awaited<ReturnType<typeof prepareLibraryUploadAction>>, { ok: true }>["upload"];

export async function finalizeLibraryUploadAction(upload: PreparedUpload) {
  try {
    const parsed = uploadSchema.parse(upload);
    const { supabase, user, organizationId } = await actionContext();
    const link = await resolveLink(supabase, organizationId, parsed.link);
    const expectedPrefix = `${organizationId}/library/`;
    if (!upload.path.startsWith(expectedPrefix)) throw new Error("Chemin de stockage invalide.");
    const { error } = await supabase.from("documents").insert({
      organization_id: organizationId,
      bucket_id: "organization-documents",
      storage_path: upload.path,
      file_name: parsed.fileName,
      mime_type: parsed.mimeType,
      file_size_bytes: parsed.fileSize,
      uploaded_by: user.id,
      is_sensitive: true,
      ...link,
    });
    if (error) {
      await supabase.storage.from("organization-documents").remove([upload.path]);
      throw error;
    }
    revalidatePath("/documents");
    return { ok: true as const };
  } catch (cause) {
    console.error("Échec de l’enregistrement du document", cause);
    return { ok: false as const, message: mutationMessage(cause) };
  }
}

export async function deleteDocumentAction(documentId: string) {
  try {
    const id = z.string().uuid().parse(documentId);
    const { supabase, organizationId } = await actionContext();
    const { data: document, error: readError } = await supabase.from("documents")
      .select("id, bucket_id, storage_path").eq("organization_id", organizationId).eq("id", id).maybeSingle();
    if (readError) throw readError;
    if (!document) throw new Error("Ce document est introuvable.");
    const { error: deleteError } = await supabase.from("documents").delete().eq("organization_id", organizationId).eq("id", id);
    if (deleteError) throw deleteError;
    const { error: storageError } = await supabase.storage.from(document.bucket_id).remove([document.storage_path]);
    if (storageError) console.error("Métadonnées supprimées, mais nettoyage Storage incomplet", storageError);
    revalidatePath("/documents");
    return { ok: true as const };
  } catch (cause) {
    console.error("Échec de la suppression du document", cause);
    return { ok: false as const, message: mutationMessage(cause) };
  }
}
