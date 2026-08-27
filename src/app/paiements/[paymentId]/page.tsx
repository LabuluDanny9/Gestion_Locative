import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { getPayment } from "@/features/payments/payment-data";
import { PaymentDetailView } from "@/features/payments/payment-detail-view";

export const metadata: Metadata = { title: "Détail paiement" };

export default async function PaymentDetailPage({ params }: { params: Promise<{ paymentId: string }> }) {
  const payment = getPayment((await params).paymentId);
  if (!payment) notFound();
  return <ProtectedAppShell><PaymentDetailView basePath="/paiements" dashboardHref="/espace" payment={payment} receiptBasePath="/recus" tenantBasePath="/locataires" unitBasePath="/logements" /></ProtectedAppShell>;
}
