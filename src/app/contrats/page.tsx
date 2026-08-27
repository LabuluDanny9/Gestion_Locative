import type { Metadata } from "next";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { ContractListView, type ContractListParams } from "@/features/contracts/contract-list-view";

export const metadata: Metadata = { title: "Contrats" };
export const dynamic = "force-dynamic";

export default async function ContractsPage({ searchParams }: { searchParams: Promise<ContractListParams> }) {
  return <ProtectedAppShell><ContractListView basePath="/contrats" dashboardHref="/espace" params={await searchParams} /></ProtectedAppShell>;
}
