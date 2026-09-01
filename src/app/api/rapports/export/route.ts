import { parseReportFilters } from "@/features/reports/report-data";
import { requireUser } from "@/features/auth/server";
import { canReadReports, loadReportData } from "@/services/report-read-model";
import { getActiveOrganization } from "@/services/rental-backend";

export const dynamic = "force-dynamic";

function csvCell(value: string | number) { return `"${String(value).replaceAll('"', '""')}"`; }
function csvLine(values: (string | number)[]) { return values.map(csvCell).join(";"); }

export async function GET(request: Request) {
  const { supabase, user } = await requireUser();
  const membership = await getActiveOrganization(supabase, user.id);
  if (!await canReadReports(supabase, membership.role)) return new Response("Accès refusé", { status: 403 });
  const url = new URL(request.url);
  const filters = parseReportFilters({ debut: url.searchParams.get("debut") ?? undefined, fin: url.searchParams.get("fin") ?? undefined, devise: url.searchParams.get("devise") ?? undefined, propriete: url.searchParams.get("propriete") ?? undefined, locataire: url.searchParams.get("locataire") ?? undefined });
  const data = await loadReportData(supabase, membership.organization_id, filters);
  const rows: string[] = [csvLine(["AMIRANDA EMPIRE", "Rapport financier"]), csvLine(["Période", filters.startDate, filters.endDate, "Devise", filters.currency]), "",
    csvLine(["SYNTHÈSE"]), csvLine(["Attendu", "Encaissé", "Solde", "Arriérés", "Recouvrement %"]), csvLine([data.summary.expected, data.summary.collected, data.summary.outstanding, data.summary.arrears, data.summary.recovery.toFixed(2)]), "",
    csvLine(["PROPRIÉTÉS"]), csvLine(["Propriété", "Logements", "Occupés", "Attendu", "Encaissé", "Arriérés"]), ...data.propertyRows.map((row) => csvLine([row.name, row.units, row.occupied, row.expected, row.collected, row.arrears])), "",
    csvLine(["LOCATAIRES"]), csvLine(["Locataire", "Propriété", "Logement", "Attendu", "Encaissé", "Arriérés", "Paiements"]), ...data.tenantRows.map((row) => csvLine([row.name, row.propertyName, row.unitLabel, row.expected, row.collected, row.arrears, row.payments])), "",
    csvLine(["PAIEMENTS"]), csvLine(["Référence", "Date", "Locataire", "Logement", "Mode", "Montant"]), ...data.paymentRows.map((row) => csvLine([row.reference, row.paidAtIso, row.tenantName, row.unitLabel, row.mode, row.amount])), "",
    csvLine(["ARRIÉRÉS"]), csvLine(["Locataire", "Propriété", "Logement", "Échéances", "Retard maximal", "Solde"]), ...data.arrearsRows.map((row) => csvLine([row.tenantName, row.propertyName, row.unitLabel, row.invoiceCount, row.maximumDaysLate, row.totalBalance]))];
  return new Response(`\uFEFF${rows.join("\r\n")}`, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="rapport-amiranda-${filters.startDate}-${filters.endDate}-${filters.currency}.csv"`, "Cache-Control": "private, no-store" } });
}
