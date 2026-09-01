"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireUser } from "@/features/auth/server";
import { mutationMessage } from "@/features/backend/mutation-errors";
import { sendTenantMessage } from "@/services/notifications/tenant-message";
import { getActiveOrganization } from "@/services/rental-backend";

async function notificationContext() {
  const { supabase, user } = await requireUser();
  const membership = await getActiveOrganization(supabase, user.id);
  return { supabase, organizationId: membership.organization_id };
}

export async function markNotificationReadAction(formData: FormData) {
  const id = z.string().uuid().parse(formData.get("notificationId"));
  const { supabase, organizationId } = await notificationContext();
  const { error } = await supabase.from("notifications").update({ read_at: new Date().toISOString() })
    .eq("id", id).eq("organization_id", organizationId).is("read_at", null);
  if (error) throw new Error("Impossible de marquer cette notification comme lue.");
  revalidatePath("/notifications");
}

export async function markAllNotificationsReadAction() {
  const { supabase, organizationId } = await notificationContext();
  const { error } = await supabase.from("notifications").update({ read_at: new Date().toISOString() })
    .eq("organization_id", organizationId).is("read_at", null);
  if (error) throw new Error("Impossible de marquer les notifications comme lues.");
  revalidatePath("/notifications");
}

export async function sendTenantMessageAction(formData: FormData) {
  const rawTenantId = String(formData.get("tenantId") ?? "");
  const path = `/locataires/${encodeURIComponent(rawTenantId)}`;
  try {
    const parsed = z.object({
      tenantId: z.string().uuid(),
      channel: z.enum(["sms", "whatsapp"]),
      body: z.string().trim().min(2).max(500),
    }).parse({
      tenantId: rawTenantId,
      channel: formData.get("channel"),
      body: formData.get("body"),
    });
    const { supabase, organizationId } = await notificationContext();
    await sendTenantMessage(supabase, organizationId, parsed);
  } catch (cause) {
    console.error("Échec de l’envoi manuel au locataire", cause);
    redirect(`${path}?erreur=${encodeURIComponent(mutationMessage(cause))}`);
  }
  revalidatePath(path);
  revalidatePath("/notifications");
  redirect(`${path}?message=envoye`);
}
