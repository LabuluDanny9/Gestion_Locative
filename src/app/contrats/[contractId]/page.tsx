import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { requireUser } from "@/features/auth/server";
import { ContractDetailView } from "@/features/contracts/contract-detail-view";
import { getActiveOrganization } from "@/services/rental-backend";
import { loadRentalData } from "@/services/rental-read-models";

export const metadata: Metadata = { title: "Détail contrat" };

export default async function ContractDetailPage({ params }: { params: Promise<{ contractId: string }> }) {
  const id = (await params).contractId;
  const { supabase, user } = await requireUser();
  const membership = await getActiveOrganization(supabase, user.id);
  const { contracts } = await loadRentalData(supabase, membership.organization_id);
  const contract = contracts.find((item) => item.id === id);
  if (!contract) notFound();
  return <ProtectedAppShell><ContractDetailView basePath="/contrats" contract={contract} dashboardHref="/espace" tenantBasePath="/locataires" unitBasePath="/logements" /></ProtectedAppShell>;
}
