import { CircleMinus, House, HousePlus, Wrench } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { PropertyStatus, UnitStatus } from "./property-data";

const propertyStatuses = {
  active: { label: "Actif", icon: HousePlus, className: "border-status-paid/25 bg-status-paid/10 text-status-paid" },
  maintenance: { label: "Maintenance", icon: Wrench, className: "border-status-due-soon/25 bg-status-due-soon/10 text-status-due-soon" },
  inactive: { label: "Inactif", icon: CircleMinus, className: "border-border bg-muted text-muted-foreground" },
} as const;

const unitStatuses = {
  occupied: { label: "Occupé", icon: House, className: "border-brand-blue/25 bg-brand-blue/10 text-brand-blue" },
  available: { label: "Libre", icon: HousePlus, className: "border-status-paid/25 bg-status-paid/10 text-status-paid" },
  maintenance: { label: "Maintenance", icon: Wrench, className: "border-status-due-soon/25 bg-status-due-soon/10 text-status-due-soon" },
  reserved: { label: "Réservé", icon: House, className: "border-brand-gold/30 bg-brand-gold/10 text-amber-700 dark:text-amber-300" },
} as const;

function StatusBadge({ config, className }: { config: { label: string; icon: typeof House; className: string }; className?: string }) {
  const Icon = config.icon;
  return <Badge className={cn("rounded-full", config.className, className)} variant="outline"><Icon />{config.label}</Badge>;
}

export function PropertyStatusBadge({ status, className }: { status: PropertyStatus; className?: string }) {
  return <StatusBadge className={className} config={propertyStatuses[status]} />;
}

export function UnitStatusBadge({ status, className }: { status: UnitStatus; className?: string }) {
  return <StatusBadge className={className} config={unitStatuses[status]} />;
}
