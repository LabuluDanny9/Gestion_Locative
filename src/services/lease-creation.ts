import type { Database } from "@/types/database.types";

type Currency = Database["public"]["Enums"]["currency_code"];

export type LeaseCreationInput = {
  tenantId: string;
  unitId: string;
  startDate: string;
  endDate: string | null;
  rent: number;
  currency: Currency;
  guarantee: number;
  frequency: Database["public"]["Enums"]["billing_frequency"];
  dueDay: number;
  terms?: string;
};

export function buildLeaseCreationRpc(organizationId: string, input: LeaseCreationInput) {
  return {
    p_organization_id: organizationId,
    p_tenant_id: input.tenantId,
    p_unit_id: input.unitId,
    p_start_date: input.startDate,
    p_end_date: null,
    p_rent_amount: input.rent,
    p_currency: input.currency,
    p_guarantee_amount: input.guarantee,
    p_advance_amount: 0,
    p_frequency: input.frequency,
    p_due_day: input.dueDay,
    p_terms: input.terms ?? "",
  };
}
