import type { LucideIcon } from "lucide-react";
import { Banknote, CheckCircle2, CircleDollarSign, CreditCard, Landmark, Smartphone, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { PaymentMode, PaymentStatus } from "./payment-data";

export const paymentModes: Record<PaymentMode, { label: string; icon: LucideIcon }> = {
  cash: { label: "Espèces", icon: Banknote },
  mobile: { label: "Mobile Money", icon: Smartphone },
  bank: { label: "Banque", icon: Landmark },
  card: { label: "Carte", icon: CreditCard },
};

const paymentStatuses = {
  paid: { label: "Payé", icon: CheckCircle2, className: "border-status-paid/25 bg-status-paid/10 text-status-paid" },
  partial: { label: "Partiel", icon: CircleDollarSign, className: "border-status-partial/25 bg-status-partial/10 text-status-partial" },
  cancelled: { label: "Annulé", icon: XCircle, className: "border-status-arrears/25 bg-status-arrears/10 text-status-arrears" },
} as const;

export function PaymentStatusBadge({ status, className }: { status: PaymentStatus; className?: string }) {
  const config = paymentStatuses[status];
  const Icon = config.icon;
  return <Badge className={cn("rounded-full font-medium", config.className, className)} variant="outline"><Icon />{config.label}</Badge>;
}

export function PaymentModeBadge({ mode }: { mode: PaymentMode }) {
  const config = paymentModes[mode];
  const Icon = config.icon;
  return <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm"><Icon className="size-3.5 text-muted-foreground" />{config.label}</span>;
}
