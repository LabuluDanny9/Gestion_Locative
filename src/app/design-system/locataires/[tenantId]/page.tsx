import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { getTenant } from "@/features/tenants/tenant-data";
import { TenantDetailView } from "@/features/tenants/tenant-detail-view";

export const metadata: Metadata = { title: "Aperçu fiche locataire" };

export default async function TenantDetailPreviewPage({ params }: { params: Promise<{ tenantId: string }> }) {
  const tenant = getTenant((await params).tenantId);
  if (!tenant) notFound();
  return <AppShell displayName="Gestionnaire" preview previewHomeHref="/design-system/dashboard"><TenantDetailView basePath="/design-system/locataires" contractBasePath="/design-system/contrats" dashboardHref="/design-system/dashboard" paymentBasePath="/design-system/paiements" receiptBasePath="/design-system/recus" tenant={tenant} unitBasePath="/design-system/logements" /></AppShell>;
}
