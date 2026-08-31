import { AppShell } from "@/components/layout/app-shell";

export function AccountShell({
  children,
  email,
  displayName,
  unreadNotifications = 0,
}: {
  children: React.ReactNode;
  email?: string;
  displayName?: string;
  unreadNotifications?: number;
}) {
  return <AppShell displayName={displayName} email={email} unreadNotifications={unreadNotifications}>{children}</AppShell>;
}
