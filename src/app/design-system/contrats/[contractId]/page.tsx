import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { getContract } from "@/features/contracts/contract-data";
import { ContractDetailView } from "@/features/contracts/contract-detail-view";

export const metadata: Metadata = { title: "Aperçu fiche contrat" };

export default async function ContractDetailPreviewPage({ params }: { params: Promise<{ contractId: string }> }) {
  const contract = getContract((await params).contractId);
  if (!contract) notFound();
  return <AppShell displayName="Gestionnaire" preview previewHomeHref="/design-system/dashboard"><ContractDetailView basePath="/design-system/contrats" contract={contract} dashboardHref="/design-system/dashboard" tenantBasePath="/design-system/locataires" unitBasePath="/design-system/logements" /></AppShell>;
}
