import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { TenantListView, type TenantListParams } from "@/features/tenants/tenant-list-view";

export const metadata: Metadata = { title: "Aperçu des locataires" };

export default async function TenantsPreviewPage({ searchParams }: { searchParams: Promise<TenantListParams> }) {
  return <AppShell displayName="Gestionnaire" preview previewHomeHref="/design-system/dashboard"><TenantListView basePath="/design-system/locataires" dashboardHref="/design-system/dashboard" params={await searchParams} /></AppShell>;
}
