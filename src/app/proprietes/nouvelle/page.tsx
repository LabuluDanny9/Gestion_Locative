import type { Metadata } from "next";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { MutationFeedback } from "@/components/shared/mutation-feedback";
import { createPropertyAction } from "@/features/backend/actions";
import { PropertyFormPreview } from "@/features/properties/property-form-preview";

export const metadata: Metadata = { title: "Ajouter une propriété" };

export default async function NewPropertyPage({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  const params = await searchParams;
  return <ProtectedAppShell><MutationFeedback error={params.erreur} /><PropertyFormPreview action={createPropertyAction} basePath="/proprietes" dashboardHref="/espace" /></ProtectedAppShell>;
}
