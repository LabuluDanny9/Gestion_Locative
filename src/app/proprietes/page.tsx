import type { Metadata } from "next";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { PropertyListView, type PropertyListParams } from "@/features/properties/property-list-view";

export const metadata: Metadata = { title: "Propriétés" };
export const dynamic = "force-dynamic";

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<PropertyListParams> }) {
  return <ProtectedAppShell><PropertyListView basePath="/proprietes" dashboardHref="/espace" params={await searchParams} /></ProtectedAppShell>;
}
