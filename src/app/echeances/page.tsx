import type { Metadata } from "next";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { requireUser } from "@/features/auth/server";
import { InvoiceListView, type InvoiceListParams } from "@/features/invoices/invoice-list-view";
import { generateRentInvoices, getActiveOrganization } from "@/services/rental-backend";
import { loadRentalData } from "@/services/rental-read-models";

export const metadata: Metadata = { title: "Échéances" };
export const dynamic = "force-dynamic";

export default async function InvoicesPage({ searchParams }: { searchParams: Promise<InvoiceListParams> }) {
  const params = await searchParams;
  const { supabase, user } = await requireUser();
  const membership = await getActiveOrganization(supabase, user.id);
  if (["super_admin", "owner", "manager"].includes(membership.role)) {
    const throughDate = new Date();
    throughDate.setUTCDate(throughDate.getUTCDate() + 45);
    await generateRentInvoices(supabase, membership.organization_id, throughDate.toISOString().slice(0, 10));
  }
  const { invoices } = await loadRentalData(supabase, membership.organization_id);
  return <ProtectedAppShell><InvoiceListView invoices={invoices} params={params} /></ProtectedAppShell>;
}
