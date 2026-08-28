import type { Metadata } from "next";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { TenantListView, type TenantListParams } from "@/features/tenants/tenant-list-view";
import { MutationFeedback } from "@/components/shared/mutation-feedback";
import { requireUser } from "@/features/auth/server";
import { getActiveOrganization } from "@/services/rental-backend";
import { loadRentalData } from "@/services/rental-read-models";

export const metadata: Metadata = { title: "Locataires" };
export const dynamic = "force-dynamic";

export default async function TenantsPage({ searchParams }: { searchParams: Promise<TenantListParams> }) {
  const params = await searchParams;
  const { supabase, user } = await requireUser();
  const membership = await getActiveOrganization(supabase, user.id);
  const { tenants } = await loadRentalData(supabase, membership.organization_id);
  return <ProtectedAppShell><MutationFeedback error={params.erreur} success={params.creation ? "Le locataire a été créé dans Supabase." : undefined} /><TenantListView basePath="/locataires" dashboardHref="/espace" params={params} tenants={tenants} /></ProtectedAppShell>;
}
