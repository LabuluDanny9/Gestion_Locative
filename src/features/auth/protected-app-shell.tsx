import { AccountShell } from "./account-shell";
import { requireUser } from "./server";
import { getActiveOrganization } from "@/services/rental-backend";

export async function ProtectedAppShell({ children }: { children: React.ReactNode }) {
  const { supabase, user } = await requireUser();
  const profilePromise = supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle();
  const membership = await getActiveOrganization(supabase, user.id);
  const [{ data: profile }, { count }] = await Promise.all([
    profilePromise,
    supabase.from("notifications").select("id", { count: "exact", head: true })
      .eq("organization_id", membership.organization_id).is("read_at", null),
  ]);
  return <AccountShell displayName={profile?.display_name ?? undefined} email={user.email} unreadNotifications={count ?? 0}>{children}</AccountShell>;
}
