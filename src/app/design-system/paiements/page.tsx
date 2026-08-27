import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { PaymentListView, type PaymentListParams } from "@/features/payments/payment-list-view";

export const metadata: Metadata = { title: "Aperçu des paiements" };

export default async function PaymentsPreviewPage({ searchParams }: { searchParams: Promise<PaymentListParams> }) {
  return <AppShell displayName="Gestionnaire" preview previewHomeHref="/design-system/dashboard"><PaymentListView basePath="/design-system/paiements" dashboardHref="/design-system/dashboard" params={await searchParams} receiptBasePath="/design-system/recus" /></AppShell>;
}
