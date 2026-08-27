import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { getContract } from "@/features/contracts/contract-data";
import { ContractDetailView } from "@/features/contracts/contract-detail-view";

export const metadata: Metadata = { title: "Détail contrat" };

export default async function ContractDetailPage({ params }: { params: Promise<{ contractId: string }> }) {
  const contract = getContract((await params).contractId);
  if (!contract) notFound();
  return <ProtectedAppShell><ContractDetailView basePath="/contrats" contract={contract} dashboardHref="/espace" tenantBasePath="/locataires" unitBasePath="/logements" /></ProtectedAppShell>;
}
