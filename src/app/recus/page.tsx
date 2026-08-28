import type { Metadata } from "next";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { ReceiptListView, type ReceiptListParams } from "@/features/payments/receipt-list-view";
import { requireUser } from "@/features/auth/server";
import { getActiveOrganization } from "@/services/rental-backend";
import { loadRentalData } from "@/services/rental-read-models";

export const metadata: Metadata = { title: "Reçus" };
export const dynamic = "force-dynamic";

export default async function ReceiptsPage({ searchParams }: { searchParams: Promise<ReceiptListParams> }) {
  const { supabase, user } = await requireUser();
  const membership = await getActiveOrganization(supabase, user.id);
  const { payments } = await loadRentalData(supabase, membership.organization_id);
  return <ProtectedAppShell><ReceiptListView basePath="/recus" dashboardHref="/espace" params={await searchParams} paymentBasePath="/paiements" payments={payments} /></ProtectedAppShell>;
}
