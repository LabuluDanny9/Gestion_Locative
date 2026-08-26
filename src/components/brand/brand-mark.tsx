import { Building2 } from "lucide-react";

import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  compact?: boolean;
  inverse?: boolean;
};

export function BrandMark({ className, compact = false, inverse = false }: BrandMarkProps) {
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <span className={cn(
        "grid size-10 shrink-0 place-items-center rounded-xl text-primary-foreground shadow-sm",
        inverse ? "bg-brand-blue shadow-black/20" : "bg-primary shadow-primary/20",
      )}>
        <Building2 aria-hidden="true" className="size-5" strokeWidth={2.2} />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className={cn("font-heading text-sm font-semibold tracking-tight", inverse && "text-white")}>
            Gestion locative
          </span>
          <span className={cn(
            "mt-1 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-muted-foreground",
            inverse && "text-slate-400",
          )}>
            Patrimoine maîtrisé
          </span>
        </span>
      )}
    </div>
  );
}
