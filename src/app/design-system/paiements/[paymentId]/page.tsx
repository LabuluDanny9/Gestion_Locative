import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { getPayment } from "@/features/payments/payment-data";
import { PaymentDetailView } from "@/features/payments/payment-detail-view";

export const metadata: Metadata = { title: "Aperçu détail paiement" };

export default async function PaymentDetailPreviewPage({ params }: { params: Promise<{ paymentId: string }> }) {
  const payment = getPayment((await params).paymentId);
  if (!payment) notFound();
  return <AppShell displayName="Gestionnaire" preview previewHomeHref="/design-system/dashboard"><PaymentDetailView basePath="/design-system/paiements" dashboardHref="/design-system/dashboard" payment={payment} receiptBasePath="/design-system/recus" tenantBasePath="/design-system/locataires" unitBasePath="/design-system/logements" /></AppShell>;
}
