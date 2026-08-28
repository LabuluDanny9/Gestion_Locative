import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { requireUser } from "@/features/auth/server";
import { PropertyDetailView } from "@/features/properties/property-detail-view";
import { getActiveOrganization } from "@/services/rental-backend";
import { loadRentalData } from "@/services/rental-read-models";

export const metadata: Metadata = { title: "Détail propriété" };

export default async function PropertyDetailPage({ params }: { params: Promise<{ propertyId: string }> }) {
  const id = (await params).propertyId;
  const { supabase, user } = await requireUser();
  const membership = await getActiveOrganization(supabase, user.id);
  const data = await loadRentalData(supabase, membership.organization_id);
  const property = data.properties.find((item) => item.id === id);
  if (!property) notFound();
  return <ProtectedAppShell><PropertyDetailView basePath="/proprietes" dashboardHref="/espace" property={property} propertyUnits={data.units.filter((unit) => unit.propertyId === property.id)} unitBasePath="/logements" /></ProtectedAppShell>;
}
