import type { Metadata } from "next";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { TenantListView, type TenantListParams } from "@/features/tenants/tenant-list-view";

export const metadata: Metadata = { title: "Locataires" };
export const dynamic = "force-dynamic";

export default async function TenantsPage({ searchParams }: { searchParams: Promise<TenantListParams> }) {
  return <ProtectedAppShell><TenantListView basePath="/locataires" dashboardHref="/espace" params={await searchParams} /></ProtectedAppShell>;
}
