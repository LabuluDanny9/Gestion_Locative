import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function FilterBar({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-xs lg:flex-row lg:items-center", className)}>{children}</div>;
}
