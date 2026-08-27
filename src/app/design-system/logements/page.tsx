import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { UnitListView, type UnitListParams } from "@/features/properties/unit-list-view";

export const metadata: Metadata = { title: "Aperçu des logements" };

export default async function UnitPreviewPage({ searchParams }: { searchParams: Promise<UnitListParams> }) {
  return <AppShell displayName="Gestionnaire" preview previewHomeHref="/design-system/dashboard"><UnitListView basePath="/design-system/logements" dashboardHref="/design-system/dashboard" params={await searchParams} /></AppShell>;
}
