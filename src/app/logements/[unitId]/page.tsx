import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { getUnit } from "@/features/properties/property-data";
import { UnitDetailView } from "@/features/properties/unit-detail-view";

export const metadata: Metadata = { title: "Détail logement" };

export default async function UnitDetailPage({ params }: { params: Promise<{ unitId: string }> }) {
  const unit = getUnit((await params).unitId);
  if (!unit) notFound();
  return <ProtectedAppShell><UnitDetailView basePath="/logements" dashboardHref="/espace" propertyBasePath="/proprietes" tenantBasePath="/locataires" unit={unit} /></ProtectedAppShell>;
}
