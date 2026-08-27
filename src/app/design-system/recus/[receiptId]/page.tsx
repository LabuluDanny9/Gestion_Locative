import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { getReceipt } from "@/features/payments/payment-data";
import { ReceiptDetailView } from "@/features/payments/receipt-detail-view";

export const metadata: Metadata = { title: "Aperçu reçu de paiement" };

export default async function ReceiptDetailPreviewPage({ params }: { params: Promise<{ receiptId: string }> }) {
  const payment = getReceipt((await params).receiptId);
  if (!payment) notFound();
  return <AppShell displayName="Gestionnaire" preview previewHomeHref="/design-system/dashboard"><ReceiptDetailView basePath="/design-system/recus" dashboardHref="/design-system/dashboard" payment={payment} /></AppShell>;
}
