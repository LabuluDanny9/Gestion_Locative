import { AccountShell } from "./account-shell";
import { requireUser } from "./server";

export async function ProtectedAppShell({ children }: { children: React.ReactNode }) {
  const { supabase, user } = await requireUser();
  const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle();
  return <AccountShell displayName={profile?.display_name ?? undefined} email={user.email}>{children}</AccountShell>;
}
