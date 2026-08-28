import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { requireUser } from "@/features/auth/server";
import { PaymentDetailView } from "@/features/payments/payment-detail-view";
import { getActiveOrganization } from "@/services/rental-backend";
import { loadRentalData } from "@/services/rental-read-models";

export const metadata: Metadata = { title: "Détail paiement" };

export default async function PaymentDetailPage({ params }: { params: Promise<{ paymentId: string }> }) {
  const id = (await params).paymentId;
  const { supabase, user } = await requireUser();
  const membership = await getActiveOrganization(supabase, user.id);
  const { payments } = await loadRentalData(supabase, membership.organization_id);
  const payment = payments.find((item) => item.id === id);
  if (!payment) notFound();
  return <ProtectedAppShell><PaymentDetailView basePath="/paiements" dashboardHref="/espace" payment={payment} receiptBasePath="/recus" tenantBasePath="/locataires" unitBasePath="/logements" /></ProtectedAppShell>;
}
