import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { ContractListView, type ContractListParams } from "@/features/contracts/contract-list-view";

export const metadata: Metadata = { title: "Aperçu des contrats" };

export default async function ContractsPreviewPage({ searchParams }: { searchParams: Promise<ContractListParams> }) {
  return <AppShell displayName="Gestionnaire" preview previewHomeHref="/design-system/dashboard"><ContractListView basePath="/design-system/contrats" dashboardHref="/design-system/dashboard" params={await searchParams} /></AppShell>;
}
