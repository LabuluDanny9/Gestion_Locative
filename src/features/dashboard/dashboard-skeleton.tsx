import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div aria-label="Chargement du tableau de bord" className="space-y-8" role="status">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div className="space-y-3"><Skeleton className="h-5 w-36" /><Skeleton className="h-9 w-56" /><Skeleton className="h-4 w-80 max-w-full" /></div>
        <Skeleton className="h-11 w-72 max-w-full" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 6 }, (_, index) => <Skeleton className="h-44 rounded-xl" key={index} />)}
      </div>
      <div className="hidden gap-5 lg:grid lg:grid-cols-12"><Skeleton className="h-96 rounded-xl lg:col-span-7" /><Skeleton className="h-96 rounded-xl lg:col-span-5" /></div>
      <div className="grid gap-5 xl:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <Skeleton className="h-80 rounded-xl" key={index} />)}</div>
    </div>
  );
}
