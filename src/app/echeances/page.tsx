import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { requireUser } from "@/features/auth/server";
import { InvoiceListView, type InvoiceListParams } from "@/features/invoices/invoice-list-view";
import { generateRentInvoices, getActiveOrganization } from "@/services/rental-backend";
import { loadRentalData } from "@/services/rental-read-models";

export const metadata: Metadata = { title: "Échéances" };
export const dynamic = "force-dynamic";

export default async function InvoicesPage({ searchParams }: { searchParams: Promise<InvoiceListParams> }) {
  const params = await searchParams;
  const { supabase, user } = await requireUser();
  const membership = await getActiveOrganization(supabase, user.id);
  let generationFailed = false;

  if (["super_admin", "owner", "manager"].includes(membership.role)) {
    const throughDate = new Date();
    throughDate.setUTCDate(throughDate.getUTCDate() + 45);

    try {
      await generateRentInvoices(supabase, membership.organization_id, throughDate.toISOString().slice(0, 10));
    } catch (cause) {
      generationFailed = true;
      console.error(JSON.stringify({
        level: "error",
        message: "rent invoice generation failed",
        route: "/echeances",
        organizationId: membership.organization_id,
        error: cause instanceof Error ? cause.message : String(cause),
      }));
    }
  }

  const { invoices } = await loadRentalData(supabase, membership.organization_id);

  return (
    <ProtectedAppShell>
      {generationFailed ? (
        <Alert className="mb-6 border-amber-300 bg-amber-50 text-amber-950">
          <AlertTriangle />
          <AlertTitle>Synchronisation temporairement indisponible</AlertTitle>
          <AlertDescription className="text-amber-800">
            Les échéances déjà enregistrées restent affichées. Rechargez la page dans quelques instants.
          </AlertDescription>
        </Alert>
      ) : null}
      <InvoiceListView invoices={invoices} params={params} />
    </ProtectedAppShell>
  );
}
