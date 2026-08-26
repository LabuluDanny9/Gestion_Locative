import { Building2 } from "lucide-react";

import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  compact?: boolean;
};

export function BrandMark({ className, compact = false }: BrandMarkProps) {
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20">
        <Building2 aria-hidden="true" className="size-5" strokeWidth={2.2} />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-heading text-sm font-semibold tracking-tight">
            Gestion locative
          </span>
          <span className="mt-1 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Patrimoine maîtrisé
          </span>
        </span>
      )}
    </div>
  );
}
