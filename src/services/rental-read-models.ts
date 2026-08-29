import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Contract, ContractStatus } from "@/features/contracts/contract-data";
import type { RentInvoice } from "@/features/invoices/invoice-data";
import type { Payment, PaymentMode, PaymentStatus } from "@/features/payments/payment-data";
import type { Property, PropertyStatus, Unit, UnitStatus } from "@/features/properties/property-data";
import type { Tenant, TenantStatus } from "@/features/tenants/tenant-data";
import type { Database } from "@/types/database.types";

type Client = SupabaseClient<Database>;
type Currency = "USD" | "CDF";

const dateFormatter = new Intl.DateTimeFormat("fr-CD", { day: "2-digit", month: "long", year: "numeric" });
const monthFormatter = new Intl.DateTimeFormat("fr-CD", { month: "long", year: "numeric" });

function formatDate(value?: string | null) {
  return value ? dateFormatter.format(new Date(value)) : "—";
}

function propertyStatus(status: string): PropertyStatus {
  return status === "active" ? "active" : status === "maintenance" ? "maintenance" : "inactive";
}

function unitStatus(status: string): UnitStatus {
  return ["occupied", "available", "maintenance", "reserved"].includes(status) ? status as UnitStatus : "maintenance";
}

function contractStatus(status: string, endDate: string | null): ContractStatus {
  if (status === "draft") return "draft";
  if (["expired", "terminated"].includes(status)) return "expired";
  if (endDate && new Date(endDate).getTime() - Date.now() <= 60 * 86_400_000) return "expiring";
  return "active";
}

function paymentMode(method: string): PaymentMode {
  if (method === "cash") return "cash";
  if (method === "mobile_money") return "mobile";
  if (["bank_transfer", "bank_deposit"].includes(method)) return "bank";
  return "card";
}

function paymentStatus(status: string): PaymentStatus {
  return status === "cancelled" || status === "reversed" ? "cancelled" : status === "partial" ? "partial" : "paid";
}

