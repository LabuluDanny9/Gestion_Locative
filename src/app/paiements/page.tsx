import type { Metadata } from "next";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { PaymentListView, type PaymentListParams } from "@/features/payments/payment-list-view";

export const metadata: Metadata = { title: "Paiements" };
export const dynamic = "force-dynamic";

export default async function PaymentsPage({ searchParams }: { searchParams: Promise<PaymentListParams> }) {
  return <ProtectedAppShell><PaymentListView basePath="/paiements" dashboardHref="/espace" params={await searchParams} receiptBasePath="/recus" /></ProtectedAppShell>;
}
