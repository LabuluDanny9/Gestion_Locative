import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { PaymentFormPreview } from "@/features/payments/payment-form-preview";

export const metadata: Metadata = { title: "Aperçu nouveau paiement" };

export default async function NewPaymentPreviewPage({ searchParams }: { searchParams: Promise<{ tenant?: string }> }) {
  return <AppShell displayName="Gestionnaire" preview previewHomeHref="/design-system/dashboard"><PaymentFormPreview basePath="/design-system/paiements" dashboardHref="/design-system/dashboard" defaultTenant={(await searchParams).tenant} receiptExampleHref="/design-system/recus/rec-2026-00332" /></AppShell>;
}
