import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { parseDashboardPeriod } from "@/features/dashboard/dashboard-data";
import { DashboardView } from "@/features/dashboard/dashboard-view";

export const metadata: Metadata = { title: "Aperçu du dashboard" };

export default async function DashboardPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ periode?: string; debut?: string; fin?: string }>;
}) {
  const params = await searchParams;

  return (
    <AppShell displayName="Gestionnaire" preview previewHomeHref="/design-system/dashboard">
      <DashboardView
        basePath="/design-system/dashboard"
        displayName="Gestionnaire"
        endDate={params.fin}
        period={parseDashboardPeriod(params.periode)}
        paymentBasePath="/design-system/paiements"
        startDate={params.debut}
      />
    </AppShell>
  );
}
