import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const rentalStatuses = {
  upcoming: {
    label: "À venir",
    icon: Clock3,
    className: "border-status-upcoming/25 bg-status-upcoming/10 text-status-upcoming",
  },
  dueSoon: {
    label: "Bientôt dû",
    icon: Timer,
    className: "border-status-due-soon/25 bg-status-due-soon/10 text-status-due-soon",
  },
  paid: {
    label: "Payé",
    icon: CheckCircle2,
    className: "border-status-paid/25 bg-status-paid/10 text-status-paid",
  },
  partial: {
    label: "Partiel",
    icon: CircleDollarSign,
    className: "border-status-partial/25 bg-status-partial/10 text-status-partial",
  },
  late: {
    label: "En retard",
    icon: AlertCircle,
    className: "border-status-late/25 bg-status-late/10 text-status-late",
  },
  arrears: {
    label: "Impayé",
    icon: XCircle,
    className: "border-status-arrears/25 bg-status-arrears/10 text-status-arrears",
  },
} as const;

export type RentalStatus = keyof typeof rentalStatuses;

type RentalStatusBadgeProps = {
  status: RentalStatus;
  className?: string;
};

export function RentalStatusBadge({ status, className }: RentalStatusBadgeProps) {
  const config = rentalStatuses[status];
  const Icon = config.icon;

  return (
    <Badge
      className={cn("rounded-full font-medium", config.className, className)}
      data-status={status}
      variant="outline"
    >
      <Icon aria-hidden="true" />
      {config.label}
    </Badge>
  );
}
import { AlertCircle, CheckCircle2, CircleDollarSign, Clock3, Timer, XCircle } from "lucide-react";
