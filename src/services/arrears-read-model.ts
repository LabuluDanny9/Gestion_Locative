import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { ArrearsAccount } from "@/features/arrears/arrears-data";
import type { Database } from "@/types/database.types";

type Client = SupabaseClient<Database>;

export async function loadArrearsData(supabase: Client, organizationId: string): Promise<ArrearsAccount[]> {
  const [arrearsResult, invoiceResult, tenantResult, leaseResult, unitResult, propertyResult] = await Promise.all([
    supabase.from("rent_arrears").select("*").eq("organization_id", organizationId),
    supabase.from("rent_invoice_balances").select("id, lease_id, invoice_number, period_start, period_end, due_date, amount_due, amount_paid, balance, currency, days_late").eq("organization_id", organizationId).gt("balance", 0).gt("days_late", 0),
    supabase.from("tenants").select("id, first_name, last_name, phone").eq("organization_id", organizationId).is("archived_at", null),
    supabase.from("leases").select("id, unit_id").eq("organization_id", organizationId),
    supabase.from("units").select("id, code, property_id").eq("organization_id", organizationId),
    supabase.from("properties").select("id, name").eq("organization_id", organizationId),
  ]);

  for (const result of [arrearsResult, invoiceResult, tenantResult, leaseResult, unitResult, propertyResult]) {
    if (result.error) throw result.error;
  }

  const tenantById = new Map((tenantResult.data ?? []).map((tenant) => [tenant.id, tenant]));
  const leaseById = new Map((leaseResult.data ?? []).map((lease) => [lease.id, lease]));
  const unitById = new Map((unitResult.data ?? []).map((unit) => [unit.id, unit]));
  const propertyById = new Map((propertyResult.data ?? []).map((property) => [property.id, property]));
  const installmentsByLeaseCurrency = new Map<string, ArrearsAccount["installments"]>();
  for (const invoice of invoiceResult.data ?? []) {
    if (!invoice.lease_id || !invoice.currency || !invoice.id || !invoice.due_date || !invoice.period_start || !invoice.period_end) continue;
    const key = `${invoice.lease_id}-${invoice.currency}`;
    installmentsByLeaseCurrency.set(key, [...(installmentsByLeaseCurrency.get(key) ?? []), {
      id: invoice.id, reference: invoice.invoice_number ?? "—", periodStart: invoice.period_start, periodEnd: invoice.period_end, dueDate: invoice.due_date,
      amountDue: Number(invoice.amount_due ?? 0), amountPaid: Number(invoice.amount_paid ?? 0), balance: Number(invoice.balance ?? 0), daysLate: Number(invoice.days_late ?? 0),
    }]);
  }

  return (arrearsResult.data ?? []).flatMap((row) => {
    if (!row.tenant_id || !row.lease_id || !row.unit_id || !row.currency || !row.oldest_due_date) return [];
    const tenant = tenantById.get(row.tenant_id);
    const lease = leaseById.get(row.lease_id);
    const unit = unitById.get(row.unit_id);
    if (!tenant || !lease || !unit) return [];
    const property = propertyById.get(unit.property_id);
    const installments = (installmentsByLeaseCurrency.get(`${row.lease_id}-${row.currency}`) ?? []).toSorted((a, b) => a.dueDate.localeCompare(b.dueDate));

    return [{
      id: `${row.lease_id}-${row.currency}`, tenantId: row.tenant_id, tenantName: `${tenant.first_name} ${tenant.last_name}`.trim(), phone: tenant.phone,
      leaseId: row.lease_id, unitId: row.unit_id, unitLabel: unit.code, propertyId: unit.property_id, propertyName: property?.name ?? "Propriété",
      currency: row.currency, totalBalance: Number(row.total_balance ?? 0), invoiceCount: Number(row.invoice_count ?? 0), oldestDueDate: row.oldest_due_date,
      maximumDaysLate: Number(row.maximum_days_late ?? 0), installments,
    }];
  }).toSorted((a, b) => b.maximumDaysLate - a.maximumDaysLate || b.totalBalance - a.totalBalance);
}
