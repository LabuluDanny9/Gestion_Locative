import Link from "next/link";
import { CircleDollarSign, CirclePlus, ListChecks, Search, WalletCards } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterBar } from "@/components/shared/filter-bar";
import { MoneyDisplay } from "@/components/shared/money-display";
import { PageHeader } from "@/components/shared/page-header";
import { TenantAvatar } from "@/components/shared/tenant-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { PaymentModeBadge, PaymentStatusBadge } from "./payment-badges";
import { PaymentCard } from "./payment-card";
import type { Payment } from "./payment-data";

export type PaymentListParams = { q?: string; status?: string; mode?: string; creation?: string; erreur?: string };

export function PaymentListView({ basePath, dashboardHref, params, receiptBasePath, payments = [] }: { basePath: string; dashboardHref: string; params: PaymentListParams; receiptBasePath: string; payments?: Payment[] }) {
  const query = params.q?.trim().toLocaleLowerCase("fr") ?? "";
  const filtered = payments.filter((payment) => (!query || `${payment.reference} ${payment.tenantName} ${payment.unitLabel} ${payment.receiptNumber}`.toLocaleLowerCase("fr").includes(query)) && (!params.status || params.status === "all" || payment.status === params.status) && (!params.mode || params.mode === "all" || payment.mode === params.mode));
  const total = payments.filter((payment) => payment.status !== "cancelled").reduce((sum, payment) => sum + payment.amount, 0);
  const columns: DataTableColumn<Payment>[] = [
    { key: "reference", header: "Référence", render: (payment) => <Link className="font-semibold hover:text-brand-blue" href={`${basePath}/${payment.id}`}>{payment.reference}</Link> },
    { key: "tenant", header: "Locataire", render: (payment) => <div className="flex items-center gap-2"><TenantAvatar name={payment.tenantName} /><span className="font-medium">{payment.tenantName}</span></div> },
    { key: "unit", header: "Logement", render: (payment) => <div><p className="font-medium">{payment.unitLabel}</p><p className="mt-0.5 text-xs text-muted-foreground">{payment.propertyName}</p></div> },
    { key: "period", header: "Période", render: (payment) => payment.period },
    { key: "amount", header: "Montant", render: (payment) => <MoneyDisplay amount={payment.amount} className="font-semibold" currency={payment.currency} /> },
    { key: "mode", header: "Mode", render: (payment) => <PaymentModeBadge mode={payment.mode} /> },
    { key: "date", header: "Date", render: (payment) => <span className="whitespace-nowrap">{payment.date}</span> },
    { key: "status", header: "Statut", render: (payment) => <PaymentStatusBadge status={payment.status} /> },
    { key: "receipt", header: "Reçu", className: "text-right", render: (payment) => <Button asChild size="sm" variant="ghost"><Link href={`${receiptBasePath}/${payment.receiptId}`}>{payment.receiptNumber}</Link></Button> },
  ];

  return <div className="space-y-6"><div><Breadcrumbs items={[{ label: "Dashboard", href: dashboardHref }, { label: "Paiements" }]} /><PageHeader actions={<Button asChild><Link href={`${basePath}/nouveau`}><CirclePlus />Nouveau paiement</Link></Button>} description="Enregistrez les encaissements, contrôlez leur affectation et accédez immédiatement aux reçus." eyebrow="Finances" title="Paiements" /></div><section aria-label="Synthèse des paiements" className="grid grid-cols-2 gap-3 xl:grid-cols-4">{[
    { label: "Encaissé aujourd’hui", value: "350 USD", icon: CircleDollarSign },
    { label: "Encaissé ce mois", value: `${new Intl.NumberFormat("fr-CD").format(total)} USD`, icon: WalletCards },
    { label: "Paiements du jour", value: 1, icon: ListChecks },
    { label: "Paiements partiels", value: payments.filter((payment) => payment.status === "partial").length, icon: CircleDollarSign },
  ].map(({ label, value, icon: Icon }) => <Card key={label}><CardContent className="flex items-center gap-3 p-4"><span className="grid size-9 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue"><Icon className="size-4.5" /></span><div className="min-w-0"><p className="truncate text-xs text-muted-foreground">{label}</p><p className="mt-0.5 truncate font-heading text-lg font-semibold tabular-nums">{value}</p></div></CardContent></Card>)}</section><FilterBar><form action={basePath} className="grid flex-1 gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(16rem,1fr)_12rem_13rem_auto]" method="GET"><label className="relative"><span className="sr-only">Rechercher un paiement</span><Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" defaultValue={params.q} name="q" placeholder="Référence, locataire, reçu..." /></label><select aria-label="Filtrer par statut" className="h-10 rounded-lg border bg-background px-3 text-sm" defaultValue={params.status ?? "all"} name="status"><option value="all">Tous les statuts</option><option value="paid">Payés</option><option value="partial">Partiels</option><option value="cancelled">Annulés</option></select><select aria-label="Filtrer par mode" className="h-10 rounded-lg border bg-background px-3 text-sm" defaultValue={params.mode ?? "all"} name="mode"><option value="all">Tous les modes</option><option value="cash">Espèces</option><option value="mobile">Mobile Money</option><option value="bank">Banque</option><option value="card">Carte</option></select><Button type="submit" variant="secondary"><ListChecks />Appliquer</Button></form></FilterBar>{filtered.length === 0 ? <EmptyState action={<Button asChild variant="outline"><Link href={basePath}>Effacer les filtres</Link></Button>} description="Modifiez les filtres ou enregistrez un nouvel encaissement." icon={WalletCards} title="Aucun paiement trouvé" /> : <><div className="grid gap-4 lg:hidden">{filtered.map((payment) => <PaymentCard href={`${basePath}/${payment.id}`} key={payment.id} payment={payment} />)}</div><div className="hidden overflow-x-auto lg:block"><DataTable className="min-w-[82rem]" columns={columns} getRowKey={(payment) => payment.id} rows={filtered} /></div></>}</div>;
}
