import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { getReceipt } from "@/features/payments/payment-data";
import { ReceiptDetailView } from "@/features/payments/receipt-detail-view";

export const metadata: Metadata = { title: "Reçu de paiement" };

export default async function ReceiptDetailPage({ params }: { params: Promise<{ receiptId: string }> }) {
  const payment = getReceipt((await params).receiptId);
  if (!payment) notFound();
  return <ProtectedAppShell><ReceiptDetailView basePath="/recus" dashboardHref="/espace" payment={payment} /></ProtectedAppShell>;
}
