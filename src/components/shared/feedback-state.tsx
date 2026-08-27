"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function ErrorState({
  title = "Impossible de charger les données",
  description = "Réessayez dans quelques instants.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/4 px-6 text-center">
      <span className="grid size-10 place-items-center rounded-xl bg-destructive/10 text-destructive"><AlertTriangle className="size-5" /></span>
      <h3 className="mt-4 font-heading font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      <Button className="mt-4" disabled={!onRetry} onClick={onRetry} size="sm" variant="outline"><RefreshCw />Réessayer</Button>
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div aria-label="Chargement" className="space-y-4 rounded-xl border bg-card p-5" role="status">
      <div className="flex items-center gap-3"><Skeleton className="size-10 rounded-xl" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-3 w-2/3" /></div></div>
      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
  );
}
