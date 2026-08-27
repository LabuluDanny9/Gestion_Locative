import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { PropertyListView, type PropertyListParams } from "@/features/properties/property-list-view";

export const metadata: Metadata = { title: "Aperçu des propriétés" };

export default async function PropertyPreviewPage({ searchParams }: { searchParams: Promise<PropertyListParams> }) {
  return <AppShell displayName="Gestionnaire" preview previewHomeHref="/design-system/dashboard"><PropertyListView basePath="/design-system/proprietes" dashboardHref="/design-system/dashboard" params={await searchParams} /></AppShell>;
}
