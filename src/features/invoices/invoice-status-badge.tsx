import { AlertCircle, CheckCircle2, CircleDollarSign, Clock3, Timer, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { InvoiceStatus } from "./invoice-data";

const states: Record<InvoiceStatus, { label: string; icon: typeof Clock3; className: string }> = {
  upcoming: { label: "À venir", icon: Clock3, className: "border-status-upcoming/25 bg-status-upcoming/10 text-status-upcoming" },
  due_soon: { label: "Bientôt dû", icon: Timer, className: "border-status-due-soon/25 bg-status-due-soon/10 text-status-due-soon" },
  due_today: { label: "Échéance aujourd’hui", icon: Timer, className: "border-status-due-soon/25 bg-status-due-soon/10 text-status-due-soon" },
  partial: { label: "Paiement partiel", icon: CircleDollarSign, className: "border-status-partial/25 bg-status-partial/10 text-status-partial" },
  paid: { label: "Payé", icon: CheckCircle2, className: "border-status-paid/25 bg-status-paid/10 text-status-paid" },
  late: { label: "En retard", icon: AlertCircle, className: "border-status-late/25 bg-status-late/10 text-status-late" },
  unpaid: { label: "Non payé", icon: XCircle, className: "border-status-arrears/25 bg-status-arrears/10 text-status-arrears" },
  arrears: { label: "Arriéré", icon: XCircle, className: "border-status-arrears/25 bg-status-arrears/10 text-status-arrears" },
};

export function InvoiceStatusBadge({ status, className }: { status: InvoiceStatus; className?: string }) {
  const state = states[status];
  const Icon = state.icon;
  return <Badge className={cn("rounded-full font-medium", state.className, className)} variant="outline"><Icon />{state.label}</Badge>;
}
