import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { requireUser } from "@/features/auth/server";
import { TenantDetailView } from "@/features/tenants/tenant-detail-view";
import { getActiveOrganization } from "@/services/rental-backend";
import { loadRentalData } from "@/services/rental-read-models";

export const metadata: Metadata = { title: "Détail locataire" };

export default async function TenantDetailPage({ params }: { params: Promise<{ tenantId: string }> }) {
  const id = (await params).tenantId;
  const { supabase, user } = await requireUser();
  const membership = await getActiveOrganization(supabase, user.id);
  const { tenants } = await loadRentalData(supabase, membership.organization_id);
  const tenant = tenants.find((item) => item.id === id);
  if (!tenant) notFound();
  return <ProtectedAppShell><TenantDetailView basePath="/locataires" contractBasePath="/contrats" dashboardHref="/espace" paymentBasePath="/paiements" receiptBasePath="/recus" tenant={tenant} unitBasePath="/logements" /></ProtectedAppShell>;
}
