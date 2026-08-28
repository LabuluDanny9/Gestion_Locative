import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { requireUser } from "@/features/auth/server";
import { ReceiptDetailView } from "@/features/payments/receipt-detail-view";
import { getActiveOrganization } from "@/services/rental-backend";
import { loadRentalData } from "@/services/rental-read-models";

export const metadata: Metadata = { title: "Reçu de paiement" };

export default async function ReceiptDetailPage({ params }: { params: Promise<{ receiptId: string }> }) {
  const id = (await params).receiptId;
  const { supabase, user } = await requireUser();
  const membership = await getActiveOrganization(supabase, user.id);
  const { payments } = await loadRentalData(supabase, membership.organization_id);
  const payment = payments.find((item) => item.receiptId === id);
  if (!payment) notFound();
  return <ProtectedAppShell><ReceiptDetailView basePath="/recus" dashboardHref="/espace" payment={payment} /></ProtectedAppShell>;
}
