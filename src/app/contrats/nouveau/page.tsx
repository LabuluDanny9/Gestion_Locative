import type { Metadata } from "next";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { requireUser } from "@/features/auth/server";
import { createLeaseAction, finalizeLeaseDocumentsAction, rollbackLeaseAction } from "@/features/backend/actions";
import { ContractFormPreview } from "@/features/contracts/contract-form-preview";
import { getActiveOrganization } from "@/services/rental-backend";
import { MutationFeedback } from "@/components/shared/mutation-feedback";

export const metadata: Metadata = { title: "Nouveau contrat" };

export default async function NewContractPage({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  const params = await searchParams;
  const { supabase, user } = await requireUser();
  const membership = await getActiveOrganization(supabase, user.id);
  const [{ data: tenantRows }, { data: unitRows }] = await Promise.all([
    supabase.from("tenants").select("id, first_name, last_name, phone").eq("organization_id", membership.organization_id).is("archived_at", null).order("last_name"),
    supabase.from("units").select("id, code, unit_type, indicative_rent, currency, properties(name)").eq("organization_id", membership.organization_id).eq("status", "available").is("archived_at", null).order("code"),
  ]);
  const tenantOptions = (tenantRows ?? []).map((tenant) => ({ id: tenant.id, name: `${tenant.first_name} ${tenant.last_name}`, phone: tenant.phone }));
  const unitOptions = (unitRows ?? []).map((unit) => ({ id: unit.id, type: unit.unit_type, code: unit.code, propertyName: unit.properties?.name ?? "Propriété", rent: unit.indicative_rent ?? 0, currency: unit.currency }));
  return <ProtectedAppShell><MutationFeedback error={params.erreur} /><ContractFormPreview action={createLeaseAction} basePath="/contrats" dashboardHref="/espace" finalizeDocuments={finalizeLeaseDocumentsAction} rollbackLease={rollbackLeaseAction} tenantOptions={tenantOptions} unitOptions={unitOptions} /></ProtectedAppShell>;
}
