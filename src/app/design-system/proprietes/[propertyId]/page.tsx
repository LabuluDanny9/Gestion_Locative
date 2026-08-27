import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { getProperty } from "@/features/properties/property-data";
import { PropertyDetailView } from "@/features/properties/property-detail-view";

export const metadata: Metadata = { title: "Aperçu fiche propriété" };

export default async function PropertyDetailPreviewPage({ params }: { params: Promise<{ propertyId: string }> }) {
  const property = getProperty((await params).propertyId);
  if (!property) notFound();
  return <AppShell displayName="Gestionnaire" preview previewHomeHref="/design-system/dashboard"><PropertyDetailView basePath="/design-system/proprietes" dashboardHref="/design-system/dashboard" property={property} unitBasePath="/design-system/logements" /></AppShell>;
}
