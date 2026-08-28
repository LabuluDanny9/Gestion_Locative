"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireUser } from "@/features/auth/server";
import {
  createLease, createProperty, createTenant, createUnit, getActiveOrganization, recordPayment,
} from "@/services/rental-backend";

const text = z.string().trim().min(1);
const uuid = z.string().uuid();
const money = z.coerce.number().positive();
const optionalText = z.string().trim().optional();

async function context() {
  const { supabase, user } = await requireUser();
  const membership = await getActiveOrganization(supabase, user.id);
  return { supabase, user, organizationId: membership.organization_id };
}

function value(form: FormData, key: string) {
  return String(form.get(key) ?? "");
}

function finish(path: string, entity: string) {
  revalidatePath(path);
  revalidatePath("/espace");
  redirect(`${path}?creation=${encodeURIComponent(entity)}`);
}

function fail(path: string, cause: unknown): never {
  console.error(`Échec de l’action ${path}`, cause);
  let message = "Une erreur inattendue est survenue. Réessayez.";
  if (cause instanceof z.ZodError) message = "Vérifiez les champs obligatoires et leur format.";
  else if (cause instanceof Error && cause.message.includes("Photo invalide")) message = cause.message;
  else if (cause instanceof Error && cause.message.includes("Document invalide")) message = cause.message;
  else if (cause instanceof Error && /duplicate|unique/i.test(cause.message)) message = "Une donnée avec la même référence existe déjà.";
  else if (cause instanceof Error && /permission|42501/i.test(cause.message)) message = "Votre compte ne possède pas l’autorisation requise.";
  redirect(`${path}?erreur=${encodeURIComponent(message)}`);
}

export async function createPropertyAction(form: FormData) {
  try {
  const parsed = z.object({
    name: text, code: optionalText,
    propertyType: z.enum(["building", "plot", "residence", "house", "villa", "residential_complex", "commercial", "other"]),
    description: optionalText, address: text, city: text, country: text,
  }).parse({
    name: value(form, "name"), code: value(form, "code"), propertyType: value(form, "propertyType"),
    description: value(form, "description"), address: value(form, "address"), city: value(form, "city"), country: value(form, "country"),
  });
  const { supabase, organizationId } = await context();
  await createProperty(supabase, organizationId, {
    ...parsed, code: parsed.code || `PROP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
  });
  } catch (cause) { fail("/proprietes/nouvelle", cause); }
  finish("/proprietes", "propriete");
}

export async function createUnitAction(form: FormData) {
  try {
  const parsed = z.object({
    propertyId: uuid, code: text,
    unitType: z.enum(["apartment", "studio", "house", "room", "office", "shop", "warehouse", "other"]),
    bedrooms: z.coerce.number().int().nonnegative(), livingRooms: z.coerce.number().int().nonnegative(),
    bathrooms: z.coerce.number().int().nonnegative(), kitchens: z.coerce.number().int().nonnegative(),
    area: z.coerce.number().nonnegative().optional(), rent: money, currency: z.enum(["USD", "CDF"]),
    status: z.enum(["available", "reserved", "maintenance"]),
  }).parse({
    propertyId: value(form, "propertyId"), code: value(form, "code"), unitType: value(form, "unitType"),
    bedrooms: value(form, "bedrooms"), livingRooms: value(form, "livingRooms"), bathrooms: value(form, "bathrooms"),
    kitchens: value(form, "kitchens"), area: value(form, "area") || undefined, rent: value(form, "rent"),
    currency: value(form, "currency"), status: value(form, "status"),
  });
  const photos = form.getAll("photos").filter((item): item is File => item instanceof File && item.size > 0).slice(0, 12);
  const { supabase, user, organizationId } = await context();
  await createUnit(supabase, user.id, organizationId, { ...parsed, photos });
  } catch (cause) { fail("/logements/nouveau", cause); }
  finish("/logements", "logement");
}

export async function createTenantAction(form: FormData) {
  try {
  const fullName = text.parse(value(form, "name")).split(/\s+/);
  const parsed = z.object({
    phone: text, email: z.string().trim().email().optional(), identityNumber: optionalText,
    previousAddress: optionalText, emergencyName: optionalText, emergencyPhone: optionalText,
  }).parse({
    phone: value(form, "phone"), email: value(form, "email") || undefined,
    identityNumber: value(form, "identityNumber"), previousAddress: value(form, "address"),
    emergencyName: value(form, "emergencyName"), emergencyPhone: value(form, "emergencyPhone"),
  });
  const identityMap: Record<string, "passport" | "voter_card" | "driving_license" | "other"> = {
    Passeport: "passport", "Carte d’électeur": "voter_card", "Permis de conduire": "driving_license", Autre: "other",
  };
  const documents = form.getAll("documents").filter((item): item is File => item instanceof File && item.size > 0);
  const { supabase, user, organizationId } = await context();
  const firstName = fullName[0]!;
  await createTenant(supabase, user.id, organizationId, {
    ...parsed, firstName, lastName: fullName.slice(1).join(" ") || firstName,
    identityType: identityMap[value(form, "identityType")] ?? "other",
    documents,
  });
  } catch (cause) { fail("/locataires/nouveau", cause); }
  finish("/locataires", "locataire");
}

export async function createLeaseAction(form: FormData) {
  try {
  const frequencyMap: Record<string, "monthly" | "quarterly" | "semiannual" | "annual"> = {
    Mensuel: "monthly", Trimestriel: "quarterly", Semestriel: "semiannual", Annuel: "annual",
  };
  const parsed = z.object({
    tenantId: uuid, unitId: uuid, startDate: z.iso.date(), endDate: z.iso.date(), rent: money,
    currency: z.enum(["USD", "CDF"]), guarantee: z.coerce.number().nonnegative(),
    dueDay: z.coerce.number().int().min(1).max(28), terms: optionalText,
  }).parse({
    tenantId: value(form, "tenant"), unitId: value(form, "unit"), startDate: value(form, "startDate"),
    endDate: value(form, "endDate"), rent: value(form, "rent"), currency: value(form, "currency"),
    guarantee: value(form, "guarantee"), dueDay: value(form, "dueDay"), terms: value(form, "clauses"),
  });
  const { supabase, organizationId } = await context();
  await createLease(supabase, organizationId, { ...parsed, frequency: frequencyMap[value(form, "frequency")] ?? "monthly" });
  } catch (cause) { fail("/contrats/nouveau", cause); }
  finish("/contrats", "contrat");
}

export async function recordPaymentAction(form: FormData) {
  try {
  const parsed = z.object({
    tenantId: uuid, leaseId: uuid, amount: money, currency: z.enum(["USD", "CDF"]),
    paidAt: z.iso.datetime(), method: z.enum(["cash", "mobile_money", "bank_transfer", "bank_deposit", "other"]),
    reference: optionalText, note: optionalText, idempotencyKey: uuid,
  }).parse({
    tenantId: value(form, "tenantId"), leaseId: value(form, "leaseId"), amount: value(form, "amount"),
    currency: value(form, "currency"), paidAt: value(form, "paidAt"), method: value(form, "method"),
    reference: value(form, "reference"), note: value(form, "note"), idempotencyKey: value(form, "idempotencyKey"),
  });
  const { supabase, organizationId } = await context();
  await recordPayment(supabase, organizationId, parsed);
  } catch (cause) { fail("/paiements/nouveau", cause); }
  finish("/paiements", "paiement");
}
