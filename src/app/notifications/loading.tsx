import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsLoading() {
  return <div className="space-y-6"><Skeleton className="h-20 w-full" /><div className="grid gap-3 sm:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <Skeleton className="h-24" key={index} />)}</div><Skeleton className="h-14 w-full" /><Skeleton className="h-36 w-full" /></div>;
}
