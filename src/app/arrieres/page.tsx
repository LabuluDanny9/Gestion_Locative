import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { requireUser } from "@/features/auth/server";
import { ArrearsListView, type ArrearsListParams } from "@/features/arrears/arrears-list-view";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { loadArrearsData } from "@/services/arrears-read-model";
import { generateRentInvoices, getActiveOrganization } from "@/services/rental-backend";

export const metadata: Metadata = { title: "Arriérés" };
export const dynamic = "force-dynamic";

export default async function ArrearsPage({ searchParams }: { searchParams: Promise<ArrearsListParams> }) {
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
      console.error("Échec de la synchronisation des échéances avant le calcul des arriérés", cause);
    }
  }

  const accounts = await loadArrearsData(supabase, membership.organization_id);
  return <ProtectedAppShell>{generationFailed ? <Alert className="mb-6 border-amber-300 bg-amber-50 text-amber-950"><AlertTriangle /><AlertTitle>Synchronisation temporairement indisponible</AlertTitle><AlertDescription className="text-amber-800">Les arriérés déjà calculés restent disponibles. Rechargez la page pour actualiser les nouvelles échéances.</AlertDescription></Alert> : null}<ArrearsListView accounts={accounts} params={params} /></ProtectedAppShell>;
}
