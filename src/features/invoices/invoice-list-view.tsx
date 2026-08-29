import Link from "next/link";
import { AlertTriangle, CalendarClock, CircleDollarSign, ListChecks, Search } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterBar } from "@/components/shared/filter-bar";
import { MoneyDisplay } from "@/components/shared/money-display";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import type { RentInvoice } from "./invoice-data";
import { InvoiceStatusBadge } from "./invoice-status-badge";

export type InvoiceListParams = { q?: string; status?: string; currency?: "USD" | "CDF" };

export function InvoiceListView({ invoices, params }: { invoices: RentInvoice[]; params: InvoiceListParams }) {
  const query = params.q?.trim().toLocaleLowerCase("fr") ?? "";
  const currency = params.currency ?? invoices[0]?.currency ?? "USD";
  const currencyRows = invoices.filter((invoice) => invoice.currency === currency);
  const filtered = currencyRows.filter((invoice) =>
    (!query || `${invoice.reference} ${invoice.tenantName} ${invoice.unitLabel} ${invoice.propertyName}`.toLocaleLowerCase("fr").includes(query))
    && (!params.status || params.status === "all" || invoice.status === params.status));
  const expected = currencyRows.reduce((sum, invoice) => sum + invoice.amountDue, 0);
  const paid = currencyRows.reduce((sum, invoice) => sum + invoice.amountPaid, 0);
  const outstanding = currencyRows.reduce((sum, invoice) => sum + invoice.balance, 0);
  const arrears = currencyRows.filter((invoice) => ["late", "arrears", "unpaid"].includes(invoice.status)).reduce((sum, invoice) => sum + invoice.balance, 0);
  const columns: DataTableColumn<RentInvoice>[] = [
    { key: "reference", header: "Échéance", render: (invoice) => <span className="font-semibold">{invoice.reference}</span> },
    { key: "tenant", header: "Locataire", render: (invoice) => <div><Link className="font-medium hover:text-brand-blue" href={`/locataires/${invoice.tenantId}`}>{invoice.tenantName}</Link><p className="text-xs text-muted-foreground">{invoice.unitLabel} · {invoice.propertyName}</p></div> },
    { key: "period", header: "Période", render: (invoice) => <div><p className="font-medium">{invoice.period}</p><p className="text-xs text-muted-foreground">Échéance : {invoice.dueDate}</p></div> },
    { key: "due", header: "Attendu", render: (invoice) => <MoneyDisplay amount={invoice.amountDue} className="font-semibold" currency={invoice.currency} /> },
    { key: "paid", header: "Encaissé", render: (invoice) => <MoneyDisplay amount={invoice.amountPaid} currency={invoice.currency} /> },
    { key: "balance", header: "Solde", render: (invoice) => <MoneyDisplay amount={invoice.balance} className="font-semibold" currency={invoice.currency} /> },
    { key: "status", header: "Statut", render: (invoice) => <div><InvoiceStatusBadge status={invoice.status} />{invoice.daysLate > 0 && <p className="mt-1 text-xs text-muted-foreground">{invoice.daysLate} jour{invoice.daysLate > 1 ? "s" : ""} de retard</p>}</div> },
  ];

  return <div className="space-y-6"><div><Breadcrumbs items={[{ label: "Dashboard", href: "/espace" }, { label: "Échéances" }]} /><PageHeader description="Suivez les loyers attendus, les paiements partiels, les retards et les arriérés calculés dans PostgreSQL." eyebrow="Finances" title="Échéances de loyers" /></div>
    <section aria-label={`Synthèse ${currency}`} className="grid grid-cols-2 gap-3 xl:grid-cols-4">{[
      { label: "Total attendu", value: expected, icon: CalendarClock }, { label: "Total encaissé", value: paid, icon: CircleDollarSign },
      { label: "Solde ouvert", value: outstanding, icon: ListChecks }, { label: "Arriérés", value: arrears, icon: AlertTriangle },
    ].map(({ label, value, icon: Icon }) => <Card key={label}><CardContent className="flex items-center gap-3 p-4"><span className="grid size-9 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue"><Icon className="size-4.5" /></span><div className="min-w-0"><p className="truncate text-xs text-muted-foreground">{label}</p><MoneyDisplay amount={value} className="mt-0.5 block truncate font-heading text-lg font-semibold" currency={currency} /></div></CardContent></Card>)}</section>
    <FilterBar><form action="/echeances" className="grid flex-1 gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(16rem,1fr)_12rem_12rem_auto]" method="GET"><label className="relative"><span className="sr-only">Rechercher une échéance</span><Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" defaultValue={params.q} name="q" placeholder="Locataire, logement, référence..." /></label><select aria-label="Devise" className="h-10 rounded-lg border bg-background px-3 text-sm" defaultValue={currency} name="currency"><option value="USD">USD</option><option value="CDF">CDF</option></select><select aria-label="Statut" className="h-10 rounded-lg border bg-background px-3 text-sm" defaultValue={params.status ?? "all"} name="status"><option value="all">Tous les statuts</option><option value="upcoming">À venir</option><option value="due_soon">Bientôt dû</option><option value="due_today">Aujourd’hui</option><option value="partial">Partiel</option><option value="paid">Payé</option><option value="late">En retard</option><option value="arrears">Arriéré</option></select><Button type="submit" variant="secondary"><ListChecks />Appliquer</Button></form></FilterBar>
    {filtered.length === 0 ? <EmptyState action={<Button asChild variant="outline"><Link href="/echeances">Effacer les filtres</Link></Button>} description="Les échéances apparaissent automatiquement après l’activation d’un contrat." icon={CalendarClock} title="Aucune échéance trouvée" /> : <><div className="grid gap-3 lg:hidden">{filtered.map((invoice) => <Card key={invoice.id}><CardContent className="space-y-3 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{invoice.tenantName}</p><p className="text-xs text-muted-foreground">{invoice.unitLabel} · {invoice.period}</p></div><InvoiceStatusBadge status={invoice.status} /></div><div className="flex items-end justify-between"><div><p className="text-xs text-muted-foreground">Solde</p><MoneyDisplay amount={invoice.balance} className="font-heading text-xl font-semibold" currency={invoice.currency} /></div><p className="text-xs text-muted-foreground">Dû le {invoice.dueDate}</p></div></CardContent></Card>)}</div><div className="hidden overflow-x-auto lg:block"><DataTable className="min-w-[76rem]" columns={columns} getRowKey={(invoice) => invoice.id} rows={filtered} /></div></>}
  </div>;
}
