import type { Metadata } from "next";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { requireUser } from "@/features/auth/server";
import { recordPaymentAction } from "@/features/backend/actions";
import { PaymentFormPreview } from "@/features/payments/payment-form-preview";
import { getActiveOrganization } from "@/services/rental-backend";
import { MutationFeedback } from "@/components/shared/mutation-feedback";

export const metadata: Metadata = { title: "Nouveau paiement" };

export default async function NewPaymentPage({ searchParams }: { searchParams: Promise<{ tenant?: string; erreur?: string }> }) {
  const params = await searchParams;
  const { supabase, user } = await requireUser();
  const membership = await getActiveOrganization(supabase, user.id);
  const [{ data: leases }, { data: balances }] = await Promise.all([
    supabase.from("leases").select("id, rent_amount, currency, unit:units(code), parties:lease_tenants!inner(tenant:tenants!inner(id, first_name, last_name, phone))").eq("organization_id", membership.organization_id).in("status", ["active", "suspended"]),
    supabase.from("rent_invoice_balances").select("lease_id, balance").eq("organization_id", membership.organization_id),
  ]);
  const balancesByLease = new Map<string, number>();
  for (const row of balances ?? []) if (row.lease_id) balancesByLease.set(row.lease_id, (balancesByLease.get(row.lease_id) ?? 0) + (row.balance ?? 0));
  const tenantOptions = (leases ?? []).flatMap((lease) => lease.parties.map(({ tenant }) => ({ id: tenant.id, name: `${tenant.first_name} ${tenant.last_name}`, phone: tenant.phone, unitLabel: lease.unit?.code ?? "Logement", rent: lease.rent_amount, balance: balancesByLease.get(lease.id) ?? 0, currency: lease.currency, contractId: lease.id })));
  return <ProtectedAppShell><MutationFeedback error={params.erreur} /><PaymentFormPreview action={recordPaymentAction} basePath="/paiements" dashboardHref="/espace" defaultTenant={params.tenant} idempotencyKey={crypto.randomUUID()} receiptExampleHref="/recus" tenantOptions={tenantOptions} /></ProtectedAppShell>;
}
