import type { Metadata } from "next";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { createUnitAction } from "@/features/backend/actions";
import { requireUser } from "@/features/auth/server";
import { UnitFormPreview } from "@/features/properties/unit-form-preview";
import { getActiveOrganization } from "@/services/rental-backend";
import { MutationFeedback } from "@/components/shared/mutation-feedback";

export const metadata: Metadata = { title: "Ajouter un logement" };

export default async function NewUnitPage({ searchParams }: { searchParams: Promise<{ property?: string; erreur?: string }> }) {
  const params = await searchParams;
  const { supabase, user } = await requireUser();
  const membership = await getActiveOrganization(supabase, user.id);
  const { data: propertyOptions } = await supabase.from("properties").select("id, name").eq("organization_id", membership.organization_id).is("archived_at", null).order("name");
  return <ProtectedAppShell><MutationFeedback error={params.erreur} /><UnitFormPreview action={createUnitAction} basePath="/logements" dashboardHref="/espace" defaultProperty={params.property} propertyOptions={propertyOptions ?? []} /></ProtectedAppShell>;
}
