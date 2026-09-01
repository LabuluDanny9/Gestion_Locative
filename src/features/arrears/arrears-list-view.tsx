import Link from "next/link";
import { AlertTriangle, CalendarDays, Clock3, ListFilter, Search, UsersRound, WalletCards } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterBar } from "@/components/shared/filter-bar";
import { MoneyDisplay } from "@/components/shared/money-display";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { arrearsAgeBand, type ArrearsAccount, type ArrearsAgeBand } from "./arrears-data";

export type ArrearsListParams = { q?: string; currency?: "USD" | "CDF"; age?: ArrearsAgeBand; property?: string };

const dateFormatter = new Intl.DateTimeFormat("fr-CD", { day: "2-digit", month: "short", year: "numeric" });
const monthFormatter = new Intl.DateTimeFormat("fr-CD", { month: "long", year: "numeric" });

export function ArrearsListView({ accounts, params }: { accounts: ArrearsAccount[]; params: ArrearsListParams }) {
  const query = params.q?.trim().toLocaleLowerCase("fr") ?? "";
  const currency = params.currency ?? accounts[0]?.currency ?? "USD";
  const age = params.age ?? "all";
  const properties = [...new Map(accounts.map((account) => [account.propertyId, account.propertyName])).entries()].toSorted((a, b) => a[1].localeCompare(b[1], "fr"));
  const currencyAccounts = accounts.filter((account) => account.currency === currency);
  const filtered = currencyAccounts.filter((account) =>
    (!query || `${account.tenantName} ${account.phone} ${account.unitLabel} ${account.propertyName}`.toLocaleLowerCase("fr").includes(query))
    && (!params.property || params.property === "all" || account.propertyId === params.property)
    && (age === "all" || arrearsAgeBand(account.maximumDaysLate) === age));
  const total = currencyAccounts.reduce((sum, account) => sum + account.totalBalance, 0);
  const invoiceCount = currencyAccounts.reduce((sum, account) => sum + account.invoiceCount, 0);
  const maximumDaysLate = Math.max(0, ...currencyAccounts.map((account) => account.maximumDaysLate));
  const ageStatistics = (["1-30", "31-60", "61-90", "90+"] as const).map((band) => ({
    band,
    amount: currencyAccounts.filter((account) => arrearsAgeBand(account.maximumDaysLate) === band).reduce((sum, account) => sum + account.totalBalance, 0),
  }));

  return <div className="space-y-6">
    <div><Breadcrumbs items={[{ label: "Dashboard", href: "/espace" }, { label: "Arriérés" }]} /><PageHeader description="Analysez les loyers échus non soldés, leur ancienneté et les mois concernés à partir des écritures PostgreSQL." eyebrow="Finances" title="Arriérés de loyers" /></div>
    <section aria-label={`Synthèse des arriérés en ${currency}`} className="grid grid-cols-2 gap-3 xl:grid-cols-4">{[
      { label: "Total à recouvrer", value: <MoneyDisplay amount={total} currency={currency} />, icon: WalletCards },
      { label: "Locataires concernés", value: currencyAccounts.length.toLocaleString("fr-CD"), icon: UsersRound },
      { label: "Échéances impayées", value: invoiceCount.toLocaleString("fr-CD"), icon: CalendarDays },
      { label: "Retard maximum", value: `${maximumDaysLate} jour${maximumDaysLate > 1 ? "s" : ""}`, icon: Clock3 },
    ].map(({ label, value, icon: Icon }) => <Card key={label}><CardContent className="flex items-center gap-3 p-4"><span className="grid size-9 place-items-center rounded-xl bg-destructive/10 text-destructive"><Icon className="size-4.5" /></span><div className="min-w-0"><p className="truncate text-xs text-muted-foreground">{label}</p><div className="mt-0.5 truncate font-heading text-lg font-semibold">{value}</div></div></CardContent></Card>)}</section>
    <Card><CardHeader><CardTitle>Ancienneté de la dette</CardTitle><CardDescription>Répartition du solde selon le retard le plus ancien de chaque dossier.</CardDescription></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{ageStatistics.map(({ band, amount }) => { const percentage = total > 0 ? Math.round((amount / total) * 100) : 0; return <div className="rounded-xl border p-4" key={band}><div className="flex items-center justify-between"><p className="font-semibold">{band} jours</p><span className="text-xs text-muted-foreground">{percentage}%</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-destructive" style={{ width: `${percentage}%` }} /></div><MoneyDisplay amount={amount} className="mt-3 block font-semibold" currency={currency} /></div>; })}</CardContent></Card>
    <FilterBar><form action="/arrieres" className="grid flex-1 gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(16rem,1fr)_9rem_11rem_13rem_auto]" method="GET"><label className="relative"><span className="sr-only">Rechercher un arriéré</span><Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" defaultValue={params.q} name="q" placeholder="Locataire, téléphone, logement..." /></label><select aria-label="Devise" className="h-10 rounded-lg border bg-background px-3 text-sm" defaultValue={currency} name="currency"><option value="USD">USD</option><option value="CDF">CDF</option></select><select aria-label="Ancienneté" className="h-10 rounded-lg border bg-background px-3 text-sm" defaultValue={age} name="age"><option value="all">Tous les retards</option><option value="1-30">1 à 30 jours</option><option value="31-60">31 à 60 jours</option><option value="61-90">61 à 90 jours</option><option value="90+">Plus de 90 jours</option></select><select aria-label="Propriété" className="h-10 rounded-lg border bg-background px-3 text-sm" defaultValue={params.property ?? "all"} name="property"><option value="all">Toutes les propriétés</option>{properties.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select><Button type="submit" variant="secondary"><ListFilter />Appliquer</Button></form></FilterBar>
    {filtered.length === 0 ? <EmptyState action={<Button asChild variant="outline"><Link href="/arrieres">Effacer les filtres</Link></Button>} description="Aucun loyer échu ne présente actuellement de solde dans cette sélection." icon={AlertTriangle} title="Aucun arriéré" /> : <div className="grid gap-4">{filtered.map((account) => <Card key={account.id}><CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between"><div><CardTitle><Link className="hover:text-brand-blue" href={`/locataires/${account.tenantId}`}>{account.tenantName}</Link></CardTitle><CardDescription>{account.phone} · {account.unitLabel} · {account.propertyName}</CardDescription></div><div className="text-left sm:text-right"><MoneyDisplay amount={account.totalBalance} className="font-heading text-xl font-semibold text-destructive" currency={account.currency} /><p className="mt-1 text-xs text-muted-foreground">{account.maximumDaysLate} jour{account.maximumDaysLate > 1 ? "s" : ""} de retard</p></div></CardHeader><CardContent className="space-y-4"><div className="grid gap-3 sm:grid-cols-3"><Summary label="Première échéance" value={dateFormatter.format(new Date(`${account.oldestDueDate}T00:00:00Z`))} /><Summary label="Mois impayés" value={account.invoiceCount.toLocaleString("fr-CD")} /><div className="flex items-end sm:justify-end"><Button asChild><Link href={`/paiements/nouveau?tenant=${account.tenantId}`}><WalletCards />Enregistrer un paiement</Link></Button></div></div><details className="group rounded-xl border"><summary className="cursor-pointer list-none p-4 font-medium marker:hidden">Voir le détail mensuel ({account.installments.length})</summary><div className="border-t p-4"><div className="grid gap-2">{account.installments.map((installment) => <div className="grid gap-2 rounded-lg bg-muted/40 p-3 sm:grid-cols-[1fr_auto_auto] sm:items-center" key={installment.id}><div><p className="font-medium capitalize">{monthFormatter.format(new Date(`${installment.periodStart}T00:00:00Z`))}</p><p className="text-xs text-muted-foreground">{installment.reference} · dû le {dateFormatter.format(new Date(`${installment.dueDate}T00:00:00Z`))} · {installment.daysLate} jours</p></div><p className="text-xs text-muted-foreground">Payé : <MoneyDisplay amount={installment.amountPaid} currency={account.currency} /></p><MoneyDisplay amount={installment.balance} className="font-semibold text-destructive" currency={account.currency} /></div>)}</div></div></details></CardContent></Card>)}</div>}
  </div>;
}

function Summary({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-muted/40 p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-semibold">{value}</p></div>;
}
