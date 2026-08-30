import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { requireUser } from "@/features/auth/server";
import { PaymentDetailView } from "@/features/payments/payment-detail-view";
import { reversePaymentAction } from "@/features/backend/actions";
import { MutationFeedback } from "@/components/shared/mutation-feedback";
import { getActiveOrganization } from "@/services/rental-backend";
import { loadRentalData } from "@/services/rental-read-models";

export const metadata: Metadata = { title: "Détail paiement" };

export default async function PaymentDetailPage({ params, searchParams }: { params: Promise<{ paymentId: string }>; searchParams: Promise<{ annulation?: string; erreur?: string }> }) {
  const id = (await params).paymentId;
  const feedback = await searchParams;
  const { supabase, user } = await requireUser();
  const membership = await getActiveOrganization(supabase, user.id);
  const { payments } = await loadRentalData(supabase, membership.organization_id);
  const payment = payments.find((item) => item.id === id);
  if (!payment) notFound();
  return <ProtectedAppShell><MutationFeedback error={feedback.erreur} success={feedback.annulation ? "Le paiement a été annulé, les échéances restaurées et le reçu invalidé." : undefined} /><PaymentDetailView basePath="/paiements" dashboardHref="/espace" payment={payment} receiptBasePath="/recus" reverseAction={reversePaymentAction} tenantBasePath="/locataires" unitBasePath="/logements" /></ProtectedAppShell>;
}
