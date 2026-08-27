import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DashboardKpiCardProps = {
  label: string;
  value: string;
  helper: string;
  variation?: string;
  direction?: "up" | "down" | "neutral";
  icon: LucideIcon;
  tone?: "blue" | "green" | "amber" | "red" | "slate";
  priority?: boolean;
};

const tones = {
  blue: "bg-brand-blue/10 text-brand-blue",
  green: "bg-status-paid/10 text-status-paid",
  amber: "bg-status-due-soon/10 text-status-due-soon",
  red: "bg-status-arrears/10 text-status-arrears",
  slate: "bg-muted text-foreground",
} as const;

export function DashboardKpiCard({
  label,
  value,
  helper,
  variation,
  direction = "neutral",
  icon: Icon,
  tone = "blue",
  priority = false,
}: DashboardKpiCardProps) {
  const VariationIcon = direction === "down" ? ArrowDownRight : ArrowUpRight;

  return (
    <Card className={cn(
      "group transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-950/5",
      priority && "border-brand-blue/15 bg-linear-to-br from-card to-blue-50/55 dark:to-blue-950/15",
    )}>
      <CardContent>
        <div className="flex items-start justify-between gap-3">
          <div className={cn("grid size-9 place-items-center rounded-xl", tones[tone])}><Icon aria-hidden="true" className="size-4.5" /></div>
          {variation && (
            <span className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[0.68rem] font-semibold",
              direction === "up" ? "bg-status-paid/10 text-status-paid" : direction === "down" ? "bg-status-arrears/10 text-status-arrears" : "bg-muted text-muted-foreground",
            )}>
              {direction !== "neutral" && <VariationIcon aria-hidden="true" className="size-3" />}{variation}
            </span>
          )}
        </div>
        <p className="mt-4 text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 font-heading text-2xl leading-tight font-semibold tracking-[-0.035em] tabular-nums sm:text-[1.75rem]">{value}</p>
        <p className="mt-2 text-xs text-muted-foreground">{helper}</p>
      </CardContent>
    </Card>
  );
}
