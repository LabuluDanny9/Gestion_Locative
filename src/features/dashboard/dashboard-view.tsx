import {
  BadgeAlert,
  Building,
  CalendarClock,
  ChartNoAxesColumnIncreasing,
  CircleCheckBig,
  CircleDollarSign,
  House,
  MessageSquareText,
  Plus,
  TriangleAlert,
  Wallet,
} from "lucide-react";
import Link from "next/link";

import { MoneyDisplay } from "@/components/shared/money-display";
import { EmptyState } from "@/components/shared/empty-state";
import { RentalStatusBadge } from "@/components/shared/rental-status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { DashboardChartSection } from "./dashboard-chart-section";
import { dashboardPeriodLabels, getDashboardData, type DashboardPeriod } from "./dashboard-data";
import { DashboardKpiCard } from "./dashboard-kpi-card";
import { PeriodFilter } from "./period-filter";

type DashboardViewProps = {
  displayName?: string;
  period: DashboardPeriod;
  basePath: string;
  startDate?: string;
  endDate?: string;
  paymentBasePath: string;
};

function formatAmount(amount: number, maximumFractionDigits = 0) {
  return `${new Intl.NumberFormat("fr-CD", { maximumFractionDigits }).format(amount)}\u00A0USD`;
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function ListHeader({ title, description, icon: Icon }: { title: string; description: string; icon: typeof CalendarClock }) {
  return (
    <CardHeader className="border-b pb-4">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-muted text-foreground"><Icon aria-hidden="true" className="size-4.5" /></span>
        <div><CardTitle>{title}</CardTitle><CardDescription className="mt-1">{description}</CardDescription></div>
      </div>
    </CardHeader>
  );
}

export function DashboardView({ displayName, period, basePath, paymentBasePath, startDate, endDate }: DashboardViewProps) {
  const data = getDashboardData(period);
  const firstName = displayName?.trim().split(" ")[0];
  const periodHelper = period === "custom" && startDate && endDate
    ? `${startDate.split("-").reverse().join("/")} — ${endDate.split("-").reverse().join("/")}`
    : dashboardPeriodLabels[period];

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge className="border-brand-gold/25 bg-brand-gold/10 text-amber-800 dark:text-amber-300" variant="outline">Aperçu frontend</Badge>
            <span className="text-xs text-muted-foreground">Données de démonstration · {periodHelper}</span>
          </div>
          <h1 className="font-heading text-[1.75rem] leading-tight font-semibold tracking-[-0.025em] sm:text-[2rem]">
            <span className="md:hidden">Bonjour{firstName ? ` ${firstName}` : ""}</span>
            <span className="hidden md:inline">Tableau de bord</span>
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">Vue d’ensemble de votre activité locative.</p>
        </div>
        <PeriodFilter basePath={basePath} endDate={endDate} period={period} startDate={startDate} />
      </header>

      <section aria-label="Indicateurs prioritaires mobiles" className="grid grid-cols-2 gap-3 md:hidden">
        <DashboardKpiCard helper="Encaissement du mois" icon={CircleDollarSign} label="Encaissé" priority tone="green" value={formatAmount(data.kpis.collected)} />
        <DashboardKpiCard helper="À recouvrer" icon={TriangleAlert} label="Arriérés" priority tone="red" value={formatAmount(data.kpis.arrears)} />
        <Button asChild className="col-span-2" size="lg"><Link href={`${paymentBasePath}/nouveau`}><Plus />Nouveau paiement</Link></Button>
      </section>

      <section aria-label="Indicateurs principaux" className="hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        <DashboardKpiCard direction="up" helper="vs période précédente" icon={CircleDollarSign} label="Revenus encaissés" tone="green" value={formatAmount(data.kpis.collected)} variation="+12,5 %" />
        <DashboardKpiCard helper={periodHelper} icon={Wallet} label="Loyers attendus" tone="blue" value={formatAmount(data.kpis.expected)} variation="100 %" />
        <DashboardKpiCard direction="down" helper="À recouvrer" icon={TriangleAlert} label="Arriérés" tone="red" value={formatAmount(data.kpis.arrears)} variation="-4,2 %" />
        <DashboardKpiCard direction="up" helper="Objectif : 92 %" icon={ChartNoAxesColumnIncreasing} label="Taux de recouvrement" tone="blue" value={`${data.kpis.recovery.toFixed(1).replace(".", ",")} %`} variation="+2,1 pts" />
        <DashboardKpiCard helper={`${data.kpis.occupied} occupés`} icon={Building} label="Logements" tone="slate" value={`${data.kpis.units}`} variation="45 unités" />
        <DashboardKpiCard direction="up" helper="3 logements libres" icon={House} label="Occupation" tone="amber" value={`${data.kpis.occupancy.toFixed(1).replace(".", ",")} %`} variation="+1,4 pt" />
      </section>

      <DashboardChartSection data={{ revenue: data.revenue, unitDistribution: data.unitDistribution }} />

      <section aria-label="Activité locative à traiter" className="grid gap-5 xl:grid-cols-12">
        <Card className="xl:col-span-4" id="upcoming">
          <ListHeader description="À traiter dans les 7 prochains jours" icon={CalendarClock} title="Échéances prochaines" />
          <CardContent className="divide-y p-0">
            {data.upcoming.length ? data.upcoming.map((item) => (
              <div className="flex items-center gap-3 px-4 py-4" key={item.id}>
                <Avatar><AvatarFallback className="bg-blue-50 text-xs font-semibold text-brand-blue dark:bg-blue-950/30">{initials(item.tenant)}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.tenant}</p><p className="mt-0.5 truncate text-xs text-muted-foreground">{item.unit}</p></div>
                <div className="text-right"><MoneyDisplay amount={item.amount} className="text-sm" /><p className="mt-0.5 text-xs font-medium text-status-due-soon">{item.timing}</p></div>
              </div>
            )) : <div className="p-4"><EmptyState description="Les prochaines échéances apparaîtront ici." icon={CalendarClock} title="Aucune échéance" /></div>}
          </CardContent>
        </Card>

        <Card className="xl:col-span-4" id="arrears">
          <ListHeader description="Retards les plus importants" icon={BadgeAlert} title="Arriérés prioritaires" />
          <CardContent className="divide-y p-0">
            {data.arrears.length ? data.arrears.map((item) => (
              <div className="px-4 py-4" key={item.id}>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-status-arrears/10 text-status-arrears"><BadgeAlert aria-hidden="true" className="size-4" /></span>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.tenant}</p><p className="mt-0.5 truncate text-xs text-muted-foreground">{item.unit} · {item.unpaid}</p></div>
                  <div className="text-right"><MoneyDisplay amount={item.amount} className="text-sm text-status-arrears" /><p className="mt-0.5 text-xs text-muted-foreground">{item.days} jours</p></div>
                </div>
                <Button className="mt-3 w-full" disabled size="sm" variant="outline"><MessageSquareText />Relancer <span className="text-[0.65rem] text-muted-foreground">bientôt</span></Button>
              </div>
            )) : <div className="p-4"><EmptyState description="Aucun retard prioritaire pour cette période." icon={BadgeAlert} title="Aucun arriéré" /></div>}
          </CardContent>
        </Card>

        <Card className="xl:col-span-4" id="payments">
          <ListHeader description="Dernières opérations enregistrées" icon={CircleCheckBig} title="Paiements récents" />
          <CardContent className="divide-y p-0">
            {data.recentPayments.length ? data.recentPayments.map((item) => (
              <div className="flex items-center gap-3 px-4 py-4" key={item.id}>
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-status-paid/10 text-status-paid"><CircleCheckBig aria-hidden="true" className="size-4" /></span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.tenant}</p><p className="mt-0.5 truncate text-xs text-muted-foreground">{item.id} · {item.date}</p></div>
                <div className="text-right"><MoneyDisplay amount={item.amount} className="text-sm" /><div className="mt-1"><RentalStatusBadge status={item.status} /></div></div>
              </div>
            )) : <div className="p-4"><EmptyState description="Les paiements récents apparaîtront ici." icon={CircleCheckBig} title="Aucun paiement" /></div>}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
