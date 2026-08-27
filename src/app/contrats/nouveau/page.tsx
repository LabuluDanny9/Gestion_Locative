import type { Metadata } from "next";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { ContractFormPreview } from "@/features/contracts/contract-form-preview";

export const metadata: Metadata = { title: "Nouveau contrat" };

export default function NewContractPage() {
  return <ProtectedAppShell><ContractFormPreview basePath="/contrats" dashboardHref="/espace" /></ProtectedAppShell>;
}
