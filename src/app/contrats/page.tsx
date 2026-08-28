import type { Metadata } from "next";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { ContractListView, type ContractListParams } from "@/features/contracts/contract-list-view";
import { MutationFeedback } from "@/components/shared/mutation-feedback";
import { requireUser } from "@/features/auth/server";
import { getActiveOrganization } from "@/services/rental-backend";
import { loadRentalData } from "@/services/rental-read-models";

export const metadata: Metadata = { title: "Contrats" };
export const dynamic = "force-dynamic";

export default async function ContractsPage({ searchParams }: { searchParams: Promise<ContractListParams> }) {
  const params = await searchParams;
  const { supabase, user } = await requireUser();
  const membership = await getActiveOrganization(supabase, user.id);
  const { contracts } = await loadRentalData(supabase, membership.organization_id);
  return <ProtectedAppShell><MutationFeedback error={params.erreur} success={params.creation ? "Le contrat a été créé et le logement est maintenant occupé." : undefined} /><ContractListView basePath="/contrats" contracts={contracts} dashboardHref="/espace" params={params} /></ProtectedAppShell>;
}
