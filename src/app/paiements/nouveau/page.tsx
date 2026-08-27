import type { Metadata } from "next";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { PaymentFormPreview } from "@/features/payments/payment-form-preview";

export const metadata: Metadata = { title: "Nouveau paiement" };

export default async function NewPaymentPage({ searchParams }: { searchParams: Promise<{ tenant?: string }> }) {
  return <ProtectedAppShell><PaymentFormPreview basePath="/paiements" dashboardHref="/espace" defaultTenant={(await searchParams).tenant} receiptExampleHref="/recus/rec-2026-00332" /></ProtectedAppShell>;
}
