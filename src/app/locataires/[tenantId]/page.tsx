import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { requireUser } from "@/features/auth/server";
import { deleteTenantAction } from "@/features/backend/actions";
import { sendTenantMessageAction } from "@/features/notifications/actions";
import { TenantDetailView } from "@/features/tenants/tenant-detail-view";
import { MutationFeedback } from "@/components/shared/mutation-feedback";
import { getActiveOrganization } from "@/services/rental-backend";
import { loadRentalData } from "@/services/rental-read-models";

export const metadata: Metadata = { title: "Détail locataire" };

export default async function TenantDetailPage({ params, searchParams }: { params: Promise<{ tenantId: string }>; searchParams: Promise<{ erreur?: string; message?: string }> }) {
  const id = (await params).tenantId;
  const feedback = await searchParams;
  const { supabase, user } = await requireUser();
  const membership = await getActiveOrganization(supabase, user.id);
  const { tenants } = await loadRentalData(supabase, membership.organization_id);
  const tenant = tenants.find((item) => item.id === id);
  if (!tenant) notFound();
  return <ProtectedAppShell><MutationFeedback error={feedback.erreur} success={feedback.message ? "Le message a été accepté par le fournisseur et journalisé." : undefined} /><TenantDetailView basePath="/locataires" contractBasePath="/contrats" dashboardHref="/espace" deleteAction={deleteTenantAction} messageAction={sendTenantMessageAction} paymentBasePath="/paiements" receiptBasePath="/recus" tenant={tenant} unitBasePath="/logements" /></ProtectedAppShell>;
}
