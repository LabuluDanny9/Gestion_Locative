import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 py-10 text-center",
        className,
      )}
    >
      <span className="mb-4 grid size-11 place-items-center rounded-xl border bg-background text-primary shadow-sm">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <h3 className="font-heading text-base font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
