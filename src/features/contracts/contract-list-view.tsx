import Link from "next/link";
import { CalendarClock, CirclePlus, FileCheck2, FilePenLine, FileSignature, Search, ShieldCheck } from "lucide-react";

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

import { ContractCard } from "./contract-card";
import type { Contract } from "./contract-data";
import { ContractStatusBadge } from "./contract-status-badge";

export type ContractListParams = { q?: string; status?: string; creation?: string; erreur?: string };

export function ContractListView({ basePath, dashboardHref, params, contracts = [] }: { basePath: string; dashboardHref: string; params: ContractListParams; contracts?: Contract[] }) {
  const query = params.q?.trim().toLocaleLowerCase("fr") ?? "";
  const filtered = contracts.filter((contract) => (!query || `${contract.reference} ${contract.tenantName} ${contract.unitLabel}`.toLocaleLowerCase("fr").includes(query)) && (!params.status || params.status === "all" || contract.status === params.status));
  const monthlyRent = contracts.filter((contract) => contract.status !== "expired").reduce((sum, contract) => sum + contract.rent, 0);
  const guarantees = contracts.reduce((sum, contract) => sum + contract.guarantee, 0);
  const columns: DataTableColumn<Contract>[] = [
    { key: "contract", header: "Contrat", render: (contract) => <div><Link className="font-semibold hover:text-brand-blue" href={`${basePath}/${contract.id}`}>{contract.reference}</Link><p className="mt-1 text-xs text-muted-foreground">{contract.frequency}</p></div> },
    { key: "tenant", header: "Locataire", render: (contract) => <div className="flex items-center gap-2"><TenantAvatar name={contract.tenantName} /><span className="font-medium">{contract.tenantName}</span></div> },
    { key: "unit", header: "Logement", render: (contract) => <div><p className="font-medium">{contract.unitLabel}</p><p className="mt-0.5 text-xs text-muted-foreground">{contract.propertyName}</p></div> },
    { key: "start", header: "Début", render: (contract) => contract.startDate },
    { key: "end", header: "Durée", render: (contract) => contract.endDate },
    { key: "rent", header: "Loyer", render: (contract) => <MoneyDisplay amount={contract.rent} currency={contract.currency} /> },
    { key: "guarantee", header: "Garantie", render: (contract) => <MoneyDisplay amount={contract.guarantee} currency={contract.currency} /> },
    { key: "status", header: "Statut", render: (contract) => <ContractStatusBadge status={contract.status} /> },
    { key: "action", header: "Actions", className: "text-right", render: (contract) => <Button asChild size="sm" variant="ghost"><Link href={`${basePath}/${contract.id}`}>Voir</Link></Button> },
  ];

  return <div className="space-y-6"><div><Breadcrumbs items={[{ label: "Dashboard", href: dashboardHref }, { label: "Contrats" }]} /><PageHeader actions={<Button asChild><Link href={`${basePath}/nouveau`}><CirclePlus />Nouveau contrat</Link></Button>} description="Centralisez les baux, leurs conditions financières, signatures et échéances." eyebrow="Gestion contractuelle" title="Contrats" /></div><section aria-label="Synthèse des contrats" className="grid grid-cols-2 gap-3 xl:grid-cols-4">{[
    { label: "Contrats actifs", value: contracts.filter((contract) => contract.status === "active").length, icon: FileCheck2 },
    { label: "À renouveler", value: contracts.filter((contract) => contract.status === "expiring").length, icon: CalendarClock },
    { label: "Loyers contractuels", value: `${new Intl.NumberFormat("fr-CD").format(monthlyRent)} USD`, icon: FileSignature },
    { label: "Garanties prévues", value: `${new Intl.NumberFormat("fr-CD").format(guarantees)} USD`, icon: ShieldCheck },
  ].map(({ label, value, icon: Icon }) => <Card key={label}><CardContent className="flex items-center gap-3 p-4"><span className="grid size-9 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue"><Icon className="size-4.5" /></span><div className="min-w-0"><p className="truncate text-xs text-muted-foreground">{label}</p><p className="mt-0.5 truncate font-heading text-lg font-semibold tabular-nums">{value}</p></div></CardContent></Card>)}</section><FilterBar><form action={basePath} className="grid flex-1 gap-2 sm:grid-cols-[minmax(16rem,1fr)_14rem_auto]" method="GET"><label className="relative"><span className="sr-only">Rechercher un contrat</span><Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" defaultValue={params.q} name="q" placeholder="Référence, locataire, logement..." /></label><select aria-label="Filtrer par statut" className="h-10 rounded-lg border bg-background px-3 text-sm" defaultValue={params.status ?? "all"} name="status"><option value="all">Tous les statuts</option><option value="active">Actifs</option><option value="expiring">À renouveler</option><option value="draft">Brouillons</option><option value="expired">Expirés</option></select><Button type="submit" variant="secondary"><FilePenLine />Appliquer</Button></form></FilterBar>{filtered.length === 0 ? <EmptyState action={<Button asChild variant="outline"><Link href={basePath}>Effacer les filtres</Link></Button>} description="Modifiez les filtres ou préparez un nouveau contrat." icon={FileSignature} title="Aucun contrat trouvé" /> : <><div className="grid gap-4 lg:hidden">{filtered.map((contract) => <ContractCard contract={contract} href={`${basePath}/${contract.id}`} key={contract.id} />)}</div><div className="hidden overflow-x-auto lg:block"><DataTable className="min-w-[82rem]" columns={columns} getRowKey={(contract) => contract.id} rows={filtered} /></div></>}</div>;
}
