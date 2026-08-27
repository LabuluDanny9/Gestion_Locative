import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { ContractFormPreview } from "@/features/contracts/contract-form-preview";

export const metadata: Metadata = { title: "Aperçu nouveau contrat" };

export default function NewContractPreviewPage() {
  return <AppShell displayName="Gestionnaire" preview previewHomeHref="/design-system/dashboard"><ContractFormPreview basePath="/design-system/contrats" dashboardHref="/design-system/dashboard" /></AppShell>;
}
