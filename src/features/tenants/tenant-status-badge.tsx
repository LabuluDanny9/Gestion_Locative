import { AlertCircle, CheckCircle2, CircleDollarSign, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { TenantStatus } from "./tenant-data";

const statuses = {
  current: { label: "À jour", icon: CheckCircle2, className: "border-status-paid/25 bg-status-paid/10 text-status-paid" },
  partial: { label: "Paiement partiel", icon: CircleDollarSign, className: "border-status-partial/25 bg-status-partial/10 text-status-partial" },
  late: { label: "En retard", icon: AlertCircle, className: "border-status-late/25 bg-status-late/10 text-status-late" },
  arrears: { label: "Arriérés", icon: XCircle, className: "border-status-arrears/25 bg-status-arrears/10 text-status-arrears" },
} as const;

export function TenantStatusBadge({ status, className }: { status: TenantStatus; className?: string }) {
  const config = statuses[status];
  const Icon = config.icon;
  return <Badge className={cn("rounded-full font-medium", config.className, className)} variant="outline"><Icon aria-hidden="true" />{config.label}</Badge>;
}
