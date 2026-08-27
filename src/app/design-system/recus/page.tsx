import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { ReceiptListView, type ReceiptListParams } from "@/features/payments/receipt-list-view";

export const metadata: Metadata = { title: "Aperçu des reçus" };

export default async function ReceiptsPreviewPage({ searchParams }: { searchParams: Promise<ReceiptListParams> }) {
  return <AppShell displayName="Gestionnaire" preview previewHomeHref="/design-system/dashboard"><ReceiptListView basePath="/design-system/recus" dashboardHref="/design-system/dashboard" params={await searchParams} paymentBasePath="/design-system/paiements" /></AppShell>;
}
