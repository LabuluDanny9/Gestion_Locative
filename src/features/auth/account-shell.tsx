import { AppShell } from "@/components/layout/app-shell";

export function AccountShell({
  children,
  email,
  displayName,
}: {
  children: React.ReactNode;
  email?: string;
  displayName?: string;
}) {
  return <AppShell displayName={displayName} email={email}>{children}</AppShell>;
}
