import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { createReportData, type ReportFilters } from "@/features/reports/report-data";
import { loadArrearsData } from "@/services/arrears-read-model";
import { loadRentalData } from "@/services/rental-read-models";
import type { Database } from "@/types/database.types";

type Client = SupabaseClient<Database>;
type AppRole = Database["public"]["Enums"]["app_role"];

export async function canReadReports(supabase: Client, role: AppRole) {
  const { data, error } = await supabase.from("role_permissions").select("role")
    .eq("role", role).eq("permission", "reports.read").maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export async function loadReportData(supabase: Client, organizationId: string, filters: ReportFilters) {
  const [rentalData, arrears] = await Promise.all([
    loadRentalData(supabase, organizationId),
    loadArrearsData(supabase, organizationId),
  ]);
  return createReportData({ ...rentalData, arrears }, filters);
}
