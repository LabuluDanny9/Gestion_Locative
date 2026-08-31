"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireUser } from "@/features/auth/server";
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
