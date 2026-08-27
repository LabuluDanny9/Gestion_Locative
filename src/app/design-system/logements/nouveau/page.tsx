import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { UnitFormPreview } from "@/features/properties/unit-form-preview";

export const metadata: Metadata = { title: "Aperçu création logement" };

export default async function NewUnitPreviewPage({ searchParams }: { searchParams: Promise<{ property?: string }> }) {
  return <AppShell displayName="Gestionnaire" preview previewHomeHref="/design-system/dashboard"><UnitFormPreview basePath="/design-system/logements" dashboardHref="/design-system/dashboard" defaultProperty={(await searchParams).property} /></AppShell>;
}
