import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { requireUser } from "@/features/auth/server";
import { recordPaymentAction } from "@/features/backend/actions";
import { PaymentFormPreview } from "@/features/payments/payment-form-preview";
import { generateRentInvoices, getActiveOrganization } from "@/services/rental-backend";
import { MutationFeedback } from "@/components/shared/mutation-feedback";

export const metadata: Metadata = { title: "Nouveau paiement" };

export default async function NewPaymentPage({ searchParams }: { searchParams: Promise<{ tenant?: string; erreur?: string }> }) {
  const params = await searchParams;
  const { supabase, user } = await requireUser();
  const membership = await getActiveOrganization(supabase, user.id);
  let generationFailed = false;

  if (["super_admin", "owner", "manager"].includes(membership.role)) {
    const throughDate = new Date();
    throughDate.setUTCDate(throughDate.getUTCDate() + 45);
    try {
      await generateRentInvoices(supabase, membership.organization_id, throughDate.toISOString().slice(0, 10));
    } catch (cause) {
      generationFailed = true;
      console.error("Échec de la génération des échéances avant paiement", cause);
    }
  }

  const [leaseResult, partyResult, tenantResult, unitResult, balanceResult] = await Promise.all([
    supabase.from("leases").select("id, rent_amount, currency, unit_id").eq("organization_id", membership.organization_id).in("status", ["active", "suspended"]),
    supabase.from("lease_tenants").select("lease_id, tenant_id").eq("organization_id", membership.organization_id).is("left_at", null),
    supabase.from("tenants").select("id, first_name, last_name, phone").eq("organization_id", membership.organization_id).is("archived_at", null),
    supabase.from("units").select("id, code").eq("organization_id", membership.organization_id).is("archived_at", null),
    supabase.from("rent_invoice_balances").select("lease_id, balance").eq("organization_id", membership.organization_id),
  ]);

  for (const result of [leaseResult, partyResult, tenantResult, unitResult, balanceResult]) {
    if (result.error) throw result.error;
  }

  const balancesByLease = new Map<string, number>();
  for (const row of balanceResult.data ?? []) if (row.lease_id) balancesByLease.set(row.lease_id, (balancesByLease.get(row.lease_id) ?? 0) + Number(row.balance ?? 0));
  const tenantById = new Map((tenantResult.data ?? []).map((tenant) => [tenant.id, tenant]));
  const unitById = new Map((unitResult.data ?? []).map((unit) => [unit.id, unit]));
  const partiesByLease = new Map<string, string[]>();
  for (const party of partyResult.data ?? []) partiesByLease.set(party.lease_id, [...(partiesByLease.get(party.lease_id) ?? []), party.tenant_id]);
  const tenantOptions = (leaseResult.data ?? []).flatMap((lease) => (partiesByLease.get(lease.id) ?? []).flatMap((tenantId) => {
    const tenant = tenantById.get(tenantId);
    if (!tenant) return [];
    return [{ id: tenant.id, name: `${tenant.first_name} ${tenant.last_name}`.trim(), phone: tenant.phone, unitLabel: unitById.get(lease.unit_id)?.code ?? "Logement", rent: Number(lease.rent_amount), balance: balancesByLease.get(lease.id) ?? 0, currency: lease.currency, contractId: lease.id }];
  }));

  return <ProtectedAppShell><MutationFeedback error={params.erreur} />{generationFailed ? <Alert className="mb-6 border-amber-300 bg-amber-50 text-amber-950"><AlertTriangle /><AlertTitle>Synchronisation temporairement indisponible</AlertTitle><AlertDescription className="text-amber-800">Les locataires liés à un contrat restent visibles. Rechargez la page pour actualiser leurs échéances.</AlertDescription></Alert> : null}<PaymentFormPreview action={recordPaymentAction} basePath="/paiements" dashboardHref="/espace" defaultTenant={params.tenant} idempotencyKey={crypto.randomUUID()} receiptExampleHref="/recus" tenantOptions={tenantOptions} /></ProtectedAppShell>;
}