export async function loadRentalData(supabase: Client, organizationId: string) {
  const [propertyResult, unitResult, photoResult, tenantResult, leaseResult, partyResult, invoiceResult, paymentResult, receiptResult, documentResult] = await Promise.all([
    supabase.from("properties").select("*").eq("organization_id", organizationId).is("archived_at", null).order("name"),
    supabase.from("units").select("*").eq("organization_id", organizationId).is("archived_at", null).order("code"),
    supabase.from("unit_photos").select("*").eq("organization_id", organizationId).order("sort_order"),
    supabase.from("tenants").select("*").eq("organization_id", organizationId).is("archived_at", null).order("last_name"),
    supabase.from("leases").select("*").eq("organization_id", organizationId).order("created_at", { ascending: false }),
    supabase.from("lease_tenants").select("*").eq("organization_id", organizationId).is("left_at", null),
    supabase.from("rent_invoices").select("*").eq("organization_id", organizationId),
    supabase.from("payments").select("*").eq("organization_id", organizationId).order("paid_at", { ascending: false }),
    supabase.from("receipts").select("*").eq("organization_id", organizationId),
    supabase.from("documents").select("*").eq("organization_id", organizationId).not("lease_id", "is", null).order("created_at"),
  ]);
  for (const result of [propertyResult, unitResult, photoResult, tenantResult, leaseResult, partyResult, invoiceResult, paymentResult, receiptResult, documentResult]) {
    if (result.error) throw result.error;
  }

  const propertyRows = propertyResult.data ?? [];
  const unitRows = unitResult.data ?? [];
  const photoRows = photoResult.data ?? [];
  const tenantRows = tenantResult.data ?? [];
  const leaseRows = leaseResult.data ?? [];
  const partyRows = partyResult.data ?? [];
  const invoiceRows = invoiceResult.data ?? [];
  const paymentRows = paymentResult.data ?? [];
  const receiptRows = receiptResult.data ?? [];
  const documentRows = documentResult.data ?? [];
  const propertyById = new Map(propertyRows.map((row) => [row.id, row]));
  const unitById = new Map(unitRows.map((row) => [row.id, row]));
  const tenantById = new Map(tenantRows.map((row) => [row.id, row]));
  const leaseById = new Map(leaseRows.map((row) => [row.id, row]));
  const primaryPartyByLease = new Map(partyRows.filter((row) => row.is_primary).map((row) => [row.lease_id, row]));
  const activeLeaseByTenant = new Map(partyRows.map((party) => [party.tenant_id, leaseById.get(party.lease_id)]));
  const receiptByPayment = new Map(receiptRows.map((row) => [row.payment_id, row]));

  const signedPhotos = new Map<string, string>();
  await Promise.all(photoRows.map(async (photo) => {
    const { data } = await supabase.storage.from("property-images").createSignedUrl(photo.storage_path, 3600);
    if (data?.signedUrl) signedPhotos.set(photo.id, data.signedUrl);
  }));
  const signedDocuments = new Map<string, string>();
  await Promise.all(documentRows.map(async (document) => {
    const { data } = await supabase.storage.from(document.bucket_id).createSignedUrl(document.storage_path, 3600, { download: document.file_name });
    if (data?.signedUrl) signedDocuments.set(document.id, data.signedUrl);
  }));

  const properties: Property[] = propertyRows.map((row) => {
    const rows = unitRows.filter((unit) => unit.property_id === row.id);
    const occupied = rows.filter((unit) => unit.status === "occupied").length;
    const cover = photoRows.find((photo) => rows.some((unit) => unit.id === photo.unit_id) && photo.is_cover);
    return {
      id: row.id, name: row.name, type: row.property_type, city: [row.city, row.country].filter(Boolean).join(", "),
      address: row.address, units: rows.length, occupied, available: rows.filter((unit) => unit.status === "available").length,
      monthlyRevenue: rows.reduce((sum, unit) => sum + Number(unit.indicative_rent ?? 0), 0), currency: (rows[0]?.currency ?? "USD") as Currency,
      buildings: 0, floors: 0, status: propertyStatus(row.status), image: cover ? signedPhotos.get(cover.id) ?? "" : "", description: row.description ?? "",
    };
  });

  const units: Unit[] = unitRows.map((row) => {
    const photos = photoRows.filter((photo) => photo.unit_id === row.id);
    const coverPhoto = photos.find((photo) => photo.is_cover) ?? photos[0];
    const lease = leaseRows.find((item) => item.unit_id === row.id && item.status === "active");
    const party = lease ? primaryPartyByLease.get(lease.id) : undefined;
    const tenant = party ? tenantById.get(party.tenant_id) : undefined;
    return {
      id: row.id, code: row.code, type: row.unit_type, propertyId: row.property_id, propertyName: propertyById.get(row.property_id)?.name ?? "",
      building: "", floor: "", bedrooms: row.bedrooms, livingRooms: row.living_rooms, bathrooms: row.bathrooms, kitchens: row.kitchens,
      area: Number(row.area_square_meters ?? 0), rent: Number(row.indicative_rent ?? 0), currency: row.currency as Currency, status: unitStatus(row.status),
      tenant: tenant && lease ? { id: tenant.id, name: `${tenant.first_name} ${tenant.last_name}`, code: tenant.tenant_number, contractId: lease.id, contractStart: formatDate(lease.start_date), contractEnd: formatDate(lease.end_date) } : undefined,
      image: coverPhoto ? signedPhotos.get(coverPhoto.id) ?? "" : "",
      photos: photos.map((photo) => ({ src: signedPhotos.get(photo.id) ?? "", label: photo.room_label ?? photo.file_name })).filter((photo) => photo.src),
    };
  });

  const contracts: Contract[] = leaseRows.map((lease) => {
    const unit = unitById.get(lease.unit_id);
    const party = primaryPartyByLease.get(lease.id);
    const tenant = party ? tenantById.get(party.tenant_id) : undefined;
    const nextInvoice = invoiceRows.filter((invoice) => invoice.lease_id === lease.id && Number(invoice.balance ?? 0) > 0).toSorted((a, b) => a.due_date.localeCompare(b.due_date))[0];
    return {
      id: lease.id, reference: lease.lease_number, tenantId: tenant?.id ?? "", tenantName: tenant ? `${tenant.first_name} ${tenant.last_name}` : "—",
      unitId: lease.unit_id, unitLabel: unit ? `${unit.unit_type} ${unit.code}` : "—", propertyName: unit ? propertyById.get(unit.property_id)?.name ?? "" : "",
      startDate: formatDate(lease.start_date), endDate: formatDate(lease.end_date), rent: Number(lease.rent_amount), guarantee: Number(lease.guarantee_amount),
      currency: lease.currency as Currency, dueDay: lease.due_day, frequency: lease.frequency, status: contractStatus(lease.status, lease.end_date),
      signedAt: lease.activated_at ? formatDate(lease.activated_at) : undefined, nextDueDate: formatDate(nextInvoice?.due_date), noticePeriod: "—",
      documents: documentRows.filter((document) => document.lease_id === lease.id).map((document) => ({ id: document.id, name: document.file_name, type: document.mime_type, url: signedDocuments.get(document.id) })),
      clauses: lease.terms ? [lease.terms] : [],
    };
  });

  const tenants: Tenant[] = tenantRows.map((tenant) => {
    const lease = activeLeaseByTenant.get(tenant.id);
    const unit = lease ? unitById.get(lease.unit_id) : undefined;
    const invoices = lease ? invoiceRows.filter((invoice) => invoice.lease_id === lease.id) : [];
    const balance = invoices.reduce((sum, invoice) => sum + Number(invoice.balance ?? 0), 0);
    const nextInvoice = invoices.filter((invoice) => Number(invoice.balance ?? 0) > 0).toSorted((a, b) => a.due_date.localeCompare(b.due_date))[0];
    const tenantPayments = paymentRows.filter((payment) => payment.tenant_id === tenant.id);
    const status: TenantStatus = balance <= 0 ? "current" : nextInvoice && new Date(nextInvoice.due_date) < new Date() ? "late" : "partial";
    return {
      id: tenant.id, code: tenant.tenant_number, name: `${tenant.first_name} ${tenant.last_name}`, phone: tenant.phone, email: tenant.email ?? "",
      propertyId: unit?.property_id ?? "", propertyName: unit ? propertyById.get(unit.property_id)?.name ?? "" : "Sans logement",
      unitId: unit?.id ?? "", unitLabel: unit ? `${unit.unit_type} ${unit.code}` : "Non attribué", rent: Number(lease?.rent_amount ?? 0), currency: (lease?.currency ?? "USD") as Currency,
      nextDueDate: formatDate(nextInvoice?.due_date), balance, guarantee: Number(lease?.guarantee_amount ?? 0), status,
      contractStart: formatDate(lease?.start_date), contractEnd: formatDate(lease?.end_date), contractId: lease?.id ?? "",
      identityType: tenant.identity_document_type ?? "", identityNumber: tenant.identity_document_number ?? "", address: tenant.previous_address ?? "",
      emergencyContact: [tenant.emergency_contact_name, tenant.emergency_contact_phone].filter(Boolean).join(" · "),
      payments: tenantPayments.map((payment) => { const receipt = receiptByPayment.get(payment.id); return { id: payment.id, period: monthFormatter.format(new Date(payment.paid_at)), amount: Number(payment.amount), currency: payment.currency as Currency, paidAt: formatDate(payment.paid_at), receipt: receipt?.receipt_number ?? "—", receiptId: receipt?.id, status: payment.status === "completed" ? "paid" as const : "partial" as const }; }),
    };
  });

  const payments: Payment[] = paymentRows.map((payment) => {
    const tenant = tenantById.get(payment.tenant_id);
    const unit = unitById.get(payment.unit_id);
    const receipt = receiptByPayment.get(payment.id);
    const paidAt = new Date(payment.paid_at);
    return {
      id: payment.id, reference: payment.payment_number, receiptId: receipt?.id ?? payment.id, receiptNumber: receipt?.receipt_number ?? "Reçu en attente",
      tenantId: payment.tenant_id, tenantName: tenant ? `${tenant.first_name} ${tenant.last_name}` : "—", unitId: payment.unit_id,
      unitLabel: unit ? `${unit.unit_type} ${unit.code}` : "—", propertyName: unit ? propertyById.get(unit.property_id)?.name ?? "" : "",
      period: monthFormatter.format(paidAt), amount: Number(payment.amount), currency: payment.currency as Currency, mode: paymentMode(payment.method),
      date: formatDate(payment.paid_at), paidAtIso: payment.paid_at, time: paidAt.toLocaleTimeString("fr-CD", { hour: "2-digit", minute: "2-digit" }), status: paymentStatus(payment.status),
      agent: "AMIRANDA EMPIRE", balanceBefore: Number(receipt?.balance_after ?? 0) + Number(payment.amount), balanceAfter: Number(receipt?.balance_after ?? 0), allocations: [], note: payment.note ?? undefined,
    };
  });

  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const invoices: RentInvoice[] = invoiceRows.toSorted((a, b) => a.due_date.localeCompare(b.due_date)).map((invoice) => {
    const lease = leaseById.get(invoice.lease_id);
    const party = primaryPartyByLease.get(invoice.lease_id);
    const tenant = party ? tenantById.get(party.tenant_id) : undefined;
    const unit = lease ? unitById.get(lease.unit_id) : undefined;
    const dueUtc = Date.parse(`${invoice.due_date}T00:00:00Z`);
    return {
      id: invoice.id, reference: invoice.invoice_number, leaseId: invoice.lease_id,
      tenantId: tenant?.id ?? "", tenantName: tenant ? `${tenant.first_name} ${tenant.last_name}` : "—",
      unitId: unit?.id ?? "", unitLabel: unit ? `${unit.unit_type} ${unit.code}` : "—",
      propertyName: unit ? propertyById.get(unit.property_id)?.name ?? "" : "",
      period: `${formatDate(invoice.period_start)} – ${formatDate(invoice.period_end)}`,
      periodStart: invoice.period_start, periodEnd: invoice.period_end,
      dueDate: formatDate(invoice.due_date), dueDateIso: invoice.due_date,
      amountDue: Number(invoice.amount_due), amountPaid: Number(invoice.amount_paid), balance: Number(invoice.balance ?? 0),
      currency: invoice.currency as Currency, status: invoice.status,
      daysLate: Number(invoice.balance ?? 0) > 0 ? Math.max(0, Math.floor((todayUtc - dueUtc) / 86_400_000)) : 0,
    };
  });

  return { properties, units, tenants, contracts, payments, invoices };
}
