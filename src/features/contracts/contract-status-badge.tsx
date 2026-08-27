import { CheckCircle2, Clock3, FileClock, FilePenLine } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { ContractStatus } from "./contract-data";

const statuses = {
  active: { label: "Actif", icon: CheckCircle2, className: "border-status-paid/25 bg-status-paid/10 text-status-paid" },
  expiring: { label: "Expire bientôt", icon: Clock3, className: "border-status-due-soon/25 bg-status-due-soon/10 text-status-due-soon" },
  draft: { label: "Brouillon", icon: FilePenLine, className: "border-status-upcoming/25 bg-status-upcoming/10 text-status-upcoming" },
  expired: { label: "Expiré", icon: FileClock, className: "border-status-arrears/25 bg-status-arrears/10 text-status-arrears" },
} as const;

export function ContractStatusBadge({ status, className }: { status: ContractStatus; className?: string }) {
  const config = statuses[status];
  const Icon = config.icon;
  return <Badge className={cn("rounded-full font-medium", config.className, className)} variant="outline"><Icon aria-hidden="true" />{config.label}</Badge>;
}
