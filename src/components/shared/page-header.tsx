import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({ eyebrow, title, description, actions, className }: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col justify-between gap-5 sm:flex-row sm:items-end", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-blue">
            {eyebrow}
          </p>
        )}
        <h1 className="font-heading text-[1.75rem] leading-tight font-semibold tracking-[-0.025em] sm:text-[2rem]">
          {title}
        </h1>
        {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
