import type { Metadata } from "next";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { createTenantAction, finalizeTenantDocumentsAction, rollbackTenantAction } from "@/features/backend/actions";
import { MutationFeedback } from "@/components/shared/mutation-feedback";
import { TenantFormPreview } from "@/features/tenants/tenant-form-preview";

export const metadata: Metadata = { title: "Nouveau locataire" };

export default async function NewTenantPage({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  const params = await searchParams;
  return <ProtectedAppShell><MutationFeedback error={params.erreur} /><TenantFormPreview action={createTenantAction} basePath="/locataires" dashboardHref="/espace" finalizeDocuments={finalizeTenantDocumentsAction} rollbackTenant={rollbackTenantAction} /></ProtectedAppShell>;
}
