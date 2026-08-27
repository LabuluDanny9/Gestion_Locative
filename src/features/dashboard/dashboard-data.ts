export const dashboardPeriods = ["month", "quarter", "half", "year", "custom"] as const;
export type DashboardPeriod = (typeof dashboardPeriods)[number];

export const dashboardPeriodLabels: Record<DashboardPeriod, string> = {
  month: "Ce mois",
  quarter: "3 mois",
  half: "6 mois",
  year: "Cette année",
  custom: "Personnalisée",
};

const monthlyRevenue = [
  { label: "Jan", expected: 12200, collected: 10850 },
  { label: "Fév", expected: 12600, collected: 11720 },
  { label: "Mar", expected: 12850, collected: 11460 },
  { label: "Avr", expected: 13200, collected: 12640 },
  { label: "Mai", expected: 13400, collected: 12180 },
  { label: "Juin", expected: 13750, collected: 13090 },
  { label: "Juil", expected: 14100, collected: 13280 },
  { label: "Août", expected: 14350, collected: 12450 },
] as const;

const currentMonthRevenue = [
  { label: "S1", expected: 3600, collected: 3180 },
  { label: "S2", expected: 3550, collected: 3470 },
  { label: "S3", expected: 3600, collected: 2990 },
  { label: "S4", expected: 3600, collected: 2810 },
] as const;

export type DashboardRevenuePoint = {
  label: string;
  expected: number;
  collected: number;
};

export type DashboardData = ReturnType<typeof getDashboardData>;
export type DashboardChartData = Pick<DashboardData, "revenue" | "unitDistribution">;

export function parseDashboardPeriod(value?: string): DashboardPeriod {
  return dashboardPeriods.includes(value as DashboardPeriod) ? value as DashboardPeriod : "month";
}

export function getDashboardData(period: DashboardPeriod) {
  const revenue: DashboardRevenuePoint[] = period === "month"
    ? [...currentMonthRevenue]
    : [...monthlyRevenue.slice(period === "quarter" ? -3 : period === "half" || period === "custom" ? -6 : 0)];

  const totals = revenue.reduce(
    (result, point) => ({ expected: result.expected + point.expected, collected: result.collected + point.collected }),
    { expected: 0, collected: 0 },
  );
  const arrears = totals.expected - totals.collected;
  const recovery = totals.expected ? (totals.collected / totals.expected) * 100 : 0;

  return {
    kpis: {
      collected: totals.collected,
      expected: totals.expected,
      arrears,
      recovery,
      units: 45,
      occupied: 39,
      occupancy: 86.7,
    },
    revenue,
    unitDistribution: [
      { name: "Occupés", value: 39, color: "#2563EB" },
      { name: "Libres", value: 3, color: "#16A34A" },
      { name: "Maintenance", value: 2, color: "#F59E0B" },
      { name: "Réservés", value: 1, color: "#D4A72C" },
    ],
    upcoming: [
      { id: "due-1", tenant: "Jean Kabulo", unit: "Appartement A03", amount: 350, timing: "Dans 2 jours" },
      { id: "due-2", tenant: "Grâce Tshibangu", unit: "Studio B07", amount: 280, timing: "Dans 3 jours" },
      { id: "due-3", tenant: "Patrick Kalala", unit: "Maison M02", amount: 620, timing: "Dans 5 jours" },
    ],
    arrears: [
      { id: "late-1", tenant: "David Mbuyi", unit: "Appartement C04", amount: 600, days: 45, unpaid: "2 mois impayés" },
      { id: "late-2", tenant: "Nadine Kanku", unit: "Studio A09", amount: 420, days: 31, unpaid: "1 mois impayé" },
      { id: "late-3", tenant: "Alain Mukendi", unit: "Maison M05", amount: 980, days: 64, unpaid: "2 mois impayés" },
    ],
    recentPayments: [
      { id: "REC-2026-00124", tenant: "Jean Kabulo", unit: "A03", amount: 350, date: "Aujourd’hui, 10:42", status: "paid" as const },
      { id: "REC-2026-00123", tenant: "Chantal Ilunga", unit: "B02", amount: 550, date: "Aujourd’hui, 09:18", status: "paid" as const },
      { id: "REC-2026-00122", tenant: "Moïse Kabila", unit: "A11", amount: 200, date: "Hier, 16:05", status: "partial" as const },
      { id: "REC-2026-00121", tenant: "Élodie Mumba", unit: "C08", amount: 410, date: "Hier, 14:26", status: "paid" as const },
    ],
  };
}
