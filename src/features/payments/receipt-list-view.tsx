import Link from "next/link";
import { CircleCheckBig, ReceiptText, Search, WalletCards } from "lucide-react";

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

import { PaymentCard } from "./payment-card";
import { payments, type Payment } from "./payment-data";
import { PaymentStatusBadge } from "./payment-badges";

export type ReceiptListParams = { q?: string; status?: string };

export function ReceiptListView({ basePath, dashboardHref, paymentBasePath, params }: { basePath: string; dashboardHref: string; paymentBasePath: string; params: ReceiptListParams }) {
  const query = params.q?.trim().toLocaleLowerCase("fr") ?? "";
  const filtered = payments.filter((payment) => (!query || `${payment.receiptNumber} ${payment.tenantName} ${payment.unitLabel}`.toLocaleLowerCase("fr").includes(query)) && (!params.status || params.status === "all" || payment.status === params.status));
  const total = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const columns: DataTableColumn<Payment>[] = [
    { key: "receipt", header: "N° reçu", render: (payment) => <Link className="font-semibold hover:text-brand-blue" href={`${basePath}/${payment.receiptId}`}>{payment.receiptNumber}</Link> },
    { key: "tenant", header: "Locataire", render: (payment) => <div className="flex items-center gap-2"><TenantAvatar name={payment.tenantName} /><span className="font-medium">{payment.tenantName}</span></div> },
    { key: "amount", header: "Montant", render: (payment) => <MoneyDisplay amount={payment.amount} className="font-semibold" currency={payment.currency} /> },
    { key: "period", header: "Période", render: (payment) => payment.period },
    { key: "date", header: "Date", render: (payment) => payment.date },
    { key: "agent", header: "Agent", render: (payment) => payment.agent },
    { key: "status", header: "Statut", render: (payment) => <PaymentStatusBadge status={payment.status} /> },
    { key: "actions", header: "Actions", className: "text-right", render: (payment) => <Button asChild size="sm" variant="ghost"><Link href={`${basePath}/${payment.receiptId}`}>Voir</Link></Button> },
  ];
  return <div className="space-y-6"><div><Breadcrumbs items={[{ label: "Dashboard", href: dashboardHref }, { label: "Reçus" }]} /><PageHeader actions={<Button asChild><Link href={paymentBasePath}><WalletCards />Voir les paiements</Link></Button>} description="Retrouvez chaque justificatif, son encaissement d’origine et les informations de vérification." eyebrow="Justificatifs" title="Reçus" /></div><section className="grid grid-cols-2 gap-3 lg:grid-cols-3"><Card><CardContent className="flex items-center gap-3 p-4"><span className="grid size-9 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue"><ReceiptText className="size-4.5" /></span><div><p className="text-xs text-muted-foreground">Reçus générés</p><p className="mt-0.5 font-heading text-lg font-semibold">{payments.length}</p></div></CardContent></Card><Card><CardContent className="flex items-center gap-3 p-4"><span className="grid size-9 place-items-center rounded-xl bg-status-paid/10 text-status-paid"><CircleCheckBig className="size-4.5" /></span><div><p className="text-xs text-muted-foreground">Reçus valides</p><p className="mt-0.5 font-heading text-lg font-semibold">{payments.filter((payment) => payment.status !== "cancelled").length}</p></div></CardContent></Card><Card className="col-span-2 lg:col-span-1"><CardContent className="flex items-center gap-3 p-4"><span className="grid size-9 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue"><WalletCards className="size-4.5" /></span><div><p className="text-xs text-muted-foreground">Montant justifié</p><p className="mt-0.5 font-heading text-lg font-semibold">{new Intl.NumberFormat("fr-CD").format(total)} USD</p></div></CardContent></Card></section><FilterBar><form action={basePath} className="grid flex-1 gap-2 sm:grid-cols-[minmax(16rem,1fr)_13rem_auto]" method="GET"><label className="relative"><span className="sr-only">Rechercher un reçu</span><Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" defaultValue={params.q} name="q" placeholder="Numéro, locataire, logement..." /></label><select aria-label="Filtrer par statut" className="h-10 rounded-lg border bg-background px-3 text-sm" defaultValue={params.status ?? "all"} name="status"><option value="all">Tous les statuts</option><option value="paid">Payés</option><option value="partial">Partiels</option><option value="cancelled">Annulés</option></select><Button type="submit" variant="secondary"><Search />Appliquer</Button></form></FilterBar>{filtered.length === 0 ? <EmptyState action={<Button asChild variant="outline"><Link href={basePath}>Effacer les filtres</Link></Button>} description="Modifiez les filtres pour retrouver un justificatif." icon={ReceiptText} title="Aucun reçu trouvé" /> : <><div className="grid gap-4 lg:hidden">{filtered.map((payment) => <PaymentCard href={`${basePath}/${payment.receiptId}`} key={payment.receiptId} payment={payment} />)}</div><div className="hidden overflow-x-auto lg:block"><DataTable className="min-w-[72rem]" columns={columns} getRowKey={(payment) => payment.receiptId} rows={filtered} /></div></>}</div>;
}
