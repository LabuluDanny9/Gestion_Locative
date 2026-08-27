import type { Metadata } from "next";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { UnitListView, type UnitListParams } from "@/features/properties/unit-list-view";

export const metadata: Metadata = { title: "Logements" };
export const dynamic = "force-dynamic";

export default async function UnitsPage({ searchParams }: { searchParams: Promise<UnitListParams> }) {
  return <ProtectedAppShell><UnitListView basePath="/logements" dashboardHref="/espace" params={await searchParams} /></ProtectedAppShell>;
}
