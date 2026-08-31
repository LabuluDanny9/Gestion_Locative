import type { Metadata } from "next";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { requireUser } from "@/features/auth/server";
import { NotificationCenter, type NotificationListParams } from "@/features/notifications/notification-center";
import { getActiveOrganization } from "@/services/rental-backend";

export const metadata: Metadata = { title: "Notifications" };
export const dynamic = "force-dynamic";

export default async function NotificationsPage({ searchParams }: { searchParams: Promise<NotificationListParams> }) {
  const params = await searchParams;
  const { supabase, user } = await requireUser();
  const membership = await getActiveOrganization(supabase, user.id);
  const { data, error } = await supabase.from("notifications").select("*")
    .eq("organization_id", membership.organization_id).order("created_at", { ascending: false }).limit(200);
  if (error) throw new Error("Impossible de charger les notifications.");
  return <ProtectedAppShell><NotificationCenter notifications={data ?? []} params={params} /></ProtectedAppShell>;
}
