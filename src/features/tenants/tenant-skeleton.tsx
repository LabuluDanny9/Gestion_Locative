import { Skeleton } from "@/components/ui/skeleton";

export function TenantCollectionSkeleton() {
  return <div aria-label="Chargement des locataires" className="space-y-6" role="status"><div className="space-y-3"><Skeleton className="h-4 w-44" /><Skeleton className="h-9 w-56" /><Skeleton className="h-4 w-96 max-w-full" /></div><div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton className="h-24 rounded-xl" key={index} />)}</div><Skeleton className="h-16 rounded-xl" /><div className="grid gap-4 lg:hidden">{Array.from({ length: 4 }, (_, index) => <Skeleton className="h-64 rounded-xl" key={index} />)}</div><Skeleton className="hidden h-96 rounded-xl lg:block" /></div>;
}
