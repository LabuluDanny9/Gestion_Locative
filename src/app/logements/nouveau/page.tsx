import type { Metadata } from "next";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { UnitFormPreview } from "@/features/properties/unit-form-preview";

export const metadata: Metadata = { title: "Ajouter un logement" };

export default async function NewUnitPage({ searchParams }: { searchParams: Promise<{ property?: string }> }) {
  return <ProtectedAppShell><UnitFormPreview basePath="/logements" dashboardHref="/espace" defaultProperty={(await searchParams).property} /></ProtectedAppShell>;
}
