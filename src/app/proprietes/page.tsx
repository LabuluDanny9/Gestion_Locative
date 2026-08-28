import type { Metadata } from "next";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { PropertyListView, type PropertyListParams } from "@/features/properties/property-list-view";
import { MutationFeedback } from "@/components/shared/mutation-feedback";
import { requireUser } from "@/features/auth/server";
import { getActiveOrganization } from "@/services/rental-backend";
import { loadRentalData } from "@/services/rental-read-models";

export const metadata: Metadata = { title: "Propriétés" };
export const dynamic = "force-dynamic";

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<PropertyListParams> }) {
  const params = await searchParams;
  const { supabase, user } = await requireUser();
  const membership = await getActiveOrganization(supabase, user.id);
  const { properties } = await loadRentalData(supabase, membership.organization_id);
  return <ProtectedAppShell><MutationFeedback error={params.erreur} success={params.creation ? "La propriété a été créée dans Supabase." : undefined} /><PropertyListView basePath="/proprietes" dashboardHref="/espace" params={params} properties={properties} /></ProtectedAppShell>;
}
