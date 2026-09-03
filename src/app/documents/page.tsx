import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { requireUser } from "@/features/auth/server";
import { parseDocumentFilters } from "@/features/documents/document-data";
import { DocumentLibrary } from "@/features/documents/document-library";
import { canReadDocuments, loadDocumentLibrary } from "@/services/document-read-model";
import { getActiveOrganization } from "@/services/rental-backend";

export const metadata: Metadata = { title: "Documents" };
export const dynamic = "force-dynamic";

export default async function DocumentsPage({ searchParams }: { searchParams: Promise<{ q?: string; type?: string; lien?: string }> }) {
  const { supabase, user } = await requireUser();
  const membership = await getActiveOrganization(supabase, user.id);
  if (!await canReadDocuments(supabase, membership.role)) notFound();
  const library = await loadDocumentLibrary(supabase, membership.organization_id, membership.role, parseDocumentFilters(await searchParams));
  return <ProtectedAppShell><DocumentLibrary library={library} /></ProtectedAppShell>;
}
