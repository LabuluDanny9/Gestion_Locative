import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  helper?: string;
  icon: LucideIcon;
  tone?: "blue" | "green" | "amber" | "red" | "neutral";
};

const tones = {
  blue: "bg-brand-blue/10 text-brand-blue",
  green: "bg-status-paid/10 text-status-paid",
  amber: "bg-status-due-soon/10 text-status-due-soon",
  red: "bg-status-arrears/10 text-status-arrears",
  neutral: "bg-muted text-muted-foreground",
} as const;

export function StatCard({ label, value, helper, icon: Icon, tone = "blue" }: StatCardProps) {
  return (
    <Card className="shadow-sm shadow-slate-950/3">
      <CardContent className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 font-heading text-3xl font-semibold tracking-[-0.03em] tabular-nums">{value}</p>
          {helper && <p className="mt-2 text-xs text-muted-foreground">{helper}</p>}
        </div>
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", tones[tone])}>
          <Icon aria-hidden="true" className="size-5" />
        </span>
      </CardContent>
    </Card>
  );
}
