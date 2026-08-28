import type { Metadata } from "next";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { UnitListView, type UnitListParams } from "@/features/properties/unit-list-view";
import { MutationFeedback } from "@/components/shared/mutation-feedback";
import { requireUser } from "@/features/auth/server";
import { getActiveOrganization } from "@/services/rental-backend";
import { loadRentalData } from "@/services/rental-read-models";

export const metadata: Metadata = { title: "Logements" };
export const dynamic = "force-dynamic";

export default async function UnitsPage({ searchParams }: { searchParams: Promise<UnitListParams> }) {
  const params = await searchParams;
  const { supabase, user } = await requireUser();
  const membership = await getActiveOrganization(supabase, user.id);
  const { properties, units } = await loadRentalData(supabase, membership.organization_id);
  return <ProtectedAppShell><MutationFeedback error={params.erreur} success={params.creation ? "Le logement et ses photos ont été enregistrés." : undefined} /><UnitListView basePath="/logements" dashboardHref="/espace" params={params} properties={properties} units={units} /></ProtectedAppShell>;
}
