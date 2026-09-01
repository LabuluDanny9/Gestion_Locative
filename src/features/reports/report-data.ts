import type { ArrearsAccount } from "@/features/arrears/arrears-data";
import type { RentInvoice } from "@/features/invoices/invoice-data";
import type { Payment } from "@/features/payments/payment-data";
import type { Property, Unit } from "@/features/properties/property-data";
import type { Tenant } from "@/features/tenants/tenant-data";

export type ReportCurrency = "USD" | "CDF";
export type ReportFilters = { startDate: string; endDate: string; currency: ReportCurrency; propertyId?: string; tenantId?: string };
export type ReportInput = { properties: Property[]; units: Unit[]; tenants: Tenant[]; payments: Payment[]; invoices: RentInvoice[]; arrears: ArrearsAccount[] };

export type ReportData = ReturnType<typeof createReportData>;

const monthFormatter = new Intl.DateTimeFormat("fr-CD", { month: "short", year: "2-digit", timeZone: "UTC" });

function inRange(value: string, start: string, end: string) {
  const date = value.slice(0, 10);
  return date >= start && date <= end;
}

function total(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0);
}

function monthsBetween(startDate: string, endDate: string) {
  const start = new Date(`${startDate.slice(0, 7)}-01T00:00:00Z`);
  const end = new Date(`${endDate.slice(0, 7)}-01T00:00:00Z`);
  const months: { key: string; label: string }[] = [];
  while (start <= end && months.length < 24) {
    months.push({ key: start.toISOString().slice(0, 7), label: monthFormatter.format(start) });
    start.setUTCMonth(start.getUTCMonth() + 1);
  }
  return months;
}

export function parseReportFilters(input: { debut?: string; fin?: string; devise?: string; propriete?: string; locataire?: string }, now = new Date()): ReportFilters {
  const validDate = (value?: string) => /^\d{4}-\d{2}-\d{2}$/.test(value ?? "") ? value! : undefined;
  const fallbackEnd = now.toISOString().slice(0, 10);
  const fallbackStart = `${now.getUTCFullYear()}-01-01`;
  const candidateStart = validDate(input.debut) ?? fallbackStart;
  const candidateEnd = validDate(input.fin) ?? fallbackEnd;
  return {
    startDate: candidateStart <= candidateEnd ? candidateStart : candidateEnd,
    endDate: candidateStart <= candidateEnd ? candidateEnd : candidateStart,
    currency: input.devise === "CDF" ? "CDF" : "USD",
    propertyId: input.propriete || undefined,
    tenantId: input.locataire || undefined,
  };
}

export function createReportData(input: ReportInput, filters: ReportFilters) {
  const unitById = new Map(input.units.map((unit) => [unit.id, unit]));
  const invoicePropertyId = (invoice: RentInvoice) => unitById.get(invoice.unitId)?.propertyId;
  const paymentPropertyId = (payment: Payment) => unitById.get(payment.unitId)?.propertyId;
  const matchesScope = (propertyId?: string, tenantId?: string) =>
    (!filters.propertyId || propertyId === filters.propertyId) && (!filters.tenantId || tenantId === filters.tenantId);

  const invoices = input.invoices.filter((invoice) => invoice.currency === filters.currency
    && inRange(invoice.dueDateIso, filters.startDate, filters.endDate)
    && matchesScope(invoicePropertyId(invoice), invoice.tenantId));
  const payments = input.payments.filter((payment) => payment.currency === filters.currency
    && payment.status !== "cancelled" && inRange(payment.paidAtIso, filters.startDate, filters.endDate)
    && matchesScope(paymentPropertyId(payment), payment.tenantId));
  const arrears = input.arrears.filter((account) => account.currency === filters.currency
    && matchesScope(account.propertyId, account.tenantId));
  const scopedUnits = input.units.filter((unit) => !filters.propertyId || unit.propertyId === filters.propertyId);
  const expected = total(invoices.map((invoice) => invoice.amountDue));
  const collected = total(payments.map((payment) => payment.amount));
  const outstanding = total(invoices.map((invoice) => invoice.balance));

  const monthly = monthsBetween(filters.startDate, filters.endDate).map((month) => ({
    ...month,
    expected: total(invoices.filter((invoice) => invoice.dueDateIso.startsWith(month.key)).map((invoice) => invoice.amountDue)),
    collected: total(payments.filter((payment) => payment.paidAtIso.startsWith(month.key)).map((payment) => payment.amount)),
  }));

  const propertyRows = input.properties
    .filter((property) => !filters.propertyId || property.id === filters.propertyId)
    .map((property) => {
      const propertyInvoices = invoices.filter((invoice) => invoicePropertyId(invoice) === property.id);
      const propertyPayments = payments.filter((payment) => paymentPropertyId(payment) === property.id);
      const propertyArrears = arrears.filter((account) => account.propertyId === property.id);
      const units = scopedUnits.filter((unit) => unit.propertyId === property.id);
      return { id: property.id, name: property.name, units: units.length, occupied: units.filter((unit) => unit.status === "occupied").length,
        expected: total(propertyInvoices.map((invoice) => invoice.amountDue)), collected: total(propertyPayments.map((payment) => payment.amount)),
        arrears: total(propertyArrears.map((account) => account.totalBalance)) };
    })
    .filter((row) => row.units > 0 || row.expected > 0 || row.collected > 0 || row.arrears > 0)
    .toSorted((a, b) => b.collected - a.collected || a.name.localeCompare(b.name));

  const tenantRows = input.tenants
    .filter((tenant) => matchesScope(tenant.propertyId, tenant.id) && tenant.currency === filters.currency)
    .map((tenant) => {
      const tenantInvoices = invoices.filter((invoice) => invoice.tenantId === tenant.id);
      const tenantPayments = payments.filter((payment) => payment.tenantId === tenant.id);
      const tenantArrears = arrears.filter((account) => account.tenantId === tenant.id);
      return { id: tenant.id, name: tenant.name, propertyName: tenant.propertyName, unitLabel: tenant.unitLabel,
        expected: total(tenantInvoices.map((invoice) => invoice.amountDue)), collected: total(tenantPayments.map((payment) => payment.amount)),
        arrears: total(tenantArrears.map((account) => account.totalBalance)), payments: tenantPayments.length };
    })
    .filter((row) => row.expected > 0 || row.collected > 0 || row.arrears > 0)
    .toSorted((a, b) => b.arrears - a.arrears || a.name.localeCompare(b.name));

  return {
    filters,
    summary: { expected, collected, outstanding, arrears: total(arrears.map((account) => account.totalBalance)),
      recovery: expected > 0 ? collected / expected * 100 : 0, paymentCount: payments.length,
      partialCount: invoices.filter((invoice) => invoice.status === "partial").length,
      occupiedUnits: scopedUnits.filter((unit) => unit.status === "occupied").length, unitCount: scopedUnits.length },
    monthly,
    propertyRows,
    tenantRows,
    paymentRows: payments.toSorted((a, b) => b.paidAtIso.localeCompare(a.paidAtIso)),
    arrearsRows: arrears.toSorted((a, b) => b.maximumDaysLate - a.maximumDaysLate || b.totalBalance - a.totalBalance),
    options: { properties: input.properties.map(({ id, name }) => ({ id, name })).toSorted((a, b) => a.name.localeCompare(b.name)),
      tenants: input.tenants.map(({ id, name }) => ({ id, name })).toSorted((a, b) => a.name.localeCompare(b.name)) },
  };
}
