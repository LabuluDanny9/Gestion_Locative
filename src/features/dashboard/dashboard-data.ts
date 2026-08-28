export const dashboardPeriods = ["month", "quarter", "half", "year", "custom"] as const;
export type DashboardPeriod = (typeof dashboardPeriods)[number];

export const dashboardPeriodLabels: Record<DashboardPeriod, string> = {
  month: "Ce mois",
  quarter: "3 mois",
  half: "6 mois",
  year: "Cette année",
  custom: "Personnalisée",
};

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
  return {
    kpis: { collected: 0, expected: 0, arrears: 0, recovery: 0, units: 0, occupied: 0, occupancy: 0 },
    revenue: [] as DashboardRevenuePoint[],
    unitDistribution: [
      { name: "Occupés", value: 0, color: "#2563EB" }, { name: "Libres", value: 0, color: "#16A34A" },
      { name: "Maintenance", value: 0, color: "#F59E0B" }, { name: "Réservés", value: 0, color: "#D4A72C" },
    ],
    upcoming: [] as { id: string; tenant: string; unit: string; amount: number; timing: string }[],
    arrears: [] as { id: string; tenant: string; unit: string; amount: number; days: number; unpaid: string }[],
    recentPayments: [] as { id: string; tenant: string; unit: string; amount: number; date: string; status: "paid" | "partial" }[],
  };
}

export function createDashboardData(input: {
  contracts: { rent: number; status: string }[];
  payments: { receiptNumber: string; tenantName: string; unitLabel: string; amount: number; date: string; status: "paid" | "partial" | "cancelled" }[];
  tenants: { id: string; name: string; unitLabel: string; balance: number; rent: number; nextDueDate: string }[];
  units: { status: string }[];
}): DashboardData {
  const activeContracts = input.contracts.filter((contract) => ["active", "expiring"].includes(contract.status));
  const expected = activeContracts.reduce((sum, contract) => sum + contract.rent, 0);
  const collected = input.payments.filter((payment) => payment.status !== "cancelled").reduce((sum, payment) => sum + payment.amount, 0);
  const arrearsAmount = input.tenants.reduce((sum, tenant) => sum + tenant.balance, 0);
  const occupied = input.units.filter((unit) => unit.status === "occupied").length;
  const count = (status: string) => input.units.filter((unit) => unit.status === status).length;
  return {
    kpis: { collected, expected, arrears: arrearsAmount, recovery: expected ? Math.min(100, collected / expected * 100) : 0, units: input.units.length, occupied, occupancy: input.units.length ? occupied / input.units.length * 100 : 0 },
    revenue: [{ label: dashboardPeriodLabels.month, expected, collected }],
    unitDistribution: [
      { name: "Occupés", value: occupied, color: "#2563EB" }, { name: "Libres", value: count("available"), color: "#16A34A" },
      { name: "Maintenance", value: count("maintenance"), color: "#F59E0B" }, { name: "Réservés", value: count("reserved"), color: "#D4A72C" },
    ],
    upcoming: input.tenants.filter((tenant) => tenant.balance <= 0 && tenant.nextDueDate !== "—").slice(0, 5).map((tenant) => ({ id: tenant.id, tenant: tenant.name, unit: tenant.unitLabel, amount: tenant.rent, timing: tenant.nextDueDate })),
    arrears: input.tenants.filter((tenant) => tenant.balance > 0).slice(0, 5).map((tenant) => ({ id: tenant.id, tenant: tenant.name, unit: tenant.unitLabel, amount: tenant.balance, days: 0, unpaid: "Solde à recouvrer" })),
    recentPayments: input.payments.filter((payment) => payment.status !== "cancelled").slice(0, 5).map((payment) => ({ id: payment.receiptNumber, tenant: payment.tenantName, unit: payment.unitLabel, amount: payment.amount, date: payment.date, status: payment.status === "partial" ? "partial" as const : "paid" as const })),
  };
}
