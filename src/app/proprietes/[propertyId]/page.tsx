import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { getProperty } from "@/features/properties/property-data";
import { PropertyDetailView } from "@/features/properties/property-detail-view";

export const metadata: Metadata = { title: "Détail propriété" };

export default async function PropertyDetailPage({ params }: { params: Promise<{ propertyId: string }> }) {
  const property = getProperty((await params).propertyId);
  if (!property) notFound();
  return <ProtectedAppShell><PropertyDetailView basePath="/proprietes" dashboardHref="/espace" property={property} unitBasePath="/logements" /></ProtectedAppShell>;
}
