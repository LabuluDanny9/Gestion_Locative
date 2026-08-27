import Link from "next/link";
import { CalendarClock, ChevronRight, House, Phone } from "lucide-react";

import { MoneyDisplay } from "@/components/shared/money-display";
import { TenantAvatar } from "@/components/shared/tenant-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type { Tenant } from "./tenant-data";
import { TenantStatusBadge } from "./tenant-status-badge";

export function TenantCard({ tenant, href }: { tenant: Tenant; href: string }) {
  return (
    <Card className="transition-[border-color,box-shadow] duration-200 hover:border-brand-blue/30 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <TenantAvatar name={tenant.name} />
          <div className="min-w-0 flex-1">
            <Link className="font-semibold hover:text-brand-blue" href={href}>{tenant.name}</Link>
            <p className="mt-0.5 text-xs text-muted-foreground">{tenant.code}</p>
          </div>
          <TenantStatusBadge className="shrink-0" status={tenant.status} />
        </div>
        <div className="mt-4 grid gap-2 rounded-xl bg-muted/45 p-3 text-sm">
          <p className="flex items-center gap-2"><House aria-hidden="true" className="size-4 text-muted-foreground" /><span className="truncate">{tenant.unitLabel} · {tenant.propertyName}</span></p>
          <a className="flex items-center gap-2 text-muted-foreground hover:text-foreground" href={`tel:${tenant.phone.replace(/\s/g, "")}`}><Phone aria-hidden="true" className="size-4" />{tenant.phone}</a>
          <p className="flex items-center gap-2 text-muted-foreground"><CalendarClock aria-hidden="true" className="size-4" />Échéance : {tenant.nextDueDate}</p>
        </div>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div><p className="text-xs text-muted-foreground">Loyer mensuel</p><MoneyDisplay amount={tenant.rent} className="mt-0.5 font-semibold" currency={tenant.currency} /></div>
          <Button asChild size="sm" variant="outline"><Link href={href}>Voir <ChevronRight aria-hidden="true" /></Link></Button>
        </div>
      </CardContent>
    </Card>
  );
}
