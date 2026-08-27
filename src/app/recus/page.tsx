import type { Metadata } from "next";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { ReceiptListView, type ReceiptListParams } from "@/features/payments/receipt-list-view";

export const metadata: Metadata = { title: "Reçus" };
export const dynamic = "force-dynamic";

export default async function ReceiptsPage({ searchParams }: { searchParams: Promise<ReceiptListParams> }) {
  return <ProtectedAppShell><ReceiptListView basePath="/recus" dashboardHref="/espace" params={await searchParams} paymentBasePath="/paiements" /></ProtectedAppShell>;
}
