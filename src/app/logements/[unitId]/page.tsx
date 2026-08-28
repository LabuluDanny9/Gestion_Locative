import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { requireUser } from "@/features/auth/server";
import { UnitDetailView } from "@/features/properties/unit-detail-view";
import { getActiveOrganization } from "@/services/rental-backend";
import { loadRentalData } from "@/services/rental-read-models";

export const metadata: Metadata = { title: "Détail logement" };

export default async function UnitDetailPage({ params }: { params: Promise<{ unitId: string }> }) {
  const id = (await params).unitId;
  const { supabase, user } = await requireUser();
  const membership = await getActiveOrganization(supabase, user.id);
  const { units } = await loadRentalData(supabase, membership.organization_id);
  const unit = units.find((item) => item.id === id);
  if (!unit) notFound();
  return <ProtectedAppShell><UnitDetailView basePath="/logements" contractBasePath="/contrats" dashboardHref="/espace" propertyBasePath="/proprietes" tenantBasePath="/locataires" unit={unit} /></ProtectedAppShell>;
}
