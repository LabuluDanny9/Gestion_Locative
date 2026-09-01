import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { requireUser } from "@/features/auth/server";
import { parseReportFilters } from "@/features/reports/report-data";
import { ReportDashboard } from "@/features/reports/report-dashboard";
import { canReadReports, loadReportData } from "@/services/report-read-model";
import { getActiveOrganization } from "@/services/rental-backend";

export const metadata: Metadata = { title: "Rapports" };
export const dynamic = "force-dynamic";

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ debut?: string; fin?: string; devise?: string; propriete?: string; locataire?: string }> }) {
  const { supabase, user } = await requireUser();
  const membership = await getActiveOrganization(supabase, user.id);
  if (!await canReadReports(supabase, membership.role)) notFound();
  const filters = parseReportFilters(await searchParams);
  const data = await loadReportData(supabase, membership.organization_id, filters);
  return <ProtectedAppShell><ReportDashboard data={data} /></ProtectedAppShell>;
}
