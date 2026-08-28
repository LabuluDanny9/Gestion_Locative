import type { Metadata } from "next";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { PaymentListView, type PaymentListParams } from "@/features/payments/payment-list-view";
import { MutationFeedback } from "@/components/shared/mutation-feedback";
import { requireUser } from "@/features/auth/server";
import { getActiveOrganization } from "@/services/rental-backend";
import { loadRentalData } from "@/services/rental-read-models";

export const metadata: Metadata = { title: "Paiements" };
export const dynamic = "force-dynamic";

export default async function PaymentsPage({ searchParams }: { searchParams: Promise<PaymentListParams> }) {
  const params = await searchParams;
  const { supabase, user } = await requireUser();
  const membership = await getActiveOrganization(supabase, user.id);
  const { payments } = await loadRentalData(supabase, membership.organization_id);
  return <ProtectedAppShell><MutationFeedback error={params.erreur} success={params.creation ? "Le paiement et son reçu ont été enregistrés." : undefined} /><PaymentListView basePath="/paiements" dashboardHref="/espace" params={params} payments={payments} receiptBasePath="/recus" /></ProtectedAppShell>;
}
