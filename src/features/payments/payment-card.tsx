import Link from "next/link";
import { CalendarDays, ChevronRight, House } from "lucide-react";

import { MoneyDisplay } from "@/components/shared/money-display";
import { TenantAvatar } from "@/components/shared/tenant-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { PaymentModeBadge, PaymentStatusBadge } from "./payment-badges";
import type { Payment } from "./payment-data";

export function PaymentCard({ payment, href, kind = "payment" }: { payment: Payment; href: string; kind?: "payment" | "receipt" }) {
  return <Card><CardContent className="p-4"><div className="flex items-start gap-3"><TenantAvatar name={payment.tenantName} /><div className="min-w-0 flex-1"><Link className="font-semibold hover:text-brand-blue" href={href}>{payment.tenantName}</Link><p className="mt-0.5 text-xs text-muted-foreground">{kind === "receipt" ? payment.receiptNumber : payment.reference}</p></div><PaymentStatusBadge status={payment.status} /></div><div className="mt-4 grid gap-2 rounded-xl bg-muted/45 p-3 text-sm"><p className="flex items-center gap-2"><House className="size-4 text-muted-foreground" />{payment.unitLabel} · {payment.propertyName}</p><p className="flex items-center gap-2 text-muted-foreground"><CalendarDays className="size-4" />{payment.period} · {payment.date}</p><PaymentModeBadge mode={payment.mode} /></div><div className="mt-4 flex items-end justify-between"><MoneyDisplay amount={payment.amount} className="font-heading text-xl font-semibold" currency={payment.currency} /><Button asChild size="sm" variant="outline"><Link href={href}>Détail <ChevronRight /></Link></Button></div></CardContent></Card>;
}
