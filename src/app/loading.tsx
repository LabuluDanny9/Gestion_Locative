import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-10 sm:px-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="size-9 rounded-lg" />
      </div>
      <div className="mt-20 max-w-3xl space-y-4">
        <Skeleton className="h-6 w-36 rounded-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-4/5" />
        <Skeleton className="h-5 w-3/5" />
      </div>
      <div className="mt-16 grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton className="h-48 rounded-xl" key={index} />
        ))}
      </div>
    </main>
  );
}
