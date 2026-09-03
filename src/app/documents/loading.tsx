import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function DocumentsLoading() {
  return <ProtectedAppShell><div className="space-y-6"><Skeleton className="h-20 w-full max-w-2xl" /><Skeleton className="h-20 w-full" /><div className="grid gap-6 xl:grid-cols-[1fr_360px]"><Skeleton className="h-96" /><Skeleton className="h-80" /></div></div></ProtectedAppShell>;
}
