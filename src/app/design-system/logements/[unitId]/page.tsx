import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { getUnit } from "@/features/properties/property-data";
import { UnitDetailView } from "@/features/properties/unit-detail-view";

export const metadata: Metadata = { title: "Aperçu fiche logement" };

export default async function UnitDetailPreviewPage({ params }: { params: Promise<{ unitId: string }> }) {
  const unit = getUnit((await params).unitId);
  if (!unit) notFound();
  return <AppShell displayName="Gestionnaire" preview previewHomeHref="/design-system/dashboard"><UnitDetailView basePath="/design-system/logements" dashboardHref="/design-system/dashboard" propertyBasePath="/design-system/proprietes" unit={unit} /></AppShell>;
}
