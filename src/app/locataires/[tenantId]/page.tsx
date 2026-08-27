import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { getTenant } from "@/features/tenants/tenant-data";
import { TenantDetailView } from "@/features/tenants/tenant-detail-view";

export const metadata: Metadata = { title: "Détail locataire" };

export default async function TenantDetailPage({ params }: { params: Promise<{ tenantId: string }> }) {
  const tenant = getTenant((await params).tenantId);
  if (!tenant) notFound();
  return <ProtectedAppShell><TenantDetailView basePath="/locataires" dashboardHref="/espace" tenant={tenant} unitBasePath="/logements" /></ProtectedAppShell>;
}
