import Link from "next/link";
import { CalendarDays, ChevronRight, House } from "lucide-react";

import { MoneyDisplay } from "@/components/shared/money-display";
import { TenantAvatar } from "@/components/shared/tenant-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type { Contract } from "./contract-data";
import { ContractStatusBadge } from "./contract-status-badge";

export function ContractCard({ contract, href }: { contract: Contract; href: string }) {
  return <Card><CardContent className="p-4"><div className="flex items-start gap-3"><TenantAvatar name={contract.tenantName} /><div className="min-w-0 flex-1"><Link className="font-semibold hover:text-brand-blue" href={href}>{contract.reference}</Link><p className="mt-0.5 text-xs text-muted-foreground">{contract.tenantName}</p></div><ContractStatusBadge status={contract.status} /></div><div className="mt-4 space-y-2 rounded-xl bg-muted/45 p-3 text-sm"><p className="flex items-center gap-2"><House className="size-4 text-muted-foreground" />{contract.unitLabel} · {contract.propertyName}</p><p className="flex items-center gap-2 text-muted-foreground"><CalendarDays className="size-4" />{contract.startDate} → {contract.endDate}</p></div><div className="mt-4 flex items-end justify-between"><div><p className="text-xs text-muted-foreground">Loyer mensuel</p><MoneyDisplay amount={contract.rent} className="mt-0.5 font-semibold" currency={contract.currency} /></div><Button asChild size="sm" variant="outline"><Link href={href}>Voir <ChevronRight /></Link></Button></div></CardContent></Card>;
}
