import { Skeleton } from "@/components/ui/skeleton";

export function PropertyCollectionSkeleton() {
  return <div aria-label="Chargement du parc immobilier" className="space-y-6" role="status"><div className="space-y-3"><Skeleton className="h-4 w-44" /><Skeleton className="h-9 w-64" /><Skeleton className="h-4 w-96 max-w-full" /></div><div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton className="h-24 rounded-xl" key={index} />)}</div><Skeleton className="h-16 rounded-xl" /><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <Skeleton className="h-96 rounded-xl" key={index} />)}</div></div>;
}
